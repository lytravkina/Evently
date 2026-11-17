import { create } from "zustand";

export const useNotification = create((set) => {
    let timerId;

    return ({
        text: "",
        type: "",
        active: false,

        setNotification: (string, type) => {
            set({ text: string, type: type })
        },
        showNotification: () => {
            clearTimeout(timerId)

            set({ active: true })

            timerId = setTimeout(() => set({ active: false }), 3000)
        }
    })
})