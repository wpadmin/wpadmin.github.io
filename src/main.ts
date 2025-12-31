import './style.css'

const scrollIndicator = document.querySelector<HTMLButtonElement>('#scroll-indicator')

if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const featuresSection = document.querySelector('#features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

const yearElement = document.querySelector<HTMLSpanElement>('#current-year')
if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString()
}

const header = document.querySelector<HTMLElement>('header')
const SCROLL_THRESHOLD = window.innerHeight * 0.5

function handleScroll(): void {
  if (!header) return

  const scrolled = window.scrollY > SCROLL_THRESHOLD

  if (scrolled) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
}

window.addEventListener('scroll', handleScroll)

const mobileMenuButton = document.querySelector<HTMLButtonElement>('#mobile-menu-button')
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')
const mobileMenuOverlay = document.querySelector<HTMLElement>('#mobile-menu-overlay')

function closeMobileMenu(): void {
  if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay) return

  mobileMenu.classList.remove('open')
  mobileMenuButton.classList.remove('open')
  mobileMenuOverlay.classList.remove('open')
  mobileMenuButton.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''
}

function openMobileMenu(): void {
  if (!mobileMenuButton || !mobileMenu || !mobileMenuOverlay) return

  mobileMenu.classList.add('open')
  mobileMenuButton.classList.add('open')
  mobileMenuOverlay.classList.add('open')
  mobileMenuButton.setAttribute('aria-expanded', 'true')
  document.body.style.overflow = 'hidden'
}

if (mobileMenuButton && mobileMenu && mobileMenuOverlay) {
  mobileMenuButton.addEventListener('click', () => {
    const isOpen = mobileMenuButton.classList.contains('open')

    if (isOpen) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  })

  mobileMenuOverlay.addEventListener('click', closeMobileMenu)

  const mobileLinks = mobileMenu.querySelectorAll('a')
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu)
  })

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuButton.classList.contains('open')) {
      closeMobileMenu()
    }
  })
}
