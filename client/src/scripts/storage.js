function getData(state) {
    const savedState = localStorage.getItem('page')

    if (savedState) {
        state.page = JSON.parse(savedState)
        document.documentElement.dataset.theme = state.page.theme
    }
}

function loadData(state) {
    localStorage.setItem('page', JSON.stringify(state.page))
}

export { getData, loadData }