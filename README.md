# VoyageMindAI - AI Travel Planner

An AI-powered travel planning application that generates personalized itineraries based on your preferences.

## 📁 Project Structure

```
VoyageMindAI/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/# Reusable components  
│   │   └── context/   # State management
│   └── package.json
│
├── backend/           # Node.js + Express API
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment

Edit `backend/.env` and add your API keys (optional - works with mock data):

```env
GEMINI_API_KEY=your_gemini_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server starts at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/destinations` | List all destinations |
| POST | `/api/generate-itinerary` | Generate AI itinerary |
| GET | `/api/weather` | Get weather forecast |
| POST | `/api/export/pdf` | Export as PDF |
| POST | `/api/export/calendar` | Export as .ics |
| POST | `/api/share/link` | Create share link |

## 💡 Features

- **AI Itinerary Generation** - Powered by Google Gemini
- **Weather-Aware Planning** - OpenWeatherMap integration
- **Indian Destinations** - Goa, Kerala, Jaipur, Manali, etc.
- **Budget in ₹ INR** - Localized for Indian travelers
- **Mobile Responsive** - Works on all devices
- **Export Options** - PDF, Calendar sync, Share links

## 👥 Team

| Name | Role |
|------|------|
| Santhosh | Full Stack Developer (Team Lead) |
| Mughal Rayhan | Web Tester |
| Bharath | UX Designer |

## 📋 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

**Backend:**
- Node.js
- Express
- Google Generative AI SDK
- Axios

## 📄 License

MIT
