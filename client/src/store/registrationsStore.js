import { create } from "zustand";
import { getRegistrations } from "../api/registrationsAPI";

export const useRegistrations = create((set) => ({
    registrations: [],
    loadRegistrations: async () => {
        const response = await getRegistrations()
        set({ registrations: response })
    }
}))