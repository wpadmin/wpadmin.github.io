import { animateOnView } from '../utils/animations.js'

export function initInViewAnimations() {
  animateOnView('[data-inview="ecommerce-title"]', {
    transform: ['translateY(40px)', 'translateY(0)']
  })

  animateOnView('[data-inview="ecommerce-subtitle"]', {
    transform: ['translateY(30px)', 'translateY(0)'],
    duration: 0.5,
    delay: 0.15
  })

  animateOnView('[data-inview="ecommerce-image"]', {
    transform: ['translateY(60px)', 'translateY(0)'],
    duration: 0.7,
    delay: 0.3
  })

  animateOnView('[data-inview="ecommerce-card-1"]', {
    transform: ['translateY(40px)', 'translateY(0)'],
    delay: 0.4
  })

  animateOnView('[data-inview="ecommerce-card-2"]', {
    transform: ['translateY(40px)', 'translateY(0)'],
    delay: 0.5
  })

  animateOnView('[data-inview="ecommerce-card-3"]', {
    transform: ['translateY(40px)', 'translateY(0)'],
    delay: 0.6
  })

  animateOnView('[data-inview="advantage-1"]', {
    transform: ['translateX(50px)', 'translateX(0)'],
    duration: 0.8,
    delay: 0.2
  })

  animateOnView('[data-inview="advantage-2"]', {
    transform: ['translateX(50px)', 'translateX(0)'],
    duration: 0.8,
    delay: 0.4
  })

  animateOnView('[data-inview="advantage-3"]', {
    transform: ['translateX(50px)', 'translateX(0)'],
    duration: 0.8,
    delay: 0.6
  })

  animateOnView('[data-inview="seo-title"]', {
    transform: ['translateY(40px)', 'translateY(0)']
  })

  animateOnView('[data-inview="seo-subtitle"]', {
    transform: ['translateY(30px)', 'translateY(0)'],
    duration: 0.5,
    delay: 0.15
  })

  animateOnView('[data-inview="seo-image"]', {
    transform: ['translateY(40px)', 'translateY(0)'],
    delay: 0.3
  })

  animateOnView('[data-inview="offer-title"]', {
    transform: ['translateY(40px)', 'translateY(0)']
  })

  animateOnView('[data-inview="offer-subtitle"]', {
    transform: ['translateY(30px)', 'translateY(0)'],
    duration: 0.5,
    delay: 0.15
  })

  animateOnView('[data-inview="offer-emoji"]', {
    transform: ['translateY(40px)', 'translateY(0)'],
    delay: 0.3
  })

  animateOnView('[data-inview="offer-display"]', {
    transform: ['translateY(30px)', 'translateY(0)'],
    duration: 0.5,
    delay: 0.45
  })

  animateOnView('[data-inview="offer-period"]', {
    transform: ['translateY(20px)', 'translateY(0)'],
    duration: 0.4,
    delay: 0.55
  })

  animateOnView('[data-inview="offer-type"]', {
    transform: ['translateY(20px)', 'translateY(0)'],
    duration: 0.4,
    delay: 0.65
  })

  animateOnView('[data-inview="offer-slider-block"]', {
    transform: ['translateY(40px)', 'translateY(0)'],
    delay: 0.75
  })

  animateOnView('[data-inview="offer-hint"]', {
    transform: ['translateY(20px)', 'translateY(0)'],
    duration: 0.4,
    delay: 0.9
  })

  animateOnView('[data-inview="offer-button"]', {
    transform: ['translateY(20px)', 'translateY(0)'],
    duration: 0.4,
    delay: 1.0
  })
}
