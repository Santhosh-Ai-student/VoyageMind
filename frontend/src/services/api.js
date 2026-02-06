// API configuration for VoyageMind backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generate AI itinerary from backend
 * Enhanced to include availability windows and accommodation preference
 */
export async function generateItinerary(tripData) {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-itinerary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: tripData.destination,
                startDate: tripData.dates.start,
                endDate: tripData.dates.end,
                logistics: tripData.logistics, // Pass the entire logistics object (includes budget, travelers, etc.)
                interests: tripData.interests,
                availability: tripData.availability,
                accommodation: tripData.accommodation,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText;
            throw new Error(`Server Error: ${errorMessage}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Get weather forecast for destination
 */
export async function getWeather(location, dates) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/weather?location=${encodeURIComponent(location)}&dates=${dates}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Weather API Error:', error);
        return null;
    }
}

/**
 * Check API health
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        return data.status === 'ok';
    } catch (error) {
        return false;
    }
}

/**
 * Validate if a city exists in a specific country
 */
export async function validateLocation(city, country) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return false;
        }

        // Fuzzy match the country
        const normalize = (str) => str.toLowerCase().trim();
        const targetCountry = normalize(country);

        return data.results.some(result =>
            normalize(result.country) === targetCountry ||
            (result.country_code && normalize(result.country_code) === targetCountry)
        );
    } catch (error) {
        console.error('Validation Error:', error);
        // If API fails, we shouldn't block the user, so return true (fail open)
        return true;
    }
}

export default {
    generateItinerary,
    getWeather,
    checkHealth,
    validateLocation
};
