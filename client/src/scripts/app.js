'use strict';

import { validateInput, validateRegistration, validateEvent } from "./validation.js";
import { state } from "./state.js";
import { getData, loadData } from "./storage.js";
import { getEvents, postEvent, updateEvent, deleteEventRequest } from "./eventsAPI.js";
import { getRegistrations, postRegistration, deleteRegistrationRequest } from "./registrationsAPI.js";
import { loader, renderEvents, renderEventModal, renderRegistrationModal, renderHero, renderEditPage, removeSingleEvent, renderSingleEvent } from "./render.js";
import { errorMessage } from "./components.js";

const eventsList = document.querySelector('.events__cards')
const modal = document.querySelector('.modal')

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
            !search || event.title.toLowerCase().includes(search.toLowerCase()) || event.description.toLowerCase().includes(search.toLowerCase())

        let filteredByCategory =
            !category || event.category === category

        return filteredBySearch && filteredByCategory
    })

    renderEvents(filteredEvents, state.page.state)
}

const handler = {
    handleEvent(event) {
        let cardId;
        if (event.target.closest('article')) {
            cardId = event.target.closest('article').id
        }
        switch (true) {
            case event.target.matches('.button_sign-up') || !!event.target.closest('.events-add'):
                this.openModal(cardId)
                break;
            case event.target.matches('.button_sign-out'):
                this.deleteRegistration(cardId)
                break;
            case !!event.target.closest('.event-card__delete'):
                this.deleteEvent(cardId)
                break;
            case !!event.target.closest('.event-card__edit'):
                this.editEvent(cardId)
                break;
            case !!event.target.closest('.event-card__close'):
                renderSingleEvent(state.events.find(event => event.id === cardId), state.page.state)
                break;
            case !!event.target.closest('.events-delete-all__button'):
                this.deleteAllEvents()
                break;
        }
    },

    openModal(cardId) {
        switch (true) {
            case !!event.target.closest('.events-add'):
                renderEventModal()
                break;
            case event.target.matches('.button_sign-up'):
                state.getCurrentEvents().forEach(event => {
                    if (event.id === cardId) {
                        renderRegistrationModal(event)
                    }
                })
                state.data.eventId = cardId
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
                await updateCapacity(cardId)
                state.registrations = await getRegistrations()
                removeSingleEvent(cardId)
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
                state.events = await getEvents(cardId)
                removeSingleEvent(cardId)
            } catch (error) {
                alert(error.message)
            }
        }
    },

    async deleteAllEvents() {
        const isConfirmed = confirm('Вы действительно хотите удалить все мероприятия?')
        if (isConfirmed) {
            try {
                if (state.page.state === 'events') {
                    state.events.forEach(async (event) => await deleteEventRequest(event.id))
                } else {
                    state.registrations.forEach(async (registration) => await deleteRegistrationRequest(registration.id))
                }
            } catch (error) {
                alert(error.message)
            }

            await updatePage()
        }
    },

    editEvent(id) {
        const eventToUpdate = state.events.find(event => event.id === id)
        renderEditPage(eventToUpdate)
        document.querySelector('.event-card__edit_form').addEventListener('submit', (event) => setUpdatedEvent(event, eventToUpdate))
    }
}

async function setUpdatedEvent(event, eventToUpdate) {
    event.preventDefault()

    let inputs = [...document.querySelectorAll('.event-card__edit_input')]

    let updatedEvent = { ...eventToUpdate }
    inputs.forEach(input => {
        const value = String(input.value.trim())
        if (value) {
            isFinite(value) ? updatedEvent[input.name] = Number(value) : updatedEvent[input.name] = value
        }
    })

    const error = validateEvent(updatedEvent, state.events)
    if (error) {
        alert(error)
        return
    }

    try {
        await updateEvent(updatedEvent)
        state.events = await getEvents()
        renderSingleEvent(updatedEvent, state.page.state)
    } catch (error) {
        alert(error.message)
    }
}

async function updateCapacity(id) {
    const eventToUpdate = state.events.find(event => event.id === id)

    let updatedEvent;
    switch (state.page.state) {
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

    try {
        await updateEvent(updatedEvent)
    } catch (error) {
        alert(error.message)
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
            isFinite(value) ? state.data[input.name] = Number(value) : state.data[input.name] = value
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
            state.events = await getEvents()
            renderSingleEvent(state.events.find(event => event.title === state.data.title), state.page.state)
            closeModal()
        } catch (error) {
            alert(error.message)
        }

    } else {
        const error = validateRegistration(state.data, state.events, state.registrations)

        if (error) {
            alert(error)
            return
        }

        try {
            await postRegistration(state.data)
            await updateCapacity(state.data.eventId)
            state.registrations = await getRegistrations()
            state.events = await getEvents()
            renderSingleEvent(state.events.find(event => event.id === state.data.eventId), state.page.state)
            closeModal()
        } catch (error) {
            alert(error.message)
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

function closeModal() {
    const inputs = [...modal.querySelectorAll('.modal-form__input')]

    inputs.forEach(input => input.value = '')
    modal.classList.remove('modal_open')
    modal.querySelector('.modal-form').innerHTML = ''
    resetFormData()
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
    loadData(state.page)
}

async function setPageState(event) {
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

    loadData(state.page)
    await updatePage()
}

async function updatePage() {
    renderHero(state.page.state)
    loader()
    try {
        state.events = await getEvents()
        state.registrations = await getRegistrations()

        renderEvents(state.getCurrentEvents(), state.page.state)
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
    getData(state.page)
    await updatePage()
    initEventListeners()
}

init()