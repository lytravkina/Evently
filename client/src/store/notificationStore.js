import { create } from "zustand";

export const useNotification = create((set) => {
    let timerId;

    return ({
        text: "",
        type: "",
        active: false,
        animation: true,

        setNotification: (string, type) => {
            set({ text: string, type: type })
        },
        showNotification: () => {
            clearTimeout(timerId)

            set({ active: true, animation: true })

            timerId = setTimeout(() => set({ animation: false }), 3000)
        },
        hideNotification: () => set({ active: false })
    })
})