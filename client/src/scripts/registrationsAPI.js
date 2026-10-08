const path = '/registrations'

async function getRegistrations() {
    const response = await fetch(path)

    if (!response.ok) {
        throw new Error('Не удалось загрузить записи')
    }

    return await response.json()
}

async function postRegistration(data) {
    // const eventId = data.eventId
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error('Не удалось записаться')
    }
}

async function deleteRegistrationRequest(id) {
    const response = await fetch(`${path}/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Не удалось отменить запись')
    }
}


export { getRegistrations, postRegistration, deleteRegistrationRequest }