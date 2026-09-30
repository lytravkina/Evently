'use strict';

const path = '/events'
let events;
const eventsList = document.querySelector('.events__cards')
const modal = document.querySelector('.modal')
const searchInput = document.querySelector('.filters-form__input')

async function getEvents() {
    try {
        const response = await fetch(path)

        if (!response.ok) {
            throw new Error()
        }

        return response.json()

    } catch {
        const errorMessage = document.querySelector('.events__error')
        errorMessage.classList.add('error-message_active')
        errorMessage.textContent = 'Не удалось загрузить данные'
    }
}

function renderEvents(events) {
    eventsList.innerHTML = ''

    events.forEach(event => {
        const eventElement = document.createElement('article')
        eventElement.classList.add('event-card')
        eventElement.id = event.id
        eventElement.innerHTML = `<div class="event-card__content">
              <div class="event-card__top">
                <div class="event-card__subtitle subtitle">${event.category}</div>
                <h2 class="event-card__title title">${event.title}</h2>
                <p class="event-card__description description">
                  ${event.description}
                </p>
              </div>
              <div class="event-card__bottom">
                <div class="event-card__details event-card__date">
                  <div class="icon">
                    <img
                      class="icon__image"
                      src="./assets/Time Square.svg"
                      alt="Clock emoji"
                    />
                  </div>
                  <span class="date">${formatDate(event.date)}</span>
                </div>
                <div class="event-card__details event-card__location">
                  <div class="icon">
                    <img
                      class="icon__image"
                      src="./assets/Location.svg"
                      alt="Location pin emoji"
                    />
                  </div>
                  <span class="location">${event.location}</span>
                </div>
                <div class="event-card__details event-card__capacity">
                  <span class="capacity"
                    ><span class="capacity__number">${event.capacity}</span> мест</span
                  >
                </div>
                <button class="button button_sign-up">Записаться</button>
              </div>
            </div>`
        eventsList.append(eventElement)
    })
}

function setCategories(events) {
    const categories = events.reduce((categories, event) => {
        if (!categories.includes(event.category)) {
            categories.push(event.category)
        }

        return categories
    }, [])

    categories.forEach(category => {
        const option = document.createElement('option')
        option.classList.add('filters-form__option')
        option.value = category
        option.textContent = category
        document.querySelector('.filters-form__select').append(option)
    })
}

function formatDate(string) {
    let [date, time] = string.split('T')

    const [year, month, day] = date.split('-')

    const [hour, minute] = time.split(':')

    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`
    return formattedDate
}

const handler = {
    handleEvent(event) {
        switch (true) {
            case event.target.matches('.button_sign-up'):
                this.openModal(event)
                break;
            case !(event.target.closest('.modal__dialog') && !event.target.closest('.modal__close')):
                this.closeModal()
                break;
        }
    },

    openModal(event) {
        modal.classList.add('modal_open')
        const cardId = event.target.closest('article').id
        events.forEach(event => {
            if (event.id === cardId) {
                modal.querySelector('.modal__title').textContent = event.title
            }
        })
    },

    closeModal() {
        modal.classList.remove('modal_open')
    },
}

const filters = {
    search: '',
    category: '',
}

function filterEvents(event) {
    event.preventDefault()
    const { search, category } = filters
    let filteredEvents = events.filter(event => {
        let filteredBySearch =
            !search || event.title.toLowerCase().includes(search) || event.description.toLowerCase().includes(search)

        let filteredByCategory =
            !category || event.category === category

        return filteredBySearch && filteredByCategory
    })

    renderEvents(filteredEvents)
}

function setRegistration(event) {
    event.preventDefault()

    const targets = [...event.target.querySelectorAll('.modal-form__input')]

    let data = {
        name: '',
        email: ''
    }

    targets.forEach(input => {
        const value = validateInput(input)
        data[input.name] = value
    })

    console.log(data)
}

function validateInput(input) {
    const value = input.value.trim()
    const parent = input.closest('label')

    clearError(input)

    if (!value) {
        input.classList.add('invalid')
        input.value = ''
        const errorMessage = document.createElement('p')
        errorMessage.classList.add('modal-form__error', 'error-message')
        if (input.name === 'name') {
            errorMessage.textContent = 'Пожалуйста, введите ваше имя'
        } else {
            errorMessage.textContent = 'Пожалуйста, введите корректный Email'
        }

        parent.append(errorMessage)
    }

    return value
}

function clearError(input) {
    // const input = event.target
    const parent = input.closest('label')
    const errorMessage = parent.querySelector('.error-message')
    if (errorMessage) {
        errorMessage.remove()
        input.classList.remove('invalid')
    }
}

function initEventListeners() {
    eventsList.addEventListener('click', handler)
    modal.addEventListener('click', handler)
    document.querySelector('.filters-form').addEventListener('submit', filterEvents)
    document.querySelector('.filters-form__select').addEventListener('change', function (event) {
        filters.category = event.target.value
        filterEvents(event)
    })
    document.querySelector('.filters-form__input').addEventListener('input', function (event) {
        filters.search = event.target.value
        filterEvents(event)
    })
    modal.querySelector('.modal-form').addEventListener('submit', setRegistration)
    modal.querySelector('.modal-form').addEventListener('input', event => clearError(event.target))
}

async function init() {
    events = await getEvents()
    renderEvents(events)
    setCategories(events)
    initEventListeners()
}

init()