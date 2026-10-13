function validateInput(input) {
    const value = String(input.value.trim())
    const parent = input.closest('label')

    if (value) {
        return value
    } else {
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

    return null
}

function validateRegistration(data, events, registrations) {
    const isRegistered = registrations.some(registration => registration.eventId === data.eventId)
    const isFull = events.find(event => event.id === data.eventId)?.capacity == 0

    if (isRegistered) {
        return 'Вы уже записаны на данное мероприятие.'
    }

    if (isFull) {
        return 'Лимит участников достигнут. Пожалуйста, выберите другое мероприятие.'
    }

    return null
}

function validateEvent(data, events) {
    const isExisting = events.filter(event => event.id !== data.id).some(event => event.title === data.title)
    const isPast = new Date(data.date).getTime() < Date.now()
    const isNull = Number(data.capacity) <= 0;

    if (isExisting) {
        return 'Мероприятие с таким именем уже существует.'
    }

    if (isPast) {
        return 'Указанная дата уже прошла. Пожалуйста, выберите другую дату.'
    }

    if (isNull) {
        return 'Количество участников должно быть больше 0.'
    }

    return null
}

export { validateInput, validateRegistration, validateEvent }
