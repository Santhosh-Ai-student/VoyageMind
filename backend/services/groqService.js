import Groq from 'groq-sdk';

// Initialize Groq client
let groqClient = null;

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    const key = process.env.GROQ_API_KEY;
    console.log(`✅ Groq API key loaded: ${key.substring(0, 8)}...${key.substring(key.length - 4)}`);
    groqClient = new Groq({ apiKey: key });
  }
  return groqClient;
}

/**
 * Generate travel itinerary using Groq (Free LLM API)
 * Enhanced to solve ALL problem statement requirements:
 * 1. Time-slot planning with crowd windows
 * 2. Hotel optimization (proximity to attractions)
 * 3. Booking insights (best price recommendations)
 * 4. Weather-adjusted scheduling (rain → indoor activities)
 */
export async function generateItinerary({
  destination,
  startDate,
  endDate,
  budget,
  pace,
  interests,
  weather,
  availability,
  accommodation
}) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const client = getGroqClient();

  if (!client) {
    console.log('No Groq API key found');
    throw new Error('Groq API key not configured.');
  }

  // Build weather context for smart scheduling
  let weatherContext = '';
  if (weather && weather.forecast) {
    const rainyDays = weather.forecast.filter(d => d.rainMm > 2);
    if (rainyDays.length > 0) {
      weatherContext = `
IMPORTANT WEATHER ADJUSTMENT: Rain is forecasted on these days: ${rainyDays.map(d => d.date).join(', ')}.
For rainy days: Schedule INDOOR activities (museums, shopping, cafes, temples with covered areas).
Move outdoor activities (beaches, parks, trekking) to sunny days.`;
    } else {
      weatherContext = 'Weather looks favorable. Mix of outdoor and indoor activities recommended.';
    }
  }

  // Build accommodation context
  const accommodationMap = {
    near_attractions: 'within 1-2km of major tourist attractions to minimize travel time',
    budget_friendly: 'with best value for money, good ratings, and essential amenities',
    luxury: 'premium 4-5 star property with excellent facilities and services',
    central: 'in the heart of the city center with easy access to everything'
  };
  const stayPreference = accommodationMap[accommodation] || accommodationMap.near_attractions;

  // Build availability context
  const availStart = availability?.start || '09:00';
  const availEnd = availability?.end || '18:00';

  const prompt = `You are an advanced AI travel planner. Generate a comprehensive ${duration}-day itinerary for ${destination}.

USER INPUTS:
- Travel Dates: ${startDate} to ${endDate}
- Budget: ₹${budget?.amount || 50000} (${budget?.style || 'Standard'} style)
- Activity Pace: ${pace || 'active'}
- Interests: ${interests?.join(', ') || 'general sightseeing'}
- Daily Availability: ${availStart} to ${availEnd} (plan activities within this window)
- Accommodation Preference: ${stayPreference}

WEATHER DATA:
${weatherContext}

OPTIMIZATION REQUIREMENTS:
1. TIME-SLOT PLANNING: Include crowd level hints like "(low crowd window)" for morning activities at popular spots
2. SMART HOTEL STRATEGY: Cluster activities by area. If Day 1-2 activities are in one area and Day 3-4 in another area, recommend DIFFERENT hotels for each cluster to minimize commute time. Each day/cluster should have a hotel within 1-2km of that day's activities.
3. BOOKING INSIGHTS: For any ticketed attraction, provide booking timing advice
4. WEATHER-ADJUSTED SCHEDULING: If rain expected, assign outdoor activities to clear days

Return ONLY valid JSON (no markdown, no code blocks):
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day theme",
      "date": "Day 1",
      "area": "Area name where most activities are",
      "hotel": {
        "name": "Recommended hotel for this day/area",
        "area": "Locality name",
        "distance": "0.8km to today's activities",
        "priceRange": "₹2000-3500/night",
        "whyHere": "Short reason why stay here for this day"
      },
      "activities": [
        {
          "time": "9:00 AM",
          "endTime": "11:30 AM",
          "category": "CULTURE",
          "title": "Activity name (low crowd window)",
          "description": "Description with tips",
          "location": "Specific area/locality",
          "distanceFromHotel": "0.5km",
          "crowdLevel": "low",
          "isIndoor": false
        }
      ]
    }
  ],
  "stayStrategy": {
    "summary": "Brief explanation of hotel strategy (e.g., 'Stay in Marina for Day 1-2, move to Mylapore for Day 3-4')",
    "totalHotels": 2,
    "clusters": [
      {
        "days": "1-2",
        "hotel": "Hotel Name",
        "area": "Area Name",
        "reason": "Close to beaches and Marina attractions"
      }
    ]
  },
  "bookingInsights": [
    {
      "activity": "Activity name",
      "insight": "Book 24-48 hours in advance for best price"
    }
  ],
  "scheduleAdjustments": [
    {
      "originalDay": 3,
      "adjustment": "Outdoor beach activity moved to Day 2 due to rain forecast on Day 3"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Categories: CULTURE, FOOD, NATURE, SHOPPING, NIGHTLIFE
Generate ${duration} days with 2-4 activities each. Use real place names and real hotel names for ${destination}.
IMPORTANT: Group activities by area each day to minimize travel. Recommend hotels that are in the SAME area as that day's activities.`;

  try {
    console.log(`Calling Groq API for ${destination} with enhanced prompt...`);

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 6000,
    });

    const text = completion.choices[0]?.message?.content || '';
    console.log('Groq response received, parsing...');

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Attach weather data to response
      if (weather) {
        parsed.weather = weather;
      }
      console.log('✅ Successfully generated enhanced itinerary!');
      return addImagesToItinerary(parsed, destination);
    }

    throw new Error('Could not parse AI response');

  } catch (error) {
    console.error('Groq API error:', error.message);
    throw new Error(`AI service error: ${error.message}`);
  }
}

/**
 * Add images and colors to itinerary activities
 */
function addImagesToItinerary(itinerary, destination) {
  const categoryImages = {
    CULTURE: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop',
    FOOD: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop',
    NATURE: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
    SHOPPING: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300&h=200&fit=crop',
    NIGHTLIFE: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=200&fit=crop',
  };

  const categoryColors = {
    CULTURE: 'bg-blue-100 text-blue-700',
    FOOD: 'bg-orange-100 text-orange-700',
    NATURE: 'bg-green-100 text-green-700',
    SHOPPING: 'bg-pink-100 text-pink-700',
    NIGHTLIFE: 'bg-purple-100 text-purple-700',
  };

  if (itinerary?.itinerary) {
    itinerary.itinerary.forEach((day, dayIndex) => {
      day.activities?.forEach((activity, actIndex) => {
        activity.id = dayIndex * 100 + actIndex;
        activity.image = activity.image || categoryImages[activity.category] || categoryImages.CULTURE;
        activity.categoryColor = categoryColors[activity.category] || 'bg-gray-100 text-gray-700';
      });
    });
  }

  return itinerary;
}

export default { generateItinerary };
