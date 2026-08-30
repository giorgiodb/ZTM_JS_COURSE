const backgroundToggles = document.querySelectorAll('.background-toggles > div')

let prevBackgroundClass = null

function changeBackground(event) {
    const backgroundValue = event.currentTarget.getAttribute('value')
    let backgroundClass = '' // Initialize to something different than null
    switch (backgroundValue) {
        case '1':
            backgroundClass = 'background-1'
            break
        case '2':
            backgroundClass = 'background-2'
            break
        case '3':
            backgroundClass = 'background-3'
            break
        default:
            throw new Error("Invalid background value", backgroundValue)
    }

    if (prevBackgroundClass === backgroundClass) {
        backgroundClass = null // Reset to original background
    }

    document.body.classList.remove('background-1', 'background-2', 'background-3')

    if (backgroundClass) {
        document.body.classList.add(backgroundClass)
    }

    prevBackgroundClass = backgroundClass
}

backgroundToggles.forEach(toggle => {
    toggle.addEventListener('click', changeBackground)
});