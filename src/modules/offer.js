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

function updateOfferLink(value, button) {
  if (!button) return

  const typeText = getOfferType(value)
  const message = `Евгений, привет! Я хочу предложить вам участие в моем проекте на ${typeText} занятости. Готов предложить ${value.toLocaleString('ru-RU')} ₽ в месяц.`
  button.href = `https://t.me/wpadmin?text=${encodeURIComponent(message)}`
}

function updateSliderBackground(slider, value) {
  const percentage = ((value - MIN_SALARY) / (MAX_SALARY - MIN_SALARY)) * 100
  slider.style.background = `linear-gradient(to right, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%)`
}

export function initOfferSlider() {
  const slider = document.querySelector('#offer-slider')
  const display = document.querySelector('#offer-display')
  const emoji = document.querySelector('#offer-emoji')
  const type = document.querySelector('#offer-type')
  const button = document.querySelector('#offer-contact-button')

  if (!slider || !display || !emoji || !type) return

  slider.addEventListener('input', (e) => {
    const value = Number(e.target.value)
    display.textContent = `${value.toLocaleString('ru-RU')} ₽`
    emoji.textContent = getEmoji(value)
    type.textContent = getOfferType(value)
    updateOfferLink(value, button)
    updateSliderBackground(slider, value)
  })

  const initialValue = 150000
  updateSliderBackground(slider, initialValue)
  updateOfferLink(initialValue, button)
}
