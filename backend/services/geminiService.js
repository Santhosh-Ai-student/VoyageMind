import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI (will use API key from env)
let genAI = null;

function getGeminiClient() {
    if (!genAI && process.env.GEMINI_API_KEY) {
        const key = process.env.GEMINI_API_KEY;
        console.log(`✅ Gemini API key loaded: ${key.substring(0, 8)}...${key.substring(key.length - 4)}`);
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
}

/**
 * Generate travel itinerary using Gemini AI
 */
export async function generateItinerary({ destination, startDate, endDate, budget, pace, interests, weather }) {
    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // DEMO MODE - Use sample data without calling API (for testing/demos when API is rate limited)
    if (process.env.DEMO_MODE === 'true') {
        console.log('🎭 DEMO MODE: Using sample itinerary data');
        return generateDemoItinerary(destination, duration, budget, pace, interests);
    }

    const client = getGeminiClient();

    // If no API key, throw error
    if (!client) {
        console.log('No Gemini API key found');
        throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to .env file.');
    }

    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a travel planning AI. Generate a detailed ${duration}-day itinerary for ${destination}.

User Preferences:
- Budget: ₹${budget?.amount || 50000} (${budget?.style || 'Standard'} style)
- Pace: ${pace || 'Active'} (how busy the days should be)
- Interests: ${interests?.join(', ') || 'general sightseeing'}
${weather ? `- Weather forecast: ${weather.summary || 'Clear weather expected'}` : ''}

Return a JSON object with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Day theme title",
      "date": "Day 1",
      "activities": [
        {
          "time": "9:00 AM",
          "category": "CULTURE|FOOD|NATURE|SHOPPING|NIGHTLIFE",
          "title": "Activity name",
          "description": "Brief description with tips"
        }
      ]
    }
  ],
  "hotel": {
    "name": "Recommended hotel name",
    "description": "Why this hotel suits the traveler"
  },
  "tips": ["Travel tip 1", "Travel tip 2"]
}

Generate ${duration} days with 2-4 activities each based on the pace preference. Make it realistic and include local experiences.`;

    // Retry logic for rate limits
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries} - Calling Gemini API...`);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                console.log('✅ Successfully generated itinerary!');
                return addImagesToItinerary(parsed, destination);
            }

            throw new Error('Could not parse AI response');

        } catch (error) {
            lastError = error;
            console.error(`Attempt ${attempt} failed:`, error.message);

            // Check if it's a rate limit error (429)
            if (error.message.includes('429') || error.message.includes('quota')) {
                // Extract retry delay from error message
                const retryMatch = error.message.match(/retry in (\d+)/i);
                const waitTime = retryMatch ? parseInt(retryMatch[1]) * 1000 : 60000;

                if (attempt < maxRetries) {
                    console.log(`⏳ Rate limited. Waiting ${waitTime / 1000}s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            } else {
                // Non-rate-limit error, don't retry
                break;
            }
        }
    }

    // All retries failed
    throw new Error(`AI service error after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Add placeholder images to itinerary activities
 */
function addImagesToItinerary(itinerary, destination) {
    const categoryImages = {
        CULTURE: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop',
        FOOD: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop',
        NATURE: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
        SHOPPING: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300&h=200&fit=crop',
        NIGHTLIFE: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=200&fit=crop',
    };

    if (itinerary?.itinerary) {
        itinerary.itinerary.forEach(day => {
            day.activities?.forEach(activity => {
                if (!activity.image) {
                    activity.image = categoryImages[activity.category] || categoryImages.CULTURE;
                }
            });
        });
    }

    return itinerary;
}

/**
 * Generate mock itinerary when API is unavailable
 */
function generateMockItinerary(destination, duration, budget, pace, interests) {
    const destinationData = {
        'Goa': {
            activities: [
                { category: 'CULTURE', title: 'Basilica of Bom Jesus', description: 'UNESCO heritage site with Portuguese architecture.' },
                { category: 'FOOD', title: "Fisherman's Wharf", description: 'Authentic Goan curry with riverside views.' },
                { category: 'NATURE', title: 'Anjuna Beach', description: 'Famous rocky coastline and vibrant atmosphere.' },
                { category: 'NIGHTLIFE', title: 'Curlies Beach Shack', description: 'Sunset views and live music.' },
                { category: 'CULTURE', title: 'Fontainhas Latin Quarter', description: 'Colorful Portuguese-era streets.' },
                { category: 'SHOPPING', title: 'Mapusa Friday Market', description: 'Local spices and souvenirs.' },
            ],
            hotel: { name: 'Heritage Boutique Villa', description: '85% of activities within easy reach.' }
        },
        'Paris': {
            activities: [
                { category: 'CULTURE', title: 'Eiffel Tower', description: 'Iconic landmark with skip-the-line access.' },
                { category: 'FOOD', title: 'Café de Flore', description: 'Historic café in Saint-Germain-des-Prés.' },
                { category: 'CULTURE', title: 'Louvre Museum', description: 'See the Mona Lisa and Venus de Milo.' },
                { category: 'NATURE', title: 'Sacré-Cœur', description: 'Panoramic city views from Montmartre.' },
                { category: 'SHOPPING', title: 'Champs-Élysées', description: 'World-famous shopping avenue.' },
            ],
            hotel: { name: 'Le Marais Boutique Hotel', description: 'Walking distance to major attractions.' }
        },
        'Kerala': {
            activities: [
                { category: 'NATURE', title: 'Alleppey Backwaters', description: 'Houseboat cruise through serene canals.' },
                { category: 'CULTURE', title: 'Mattancherry Palace', description: 'Dutch colonial architecture and murals.' },
                { category: 'NATURE', title: 'Munnar Tea Gardens', description: 'Rolling hills of tea plantations.' },
                { category: 'FOOD', title: 'Kerala Sadya', description: 'Traditional feast on banana leaf.' },
            ],
            hotel: { name: 'Backwater Resort & Spa', description: 'Ayurvedic treatments and lake views.' }
        }
    };

    // Default activities if destination not found
    const defaultActivities = [
        { category: 'CULTURE', title: 'City Center Tour', description: 'Explore main attractions and landmarks.' },
        { category: 'FOOD', title: 'Local Cuisine Experience', description: 'Try authentic regional dishes.' },
        { category: 'NATURE', title: 'Nature Excursion', description: 'Visit nearby natural attractions.' },
        { category: 'SHOPPING', title: 'Local Markets', description: 'Browse souvenirs and local crafts.' },
    ];

    const data = destinationData[destination] || {
        activities: defaultActivities,
        hotel: { name: 'Premium City Hotel', description: 'Centrally located accommodation.' }
    };

    const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];
    const activitiesPerDay = pace === 'Intense' ? 4 : pace === 'Chill' ? 2 : 3;

    const itinerary = [];
    const dayTitles = ['Arrival & Exploration', 'Cultural Immersion', 'Adventure Day', 'Leisure & Shopping', 'Departure Day'];

    for (let day = 1; day <= duration; day++) {
        const dayActivities = [];
        for (let i = 0; i < activitiesPerDay && i < data.activities.length; i++) {
            const activityIndex = ((day - 1) * activitiesPerDay + i) % data.activities.length;
            const activity = data.activities[activityIndex];

            dayActivities.push({
                id: day * 10 + i,
                time: times[i % times.length],
                category: activity.category,
                categoryColor: getCategoryColor(activity.category),
                title: activity.title,
                description: activity.description,
                image: getCategoryImage(activity.category)
            });
        }

        itinerary.push({
            day,
            title: dayTitles[(day - 1) % dayTitles.length],
            date: `Day ${day}`,
            activities: dayActivities
        });
    }

    return {
        itinerary,
        hotel: data.hotel,
        tips: [
            `Best time to visit ${destination} depends on weather patterns`,
            'Book popular attractions in advance',
            'Keep some buffer time for spontaneous discoveries'
        ]
    };
}

function getCategoryColor(category) {
    const colors = {
        CULTURE: 'bg-blue-100 text-blue-700',
        FOOD: 'bg-orange-100 text-orange-700',
        NATURE: 'bg-green-100 text-green-700',
        SHOPPING: 'bg-pink-100 text-pink-700',
        NIGHTLIFE: 'bg-purple-100 text-purple-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
}

function getCategoryImage(category) {
    const images = {
        CULTURE: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300&h=200&fit=crop',
        FOOD: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop',
        NATURE: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop',
        SHOPPING: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=300&h=200&fit=crop',
        NIGHTLIFE: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=200&fit=crop',
    };
    return images[category] || images.CULTURE;
}

/**
 * Generate demo itinerary with realistic sample data (for testing/demos)
 */
function generateDemoItinerary(destination, duration, budget, pace, interests) {
    const activitiesPerDay = pace === 'Intense' ? 4 : pace === 'Chill' ? 2 : 3;

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

    const destinationData = {
        'Paris': {
            activities: [
                { category: 'CULTURE', title: 'Eiffel Tower', description: 'Iconic landmark with stunning city views. Book skip-the-line tickets in advance.' },
                { category: 'CULTURE', title: 'Louvre Museum', description: 'Home to the Mona Lisa. Arrive early to avoid crowds.' },
                { category: 'FOOD', title: 'Le Marais Café', description: 'Authentic French croissants and coffee in the historic Jewish Quarter.' },
                { category: 'SHOPPING', title: 'Champs-Élysées', description: 'World-famous shopping avenue with luxury boutiques.' },
                { category: 'NATURE', title: 'Luxembourg Gardens', description: 'Beautiful park perfect for a leisurely afternoon stroll.' },
                { category: 'CULTURE', title: 'Sacré-Cœur', description: 'Stunning basilica with panoramic views from Montmartre.' },
            ],
            hotel: { name: 'Hôtel Le Marais Boutique', description: 'Charming 4-star hotel in the heart of Paris, walking distance to major attractions.' }
        },
        'New York': {
            activities: [
                { category: 'CULTURE', title: 'Statue of Liberty', description: 'Book ferry tickets in advance. Crown access requires early booking.' },
                { category: 'NATURE', title: 'Central Park', description: 'Rent a bike or take a carriage ride through this urban oasis.' },
                { category: 'SHOPPING', title: 'Times Square', description: 'Neon lights and Broadway shows. Best experienced at night.' },
                { category: 'FOOD', title: 'Chelsea Market', description: 'Gourmet food hall with diverse cuisines. Try the lobster rolls!' },
                { category: 'CULTURE', title: 'Metropolitan Museum', description: 'One of the world\'s largest art museums. Allow at least 3 hours.' },
                { category: 'NIGHTLIFE', title: 'Brooklyn Bridge Walk', description: 'Sunset walk with stunning Manhattan skyline views.' },
            ],
            hotel: { name: 'The Manhattan Grand', description: 'Modern hotel in Midtown, steps from Central Park and subway stations.' }
        },
        'Tokyo': {
            activities: [
                { category: 'CULTURE', title: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa. Visit early morning for fewer crowds.' },
                { category: 'FOOD', title: 'Tsukiji Outer Market', description: 'Fresh sushi and street food paradise. Don\'t miss the tamagoyaki!' },
                { category: 'SHOPPING', title: 'Shibuya Crossing', description: 'World\'s busiest intersection. Experience the organized chaos.' },
                { category: 'NATURE', title: 'Meiji Shrine', description: 'Peaceful forested oasis in the heart of the city.' },
                { category: 'NIGHTLIFE', title: 'Golden Gai', description: 'Tiny bars with big character in Shinjuku. Each bar seats only 6-8 people.' },
                { category: 'CULTURE', title: 'teamLab Borderless', description: 'Immersive digital art museum. Book tickets well in advance.' },
            ],
            hotel: { name: 'Shinjuku Granbell Hotel', description: 'Stylish hotel near major train stations with city views.' }
        },
    };

    // Default for any destination
    const defaultData = {
        activities: [
            { category: 'CULTURE', title: `${destination} City Tour`, description: 'Explore the main landmarks and historical sites with a local guide.' },
            { category: 'FOOD', title: 'Local Cuisine Experience', description: 'Taste authentic regional dishes at a popular local restaurant.' },
            { category: 'NATURE', title: 'Scenic Viewpoint', description: 'Enjoy panoramic views of the city and surrounding landscape.' },
            { category: 'SHOPPING', title: 'Local Market', description: 'Browse handcrafted souvenirs and local specialties.' },
            { category: 'CULTURE', title: 'Museum Visit', description: 'Learn about local history and culture at the main museum.' },
            { category: 'NIGHTLIFE', title: 'Evening Entertainment', description: 'Experience the local nightlife scene and live performances.' },
        ],
        hotel: { name: `${destination} Grand Hotel`, description: 'Centrally located with easy access to major attractions.' }
    };

    const data = destinationData[destination] || defaultData;
    const times = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM'];
    const dayTitles = ['Arrival & Discovery', 'Deep Exploration', 'Cultural Immersion', 'Adventure Day', 'Leisure & Farewell'];

    const itinerary = [];
    for (let day = 1; day <= duration; day++) {
        const dayActivities = [];
        for (let i = 0; i < activitiesPerDay && i < data.activities.length; i++) {
            const activityIndex = ((day - 1) * activitiesPerDay + i) % data.activities.length;
            const activity = data.activities[activityIndex];

            dayActivities.push({
                id: day * 100 + i,
                time: times[i % times.length],
                category: activity.category,
                categoryColor: categoryColors[activity.category],
                title: activity.title,
                description: activity.description,
                image: categoryImages[activity.category]
            });
        }

        itinerary.push({
            day,
            title: dayTitles[(day - 1) % dayTitles.length],
            date: `Day ${day}`,
            activities: dayActivities
        });
    }

    return {
        itinerary,
        hotel: data.hotel,
        tips: [
            `Best time to visit ${destination} may vary by season`,
            'Book popular attractions 2-3 weeks in advance',
            'Download offline maps for navigation',
            'Keep some local currency for small vendors'
        ]
    };
}

export default { generateItinerary };
