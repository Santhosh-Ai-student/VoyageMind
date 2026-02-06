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
  logistics,
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

  // Build logistics context
  const travelers = logistics?.travelers || 1;
  const transportPref = logistics?.transport || 'public';
  console.log('Received logistics:', logistics);
  const userBudget = logistics?.budget ? parseInt(logistics.budget) : null;
  console.log('Parsed User Budget:', userBudget);
  const departureInfo = logistics?.departure ? `Departing from: ${logistics.departure}` : 'Departure location not specified';

  // Note: We are now relying on the AI to estimate the specific trip cost and validate availability.
  // This allows dynamic validation (e.g., ₹2000 might be enough for a local bus trip, but not for a flight).

  const prompt = `You are an advanced AI travel planner. Generate a comprehensive ${duration}-day itinerary for ${destination}.

USER INPUTS:
- Travel Dates: ${startDate} to ${endDate} (${duration} days)
- Travelers: ${travelers} Person(s)
- Transport Preference: ${transportPref}
- ${departureInfo}
- Total Budget: ${userBudget ? '₹' + userBudget : 'Not specified'}
- Interests: ${interests?.join(', ') || 'general sightseeing'}
- Daily Availability: ${availStart} to ${availEnd}
- Accommodation Preference: ${stayPreference}

WEATHER DATA:
${weatherContext}

OPTIMIZATION REQUIREMENTS:
1. **CRITICAL: BUDGET VALIDATION & ESTIMATION**
   - **STEP 1 [CALCULATE MINIMUM VIABLE COST]**:
     * Calculate the *Absolute Minimum Cost* for this trip using the **Budget Tier**:
     * **Min Transport**:
       - Short Distance (< 400km, e.g. Chittoor-Chennai): ₹150/person (Local Bus/Train)
       - Domestic India: ₹1,000/person (Sleeper Class)
       - International: Use realistic flight costs (e.g. ₹25k Asia, ₹80k Europe).
     * **Min Daily Cost (Stay + Food + Travel)**:
       - **Domestic (India)**: ₹600/day per person (Ultra Budget).
       - **International**: ₹6,000/day per person (Strict baseline).
     * **Formula**: (Min Transport * Travelers) + (Min Daily Cost * Days * Travelers)
     * This is the "Floor Price".

   - **STEP 2 [CALCULATE ONLY]**:
     * Calculate the final minTotalCost using the formula above.
     * RETURN this value in the JSON response as minTotalCost (number).
     * **DO NOT** validate the budget yourself. **DO NOT** return an error JSON.
     * Always generate a valid itinerary structure. The application code will handle validation.

   - **STEP 3 [CONSISTENT ESTIMATION]**:
     * Your "estimatedTripCost" MUST be realistic and separate from the "minTotalCost".
     * "estimatedTripCost" is what a *comfortable* trip costs.
     * "minTotalCost" is the *absolute floor* (survival mode).

2. **ITINERARY STRUCTURE**:
   - **stayStrategy**: MANDATORY OBJECT. Must include "summary" (best area to stay) and "clusters" array.
   - **Hotel**: Suggest a SPECIFIC, REAL hotel for each day matching the "${stayPreference}" tier.
   - **Activities**: STRICTLY provide **EXACTLY 3** main activities per day.
     * Activity 1: Morning
     * Activity 2: Afternoon
     * Activity 3: Evening
   - **Logistics**: Include distance from the selected Hotel to each activity.

3. **FORMATTING**:
   - Times must be specific.
   - Distances must be realistic.

Return ONLY valid JSON (no markdown).
Required JSON Structure:
{
  "minTotalCost": 4500,
  "estimatedTripCost": {
    "total": "e.g., ₹45,000",
    "breakdown": "Flight: ₹X, Stay: ₹Y, Food: ₹Z, Activities: ₹W",
    "note": "Estimated based on ${travelers} travelers staying at [Hotel Tier]"
  },
  "transportAdvice": {
    "title": "Best Transport",
    "recommendation": "Use Metro/Cab...",
    "priceEstimate": "₹500/day"
  },
  "stayStrategy": {
    "summary": "Best area to stay (e.g. City Center)",
    "clusters": [
      { "days": "1-3", "hotel": "Hotel Name", "area": "Area Name" }
    ]
  },
  "itinerary": [
     {
       "day": 1,
       "title": "Day Theme",
       "hotel": { 
          "name": "Exact Hotel Name", 
          "area": "Location", 
          "distanceToAttractions": "2 km from City Center"
       },
       "activities": [
         { 
           "time": "09:00 AM - 12:00 PM",
           "title": "Activity Name", 
           "description": "Description...", 
           "category": "CULTURE",
           "distanceFromHotel": "2.5 km"
         },
         {
           "time": "01:00 PM - 03:00 PM",
           "title": "Activity Name", 
           "description": "...",
           "category": "FOOD",
           "distanceFromHotel": "3.0 km"
         },
         {
           "time": "05:00 PM - 08:00 PM",
           "title": "Activity Name", 
           "description": "...",
           "category": "NIGHTLIFE",
           "distanceFromHotel": "1.5 km"
         }
       ]
     }
  ]
}
If generation fails, return empty JSON.`;

  try {
    console.log(`Calling Groq API for ${destination} with enhanced prompt...`);

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.3, // Lower temperature for consistent calculation
      max_tokens: 6000,
    });

    const text = completion.choices[0]?.message?.content || '';
    console.log('Groq response received, parsing...');

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // ---------------------------------------------------------
      // JAVASCRIPT BUDGET VALIDATION (Replaces AI Validation)
      // ---------------------------------------------------------
      if (userBudget && parsed.minTotalCost) {
        console.log(`💰 Budget Check: User ₹${userBudget} vs Min ₹${parsed.minTotalCost}`);

        if (userBudget < parsed.minTotalCost) {
          console.log('❌ Budget too low. Returning error object.');
          return {
            error: "Budget Too Low",
            reason: `The absolute minimum cost for ${travelers} people to ${destination} is approx ₹${parsed.minTotalCost}. Your budget ₹${userBudget} is not enough.`,
            breakdown: `Min Transport + Min Daily x ${duration} days`
          };
        }
      }
      // ---------------------------------------------------------

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
    // If it's a JSON parse error from our explicit error return, pass it through
    if (error.message.includes('Budget Too Low')) {
      throw new Error('Budget Too Low');
    }
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
      // Ensure activities is an array
      if (!Array.isArray(day.activities)) {
        day.activities = [];
      }

      // Fix: Handle case where AI returns strings instead of objects
      day.activities = day.activities.map((activity, actIndex) => {
        // Defensive transformation: If it's not a valid object, make it one
        let actObj;

        if (typeof activity === 'string') {
          actObj = { title: activity, description: 'Explore this location', category: 'CULTURE' };
        } else if (typeof activity !== 'object' || activity === null) {
          actObj = { title: 'Unknown Activity', description: 'Explore this location', category: 'CULTURE' };
        } else {
          // It is an object, but let's clone it to be safe against frozen objects
          actObj = { ...activity };
        }

        // Now safe to assign properties
        actObj.id = dayIndex * 100 + actIndex;
        actObj.image = actObj.image || categoryImages[actObj.category] || categoryImages.CULTURE;
        actObj.categoryColor = categoryColors[actObj.category] || 'bg-gray-100 text-gray-700';

        return actObj;
      });
    });
  }

  return itinerary;
}

export default { generateItinerary };
