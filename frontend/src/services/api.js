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
                destination: tripData.destination.name,
                startDate: tripData.dates.start,
                endDate: tripData.dates.end,
                budget: tripData.budget,
                pace: tripData.pace,
                interests: tripData.interests,
                // NEW FIELDS for problem statement alignment
                availability: tripData.availability,
                accommodation: tripData.accommodation,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate itinerary');
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

export default {
    generateItinerary,
    getWeather,
    checkHealth,
};
