'use strict';

const eventsPath = '/events'
const registrationsPath = '/registrations'

let events;
let registrations;
let currentEvents;

const eventsList = document.querySelector('.events__cards')
const modal = document.querySelector('.modal')
const searchInput = document.querySelector('.filters-form__input')

const hero = {
    subtitle: document.querySelector('.hero__subtitle'),
    title: document.querySelector('.hero__title'),
    description: document.querySelector('.hero__description')
}

const menu = {
    events: document.querySelector('.menu__item_events'),
    registrations: document.querySelector('.menu__item_registrations')
}

let data = {
    name: '',
    email: ''
}

async function getEvents() {
    try {
        const response = await fetch(eventsPath)

        if (!response.ok) {
            throw new Error()
        }

        return response.json()

    } catch {
        const errorMessage = document.createElement('p')
        errorMessage.classList.add('events__error', 'error-message', 'error-message_active')
        errorMessage.textContent = 'Не удалось загрузить данные'
        eventsList.append(errorMessage)
    }
}

async function getRegistrations() {
    try {
        const response = await fetch(registrationsPath)

        if (!response.ok) {
            throw new Error()
        }

        return await response.json()

    } catch {
        const errorMessage = document.createElement('p')
        errorMessage.classList.add('events__error', 'error-message', 'error-message_active')
        errorMessage.textContent = 'Не удалось загрузить данные'
        eventsList.append(errorMessage)
    }
}

function getRegisteredEvents(events, registrations) {
    const registeredEvents = events.filter(event => {
        return registrations.some(registration => registration.eventId === event.id)
    })

    currentEvents = registeredEvents

    renderEvents(currentEvents, false)
    setCategories(currentEvents)
}

function renderEvents(events, signIn = true) {
    eventsList.innerHTML = ''

    if (events.length === 0) {
        const errorMessage = document.createElement('p')
        errorMessage.classList.add('events__error', 'error-message', 'error-message_active')
        errorMessage.textContent = 'Нет доступных мероприятий'
        eventsList.append(errorMessage)
        return
    }

    let button;
    if (signIn) {
        button = '<button class="button button_sign-up">Записаться</button>'
    } else {
        button = '<button class="button button_sign-out">Отменить запись</button>'
    }

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
                ${button}
              </div>
            </div>`
        eventsList.append(eventElement)
    })
}

function setCategories(events) {
    document.querySelectorAll('.filters-form__option').forEach(option => option.remove())
    let categories = []

    categories = events.reduce((categories, event) => {
        if (!categories.includes(event.category)) {
            categories.push(event.category)
        }

        return categories
    }, [])

    if (categories.length === 0) {
        return
    }

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
        }
    },

    openModal(event) {
        modal.classList.add('modal_open')
        const cardId = event.target.closest('article').id
        events.forEach(event => {
            if (event.id === cardId) {
                modal.querySelector('.modal__title').textContent = event.title
                data.eventId = cardId
            }
        })
    },
}

const filters = {
    search: '',
    category: '',
}

function filterEvents(event) {
    event.preventDefault()
    const { search, category } = filters
    let filteredEvents = currentEvents.filter(event => {
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

    let isValid = true
    targets.forEach(input => {
        const value = validateInput(input)
        if (value) {
            data[input.name] = value
        } else {
            isValid = false
        }
    })

    if (isValid) {
        postRegistration(data)
    }
}

async function postRegistration(data) {
    const response = await fetch(registrationsPath, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    if (response.ok) {
        closeModal()
        registrations = await getRegistrations()
    }
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
    const parent = input.closest('label')
    const errorMessage = parent.querySelector('.error-message')
    if (errorMessage) {
        errorMessage.remove()
        input.classList.remove('invalid')
    }
}

function closeModal() {
    const inputs = [...modal.querySelectorAll('.modal-form__input')]

    inputs.forEach(input => input.value = '')
    modal.classList.remove('modal_open')
}

function updateHero(event) {
    switch (event.target) {
        case menu.events:
            hero.subtitle.textContent = 'Мероприятия'
            hero.title.textContent = 'Будь в центре событий'
            hero.description.textContent = 'Выбирай интересное мероприятие и записывайся в пару кликов.'
            break;
        case menu.registrations:
            hero.subtitle.textContent = 'Мои записи'
            hero.title.textContent = 'Твои планы на ближайшее время'
            hero.description.textContent = 'Следи за предстоящими событиями и ничего не пропускай.'
            break;
    }
}

function initEventListeners() {
    eventsList.addEventListener('click', handler)
    modal.addEventListener('click', function (event) {
        if (event.target.closest('.modal__dialog') && !event.target.closest('.modal__close')) {
            return
        }
        closeModal()
    })
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

    menu.events.addEventListener('click', function (event) {
        currentEvents = events
        updateHero(event)
        renderEvents(currentEvents)
        setCategories(currentEvents)
    })

    menu.registrations.addEventListener('click', function (event) {
        updateHero(event)
        getRegisteredEvents(events, registrations)
    })
}

async function init() {
    events = await getEvents()
    registrations = await getRegistrations()
    currentEvents = events
    renderEvents(currentEvents)
    setCategories(currentEvents)
    initEventListeners()
}

init()