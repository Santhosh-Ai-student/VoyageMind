import express from 'express';
import { generateItinerary } from '../services/groqService.js';
import { getWeatherForecast } from '../services/weatherService.js';

const router = express.Router();

/**
 * POST /api/generate-itinerary
 * Generate AI-powered itinerary based on user preferences
 * Includes all problem statement parameters
 */
router.post('/generate-itinerary', async (req, res, next) => {
    try {
        const { destination, startDate, endDate, logistics, interests, availability, accommodation } = req.body;

        // Validation
        if (!destination || !startDate || !endDate) {
            return res.status(400).json({
                error: {
                    message: 'Missing required fields: destination, startDate, endDate',
                    status: 400
                }
            });
        }

        let destName = destination;
        if (typeof destination === 'object' && destination.name) {
            destName = destination.name;
        }

        console.log(`Generating itinerary for ${destName}...`);

        // Get weather forecast for the destination
        let weatherData = null;
        try {
            weatherData = await getWeatherForecast(destName, startDate, endDate);
            console.log('Weather data fetched:', weatherData?.summary || 'N/A');
        } catch (weatherError) {
            console.log('Weather API unavailable, using defaults:', weatherError.message);
        }

        // Generate itinerary using Groq AI with all parameters
        const itinerary = await generateItinerary({
            destination: destName,
            startDate,
            endDate,
            logistics,
            interests,
            weather: weatherData,
            availability,
            accommodation
        });

        res.json({
            success: true,
            data: itinerary
        });

    } catch (error) {
        console.error('Error generating itinerary:', error.message);
        next(error);
    }
});

/**
 * GET /api/destinations
 * Get list of available destinations
 */
router.get('/destinations', (req, res) => {
    const destinations = {
        india: [
            { id: 'goa', name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400' },
            { id: 'kerala', name: 'Kerala', country: 'India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400' },
            { id: 'jaipur', name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400' },
            { id: 'manali', name: 'Manali', country: 'India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400' },
            { id: 'chennai', name: 'Chennai', country: 'India', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400' },
            { id: 'udaipur', name: 'Udaipur', country: 'India', image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=400' },
            { id: 'varanasi', name: 'Varanasi', country: 'India', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400' },
            { id: 'agra', name: 'Agra', country: 'India', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400' },
            { id: 'ladakh', name: 'Ladakh', country: 'India', image: 'https://images.unsplash.com/photo-1626015365107-454b5f7e3f95?w=400' },
        ],
        international: [
            { id: 'paris', name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
            { id: 'tokyo', name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
            { id: 'new-york', name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
            { id: 'dubai', name: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
            { id: 'singapore', name: 'Singapore', country: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400' },
            { id: 'bali', name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
        ]
    };

    res.json({ success: true, data: destinations });
});

export default router;
