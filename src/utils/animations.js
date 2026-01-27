import { animate, inView } from 'motion'

const EASING = [0.22, 1, 0.36, 1]

export function animateOnLoad(selector, options = {}) {
  const element = document.querySelector(selector)
  if (!element) return

  const {
    opacity = [0, 1],
    transform,
    duration = 0.6,
    delay = 0
  } = options

  const config = { opacity }
  if (transform) config.transform = transform

  animate(element, config, {
    duration,
    delay,
    easing: EASING
  })
}

export function animateOnView(selector, options = {}) {
  const element = document.querySelector(selector)
  if (!element) return

  const {
    opacity = [0, 1],
    transform,
    duration = 0.6,
    delay = 0
  } = options

  inView(element, () => {
    const config = { opacity }
    if (transform) config.transform = transform

    animate(element, config, {
      duration,
      delay,
      easing: EASING
    })
  })
}
