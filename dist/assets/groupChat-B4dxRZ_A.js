import{o as g,c as v,d as p,q as f,v as _,i as b,b as y,f as L,e as C,j as E,s as w}from"./firebaseConfig-D3CXmay8.js";/* empty css              */const l=t=>document.querySelector(t),U=new URL(location.href),h=U.searchParams.get("docID");if(!h)throw document.body.innerHTML="<h2>Invalid group.</h2>",new Error("Missing docID in URL");let m="/images/default_user.png";async function x(t){try{const c=C(p,"users",t),e=await E(c);if(e.exists()){const n=e.data();n.photoURL&&(m=n.photoURL)}}catch(c){console.error("Error loading user profile pic:",c)}}function R(t){document.body.innerHTML=`
    <div id="title_container">
      <div id="title_inner_container">
        <h1 id="title">Group Chat</h1>
      </div>
    </div>

    <div id="chat_container">
      <div id="chat_inner_container">
        <div id="chat_content_container"></div>

        <div id="chat_input_container">
          <input id="chat_input" maxlength="500" placeholder="${t}, say something…">
          <button id="chat_input_send" disabled>Send</button>
        </div>

        <div id="chat_logout_container">
          <button id="backBtn">← Back to group</button>
        </div>
      </div>
    </div>
  `}function S(t,c){const e=l("#chat_content_container");e&&(e.innerHTML="",t.forEach(n=>{const d=n.uid===c,i=document.createElement("div");i.className=`msg-row ${d?"you":"other"}`;const o=document.createElement("img");o.className="msg-pfp",o.src=n.photoURL||"default_user.png";const a=document.createElement("div");if(a.className=`msg-wrapper ${d?"you":"other"}`,!d){const u=document.createElement("div");u.className="msg-username",u.textContent=n.user||"Unknown",a.appendChild(u)}const s=document.createElement("div");s.className=`message ${d?"you":"other"}`,s.textContent=n.text,a.appendChild(s);const r=document.createElement("div");r.className="msg-time",n.timestamp?.toDate&&(r.textContent=n.timestamp.toDate().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),a.appendChild(r),i.appendChild(o),i.appendChild(a),e.appendChild(i)}),e.scrollTop=e.scrollHeight)}g(L(),async t=>{if(!t){document.body.innerHTML="<h2>Sign in required.</h2>";return}const c=t.displayName||"User";await x(t.uid),R(c),console.log("Chat UI Built:",l("#chat_content_container")),l("#backBtn").addEventListener("click",()=>{window.location.href=`/myGroup.html?docID=${h}`});const e=v(p,"groups",h,"chat"),n=f(e,_("timestamp","asc")),d=t.uid;b(n,a=>{const s=[];a.forEach(r=>s.push(r.data())),console.log("Snapshot fired, messages:",s),S(s,d)});const i=l("#chat_input"),o=l("#chat_input_send");i.addEventListener("input",()=>{o.disabled=i.value.trim().length===0,o.classList.toggle("enabled",!o.disabled)}),o.addEventListener("click",async()=>{const a=i.value.trim();a&&(await y(e,{user:c,uid:t.uid,text:a,photoURL:m,timestamp:w()}).catch(s=>console.error("Send error:",s)),i.value="",o.disabled=!0,o.classList.remove("enabled"))})});
