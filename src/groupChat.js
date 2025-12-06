import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let ADMIN_UID = null;
let GROUP_ADMINS = [];
let IS_ADMIN = false;

//load admin + admins[] from group doc
async function loadGroupAdmin() {
  const groupRef = doc(db, "groups", groupId);
  const snap = await getDoc(groupRef);

  if (!snap.exists()) return;

  const data = snap.data();
  ADMIN_UID = data.ownerUid || null;
  GROUP_ADMINS = Array.isArray(data.admins) ? data.admins : [];

  // compute admin using same logic as myGroup.js file
  const uid = state.currentUser?.uid;
}

let state = { currentUser: null };

function computeIsAdmin() {
  const uid = state.currentUser?.uid;
  IS_ADMIN = !!(uid && (uid === ADMIN_UID || GROUP_ADMINS.includes(uid)));
}

// tiny selector helper
const $ = (sel) => document.querySelector(sel);

// grab group id from URL
const url = new URL(location.href);
const groupId = url.searchParams.get("docID");

if (!groupId) {
  document.body.innerHTML = "<h2>Invalid group.</h2>";
  throw new Error("Missing docID in URL");
}

// default profile photo
let currentUserPic = "/images/default_user.png";

// pull user profile so chat bubbles can show correct avatar
async function loadUserProfilePic(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data.photoURL) {
        currentUserPic = data.photoURL;
      }
    }
  } catch (err) {
    console.error("Error loading user profile pic:", err);
  }
}

// basic chat layout
function buildChatUI(username) {
  document.body.innerHTML = `
    <div id="title_container">
      <div id="title_inner_container">
        <h1 id="title">Group Chat</h1>
      </div>
    </div>

    <div id="chat_container">
      <div id="chat_inner_container">
        <div id="chat_content_container"></div>

        <div id="chat_input_container">
          <input
            id="chat_input"
            maxlength="500"
            placeholder="${username}, say something…"
          />
          <div id="admin_image_container" style="display:none; margin-top:10px;">
              <input 
                type="text" 
                id="imageUrlInput" 
                placeholder="Paste image URL…" 
                style="width:70%; padding:6px;"
              >
              <button id="sendImageUrlBtn">+</button>
            </div>
          <button id="chat_input_send" disabled>Send</button>
        </div>

        <div id="chat_logout_container">
          <button id="backBtn">← Back to group</button>
        </div>
      </div>
    </div>
  `;
}

// render chat bubbles
function renderMessages(msgList, currentUid) {
  const box = $("#chat_content_container");
  if (!box) return;

  box.innerHTML = "";

  msgList.forEach((m) => {
    const isYou = m.uid === currentUid;

    const row = document.createElement("div");
    row.className = `msg-row ${isYou ? "you" : "other"}`;

    const img = document.createElement("img");
    img.className = "msg-pfp";
    img.src = m.photoURL || "/images/default_user.png";

    const wrapper = document.createElement("div");
    wrapper.className = `msg-wrapper ${isYou ? "you" : "other"}`;

    if (!isYou) {
      const nameEl = document.createElement("div");
      nameEl.className = "msg-username";
      nameEl.textContent = m.user || "Unknown";
      wrapper.appendChild(nameEl);
    }

    const bubble = document.createElement("div");
    bubble.className = `message ${isYou ? "you" : "other"}`;
    bubble.textContent = m.text;
    wrapper.appendChild(bubble);

    // IMAGE message
    if (m.imageUrl) {
      const imgEl = document.createElement("img");
      imgEl.src = m.imageUrl;
      imgEl.style.maxWidth = "250px";
      imgEl.style.borderRadius = "10px";
      imgEl.style.marginTop = "6px";
      wrapper.appendChild(imgEl);
    }

    const timeEl = document.createElement("div");
    timeEl.className = "msg-time";
    if (m.timestamp?.toDate) {
      timeEl.textContent = m.timestamp
        .toDate()
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    wrapper.appendChild(timeEl);

    row.appendChild(img);
    row.appendChild(wrapper);
    box.appendChild(row);
  });

  box.scrollTop = box.scrollHeight;
}

// main auth + chat wiring
onAuthStateChanged(getAuth(), async (user) => {
  if (!user) {
    document.body.innerHTML = "<h2>Sign in required.</h2>";
    return;
  }

  state.currentUser = user;
  const username = user.displayName || "User";

  // load group admin info
  await loadGroupAdmin();

  // compute admin using same logic as your other admin page
  computeIsAdmin();

  // pull avatar first
  await loadUserProfilePic(user.uid);

  // then draw UI
  buildChatUI(username);

  if (IS_ADMIN) {
    $("#admin_image_container").style.display = "block";
  }


  $("#backBtn")?.addEventListener("click", () => {
    window.location.href = `/myGroup.html?docID=${groupId}`;
  });

  const chatRef = collection(db, "groups", groupId, "chat");
  const q = query(chatRef, orderBy("timestamp", "asc"));
  const currentUid = user.uid;

  // live updates
  onSnapshot(q, (snap) => {
    const msgs = [];
    snap.forEach((d) => msgs.push(d.data()));
    renderMessages(msgs, currentUid);
  });

  const input = $("#chat_input");
  const sendBtn = $("#chat_input_send");

  input.addEventListener("input", () => {
    const hasText = input.value.trim().length > 0;
    sendBtn.disabled = !hasText;
    sendBtn.classList.toggle("enabled", hasText);
  });

  sendBtn.addEventListener("click", async () => {
    const text = input.value.trim();
    if (!text) return;

    await addDoc(chatRef, {
      user: username,
      uid: user.uid,
      text,
      photoURL: currentUserPic,
      timestamp: serverTimestamp(),
    }).catch((err) => console.error("Send error:", err));

    input.value = "";
    sendBtn.disabled = true;
    sendBtn.classList.remove("enabled");
  });

  // SEND IMAGE URL (ADMIN ONLY)
$("#sendImageUrlBtn")?.addEventListener("click", async () => {
  if (!IS_ADMIN) {
    alert("Only admins can send image messages.");
    return;
  }

  const url = $("#imageUrlInput").value.trim();
  if (!url) return;

  try {
    await addDoc(chatRef, {
      user: username,
      uid: user.uid,
      imageUrl: url,
      photoURL: currentUserPic,
      timestamp: serverTimestamp(),
    });

    $("#imageUrlInput").value = "";
  } catch (err) {
    console.error("Error sending image message:", err);
  }
});


});

