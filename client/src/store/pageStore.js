import { create } from "zustand";

export const useTab = create((set) => ({
    activeTab: JSON.parse(localStorage.getItem("TAB_KEY")) ?? "events",

    setActiveTab: (tab) => set({ activeTab: tab }),
}));

export const useModal = create((set) => ({
    modalOpen: false,
    cardId: null,

    openRegistrationModal: (id) => set({ modalOpen: true, cardId: id }),
    openEventModal: () => set({ modalOpen: true, cardId: null }),
    closeModal: () => set({ modalOpen: false, cardId: null })
}))