import './style.css'
import { animate, inView } from 'motion'

const yearElement = document.querySelector('#current-year')
if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString()
}

const header = document.querySelector('header')
const SCROLL_THRESHOLD = window.innerHeight * 0.5

function handleScroll() {
  if (!header) return

  if (window.scrollY > SCROLL_THRESHOLD) {
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
}

window.addEventListener('scroll', handleScroll)

const heroTitle = document.querySelector('[data-animate="hero-title"]')
const avatar = document.querySelector('[data-animate="avatar"]')
const bubble = document.querySelector('[data-animate="bubble"]')
const button = document.querySelector('[data-animate="button"]')

if (heroTitle) {
  animate(heroTitle, {
    opacity: [0, 1],
    transform: ['translateY(30px)', 'translateY(0)']
  }, {
    duration: 0.6,
    easing: [0.22, 1, 0.36, 1]
  })
}

if (avatar) {
  animate(avatar, {
    opacity: [0, 1],
    transform: ['translateX(-40px) scale(0.95)', 'translateX(0) scale(1)']
  }, {
    duration: 0.5,
    delay: 0.15,
    easing: [0.22, 1, 0.36, 1]
  })
}

if (bubble) {
  animate(bubble, {
    opacity: [0, 1],
    transform: ['translateX(40px) scale(0.98)', 'translateX(0) scale(1)']
  }, {
    duration: 0.5,
    delay: 0.25,
    easing: [0.22, 1, 0.36, 1]
  })
}

if (button) {
  animate(button, {
    opacity: [0, 1],
    transform: ['translateY(30px) scale(0.95)', 'translateY(0) scale(1)']
  }, {
    duration: 0.4,
    delay: 0.4,
    easing: [0.22, 1, 0.36, 1]
  })
}

const ecommerceTitle = document.querySelector('[data-inview="ecommerce-title"]')
const ecommerceSubtitle = document.querySelector('[data-inview="ecommerce-subtitle"]')
const ecommerceImage = document.querySelector('[data-inview="ecommerce-image"]')

if (ecommerceTitle) {
  inView(ecommerceTitle, () => {
    animate(ecommerceTitle, {
      opacity: [0, 1],
      transform: ['translateY(40px)', 'translateY(0)']
    }, {
      duration: 0.6,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (ecommerceSubtitle) {
  inView(ecommerceSubtitle, () => {
    animate(ecommerceSubtitle, {
      opacity: [0, 1],
      transform: ['translateY(30px)', 'translateY(0)']
    }, {
      duration: 0.5,
      delay: 0.15,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (ecommerceImage) {
  inView(ecommerceImage, () => {
    animate(ecommerceImage, {
      opacity: [0, 1],
      transform: ['translateY(60px)', 'translateY(0)']
    }, {
      duration: 0.7,
      delay: 0.3,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}
