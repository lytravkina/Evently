const path = '/registrations'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRegistrations() {
    const response = await fetch(path)

    sleep(5000)

    if (!response.ok) {
        throw new Error('Не удалось загрузить записи')
    }

    return await response.json()
}

async function postRegistration(registration) {
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(registration)
    })
    if (!response.ok) {
        throw new Error('Не удалось записаться на мероприятие')
    }
}

async function deleteRegistration(id) {
    const response = await fetch(`${path}/${id}`, {
        method: 'DELETE'
    })

    if (!response.ok) {
        throw new Error('Не удалось отменить запись')
    }
}


export { getRegistrations, postRegistration, deleteRegistration }