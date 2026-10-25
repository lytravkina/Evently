function input(name, label, type = 'text') {
  return `<label class="modal-form__label modal-form__label_${label} label"
              >${name}
              <input
                type=${type}
                name=${label}
                class="modal-form__input modal-form__input_${label} input"
              />
            </label>
            <p class="modal-form__error error-message"></p>`
}

function eventForm() {
  return `${input('Название', 'title')}
            ${input('Описание', 'description')}
            <label class="modal-form__label modal-form__label_category label"
                >Категория
                <select name="category" class="modal-form__select modal-form__select_category select">
                    <option class="modal-form__option" value="tech" selected>tech</option>
                    <option class="modal-form__option" value="art">art</option>
                    <option class="modal-form__option" value="music">music</option>
                </select>
            </label>
            ${input('Дата и время', 'date', 'datetime-local')}
            ${input('Место проведения', 'location')}
            ${input('Количество участников', 'capacity', 'number')}
            <button class="button button_submit" type="submit">
                Отправить
            </button>`
}

function registrationForm() {
  return `${input('Имя', 'name')}
            ${input('Email', 'email', 'email')}
            <button class="button button_submit" type="submit">
                Отправить
            </button>`
}

function eventCard(event, state) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('event-card__content')
  wrapper.innerHTML = `<div class="event-card__top">
                <div class="event-card__subtitle subtitle">${event.category}</div>
                <h2 class="event-card__title title"></h2>
                <p class="event-card__description description"></p>
                ${state === 'events'
      ? '<button class="event-card__edit"><img class="icon__image" src="./assets/icons/edit-button.svg"/></button><button class="event-card__delete"><img class="icon__image" src="./assets/icons/delete-button.svg"/></button>'
      : ''}
              </div>
              <div class="event-card__bottom">
                <div class="event-card__details event-card__date">
                  <div class="icon">
                    <img
                      class="icon__image"
                      src="./assets/icons/icon-date.svg"
                    />
                  </div>
                  <span class="date"></span>
                </div>
                <div class="event-card__details event-card__location">
                  <div class="icon">
                    <img
                      class="icon__image"
                      src="./assets/icons/icon-location.svg"
                    />
                  </div>
                  <span class="location"></span>
                </div>
                <div class="event-card__details event-card__capacity">
                  <span class="capacity"
                    ><span class="capacity__number"></span> мест</span
                  >
                </div>
                <button class="button ${state === 'events' ? 'button_sign-up' : 'button_sign-out'}">
                ${state === 'events'
      ? 'Записаться'
      : 'Отменить запись'}
                </button>
              </div>`

  wrapper.querySelector('.event-card__title').textContent = String(event.title)
  wrapper.querySelector('.event-card__description').textContent = String(event.description)
  wrapper.querySelector('.event-card__title').textContent = String(event.title)
  wrapper.querySelector('.date').textContent = String(formatDate(event.date))
  wrapper.querySelector('.location').textContent = String(event.location)
  wrapper.querySelector('.capacity__number').textContent = String(event.capacity)

  return wrapper
}

function cardInput(name, value, type = 'text') {
  const inputElement = document.createElement('input')
  inputElement.classList.add('event-card__edit_input', 'input')
  inputElement.value = value
  inputElement.type = type
  inputElement.name = name

  return inputElement
}

function eventCardEdit(event) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('event-card__content')
  wrapper.innerHTML = `<form class="event-card__edit_form form">
              <div class="event-card__top">
                <div class="event-card__subtitle subtitle">${event.category}</div>
                <button class="event-card__close" type="button"><img class="icon__image" src="./assets/icons/quit-button.svg"/></button>
                <button class="event-card__delete" type="button" style="pointer-events: none"><img class="icon__image" src="./assets/icons/delete-button.svg"/></button>
              </div>
              <div class="event-card__bottom">
                <div class="event-card__details event-card__date">
                  <div class="icon">
                    <img
                      class="icon__image"
                      src="./assets/icons/icon-date.svg"
                      alt="Clock emoji"
                    />
                  </div>
                </div>
                <div class="event-card__details event-card__location">
                  <div class="icon">
                    <img
                      class="icon__image"
                      src="./assets/icons/icon-location.svg"
                      alt="Location pin emoji"
                    />
                  </div>
                </div>
                <div class="event-card__details event-card__capacity"></div>
                <button class="event-card__edit_button button" type="submit">Завершить редактирование</button>
              </div>
            </form>`

  wrapper.querySelector('.event-card__top').append(cardInput('title', event.title))
  wrapper.querySelector('.event-card__top').append(cardInput('description', event.description))

  wrapper.querySelector('.event-card__date').append(cardInput('date', event.date, 'datetime-local'))
  wrapper.querySelector('.event-card__location').append(cardInput('location', event.location))
  wrapper.querySelector('.event-card__capacity').append(cardInput('capacity', event.capacity, 'number'))

  return wrapper
}

function formatDate(string) {
  let [date, time] = string.split('T')

  const [year, month, day] = date.split('-')

  const [hour, minute] = time.split(':')

  const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`
  return formattedDate
}

function createEventButton() {
  return `<button class="events-add">Создать событие
            <svg class="events-add__icon" xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
              <path d="M9.83521 16.0078H16.2122" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5578 1.35883V1.35883C11.2138 0.350828 9.30779 0.622828 8.29979 1.96583C8.29979 1.96583 3.28679 8.64383 1.54779 10.9608C-0.191209 13.2788 1.45379 16.1508 1.45379 16.1508C1.45379 16.1508 4.69779 16.8968 6.41179 14.6118C8.12679 12.3278 13.1638 5.61683 13.1638 5.61683C14.1718 4.27383 13.9008 2.36683 12.5578 1.35883Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.00415 3.7113L11.8682 7.3623" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>`
}

function errorMessage(string) {
  const error = document.createElement('p')
  error.classList.add('events__error', 'error-message', 'error-message_active')
  error.textContent = string
  return error
}

function deleteAllButton() {
  const deleteAll = document.createElement('div')
  deleteAll.classList.add('events-delete-all')
  const deleteAllButton = document.createElement('button')
  deleteAllButton.classList.add('events-delete-all__button', 'button')
  deleteAllButton.innerHTML = `Очистить все
                              <svg class="icon__image" xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                <path d="M15.4245 7.59003C15.4245 15.6091 16.5788 19.2338 8.81495 19.2338C1.05018 19.2338 2.22828 15.6091 2.22828 7.59003" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16.9005 4.51574H0.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12.2502 4.51571C12.2502 4.51571 12.7788 0.75 8.82451 0.75C4.87118 0.75 5.39975 4.51571 5.39975 4.51571" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>`
  deleteAll.append(deleteAllButton)

  return deleteAll
}

export { eventForm, registrationForm, eventCard, createEventButton, errorMessage, eventCardEdit, deleteAllButton }