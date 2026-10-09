import { eventCard, eventForm, registrationForm, createEventButton, errorMessage, eventCardEdit } from "./components.js"

const eventsList = document.querySelector('.events__cards')
const modal = document.querySelector('.modal')

function loader() {
    eventsList.innerHTML = ''

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML = '<img class="icon__image" src="./assets/icons/icon-spinner.svg">'

    if (document.querySelector('.modal_open')) {
        modal.querySelector('.button_submit').textContent = 'Отправка...'
        modal.querySelector('.button_submit').disabled = true
    }

    eventsList.append(spinner)
}

function renderEvents(events, state) {
    eventsList.innerHTML = ''

    if (events.length === 0) {
        const string = 'Нет доступных мероприятий'
        eventsList.append(errorMessage(string))
        return
    }

    if (state === 'events') {
        eventsList.innerHTML = createEventButton()
    }

    events.forEach(event => {
        const eventElement = document.createElement('article')
        eventElement.classList.add('event-card')
        eventElement.id = event.id
        eventElement.innerHTML = eventCard(event, state)
        eventsList.append(eventElement)
    })

    filterPastEvents(events)
}

function filterPastEvents(events) {
    const pastEvents = events.filter(event => new Date(event.date).getTime() < Date.now())
    pastEvents.forEach(event => {
        for (let child of eventsList.children) {
            if (child.id === event.id) {
                child.setAttribute('disabled', true)
                child.querySelector('.button').textContent = 'Мероприятие завершилось'
                child.querySelector('.button').style.pointerEvents = 'none'
                child.querySelector('.date').style.color = 'var(--dark-error)'
                child.style.order = '1'
            }
        }
    })
}

function renderEventModal() {
    const modalForm = document.querySelector('.modal-form')
    const modalHeader = document.querySelector('.modal__top')

    modalForm.innerHTML = eventForm()

    modalHeader.querySelector('.subtitle').textContent = 'Добавление'
    modalHeader.querySelector('.title').textContent = 'Расскажите о событии'
    modalHeader.querySelector('.description').textContent = 'Заполните данные о мероприятии, чтобы о нем узнало больше людей'
}

function renderRegistrationModal(event) {
    const modalForm = document.querySelector('.modal-form')
    const modalHeader = document.querySelector('.modal__top')

    modalForm.innerHTML = registrationForm()

    modalHeader.querySelector('.subtitle').textContent = 'Запись'
    modalHeader.querySelector('.title').textContent = event.title
    modalHeader.querySelector('.description').textContent = 'Оставь контакты, чтобы подтвердить участие'
}

function renderHero(state) {
    const hero = {
        subtitle: document.querySelector('.hero__subtitle'),
        title: document.querySelector('.hero__title'),
        description: document.querySelector('.hero__description')
    }

    switch (state) {
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

function renderEditPage(event) {
    for (let card of eventsList.querySelectorAll('article')) {
        if (card.id === event.id) {
            card.innerHTML = eventCardEdit(event)
        } else {
            card.setAttribute('disabled', true)
            card.style.pointerEvents = 'none'
        }
    }
}

export { loader, renderEvents, renderEventModal, renderRegistrationModal, renderHero, renderEditPage }