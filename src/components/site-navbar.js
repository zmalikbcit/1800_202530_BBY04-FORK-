import { onAuthReady } from "../authentication.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "/src/firebaseConfig.js";
import { logoutUser } from "/src/authentication.js";

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    // wait for auth and then draw
    onAuthReady((user) => {
      this.renderNavbar(user);
      this.renderAuthControls();
    });
  }

  renderNavbar(user) {
    if (!user) {
      // logged-out nav (landing page sections)
      this.innerHTML = `
        <header class="topbar">
          <div class="wrap">
            <div class="brand">
              <img
                src="/images/logowhite.png"
                alt="Pantry Tracker Logo"
                class="logo-image"
              />
            </div>

            <nav class="nav">
              <a href="index.html" class="active">Home</a>
              <a href="#features">Features</a>
              <a href="#learn-more">Learn More</a>
            </nav>

            <div
              id="authControls"
              class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0"
            ></div>
          </div>
        </header>
      `;
    } else {
      // logged-in nav (app pages)
      this.innerHTML = `
        <header class="topbar">
          <div class="wrap">
            <div class="brand">
              <img
                src="/images/logowhite.png"
                alt="Pantry Tracker Logo"
                class="logo-image"
              />
            </div>

            <nav class="nav">
              <a href="indexloggedin.html" class="active">Home</a>
              <a href="main.html" class="active">Your Groups</a>
              <a href="profile.html" class="active">Profile</a>
            </nav>

            <div
              id="authControls"
              class="auth-controls d-flex align-items-center gap-2 my-2 my-lg-0"
            ></div>
          </div>
        </header>
      `;
    }
  }

  renderAuthControls() {
    const authControls = this.querySelector("#authControls");
    if (!authControls) return;

    // hold space so layout doesn't jump
    authControls.innerHTML = `
      <div
        class="btn btn-outline-light"
        style="visibility: hidden; min-width: 80px;"
      >
        Log out
      </div>
    `;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        authControls.innerHTML = `
          <button
            class="btn btn-outline-light"
            id="signOutBtn"
            type="button"
            style="min-width: 80px;"
          >
            Log out
          </button>
        `;

        const signOutBtn = authControls.querySelector("#signOutBtn");
        signOutBtn?.addEventListener("click", logoutUser);
      } else {
        authControls.innerHTML = `
          <a
            class="btn btn-outline-light"
            id="loginBtn"
            href="/login.html"
            style="min-width: 80px;"
          >
            Log in
          </a>
        `;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
