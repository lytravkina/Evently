export const state = {
    events: [],
    registrations: [],

    page: {
        state: 'events',
        theme: 'light'
    },

    data: {},

    filters: {},

    getRegisteredEvents() {
        const registeredEvents = this.events.filter(event => {
            return this.registrations.some(registration => registration.eventId === event.id)
        })

        return registeredEvents
    },

    getCurrentEvents() {
        return this.page.state === 'events' ? this.events : this.getRegisteredEvents()
    }
}