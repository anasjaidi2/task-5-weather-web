const weatherForm = document.querySelector('#weatherForm')
const countryInput = document.querySelector('#countryInput')
const searchButton = document.querySelector('#searchButton')
const emptyState = document.querySelector('#emptyState')
const resultSection = document.querySelector('#weatherResult')
const errorMessage = document.querySelector('#errorMessage')

const placeName = document.querySelector('#placeName')
const countryName = document.querySelector('#countryName')
const temperatureValue = document.querySelector('#temperatureValue')
const temperatureUnit = document.querySelector('#temperatureUnit')
const latitudeValue = document.querySelector('#latitudeValue')
const longitudeValue = document.querySelector('#longitudeValue')

const showError = (message) => {
    errorMessage.textContent = message
    errorMessage.hidden = false
    resultSection.hidden = true
    emptyState.hidden = false
}

const showWeather = (weather) => {
    placeName.textContent = weather.location
    countryName.textContent = weather.country
    temperatureValue.textContent = Math.round(weather.temperature)
    temperatureUnit.textContent = weather.unit
    latitudeValue.textContent = Number(weather.latitude).toFixed(4)
    longitudeValue.textContent = Number(weather.longitude).toFixed(4)

    errorMessage.hidden = true
    emptyState.hidden = true
    resultSection.hidden = false
}

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const country = countryInput.value.trim()

    if (!country) {
        showError('Please enter a country or city before searching.')
        countryInput.focus()
        return
    }

    searchButton.disabled = true
    searchButton.textContent = 'Searching...'
    errorMessage.hidden = true

    try {
        const response = await fetch(`/api/weather?country=${encodeURIComponent(country)}`)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Weather data could not be loaded.')
        }

        showWeather(data)
    } catch (error) {
        showError(error.message)
    } finally {
        searchButton.disabled = false
        searchButton.textContent = 'Check weather'
    }
})
