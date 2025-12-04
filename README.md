# Pantry Tracker

## Overview

Pantry Tracker is a shared pantry and grocery tracking app for roommates, housemates, and families.

Our team **BBY 4** built this project for **BCIT COMP 1800**. The app helps groups:

- keep a live inventory of what’s in the pantry,
- see which items are running low,
- share a simple grocery checklist,
- and chat together in one place.

We used a user-centred design process (low-fi → hi-fi prototypes, quick user feedback) and ran the project in short sprints using basic agile practices. Firebase handles auth and data so the app stays synced across everyone in the group.

---

## Features

- **Shared groups**
  - Create a group with a join name and password.
  - Join multiple groups (e.g., “Home”, “Roommates”, “Cottage”).

- **Pantry inventory**
  - Add items with name, amount, and unit.
  - Adjust amounts directly in the table (plus/minus buttons).
  - Baseline values (set by the group owner) define what “stocked” looks like.

- **Auto-generated grocery checklist**
  - Items drop into the grocery list when `amount < baseline`.
  - See how many you need to buy and in which units.
  - “Dismiss” an item after shopping (sets the amount back up to baseline).

- **Group chat**
  - Real-time chat per group so you can coordinate groceries.
  - Messages show display name, avatar, and timestamp.

- **User profiles**
  - Edit display name, bio, and avatar URL.
  - Profile changes sync to all groups you’re in.
  - Quick link from profile to “My Groups”.

- **Auth & multi-group support**
  - Email + password login/signup with Firebase Authentication.
  - Each user can belong to many groups at once.

---

## Technologies Used

- **Frontend**
  - HTML, CSS, JavaScript (ES modules)
  - [Bootstrap](https://getbootstrap.com/) for basic layout and components

- **Build / Tooling**
  - [Vite](https://vitejs.dev/) for dev server and bundling
  - Environment variables via `import.meta.env` for Firebase config

- **Backend / Infrastructure**
  - [Firebase Auth](https://firebase.google.com/products/auth) for login/signup
  - [Cloud Firestore](https://firebase.google.com/products/firestore) for:
    - users collection
    - groups collection (pantry + membership)
    - per-group chat subcollections
  - (Optionally) Firebase Hosting for deploying the built app

---

## Usage

### Local development

1. Clone the repo and install dependencies:

   ```bash
   npm install
````

2. Create a `.env` file (or `.env.local`) with your Firebase keys:

   ```bash
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the printed URL (usually `http://localhost:5173`).

5. From there:

   * Go to Sign Up and create an account.
   * Create your first group from `main.html`.
   * Start adding pantry items and watch the grocery list update.
   * Open Group Chat from the group page to coordinate with others.

### Basic flow

1. Sign up / log in
   Use email and password to create an account.

2. Create or join a group

   * Pick a group name and password.
   * Set a join name (code) that others can use to join.
   * Or, if you already know the join name and password, use the “Join Group” panel.

3. Manage pantry

   * Add items (e.g., “Eggs”, `12` `pcs`).
   * Set baselines for important items (e.g., always keep 6 eggs).
   * The grocery list will auto-populate when you drop below baseline.

4. Check the grocery list

   * Before shopping, open the group and scroll to “Grocery Checklist”.
   * After shopping, either:

     * bump the amounts in the pantry table, or
     * hit “Dismiss” for items you’ve restocked.

5. Chat with your group

   * Click Open Group Chat on the group page.
   * Use the chat to coordinate who’s buying what.

---

## Project Structure

This is the rough layout of the project:

```text
pantry-tracker/
├── index.html             # Landing page (logged-out)
├── indexloggedin.html     # Landing header when logged in
├── login.html             # Login + signup variant
├── signup.html            # Signup + login variant
├── main.html              # Group dashboard (create / join / list)
├── myGroup.html           # Single group (pantry + grocery list)
├── groupChat.html         # Real-time group chat
├── profile.html           # User profile and “My Groups” list
├── src/
│   ├── firebaseConfig.js  # Firebase app + exports
│   ├── authentication.js  # Auth helpers
│   ├── main.js            # Group dashboard logic
│   ├── myGroup.js         # Pantry + grocery list logic
│   ├── groupChat.js       # Chat logic
│   ├── profile.js         # Profile screen logic
│   ├── loginSignup.js     # Auth form wiring
│   ├── components/
│   │   ├── site-navbar.js # Shared navbar web component
│   │   └── site-footer.js # Shared footer web component
│   └── styles/
│       ├── global.css     # Imports Bootstrap + theme CSS
│       └── style.css      # Main site + chat + pantry styles
├── images/                # Logos and group images
├── package.json
└── README.md
```

---

## Contributors

* Supreet – BCIT CST student who likes gaming and DC comics and keeps the design tidy.
* Ziad Malik – BCIT CST student who enjoys gaming, cooking, and building little tools like this to make life easier.

---

## Acknowledgments

* Some layout patterns and UI ideas were inspired by:

  * [MDN Web Docs](https://developer.mozilla.org/)
  * [Stack Overflow](https://stackoverflow.com/)
  * [Bootstrap Docs](https://getbootstrap.com/)
* Stock photos from [Unsplash](https://unsplash.com/) are used for testimonial avatars and demo images.

---

## Limitations and Future Work

### Current limitations

* Can only upload profile images through a link, no file upload. (This does bypass firebase file size limitations but limits freedom)
* No expiry-date tracking yet (it’s purely quantity-based).
* No notifications (e.g., “milk is low”) or reminder emails.
* Accessibility can be improved (keyboard shortcuts, aria labels, better contrast in a few spots).
* Mobile layout works but could use more polish on smaller screens.

### Future ideas

* Add expiry dates and highlight items that are about to expire.
* Push notifications or in-app alerts when certain items drop below baseline.
* Add roles/permissions (e.g., “owner”, “editor”, “viewer”) inside each group.
* Optional budget view that shows rough monthly spend per group.
* Dark mode toggle for late-night browsing.

---

## License

None?
