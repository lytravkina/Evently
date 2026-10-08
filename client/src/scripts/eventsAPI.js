const path = '/events'

async function getEvents() {
    const response = await fetch(path)

    if (!response.ok) {
        throw new Error('Не удалось загрузить данные')
    }

    return await response.json()
}

async function postEvent(data) {
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        throw new Error()
    }

    return await response.json()
}

async function updateEvent(id, state) {
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

    const response = await fetch(`${path}/${id}`, {
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

async function deleteEventRequest(eventId) {
    const response = await fetch(`${path}/${eventId}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error()
    }

    return await response.json()
}


export { getEvents, postEvent, updateEvent, deleteEventRequest }

