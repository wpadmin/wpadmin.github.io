import Swiper from 'swiper'
import { Autoplay, EffectCoverflow } from 'swiper/modules'

function loadScreenshots() {
  const wrapper = document.querySelector('.showcaseSwiper .swiper-wrapper')
  if (!wrapper) return

  const screenshots = import.meta.glob('/public/demo/screenshot-*.png', { eager: true, as: 'url' })
  const paths = Object.keys(screenshots).sort()

  wrapper.innerHTML = paths.map((path, index) => {
    const url = screenshots[path]
    return `
      <div class="swiper-slide">
        <img src="${url}" alt="WordPress site example ${index + 1}" class="w-full h-auto">
      </div>
    `
  }).join('')
}

export function initShowcaseSwiper() {
  loadScreenshots()

  return new Swiper('.showcaseSwiper', {
    modules: [Autoplay, EffectCoverflow],
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    speed: 1200,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 2,
      slideShadows: false,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1.5,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
    },
  })
}
