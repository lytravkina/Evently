import { useState, useEffect } from "react";
import { getEvents, postEvent, updateEvent, deleteEvent } from "../api/eventsAPI";

export function useEvents() {
    const [events, setEvents] = useState([]);
    const [eventsError, setError] = useState(null);
    const [isEventsLoading, setLoading] = useState(true)

    async function loadEvents() {
        const response = await getEvents()
        setEvents(response)
    }

    async function handlePostEvent(event) {
        setLoading(true)
        try {
            await postEvent(event)
            await loadEvents()
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdateEvent(updatedEvent) {
        setLoading(true)
        try {
            await updateEvent(updatedEvent)
            await loadEvents()
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteEvent(eventId) {
        const confirmed = confirm('Вы действительно хотите удалить мероприятие?')
        if (confirmed) {
            setLoading(true)
            try {
                await deleteEvent(eventId)
                await loadEvents()
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
    }

    async function handleDeleteAllEvents() {
        const confirmed = confirm('Вы действительно хотите очистить список мероприятий?')
        if (confirmed) {
            setLoading(true)
            try {
                await Promise.all(events.map(event => deleteEvent(event.id)))
                await loadEvents()
            } catch (e) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        loadEvents().catch(e => setError(e.message)).finally(() => setLoading(false))
    }, []);

    return { events, eventsError, isEventsLoading, handlePostEvent, handleUpdateEvent, handleDeleteEvent, handleDeleteAllEvents }
}