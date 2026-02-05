import express from 'express';
import { getWeatherForecast } from '../services/weatherService.js';

const router = express.Router();

/**
 * GET /api/weather
 * Get weather forecast for a destination and date range
 */
router.get('/weather', async (req, res, next) => {
    try {
        const { location, dates } = req.query;

        if (!location) {
            return res.status(400).json({
                error: {
                    message: 'Missing required parameter: location',
                    status: 400
                }
            });
        }

        // Parse dates if provided
        let startDate, endDate;
        if (dates) {
            const [start, end] = dates.split(',');
            startDate = start;
            endDate = end || start;
        }

        const weather = await getWeatherForecast(location, startDate, endDate);

        res.json({
            success: true,
            data: weather
        });

    } catch (error) {
        console.error('Weather API error:', error.message);

        // Return mock data if API fails
        res.json({
            success: true,
            data: {
                location: req.query.location,
                forecast: 'Weather data temporarily unavailable',
                alerts: [],
                mock: true
            }
        });
    }
});

export default router;
