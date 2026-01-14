class CtaButton extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    const href = this.getAttribute('href') || 'https://t.me/wpadmin'
    const text = this.getAttribute('text') || 'обсудить проект'
    const size = this.getAttribute('size') || 'large'

    const sizeClasses = size === 'large'
      ? 'px-16 py-6 md:px-20 md:py-8 lg:px-24 lg:py-10 text-2xl md:text-3xl lg:text-4xl'
      : 'px-12 py-5 text-xl'

    this.innerHTML = `
      <a href="${href}"
         target="_blank"
         rel="noopener noreferrer"
         class="animated-button inline-block ${sizeClasses} hover:shadow-2xl hover:shadow-accent-orange/50 text-white font-semibold uppercase rounded-full transition-all">
        ${text}
      </a>
    `
  }
}

customElements.define('cta-button', CtaButton)
