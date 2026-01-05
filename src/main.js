import './style.css'
import { animate, inView } from 'motion'

const yearElements = document.querySelectorAll('#current-year')
yearElements.forEach(el => {
  el.textContent = new Date().getFullYear().toString()
})

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

const offerTitle = document.querySelector('[data-inview="offer-title"]')
const offerSubtitle = document.querySelector('[data-inview="offer-subtitle"]')
const offerEmojiElement = document.querySelector('[data-inview="offer-emoji"]')
const offerDisplayElement = document.querySelector('[data-inview="offer-display"]')
const offerPeriodElement = document.querySelector('[data-inview="offer-period"]')
const offerTypeElement = document.querySelector('[data-inview="offer-type"]')
const offerSliderBlock = document.querySelector('[data-inview="offer-slider-block"]')
const offerHint = document.querySelector('[data-inview="offer-hint"]')

if (offerTitle) {
  inView(offerTitle, () => {
    animate(offerTitle, {
      opacity: [0, 1],
      transform: ['translateY(40px)', 'translateY(0)']
    }, {
      duration: 0.6,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerSubtitle) {
  inView(offerSubtitle, () => {
    animate(offerSubtitle, {
      opacity: [0, 1],
      transform: ['translateY(30px)', 'translateY(0)']
    }, {
      duration: 0.5,
      delay: 0.15,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerEmojiElement) {
  inView(offerEmojiElement, () => {
    animate(offerEmojiElement, {
      opacity: [0, 1],
      transform: ['translateY(40px)', 'translateY(0)']
    }, {
      duration: 0.6,
      delay: 0.3,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerDisplayElement) {
  inView(offerDisplayElement, () => {
    animate(offerDisplayElement, {
      opacity: [0, 1],
      transform: ['translateY(30px)', 'translateY(0)']
    }, {
      duration: 0.5,
      delay: 0.45,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerPeriodElement) {
  inView(offerPeriodElement, () => {
    animate(offerPeriodElement, {
      opacity: [0, 1],
      transform: ['translateY(20px)', 'translateY(0)']
    }, {
      duration: 0.4,
      delay: 0.55,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerTypeElement) {
  inView(offerTypeElement, () => {
    animate(offerTypeElement, {
      opacity: [0, 1],
      transform: ['translateY(20px)', 'translateY(0)']
    }, {
      duration: 0.4,
      delay: 0.65,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerSliderBlock) {
  inView(offerSliderBlock, () => {
    animate(offerSliderBlock, {
      opacity: [0, 1],
      transform: ['translateY(40px)', 'translateY(0)']
    }, {
      duration: 0.6,
      delay: 0.75,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

if (offerHint) {
  inView(offerHint, () => {
    animate(offerHint, {
      opacity: [0, 1],
      transform: ['translateY(20px)', 'translateY(0)']
    }, {
      duration: 0.4,
      delay: 0.9,
      easing: [0.22, 1, 0.36, 1]
    })
  })
}

const MIN_SALARY = 90000
const MAX_SALARY = 250000
const FULLTIME_THRESHOLD = 150000

function getEmoji(value) {
  if (value < 110000) return '😢'
  if (value < 140000) return '😕'
  if (value < 180000) return '😐'
  if (value < 230000) return '🙂'
  return '😊'
}

function getOfferType(value) {
  return value >= FULLTIME_THRESHOLD ? 'full-time' : 'part-time'
}

const offerSlider = document.querySelector('#offer-slider')
const offerDisplay = document.querySelector('#offer-display')
const offerEmoji = document.querySelector('#offer-emoji')
const offerType = document.querySelector('#offer-type')

if (offerSlider && offerDisplay && offerEmoji && offerType) {
  offerSlider.addEventListener('input', (e) => {
    const value = Number(e.target.value)
    offerDisplay.textContent = `${value.toLocaleString('ru-RU')} ₽`
    offerEmoji.textContent = getEmoji(value)
    offerType.textContent = getOfferType(value)

    const percentage = ((value - MIN_SALARY) / (MAX_SALARY - MIN_SALARY)) * 100
    e.target.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%)`
  })

  const initialValue = 150000
  const initialPercentage = ((initialValue - MIN_SALARY) / (MAX_SALARY - MIN_SALARY)) * 100
  offerSlider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) ${initialPercentage}%, rgba(255, 255, 255, 0.2) ${initialPercentage}%, rgba(255, 255, 255, 0.2) 100%)`
}

