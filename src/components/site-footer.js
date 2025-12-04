class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="wrap small">
          <p>© <span id="y"></span> Pantry Tracker</p>
          <p>
            <a href="#privacy">Privacy</a> ·
            <a href="#terms">Terms</a> ·
            <a href="#contact">Contact</a>
          </p>
        </div>
      </footer>
    `;

    // drop in the current year
    const yearSpan = this.querySelector("#y");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }
}

customElements.define("site-footer", SiteFooter);
