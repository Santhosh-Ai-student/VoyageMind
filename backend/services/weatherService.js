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
    'ooty': { lat: 11.4102, lon: 76.6950 },
    'coorg': { lat: 12.3375, lon: 75.8069 },
    'munnar': { lat: 10.0889, lon: 77.0595 },
    'kodaikanal': { lat: 10.2381, lon: 77.4892 },
    'shimla': { lat: 31.1048, lon: 77.1734 },
    'darjeeling': { lat: 27.0410, lon: 88.2663 },
    // International
    'greenland': { lat: 64.1814, lon: -51.6941 }, // Nuuk
    'iceland': { lat: 64.9631, lon: -19.0208 },
    'antarctica': { lat: -75.2509, lon: -0.0713 },
    'switzerland': { lat: 46.8182, lon: 8.2275 },
    'new zealand': { lat: -40.9006, lon: 174.8860 },
};

/**
 * Get weather forecast for a destination using OpenMeteo with fallback to wttr.in
 */
export async function getWeatherForecast(location, startDate, endDate) {
    // Try Primary API (OpenMeteo)
    try {
        let coords = cityCoordinates[location.toLowerCase()];

        // 1. Get Coordinates if not cached
        if (!coords) {
            const geoResponse = await axios.get(GEOCODING_URL, {
                params: { name: location, count: 1, limit: 1 },
                timeout: 5000
            });

            if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
                console.warn(`Location not found: ${location}, trying backup API.`);
                throw new Error('Location not found');
            }

            coords = {
                lat: geoResponse.data.results[0].latitude,
                lon: geoResponse.data.results[0].longitude
            };
        }

        // 2. Get Forecast from OpenMeteo
        const forecastResponse = await axios.get(OPEN_METEO_URL, {
            params: {
                latitude: coords.lat,
                longitude: coords.lon,
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,rain_sum',
                timezone: 'auto',
                forecast_days: 14
            },
            timeout: 5000
        });

        const dailyData = forecastResponse.data.daily;

        // 3. Process Data
        const processedForecast = [];
        for (let i = 0; i < dailyData.time.length; i++) {
            processedForecast.push({
                date: dailyData.time[i],
                tempHigh: Math.round(dailyData.temperature_2m_max[i]),
                tempLow: Math.round(dailyData.temperature_2m_min[i]),
                condition: getWeatherCondition(dailyData.weather_code[i]),
                rainMm: dailyData.rain_sum[i]
            });
        }

        const alerts = checkForAlerts(processedForecast);

        return {
            location,
            coordinates: coords,
            forecast: processedForecast.slice(0, 7),
            alerts,
            summary: generateWeatherSummary(processedForecast.slice(0, 7), alerts)
        };

    } catch (primaryError) {
        console.warn('OpenMeteo failed, trying wttr.in backup:', primaryError.message);

        // Try Secondary API (wttr.in)
        try {
            return await getWeatherFromWttrIn(location);
        } catch (secondaryError) {
            console.error('All weather APIs failed. Using mock.', secondaryError.message);
            return getMockWeatherData(location);
        }
    }
}

/**
 * Backup: Get weather from wttr.in (JSON format)
 */
async function getWeatherFromWttrIn(location) {
    const response = await axios.get(`https://wttr.in/${location}?format=j1`, { timeout: 5000 });
    const data = response.data;

    const weather = data.weather.map(day => ({
        date: day.date,
        tempHigh: parseInt(day.maxtempC),
        tempLow: parseInt(day.mintempC),
        condition: day.hourly[4].weatherDesc[0].value, // Midday condition
        rainMm: parseFloat(day.hourly[0].precipMM) // Rough estimate
    }));

    const alerts = checkForAlerts(weather);

    return {
        location,
        coordinates: { lat: 0, lon: 0 }, // Wttr doesn't return easy coords in this view
        forecast: weather.slice(0, 7),
        alerts,
        summary: generateWeatherSummary(weather.slice(0, 7), alerts)
    };
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
    // Safer condition extraction
    const conditions = forecasts.map(d => d.condition || 'Clear');
    let mainCondition = 'Clear';
    if (conditions.length > 0) {
        mainCondition = conditions.sort((a, b) =>
            conditions.filter(v => v === a).length - conditions.filter(v => v === b).length
        ).pop();
    }

    return `Avg ${avgTemp}°C, mostly ${mainCondition.toLowerCase()}`;
}

/**
 * Return mock weather data when API unavailable
 * Now returns cleaner 'Unavailable' state rather than fake hot weather
 */
function getMockWeatherData(location) {
    // Return neutral data instead of misleading 30C
    return {
        location,
        forecast: [],
        alerts: [],
        summary: 'Forecast unavailable (Offline)',
        mock: true
    };
}

export default { getWeatherForecast };
