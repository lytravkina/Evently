import { state } from "./state.js"

function getData() {
    const savedState = localStorage.getItem('page')

    if (savedState) {
        state.page = JSON.parse(savedState)
        document.documentElement.dataset.theme = state.page.theme
    }
}

function loadData(state) {
    console.log(state)
    localStorage.setItem('page', JSON.stringify(state))
}

export { getData, loadData }