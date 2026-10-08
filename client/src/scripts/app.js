'use strict';

import { eventForm, registrationForm, eventCard, createEventButton, errorMessage } from "./components.js";
import { validateInput, validateRegistration, validateEvent } from "./validation.js";
import { state } from "./state.js";
import { getData, loadData } from "./storage.js";
import { getEvents, postEvent, updateEvent, deleteEventRequest } from "./eventsAPI.js";
import { getRegistrations, postRegistration, deleteRegistrationRequest } from "./registrationsAPI.js";

const eventsList = document.querySelector('.events__cards')
const modal = document.querySelector('.modal')

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

function renderEvents(events) {
    eventsList.innerHTML = ''

    if (events.length === 0) {
        const string = 'Нет доступных мероприятий'
        eventsList.append(errorMessage(string))
        return
    }

    if (state.page.state === 'events') {
        eventsList.innerHTML = createEventButton()
    }

    events.forEach(event => {
        const eventElement = document.createElement('article')
        eventElement.classList.add('event-card')
        eventElement.id = event.id
        eventElement.innerHTML = eventCard(event, state.page.state, formatDate)
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

function filterEvents(event) {
    event.preventDefault()

    let input;
    let select;
    for (let element of event.currentTarget.elements) {
        switch (element.type) {
            case 'text':
                input = element
                break
            case 'select-one':
                select = element
                break
        }
    }

    state.filters.search = input.value
    state.filters.category = select.value

    const { search, category } = state.filters

    let filteredEvents = state.getCurrentEvents().filter(event => {
        let filteredBySearch =
            !search || event.title.toLowerCase().includes(search) || event.description.toLowerCase().includes(search)

        let filteredByCategory =
            !category || event.category === category

        return filteredBySearch && filteredByCategory
    })

    renderEvents(filteredEvents)
}

const handler = {
    handleEvent(event) {
        let cardId;
        if (event.target.closest('article')) {
            cardId = event.target.closest('article').id
        }
        switch (true) {
            case event.target.matches('.button_sign-up') || event.target.matches('.events-add'):
                this.openModal(cardId)
                break;
            case event.target.matches('.button_sign-out'):
                this.deleteRegistration(cardId)
                break;
            case !!event.target.closest('.event-card__delete'):
                this.deleteEvent(cardId)
                break;
        }
    },

    openModal(cardId) {
        const modalForm = document.querySelector('.modal-form')
        const modalHeader = document.querySelector('.modal__top')
        switch (true) {
            case event.target.matches('.events-add'):
                modalForm.innerHTML = eventForm()

                modalHeader.querySelector('.subtitle').textContent = 'Добавление'
                modalHeader.querySelector('.title').textContent = 'Расскажите о событии'
                modalHeader.querySelector('.description').textContent = 'Заполните данные о мероприятии, чтобы о нем узнало больше людей'
                break;
            case event.target.matches('.button_sign-up'):
                modalForm.innerHTML = registrationForm()

                state.getCurrentEvents().forEach(event => {
                    if (event.id === cardId) {
                        modalHeader.querySelector('.subtitle').textContent = 'Запись'
                        modalHeader.querySelector('.title').textContent = event.title
                        modalHeader.querySelector('.description').textContent = 'Оставь контакты, чтобы подтвердить участие'

                        state.data.eventId = cardId
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
            let registrationId;
            state.registrations.forEach(registration => {
                if (registration.eventId === cardId) {
                    registrationId = registration.id
                }
            })

            try {
                await deleteRegistrationRequest(registrationId)
                await updateEvent(cardId, state)
                await updatePage()
            } catch (error) {
                alert(error.message)
            }
        }
    },

    async deleteEvent(cardId) {
        const isConfirmed = confirm('Вы действительно хотите удалить мероприятие?')
        if (isConfirmed) {
            try {
                await deleteEventRequest(cardId)
                await updatePage()
            } catch (error) {
                alert(error.message)
            }
        }
    }
}

function resetFormData() {
    state.data = {}
}

async function setFormData(event) {
    event.preventDefault()

    if (event.type === 'input') {
        clearError(event.target)
        return
    }

    const targets = [...event.target.querySelectorAll('.modal-form__input')]

    let isValid = true
    for (let input of targets) {
        clearError(input)
        const value = validateInput(input)
        if (!value) {
            isValid = false
        } else {
            state.data[input.name] = value
        }
    }


    if (!isValid) {
        return
    }

    if (event.target.querySelector('.select')) {
        state.data.category = event.target.querySelector('.select')?.value

        const error = validateEvent(state.data, state.events)

        if (error) {
            alert(error)
            return
        }

        try {
            await postEvent(state.data)
            await updatePage()
            closeModal()
        } catch (error) {
            alert(error.message)
            return
        }

    } else {
        const error = validateRegistration(state.data, state.events, state.registrations)

        if (error) {
            alert(error)
            return
        }

        try {
            await postRegistration(state.data)
            await updateEvent(state.data.eventId, state)
            await updatePage()
            closeModal()
        } catch (error) {
            alert(error.message)
            return
        }
    }
}

function clearError(input) {
    const parent = input.closest('label')
    const errorMessage = parent.querySelector('.error-message')
    if (errorMessage) {
        errorMessage.remove()
        input.classList.remove('invalid')
    }
}

function closeModal(event) {
    const inputs = [...modal.querySelectorAll('.modal-form__input')]

    inputs.forEach(input => input.value = '')
    modal.classList.remove('modal_open')
    resetFormData()
}

function renderHero() {
    const hero = {
        subtitle: document.querySelector('.hero__subtitle'),
        title: document.querySelector('.hero__title'),
        description: document.querySelector('.hero__description')
    }

    switch (state.page.state) {
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
    switch (state.page.theme) {
        case 'light':
            state.page.theme = 'dark'
            break
        case 'dark':
            state.page.theme = 'light'
            break;
    }

    document.documentElement.dataset.theme = state.page.theme
    loadData(state)
}

function filterPastEvents() {
    const pastEvents = state.events.filter(event => new Date(event.date).getTime() < Date.now())
    pastEvents.forEach(event => {
        for (let child of eventsList.children) {
            if (child.id === event.id) {
                child.setAttribute('disabled', true)
                child.querySelector('.button').textContent = 'Мероприятие завершилось'
                child.querySelector('.date').style.color = 'var(--dark-error)'
                child.style.order = '1'
            }
        }
    })
}

function setPageState(event) {
    switch (true) {
        case event.target.matches('.menu__item_events') || event.target.matches('.logo'):
            state.page.state = 'events'
            break;
        case event.target.matches('.menu__item_registrations'):
            state.page.state = 'registrations'
            break;
        case !!event.target.closest('.menu__item_theme'):
            toggleTheme()
            break;
    }

    loadData(state)
    renderHero()
    renderEvents(state.getCurrentEvents())
    setCategories(state.getCurrentEvents())
}

async function updatePage() {
    renderHero()
    loader()
    try {
        state.events = await getEvents()
        state.registrations = await getRegistrations()

        renderEvents(state.getCurrentEvents())
        setCategories(state.getCurrentEvents())

    } catch (error) {
        eventsList.innerHTML = ''
        eventsList.append(errorMessage(error.message))
    }
}

function initEventListeners() {
    eventsList.addEventListener('click', handler)

    modal.addEventListener('click', function () {
        if (event.target.closest('.modal__dialog') && !event.target.closest('.modal__close')) {
            return
        }
        closeModal()
    });

    ['submit', 'change', 'input'].forEach(eventType => document.querySelector('.filters-form').addEventListener(eventType, filterEvents));

    ['submit', 'input'].forEach(eventType => modal.querySelector('.modal-form').addEventListener(eventType, setFormData))

    document.querySelector('.header').addEventListener('click', setPageState)
}

async function init() {
    getData(state)
    await updatePage()
    initEventListeners()
}

init()