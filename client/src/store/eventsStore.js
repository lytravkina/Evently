import { create } from "zustand";
import { getEvents } from "../api/eventsAPI";

export const useEvents = create((set) => ({
    events: [],
    loadEvents: async () => {
        const response = await getEvents()
        set({ events: response })
    }
}))