import axios from 'axios';

// OpenMeteo API Base URL (Free, no key required)
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// City coordinates for common destinations (Fallback/Cache)
const cityCoordinates = {
    'goa': { lat: 15.2993, lon: 74.1240 },
    'kerala': { lat: 10.8505, lon: 76.2711 },
    'jaipur': { lat: 26.9124, lon: 75.7873 },
    'manali': { lat: 32.2396, lon: 77.1887 },
    'udaipur': { lat: 24.5854, lon: 73.7125 },
    'varanasi': { lat: 25.3176, lon: 82.9739 },
    'agra': { lat: 27.1767, lon: 78.0081 },
    'ladakh': { lat: 34.1526, lon: 77.5771 },
    'paris': { lat: 48.8566, lon: 2.3522 },
    'tokyo': { lat: 35.6762, lon: 139.6503 },
    'new york': { lat: 40.7128, lon: -74.0060 },
    'dubai': { lat: 25.2048, lon: 55.2708 },
    'singapore': { lat: 1.3521, lon: 103.8198 },
    'bali': { lat: -8.3405, lon: 115.0920 },
    'london': { lat: 51.5074, lon: -0.1278 },
    'maldives': { lat: 3.2028, lon: 73.2207 },
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'hyderabad': { lat: 17.3850, lon: 78.4867 },
};

/**
 * Get weather forecast for a destination using OpenMeteo
 */
export async function getWeatherForecast(location, startDate, endDate) {
    try {
        let coords = cityCoordinates[location.toLowerCase()];

        // 1. Get Coordinates if not cached
        if (!coords) {
            const geoResponse = await axios.get(GEOCODING_URL, {
                params: { name: location, count: 1, limit: 1 }
            });

            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                // Return mock if location not found to prevent breaking flow
                console.warn(`Location not found: ${location}, using mock data.`);
                return getMockWeatherData(location);
            }

            coords = {
                lat: geoResponse.data.results[0].latitude,
                lon: geoResponse.data.results[0].longitude
            };
        }

        // 2. Get Forecast from OpenMeteo
        // Using 'daily' parameters for forecast
        const forecastResponse = await axios.get(OPEN_METEO_URL, {
            params: {
                latitude: coords.lat,
                longitude: coords.lon,
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,rain_sum',
                timezone: 'auto',
                forecast_days: 14 // Get ample data
            }
        });

        const dailyData = forecastResponse.data.daily;

        // 3. Process Data
        const processedForecast = [];
        // OpenMeteo returns arrays for each property (time, temperature_2m_max, etc.)
        for (let i = 0; i < dailyData.time.length; i++) {
            processedForecast.push({
                date: dailyData.time[i],
                tempHigh: Math.round(dailyData.temperature_2m_max[i]),
                tempLow: Math.round(dailyData.temperature_2m_min[i]),
                condition: getWeatherCondition(dailyData.weather_code[i]),
                rainMm: dailyData.rain_sum[i]
            });
        }

        // Filter for trip dates if provided, otherwise return next 5 days
        // Note: OpenMeteo free tier only gives 7-14 days forecast.
        // For far future dates, we might need to rely on the general forecast or mock.

        const alerts = checkForAlerts(processedForecast);

        return {
            location,
            coordinates: coords,
            forecast: processedForecast.slice(0, 7), // Return first 7 days
            alerts,
            summary: generateWeatherSummary(processedForecast.slice(0, 7), alerts)
        };

    } catch (error) {
        console.error('Weather API error:', error.message);
        return getMockWeatherData(location);
    }
}

/**
 * Interpret WMO Weather Codes
 * https://open-meteo.com/en/docs
 */
function getWeatherCondition(code) {
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
}

/**
 * Check for weather alerts
 */
function checkForAlerts(dailyForecasts) {
    const alerts = [];
    dailyForecasts.forEach((day, index) => {
        if (day.rainMm > 10) {
            alerts.push({
                day: index + 1,
                date: day.date,
                type: 'RAIN',
                message: `Heavy rain expected (${day.rainMm}mm) - consider indoor plans`
            });
        }
        if (day.tempHigh > 35) {
            alerts.push({
                day: index + 1,
                date: day.date,
                type: 'HEAT',
                message: `High heat (${day.tempHigh}°C) - stay hydrated`
            });
        }
    });
    return alerts;
}

/**
 * Generate weather summary string
 */
function generateWeatherSummary(forecasts, alerts) {
    if (forecasts.length === 0) return 'Weather data unavailable';

    const avgTemp = Math.round(
        forecasts.reduce((sum, d) => sum + (d.tempHigh + d.tempLow) / 2, 0) / forecasts.length
    );
    const conditions = forecasts.map(d => d.condition);
    const mainCondition = conditions.sort((a, b) =>
        conditions.filter(v => v === a).length - conditions.filter(v => v === b).length
    ).pop();

    return `Avg ${avgTemp}°C, mostly ${mainCondition.toLowerCase()}`;
}

/**
 * Return mock weather data when API unavailable
 */
function getMockWeatherData(location) {
    return {
        location,
        forecast: [
            { date: new Date().toISOString().split('T')[0], tempHigh: 30, tempLow: 22, condition: 'Sunny', rainMm: 0 },
            { date: 'Day 2', tempHigh: 29, tempLow: 21, condition: 'Partly Cloudy', rainMm: 0 },
            { date: 'Day 3', tempHigh: 31, tempLow: 23, condition: 'Sunny', rainMm: 0 },
        ],
        alerts: [],
        summary: 'Warm and sunny (Offline Estimate)',
        mock: true
    };
}

export default { getWeatherForecast };
