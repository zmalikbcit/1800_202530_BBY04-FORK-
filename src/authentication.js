import { auth } from "/src/firebaseConfig.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db } from "/src/firebaseConfig.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// plain login
export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// signup + seed Firestore user document
export async function signupUser(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // show name in Firebase Auth profile
  await updateProfile(user, { displayName: name });

  // simple username fallback
  const username =
    (name || "").trim() || (email ? email.split("@")[0] : "user");

  try {
    await setDoc(doc(db, "users", user.uid), {
      username,
      displayName: name,
      photoURL: user.photoURL || null,
      name,
      email,
      country: "Canada",
      school: "BCIT",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Firestore user document created.");
  } catch (error) {
    console.error("Error creating user document in Firestore:", error);
  }

  return user;
}

// full logout + redirect to landing
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}

// simple gate for main.html
export function checkAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (window.location.pathname.endsWith("main.html")) {
      if (user) {
        const displayName =
          user.displayName ||
          (user.email ? user.email.split("@")[0] : "user");
        $("#welcomeMessage").text(`Hello, ${displayName}!`);
      } else {
        window.location.href = "index.html";
      }
    }
  });
}

// tiny helper to wait for auth state once
export function onAuthReady(callback) {
  return onAuthStateChanged(auth, callback);
}

// friendlier error messages
export function authErrorMessage(error) {
  const code = (error?.code || "").toLowerCase();

  const map = {
    "auth/invalid-credential": "Wrong email or password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
    "auth/email-already-in-use": "Email is already in use.",
    "auth/weak-password": "Password too weak (min 6 characters).",
    "auth/missing-password": "Password cannot be empty.",
    "auth/network-request-failed": "Network error. Try again.",
  };

  return map[code] || "Something went wrong. Please try again.";
}

// -------------------------------------
// promise style helper for "auth ready"
// -------------------------------------
let authReadyResolvers = [];

export const whenAuthReady = new Promise((res) => {
  authReadyResolvers.push(res);
});

export function initializeAuthState(onUserChange) {
  onAuthStateChanged(auth, (user) => {
    if (typeof onUserChange === "function") onUserChange(user);

    // flush any waiters
    while (authReadyResolvers.length) {
      const resolve = authReadyResolvers.shift();
      resolve(user);
    }
  });
}

// minimal logout variant (no redirect)
export async function logout() {
  await signOut(auth);
}
