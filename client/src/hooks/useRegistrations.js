import { useState, useEffect, useContext } from "react";
import { getRegistrations, postRegistration, deleteRegistration } from "../api/registrationsAPI";
import { EventsContext } from "../Context/EventsContext";

export function useRegistrations() {
    const [registrations, setRegistrations] = useState([]);
    const [registrationsError, setError] = useState(null);
    const [isRegistrationLoading, setLoading] = useState(true)
    const { events, handleUpdateEvent } = useContext(EventsContext)

    async function loadRegistrations() {
        const response = await getRegistrations()
        setRegistrations(response)
    }

    async function handlePostRegistration(registration) {
        const eventToUpdate = events.find(event => event.id === registration.eventId)
        const updatedEvent = { ...eventToUpdate, capacity: eventToUpdate.capacity - 1 }

        setLoading(true)

        try {
            await postRegistration(registration)
            Promise.all([
                loadRegistrations(),
                handleUpdateEvent(updatedEvent)
            ])
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteRegistration(eventId) {
        const eventToUpdate = events.find(event => event.id === eventId)
        const updatedEvent = { ...eventToUpdate, capacity: eventToUpdate.capacity + 1 }

        const confirmed = confirm('Вы действительно хотите отменить запись на мероприятие?')
        if (confirmed) {
            setLoading(true)
            try {
                await deleteRegistration(getRegistrationId(eventId))
                await Promise.all([
                    loadRegistrations(),
                    handleUpdateEvent(updatedEvent)
                ]);
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
    }

    async function handleDeleteAllRegistrations() {
        const eventsToUpdate = events.filter(event => {
            return registrations.some(registration => registration.eventId === event.id)
        })

        const confirmed = confirm('Вы действительно хотите отменить все записи?')
        if (confirmed) {
            setLoading(true)
            try {
                await Promise.all(registrations.map(registration => deleteRegistration(registration.id)))
                await Promise.all([
                    loadRegistrations(),
                    Promise.all(eventsToUpdate.map(event => handleUpdateEvent({ ...event, capacity: event.capacity + 1 })))
                ])
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
    }

    function getRegistrationId(eventId) {
        return registrations.find(registration => registration.eventId === eventId).id
    }

    useEffect(() => {
        loadRegistrations().catch(e => setError(e.message)).finally(() => setLoading(false))
    }, []);

    return { registrations, registrationsError, isRegistrationLoading, handlePostRegistration, handleDeleteRegistration, handleDeleteAllRegistrations }
}