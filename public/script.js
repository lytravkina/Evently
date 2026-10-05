'use strict';

const eventsPath = '/events'
const registrationsPath = '/registrations'

let events;
let registrations;

let page = {
    state: 'events',
    currentEvents: [],
    theme: 'light',
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

let data = {
    // name: '',
    // email: ''
}

// function sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

async function getEvents() {
    try {
        const response = await fetch(eventsPath)

        if (!response.ok) {
            throw new Error()
        }

        // await sleep(2000)

        return await response.json()

    } catch {
        eventsList.innerHTML = ''
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

        // await sleep(2000)

        return await response.json()

    } catch {
        eventsList.innerHTML = ''
        const string = 'Не удалось загрузить данные'
        eventsList.append(createError(string))
    }
}

function loader() {
    eventsList.innerHTML = ''

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML = '<img class="icon__image" src="./assets/DottedCircle01.svg">'

    if (document.querySelector('.modal_open')) {
        modal.querySelector('.button_submit').textContent = 'Отправка...'
        modal.querySelector('.button_submit').disabled = true
    }

    eventsList.append(spinner)
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

            const createEventElement = document.createElement('button')
            createEventElement.classList.add('events-add')
            createEventElement.innerHTML = `Создать событие<svg class="events-add__icon" xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                                        <path d="M9.83521 16.0078H16.2122" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5578 1.35883V1.35883C11.2138 0.350828 9.30779 0.622828 8.29979 1.96583C8.29979 1.96583 3.28679 8.64383 1.54779 10.9608C-0.191209 13.2788 1.45379 16.1508 1.45379 16.1508C1.45379 16.1508 4.69779 16.8968 6.41179 14.6118C8.12679 12.3278 13.1638 5.61683 13.1638 5.61683C14.1718 4.27383 13.9008 2.36683 12.5578 1.35883Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M7.00415 3.7113L11.8682 7.3623" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>`
            eventsList.append(createEventElement)
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

    filterPastEvents()
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

    switch (event.type) {
        case 'submit':
            for (let element of event.target.elements) {
                switch (element.type) {
                    case 'text':
                        filters.search = element.value
                        break;
                    case 'select-one':
                        filters.category = element.value
                }
            }
            break;
        case 'input':
            filters.search = event.target.value
            break;
        case 'change':
            filters.category = event.target.value
            break;
    }

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
        let cardId;
        switch (true) {
            case event.target.matches('.button_sign-up') || event.target.matches('.events-add'):
                if (event.target.closest('article')) {
                    cardId = event.target.closest('article').id
                }
                this.openModal(cardId)
                break;
            case event.target.matches('.button_sign-out'):
                cardId = event.target.closest('article').id
                this.deleteRegistration(cardId)
                break;
        }
    },

    openModal(cardId) {
        const modalHead = document.querySelector('.modal__top')
        const modalForm = document.querySelector('.modal-form')
        switch (true) {
            case event.target.matches('.events-add'):
                modalForm.innerHTML = `<label class="modal-form__label modal-form__label_title label"
              >Название
              <input
                type="text"
                name="title"
                class="modal-form__input modal-form__input_title input"
              />
            </label>
            <p class="modal-form__error error-message"></p>
            <label class="modal-form__label modal-form__label_description label"
              >Описание
              <input
                type="text"
                name="description"
                class="modal-form__input modal-form__input_description input"
              />
            </label>
            <label class="modal-form__label modal-form__label_category label"
              >Категория
              <select name="category" class="modal-form__select modal-form__select_category select">
                <option class="modal-form__option" value="tech" selected>tech</option>
                <option class="modal-form__option" value="art">art</option>
                <option class="modal-form__option" value="music">music</option>
              </select>
            </label>
            <p class="modal-form__error error-message"></p>
            <label class="modal-form__label modal-form__label_date label"
              >Дата и время
              <input
                type="datetime-local"
                name="date"
                class="modal-form__input modal-form__input_date input"
              />
            </label>
            <label class="modal-form__label modal-form__label_location label"
              >Место
              <input
                type="text"
                name="location"
                class="modal-form__input modal-form__input_location input"
              />
            </label>
            <label class="modal-form__label modal-form__label_capacity label"
              >Количество участников
              <input
                type="number"
                name="capacity"
                class="modal-form__input modal-form__input_capacity input"
              />
            </label>
            <button class="button button_submit" type="submit">
              Отправить
            </button>`
                modalHead.querySelector('.subtitle').textContent = 'Добавление'
                modalHead.querySelector('.title').textContent = 'Расскажите о событии'
                modalHead.querySelector('.description').textContent = 'Заполните данные о мероприятии, чтобы о нем узнало больше людей'
                data = {}
                break;
            case event.target.matches('.button_sign-up'):
                modalForm.innerHTML = `<label class="modal-form__label modal-form__label_name label"
              >Имя
              <input
                type="text"
                name="name"
                class="modal-form__input modal-form__input_name input"
              />
            </label>
            <p class="modal-form__error error-message"></p>
            <label class="modal-form__label modal-form__label_email label"
              >Email
              <input
                type="email"
                name="email"
                class="modal-form__input modal-form__input_email input"
              />
            </label>
            <button class="button button_submit" type="submit">
              Отправить
            </button>`
                modalHead.querySelector('.subtitle').textContent = 'Запись'
                modalHead.querySelector('.description').textContent = 'Оставь контакты, чтобы подтвердить участие'
                data = {}
                page.currentEvents.forEach(event => {
                    if (event.id === cardId) {
                        modalHead.querySelector('.title').textContent = event.title
                        data.eventId = cardId
                    }
                })
                break;
        }

        modal.querySelector('.button_submit').textContent = 'Отправить'
        modal.querySelector('.button_submit').disabled = false
        modal.classList.add('modal_open')
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
                loader()
                registrations = await getRegistrations()
                updatePageState()
                updateCapacity(cardId)
                closeModal()
            }
        }
    }
}

function setFormData(event) {
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

    if (!isValid) {
        return
    }

    if (event.target.querySelector('.select')) {
        data.category = event.target.querySelector('.select').value
        const isExisting = events.some(event => event.title === data.title)
        if (isExisting) {
            alert('Мероприятие с таким именем уже существует')
            return
        }
        data.capacity = Number(data.capacity)
        postEvent(data)
    } else {
        const isRegistered = registrations.some(registration => registration.eventId === data.eventId)
        if (isRegistered) {
            alert('Вы уже записаны на данное мероприятие.')
            return
        }
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
        let string;
        switch (input.name) {
            case 'name':
                string = 'Пожалуйста, введите ваше имя'
                break;
            case 'email':
                string = 'Пожалуйста, введите корректный Email'
                break;
            case 'title':
                string = 'Пожалуйста, введите название'
                break;
            case 'description':
                string = 'Пожалуйста, введите описание'
                break;
            case 'date':
                string = 'Пожалуйста, укажите дату и время'
                break;
            case 'location':
                string = 'Пожалуйста, укажите место проведения'
                break;
            case 'capacity':
                string = 'Пожалуйста, укажите количество участников'
                break;
        }
        errorMessage.textContent = string

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
    const eventId = data.eventId
    const response = await fetch(registrationsPath, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    if (response.ok) {
        loader()
        registrations = await getRegistrations()
        updateCapacity(eventId)
        closeModal()
    }
}

async function postEvent(data) {
    const response = await fetch(eventsPath, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (response.ok) {
        loader()
        events = await getEvents()
        updatePageState()
        closeModal()
    }
}

async function updateCapacity(eventId) {
    console.log(events)
    const eventToUpdate = events.find(event => event.id === eventId)

    let updatedEvent;
    switch (page.state) {
        case 'events':
            updatedEvent = {
                ...eventToUpdate,
                capacity: eventToUpdate.capacity - 1
            }
            break;
        case 'registrations':
            updatedEvent = {
                ...eventToUpdate,
                capacity: eventToUpdate.capacity + 1
            }
            break;
    }

    const response = await fetch(`${eventsPath}/${eventId}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(updatedEvent)
    })

    if (response.ok) {
        loader()
        events = await getEvents()
        updatePageState()
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

function filterPastEvents() {
    const pastEvents = events.filter(event => new Date(event.date).getTime() < Date.now())
    pastEvents.forEach(event => {
        for (let child of eventsList.children) {
            if (child.id === event.id) {
                console.log(child.id)
                child.setAttribute('disabled', true)
                child.querySelector('.button').textContent = 'Мероприятие завершилось'
                child.querySelector('.date').style.color = 'var(--dark-error)'
                child.style.order = '1'
            }
        }
    })
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

    modal.querySelector('.modal-form').addEventListener('submit', setFormData)
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

    document.querySelector('.logo').addEventListener('click', function () {
        page.state = 'events'
        updatePageState()
    })
}

async function init() {
    loader()

    getData()
    updateHero()

    events = await getEvents()
    registrations = await getRegistrations()
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