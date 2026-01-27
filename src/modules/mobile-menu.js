import { animate } from 'motion'

const EASING = [0.22, 1, 0.36, 1]

let isMenuOpen = false

function openMobileMenu(button, menu, links) {
  isMenuOpen = true
  button.classList.add('active')
  menu.classList.add('active')
  document.body.classList.add('menu-open')

  animate(menu, { opacity: [0, 1] }, {
    duration: 0.3,
    easing: EASING
  })

  links.forEach((link, index) => {
    animate(link, {
      opacity: [0, 1],
      transform: ['translateY(20px)', 'translateY(0)']
    }, {
      duration: 0.4,
      delay: 0.1 + index * 0.1,
      easing: EASING
    })
  })
}

function closeMobileMenu(button, menu, links) {
  isMenuOpen = false
  button.classList.remove('active')
  document.body.classList.remove('menu-open')

  links.forEach(link => {
    animate(link, { opacity: [1, 0] }, {
      duration: 0.15,
      easing: EASING
    })
  })

  animate(menu, { opacity: [1, 0] }, {
    duration: 0.2,
    easing: EASING
  }).finished.then(() => {
    menu.classList.remove('active')
  })
}

export function initMobileMenu() {
  const button = document.querySelector('#mobile-menu-button')
  const menu = document.querySelector('#mobile-menu')
  const links = document.querySelectorAll('.mobile-menu-link')

  if (!button || !menu) return

  button.addEventListener('click', () => {
    if (isMenuOpen) {
      closeMobileMenu(button, menu, links)
    } else {
      openMobileMenu(button, menu, links)
    }
  })

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) {
        closeMobileMenu(button, menu, links)
      }
    })
  })
}
