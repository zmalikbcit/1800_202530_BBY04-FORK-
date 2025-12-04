import { auth, db } from "/src/firebaseConfig.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

// turn a name into a stable id: "Team Alpha" -> "team-alpha"
function groupIdFromName(name) {
  return (name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// make a group doc if it doesn't exist yet
export async function createGroup(name, password) {
  if (!name || !password) {
    throw new Error("Group name and password are required.");
  }

  const gid = groupIdFromName(name);
  const ref = doc(db, "groups", gid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    throw new Error("A group with that name already exists.");
  }

  const uid = auth.currentUser?.uid || null;
  let userEntry = null;

  if (uid) {
    const uref = doc(db, "users", uid);
    const usnap = await getDoc(uref);
    const udoc = usnap.exists() ? usnap.data() : {};

    const username =
      udoc.username ||
      auth.currentUser.displayName ||
      (auth.currentUser.email ? auth.currentUser.email.split("@")[0] : "user");

    userEntry = {
      uid,
      username,
      displayName: udoc.displayName || auth.currentUser.displayName || username,
      photoURL: udoc.photoURL || auth.currentUser.photoURL || null,
      email: auth.currentUser.email || udoc.email || null,
      joinedAt: new Date(),
    };
  }

  const data = {
    name: name.trim(),
    password,
    createdAt: serverTimestamp(),
    ownerUid: uid,
    users: userEntry ? [userEntry] : [],
    userUids: uid ? [uid] : [],
  };

  await setDoc(ref, data);
  return gid;
}

// join a group by its name + password
export async function joinGroup(name, password) {
  if (!name || !password) {
    throw new Error("Group name and password are required.");
  }
  if (!auth.currentUser) {
    throw new Error("Must be logged in to join a group.");
  }

  const uid = auth.currentUser.uid;
  const gid = groupIdFromName(name);
  const ref = doc(db, "groups", gid);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error("Group not found.");

  const group = snap.data();
  if (group.deletedAt) throw new Error("This group has been deleted.");
  if (group.password !== password) throw new Error("Incorrect group password.");

  const alreadyMember =
    Array.isArray(group.users) && group.users.some((u) => u?.uid === uid);

  if (!alreadyMember) {
    const uref = doc(db, "users", uid);
    const usnap = await getDoc(uref);
    const udoc = usnap.exists() ? usnap.data() : {};

    const username =
      udoc.username ||
      auth.currentUser.displayName ||
      (auth.currentUser.email ? auth.currentUser.email.split("@")[0] : "user");

    await updateDoc(ref, {
      users: arrayUnion({
        uid,
        username,
        displayName:
          udoc.displayName || auth.currentUser.displayName || username,
        photoURL: udoc.photoURL || auth.currentUser.photoURL || null,
        email: auth.currentUser.email || udoc.email || null,
        joinedAt: new Date(),
      }),
      userUids: arrayUnion(uid),
      updatedAt: serverTimestamp(),
    });
  }

  return gid;
}

// quick membership check
export async function isMemberOfGroup(name) {
  if (!auth.currentUser) return false;

  const gid = groupIdFromName(name);
  const ref = doc(db, "groups", gid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;

  const group = snap.data();
  if (group.deletedAt) return false;

  return (
    Array.isArray(group.users) &&
    group.users.some((u) => u?.uid === auth.currentUser.uid)
  );
}
