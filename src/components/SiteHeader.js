class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header id="main-header" class="fixed top-0 left-0 w-full z-120 transition-all duration-300">
        <div class="container mx-auto px-4 py-6 flex justify-between items-center">
          <a href="/#hero">
            <img src="/wpadmin.svg" alt="wpadmin" class="w-[100px]">
          </a>

          <nav class="hidden md:flex gap-8">
            <a href="/#ecommerce" class="text-white hover:text-accent-orange transition-colors text-lg font-medium">
              Разработка
            </a>
            <a href="/#seo" class="text-white hover:text-accent-orange transition-colors text-lg font-medium">
              Продвижение
            </a>
            <a href="/#about" class="text-white hover:text-accent-orange transition-colors text-lg font-medium">
              Обо мне
            </a>
            <a href="/#offer" class="text-white hover:text-accent-orange transition-colors text-lg font-medium">
              Фриланс
            </a>
          </nav>

          <button type="button" id="mobile-menu-button"
            class="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-2 relative" aria-label="Меню">
            <span class="hamburger-line w-7 h-0.5 bg-white rounded-full transition-all duration-300"></span>
            <span class="hamburger-line w-7 h-0.5 bg-white rounded-full transition-all duration-300"></span>
            <span class="hamburger-line w-7 h-0.5 bg-white rounded-full transition-all duration-300"></span>
          </button>
        </div>
      </header>

      <nav id="mobile-menu"
        class="fixed top-0 left-0 w-full h-screen bg-dark-gray-900 z-[110] flex flex-col items-center justify-center gap-8 md:hidden invisible">
        <a href="/#ecommerce"
          class="mobile-menu-link text-white text-3xl font-medium hover:text-accent-orange transition-colors">
          Разработка
        </a>
        <a href="/#seo" class="mobile-menu-link text-white text-3xl font-medium hover:text-accent-orange transition-colors">
          Продвижение
        </a>
        <a href="/#about"
          class="mobile-menu-link text-white text-3xl font-medium hover:text-accent-orange transition-colors">
          Обо мне
        </a>
        <a href="/#offer"
          class="mobile-menu-link text-white text-3xl font-medium hover:text-accent-orange transition-colors">
          Фриланс
        </a>
      </nav>
    `
  }
}

customElements.define('site-header', SiteHeader)
