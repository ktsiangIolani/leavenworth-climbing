import { WeatherData, WeatherDay } from '../types'

// Leavenworth, WA coordinates
const LAT = 47.5965
const LNG = -120.6610

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LNG}` +
  `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,windspeed_10m_max,weathercode` +
  `&temperature_unit=fahrenheit&windspeed_unit=mph` +
  `&timezone=America%2FLos_Angeles&forecast_days=7`

// WMO weather interpretation
function interpretWeatherCode(code: number): { description: string; icon: string } {
  if (code === 0)             return { description: 'Clear sky',        icon: '☀️' }
  if (code === 1)             return { description: 'Mostly clear',      icon: '🌤️' }
  if (code === 2)             return { description: 'Partly cloudy',     icon: '⛅' }
  if (code === 3)             return { description: 'Overcast',          icon: '☁️' }
  if (code <= 49)             return { description: 'Foggy',             icon: '🌫️' }
  if (code <= 57)             return { description: 'Drizzle',           icon: '🌦️' }
  if (code <= 67)             return { description: 'Rain',              icon: '🌧️' }
  if (code <= 77)             return { description: 'Snow',              icon: '❄️' }
  if (code <= 82)             return { description: 'Rain showers',      icon: '🌦️' }
  if (code <= 86)             return { description: 'Snow showers',      icon: '🌨️' }
  if (code >= 95)             return { description: 'Thunderstorm',      icon: '⛈️' }
  return                             { description: 'Unknown',           icon: '🌡️' }
}

interface OpenMeteoResponse {
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    windspeed_10m_max: number[]
    weathercode: number[]
  }
}

export async function fetchWeather(): Promise<WeatherData> {
  const response = await fetch(WEATHER_URL)
  if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`)

  const data: OpenMeteoResponse = await response.json()
  const { daily } = data

  const days: WeatherDay[] = daily.time.map((dateStr, i) => {
    const code = daily.weathercode[i]
    const { description, icon } = interpretWeatherCode(code)
    return {
      date: new Date(dateStr + 'T12:00:00'),
      maxTemp: Math.round(daily.temperature_2m_max[i]),
      minTemp: Math.round(daily.temperature_2m_min[i]),
      precipProbability: daily.precipitation_probability_max[i],
      windspeed: Math.round(daily.windspeed_10m_max[i]),
      weatherCode: code,
      description,
      icon,
    }
  })

  return { days, fetchedAt: new Date() }
}
