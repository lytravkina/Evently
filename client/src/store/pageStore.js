import { create } from "zustand";

export const usePage = create((set) => ({
    activeTab: JSON.parse(localStorage.getItem("TAB_KEY")) ?? "events",
    setActiveTab: (tab) => set({ activeTab: tab })
}))