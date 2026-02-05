import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// In-memory store for shared links (use database in production)
const sharedItineraries = new Map();

/**
 * POST /api/export/pdf
 * Generate PDF export of itinerary
 */
router.post('/export/pdf', async (req, res) => {
    try {
        const { itinerary, destination, dates } = req.body;

        if (!itinerary) {
            return res.status(400).json({
                error: { message: 'Itinerary data required', status: 400 }
            });
        }

        // In production, use puppeteer or jsPDF to generate actual PDF
        // For now, return a success response with download info
        console.log(`PDF export requested for ${destination}`);

        res.json({
            success: true,
            data: {
                message: 'PDF generation initiated',
                filename: `voyagemind-${destination?.toLowerCase() || 'trip'}-itinerary.pdf`,
                downloadUrl: `/api/download/pdf/${Date.now()}`,
                note: 'PDF generation service will be implemented with Puppeteer'
            }
        });

    } catch (error) {
        console.error('PDF export error:', error.message);
        res.status(500).json({
            error: { message: 'Failed to generate PDF', status: 500 }
        });
    }
});

/**
 * POST /api/export/calendar
 * Generate .ics calendar file
 */
router.post('/export/calendar', async (req, res) => {
    try {
        const { itinerary, destination, startDate } = req.body;

        if (!itinerary || !startDate) {
            return res.status(400).json({
                error: { message: 'Itinerary and start date required', status: 400 }
            });
        }

        // Generate ICS content
        let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//VoyageMind//AI Travel Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${destination} Trip
`;

        // Add events for each day's activities
        const baseDate = new Date(startDate);

        itinerary.forEach((day, dayIndex) => {
            const eventDate = new Date(baseDate);
            eventDate.setDate(eventDate.getDate() + dayIndex);
            const dateStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            day.activities?.forEach((activity, actIndex) => {
                icsContent += `
BEGIN:VEVENT
UID:${crypto.randomUUID()}
DTSTAMP:${dateStr}
DTSTART:${dateStr}
SUMMARY:${activity.title}
DESCRIPTION:${activity.description?.replace(/\n/g, '\\n') || ''}
LOCATION:${destination}
CATEGORIES:${activity.category || 'TRAVEL'}
END:VEVENT
`;
            });
        });

        icsContent += 'END:VCALENDAR';

        res.json({
            success: true,
            data: {
                filename: `voyagemind-${destination?.toLowerCase() || 'trip'}.ics`,
                content: icsContent,
                mimeType: 'text/calendar'
            }
        });

    } catch (error) {
        console.error('Calendar export error:', error.message);
        res.status(500).json({
            error: { message: 'Failed to generate calendar', status: 500 }
        });
    }
});

/**
 * POST /api/share/link
 * Generate shareable link for itinerary
 */
router.post('/share/link', (req, res) => {
    try {
        const { itinerary, destination, dates, budget } = req.body;

        if (!itinerary) {
            return res.status(400).json({
                error: { message: 'Itinerary data required', status: 400 }
            });
        }

        // Generate unique share ID
        const shareId = crypto.randomBytes(8).toString('hex');

        // Store itinerary data (use database in production)
        sharedItineraries.set(shareId, {
            itinerary,
            destination,
            dates,
            budget,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

        res.json({
            success: true,
            data: {
                shareId,
                shareUrl: `${req.protocol}://${req.get('host')}/api/shared/${shareId}`,
                expiresIn: '7 days'
            }
        });

    } catch (error) {
        console.error('Share link error:', error.message);
        res.status(500).json({
            error: { message: 'Failed to generate share link', status: 500 }
        });
    }
});

/**
 * GET /api/shared/:id
 * Retrieve shared itinerary
 */
router.get('/shared/:id', (req, res) => {
    const { id } = req.params;
    const shared = sharedItineraries.get(id);

    if (!shared) {
        return res.status(404).json({
            error: { message: 'Shared itinerary not found or expired', status: 404 }
        });
    }

    // Check expiration
    if (new Date(shared.expiresAt) < new Date()) {
        sharedItineraries.delete(id);
        return res.status(410).json({
            error: { message: 'Shared itinerary has expired', status: 410 }
        });
    }

    res.json({
        success: true,
        data: shared
    });
});

export default router;
