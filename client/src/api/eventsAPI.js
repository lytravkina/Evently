const path = '/events'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const num = Math.floor(Math.random() * 2)
if (num > 0) {
    throw new Error('Произошла непредвиденная ошибка. Пожалуйста, повторите попытку.')
}

async function getEvents() {
    const response = await fetch(path)

    if (!response.ok) {
        throw new Error('Не удалось загрузить данные')
    }

    return await response.json()
}

async function postEvent(event) {
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(event)
    })

    if (!response.ok) {
        throw new Error('Не удалось создать мероприятие')
    }

    return await response.json()
}

async function updateEvent(updatedEvent) {
    const num = Math.floor(Math.random() * 2)
    if (num > 0) {
        throw new Error('Произошла непредвиденная ошибка. Пожалуйста, повторите попытку.')
    }

    const response = await fetch(`${path}/${updatedEvent.id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(updatedEvent)
    })

    await sleep(5000)

    if (!response.ok) {
        throw new Error('Произошла непредвиденная ошибка')
    }

    return await response.json()
}

async function deleteEvent(eventId) {
    const response = await fetch(`${path}/${eventId}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Не удалось удалить мероприятие')
    }

    return await response.json()
}

async function updateEventCapacity() {

}


export { getEvents, postEvent, updateEvent, deleteEvent }

