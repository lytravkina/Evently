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

function eventCard(event, state, fn) {
  return `<div class="event-card__content">
              <div class="event-card__top">
                <div class="event-card__subtitle subtitle">${event.category}</div>
                <h2 class="event-card__title title">${event.title}</h2>
                <p class="event-card__description description">
                  ${event.description}
                </p>
                ${state === 'events' ? '<button class="event-card__delete"><img class="icon__image" src = "./assets/Delete.svg"/></button>' : ''}
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
                  <span class="date">${fn(event.date)}</span>
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
                <button class="button ${state === 'events' ? 'button_sign-up' : 'button_sign-out'}">
                ${state === 'events'
      ? 'Записаться'
      : 'Отменить запись'}
                </button>
              </div>
            </div>`
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

export { eventForm, registrationForm, eventCard, createEventButton, errorMessage }