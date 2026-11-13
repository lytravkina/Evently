const path = '/events'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getEvents() {
    const response = await fetch(path)

    sleep(5000)

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
    const response = await fetch(`${path}/${updatedEvent.id}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(updatedEvent)
    })

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

