const SCROLL_THRESHOLD = 50

export function initScrollHeader() {
  const header = document.querySelector('#main-header')
  if (!header) return

  function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled')
    } else {
      header.classList.remove('scrolled')
    }
  }

  window.addEventListener('scroll', handleScroll)
}
