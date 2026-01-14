import { animate, stagger } from 'motion'
import { animateOnLoad } from '../utils/animations.js'

const EASING = [0.22, 1, 0.36, 1]

export function initHero() {
  animateOnLoad('[data-animate="hero-title"]', {
    transform: ['translateY(30px)', 'translateY(0)']
  })

  animateOnLoad('[data-animate="avatar"]', {
    transform: ['translateX(-40px) scale(0.95)', 'translateX(0) scale(1)'],
    duration: 0.5,
    delay: 0.15
  })

  animateOnLoad('[data-animate="bubble"]', {
    transform: ['translateX(40px) scale(0.98)', 'translateX(0) scale(1)'],
    duration: 0.5,
    delay: 0.25
  })

  animateOnLoad('[data-animate="button"]', {
    transform: ['translateY(30px) scale(0.95)', 'translateY(0) scale(1)'],
    duration: 0.4,
    delay: 0.4
  })

  initTextRotation()
}

function initTextRotation() {
  const line1 = document.querySelector('#hero-line1')
  if (!line1) return

  const phrases = [
    'Ваш бизнес не находят в интернете?',
    'Или у вас ещё нет сайта?'
  ]

  let currentIndex = 0

  function changeText() {
    currentIndex = (currentIndex + 1) % phrases.length
    const newText = phrases[currentIndex]

    line1.innerHTML = newText
      .split('')
      .map(char => `<span style="opacity:0">${char}</span>`)
      .join('')

    animate(
      line1.querySelectorAll('span'),
      { opacity: [0, 1] },
      { delay: stagger(0.03), duration: 0.2 }
    )
  }

  setInterval(changeText, 5000)
}
