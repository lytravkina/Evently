import { create } from "zustand";

export const usePage = create((set) => ({
    activeTab: 'events',
    setActiveTab: (tab) => set({ activeTab: tab })
}))