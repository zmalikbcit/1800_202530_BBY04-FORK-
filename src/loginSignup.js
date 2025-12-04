import "/src/styles/global.css";
import "bootstrap";
import { loginUser, signupUser, authErrorMessage } from "./authentication.js";

function initAuthUI() {
  // bits from the DOM
  const alertEl = document.getElementById("authAlert");
  const loginView = document.getElementById("loginView");
  const signupView = document.getElementById("signupView");
  const toSignupBtn = document.getElementById("toSignup");
  const toLoginBtn = document.getElementById("toLogin");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const redirectUrl = "main.html";

  // quick visibility toggle
  function setVisible(el, visible) {
    el?.classList.toggle("d-none", !visible);
  }

  // alert helpers
  let errorTimeout;
  function showError(msg) {
    alertEl.textContent = msg || "";
    alertEl.classList.remove("d-none");
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(hideError, 5000);
  }

  function hideError() {
    alertEl.classList.add("d-none");
    alertEl.textContent = "";
    clearTimeout(errorTimeout);
  }

  function setSubmitDisabled(form, disabled) {
    const submitBtn = form?.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = !!disabled;
  }

  // view switching
  toSignupBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    hideError();
    setVisible(loginView, false);
    setVisible(signupView, true);
    signupView?.querySelector("input")?.focus();
  });

  toLoginBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    hideError();
    setVisible(signupView, false);
    setVisible(loginView, true);
    loginView?.querySelector("input")?.focus();
  });

  // login submit
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const email = document.querySelector("#loginEmail")?.value?.trim() ?? "";
    const password = document.querySelector("#loginPassword")?.value ?? "";

    if (!email || !password) {
      showError("Please enter your email and password.");
      return;
    }

    setSubmitDisabled(loginForm, true);

    try {
      await loginUser(email, password);
      location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      showError(authErrorMessage(err));
    } finally {
      setSubmitDisabled(loginForm, false);
    }
  });

  // signup submit
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const name = document.querySelector("#signupName")?.value?.trim() ?? "";
    const email = document.querySelector("#signupEmail")?.value?.trim() ?? "";
    const password = document.querySelector("#signupPassword")?.value ?? "";

    if (!name || !email || !password) {
      showError("Please fill in name, email, and password.");
      return;
    }

    setSubmitDisabled(signupForm, true);

    try {
      await signupUser(name, email, password);
      location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      showError(authErrorMessage(err));
    } finally {
      setSubmitDisabled(signupForm, false);
    }
  });
}

document.addEventListener("DOMContentLoaded", initAuthUI);
