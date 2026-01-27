import './style.css'
import './components/CtaButton.js'
import { initScrollHeader } from './modules/scroll.js'
import { initHero } from './modules/hero.js'
import { initInViewAnimations } from './modules/inview-animations.js'
import { initOfferSlider } from './modules/offer.js'
import { initMobileMenu } from './modules/mobile-menu.js'
import { initShowcaseSwiper } from './modules/swiper.js'
import { initLogoAnimation } from './modules/logo-animation.js'

document.querySelectorAll('#current-year').forEach(el => {
  el.textContent = new Date().getFullYear().toString()
})

initScrollHeader()
initHero()
initInViewAnimations()
initOfferSlider()
initMobileMenu()
initShowcaseSwiper()
initLogoAnimation()
