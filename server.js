const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

const getJson = async (url) => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Weather service returned status ${response.status}`)
    }

    return response.json()
}

app.get('/api/weather', async (req, res) => {
    const searchValue = String(req.query.country || '').trim()

    if (!searchValue) {
        return res.status(400).send({ error: 'Please enter a country name.' })
    }

    try {
        const locationUrl = new URL('https://geocoding-api.open-meteo.com/v1/search')
        locationUrl.searchParams.set('name', searchValue)
        locationUrl.searchParams.set('count', '1')
        locationUrl.searchParams.set('language', 'en')
        locationUrl.searchParams.set('format', 'json')

        const locationData = await getJson(locationUrl)
        const location = locationData.results && locationData.results[0]

        if (!location) {
            return res.status(404).send({ error: 'No matching country or location was found.' })
        }

        const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast')
        weatherUrl.searchParams.set('latitude', location.latitude)
        weatherUrl.searchParams.set('longitude', location.longitude)
        weatherUrl.searchParams.set('current_weather', 'true')

        const weatherData = await getJson(weatherUrl)

        if (!weatherData.current_weather) {
            throw new Error('Current weather data is unavailable')
        }

        res.send({
            location: location.name,
            country: location.country || location.name,
            latitude: location.latitude,
            longitude: location.longitude,
            temperature: weatherData.current_weather.temperature,
            unit: weatherData.current_weather_units?.temperature || '°C'
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send({
            error: 'Unable to get weather data right now. Please try again.'
        })
    }
})

app.listen(port, () => {
    console.log(`Weather dashboard is running at http://localhost:${port}`)
})
