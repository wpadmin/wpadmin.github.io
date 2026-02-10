class SiteFooter extends HTMLElement {
  connectedCallback() {
    const currentYear = new Date().getFullYear()

    this.innerHTML = `
      <footer class="w-full py-8 bg-dark-gray-900 text-white">
        <div class="container mx-auto px-4 flex items-center justify-between">
          <p class="text-sm">© Evgeni Shavrin, ${currentYear}</p>

          <div class="flex items-center gap-2">
            <p class="text-sm">Proudly hosted by</p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
              <img src="/github-mark-white.svg" alt="GitHub" class="h-10">
            </a>
          </div>
        </div>
      </footer>
    `
  }
}

customElements.define('site-footer', SiteFooter)
