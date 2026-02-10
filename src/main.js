import './style.css'
import './components/CtaButton.js'
import './components/SiteHeader.js'
import './components/SiteFooter.js'
import { initScrollHeader } from './modules/scroll.js'
import { initHero } from './modules/hero.js'
import { initInViewAnimations } from './modules/inview-animations.js'
import { initOfferSlider } from './modules/offer.js'
import { initMobileMenu } from './modules/mobile-menu.js'
import { initShowcaseSwiper } from './modules/swiper.js'
import { initLogoAnimation } from './modules/logo-animation.js'

initScrollHeader()
initMobileMenu()
initInViewAnimations()

if (document.querySelector('#hero[data-animate="hero-title"]')) {
  initHero()
}

if (document.querySelector('#offer-slider')) {
  initOfferSlider()
}

if (document.querySelector('.showcaseSwiper')) {
  initShowcaseSwiper()
}

if (document.querySelector('#showcase-logo')) {
  initLogoAnimation()
}
