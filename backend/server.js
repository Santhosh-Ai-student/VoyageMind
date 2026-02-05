import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import itineraryRoutes from './routes/itinerary.js';
import weatherRoutes from './routes/weather.js';
import exportRoutes from './routes/export.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all origins by default for public API
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'VoyageMind API is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api', itineraryRoutes);
app.use('/api', weatherRoutes);
app.use('/api', exportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Endpoint not found',
            status: 404
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🌍 VoyageMind Backend Server                    ║
  ║                                                   ║
  ║   Server running on: http://localhost:${PORT}       ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}                     ║
  ║                                                   ║
  ║   API Endpoints:                                  ║
  ║   - POST /api/generate-itinerary                  ║
  ║   - GET  /api/weather                             ║
  ║   - POST /api/export/pdf                          ║
  ║   - POST /api/export/calendar                     ║
  ║   - POST /api/share/link                          ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);
});

export default app;
