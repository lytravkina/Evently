import { create } from "zustand";
import { getEvents } from "../api/eventsAPI";
import { postEvent as postEventRequest } from "../api/eventsAPI";
import { updateEvent as updatedEventRequest } from "../api/eventsAPI";
import { deleteEvent as deleteEventRequest } from "../api/eventsAPI";

export const useEvents = create((set) => ({
    events: [],
    loadEvents: async () => {
        const response = await getEvents()
        set({ events: response })
    }
}))