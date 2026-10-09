function getData(state) {
    const savedState = localStorage.getItem('page')

    if (savedState) {
        state = JSON.parse(savedState)
        document.documentElement.dataset.theme = state.theme
    }
}

function loadData(state) {
    localStorage.setItem('page', JSON.stringify(state))
}

export { getData, loadData }