import { animate, inView } from 'motion'

export function initLogoAnimation() {
  const logo = document.querySelector('#showcase-logo')
  if (!logo) return

  inView(logo, () => {
    setTimeout(() => {
      animate(logo, {
        left: ['0px', '150vw'],
        rotate: ['0deg', '720deg'],
        opacity: [1, 1, 0]
      }, {
        duration: 3,
        easing: 'ease-in'
      })
    }, 2000)
  }, { amount: 0.3 })
}
