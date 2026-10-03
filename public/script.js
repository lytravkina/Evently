'use strict';

const eventsPath = '/events'
const registrationsPath = '/registrations'

let events;
let registrations;

let page = {
    state: 'events',
    currentEvents: [],
    theme: 'light'
}

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
    registrations: document.querySelector('.menu__item_registrations'),
    theme: document.querySelector('.menu__item_theme')
}

const data = {
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
        const string = 'Не удалось загрузить данные'
        eventsList.append(createError(string))
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
        const string = 'Не удалось загрузить данные'
        eventsList.append(createError(string))
    }
}

function getRegisteredEvents() {
    const registeredEvents = events.filter(event => {
        return registrations.some(registration => registration.eventId === event.id)
    })

    return registeredEvents
}

function updatePageState() {
    switch (page.state) {
        case 'events':
            page.currentEvents = events
            break;
        case 'registrations':
            page.currentEvents = getRegisteredEvents()
            break;
    }

    loadData()
    updateHero()
    renderEvents(page.currentEvents)
    setCategories(page.currentEvents)
}

function renderEvents(events) {
    eventsList.innerHTML = ''

    if (events.length === 0) {
        const string = 'Нет доступных мероприятий'
        eventsList.append(createError(string))
        return
    }

    let button;
    switch (page.state) {
        case 'events':
            button = '<button class="button button_sign-up">Записаться</button>'
            break;
        case 'registrations':
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

function formatDate(string) {
    let [date, time] = string.split('T')

    const [year, month, day] = date.split('-')

    const [hour, minute] = time.split(':')

    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`
    return formattedDate
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

const filters = {
    search: '',
    category: '',
}

function filterEvents(event) {
    event.preventDefault()

    filters.search = event.target.value

    const { search, category } = filters
    let filteredEvents = page.currentEvents.filter(event => {
        let filteredBySearch =
            !search || event.title.toLowerCase().includes(search) || event.description.toLowerCase().includes(search)

        let filteredByCategory =
            !category || event.category === category

        return filteredBySearch && filteredByCategory
    })

    renderEvents(filteredEvents)
}

function createError(string) {
    const errorMessage = document.createElement('p')
    errorMessage.classList.add('events__error', 'error-message', 'error-message_active')
    errorMessage.textContent = string
    return errorMessage
}

const handler = {
    handleEvent(event) {
        let cardId = event.target.closest('article').id
        switch (true) {
            case event.target.matches('.button_sign-up'):
                this.openModal(cardId)
                break;
            case event.target.matches('.button_sign-out'):
                this.deleteRegistration(cardId)
                break;
        }
    },

    openModal(cardId) {
        modal.classList.add('modal_open')
        page.currentEvents.forEach(event => {
            if (event.id === cardId) {
                modal.querySelector('.modal__title').textContent = event.title
                data.eventId = cardId
            }
        })
    },

    async deleteRegistration(cardId) {
        const isConfirmed = confirm('Вы действительно хотите отменить запись?')

        if (isConfirmed) {
            let id;
            registrations.forEach(registration => {
                if (registration.eventId === cardId) {
                    id = registration.id
                }
            })
            const response = await fetch(`${registrationsPath}/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                registrations = await getRegistrations()
                updatePageState()
                closeModal()
            }
        }
    }
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

async function postRegistration(data) {
    const response = await fetch(registrationsPath, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    if (response.ok) {
        registrations = await getRegistrations()
        closeModal()
    }
}

function closeModal() {
    const inputs = [...modal.querySelectorAll('.modal-form__input')]

    inputs.forEach(input => input.value = '')
    modal.classList.remove('modal_open')
}

function updateHero() {
    switch (page.state) {
        case 'events':
            hero.subtitle.textContent = 'Мероприятия'
            hero.title.textContent = 'Будь в центре событий'
            hero.description.textContent = 'Выбирай интересное мероприятие и записывайся в пару кликов.'
            break;
        case 'registrations':
            hero.subtitle.textContent = 'Мои записи'
            hero.title.textContent = 'Твои планы на ближайшее время'
            hero.description.textContent = 'Следи за предстоящими событиями и ничего не пропускай.'
            break;
    }
}

function toggleTheme() {
    switch (page.theme) {
        case 'light':
            page.theme = 'dark'
            break
        case 'dark':
            page.theme = 'light'
            break;
    }

    document.documentElement.dataset.theme = page.theme
    loadData()
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
    document.querySelector('.filters-form__select').addEventListener('change', filterEvents)
    document.querySelector('.filters-form__input').addEventListener('input', filterEvents)

    modal.querySelector('.modal-form').addEventListener('submit', setRegistration)
    modal.querySelector('.modal-form').addEventListener('input', event => clearError(event.target))

    menu.events.addEventListener('click', function () {
        page.state = 'events'
        updatePageState()
    })

    menu.registrations.addEventListener('click', function () {
        page.state = 'registrations'
        updatePageState()
    })

    menu.theme.addEventListener('click', toggleTheme)
}

async function init() {
    events = await getEvents()
    registrations = await getRegistrations()
    getData()
    updatePageState()
    initEventListeners()
}

function getData() {
    const data = localStorage.getItem('page')

    if (data) {
        page = JSON.parse(data)
        document.documentElement.dataset.theme = page.theme
    }
}

function loadData() {
    localStorage.setItem('page', JSON.stringify(page))
}
init()