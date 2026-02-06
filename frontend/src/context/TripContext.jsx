import { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export function useTrip() {
    return useContext(TripContext);
}

export function TripProvider({ children }) {
    const defaultTripData = {
        destination: { name: '', state: '', country: '', image: '' },
        dates: { start: '', end: '' },
        logistics: { travelers: 1, departure: '', transport: 'public', budget: '' },
        interests: [],
        itinerary: [],
        weather: null,
        hotel: null,
        stayStrategy: null,
        tips: [],
        bookingInsights: [],
        scheduleAdjustments: []
    };

    // Load from local storage if available
    const [tripData, setTripData] = useState(() => {
        try {
            const saved = localStorage.getItem('voyageMindTrip');
            return saved ? JSON.parse(saved) : defaultTripData;
        } catch (e) {
            return defaultTripData;
        }
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('voyageMindTrip', JSON.stringify(tripData));
    }, [tripData]);

    const updateDestination = (dest) => {
        setTripData(prev => ({
            ...prev,
            destination: { ...prev.destination, ...dest }
        }));
    };

    const updateDates = (dates) => {
        setTripData(prev => ({ ...prev, dates }));
    };

    const updateLogistics = (logistics) => {
        setTripData(prev => ({
            ...prev,
            logistics: { ...prev.logistics, ...logistics }
        }));
    };

    const toggleInterest = (interestId) => {
        setTripData(prev => {
            const current = prev.interests;
            const updated = current.includes(interestId)
                ? current.filter(id => id !== interestId)
                : [...current, interestId];
            return { ...prev, interests: updated };
        });
    };

    const updateItinerary = (data) => {
        setTripData(prev => ({
            ...prev,
            itinerary: data.itinerary || [],
            hotel: data.hotel || null,
            stayStrategy: data.stayStrategy || null,
            tips: data.tips || [],
            weather: data.weather || null,
            bookingInsights: data.bookingInsights || [],
            scheduleAdjustments: data.scheduleAdjustments || [],
            estimatedTripCost: data.estimatedTripCost || null,
            transportAdvice: data.transportAdvice || null
        }));
    };

    const resetTrip = () => {
        setTripData(defaultTripData);
        localStorage.removeItem('voyageMindTrip');
    };

    const value = {
        tripData,
        updateDestination,
        updateDates,
        updateLogistics,
        toggleInterest,
        updateItinerary,
        resetTrip
    };

    return (
        <TripContext.Provider value={value}>
            {children}
        </TripContext.Provider>
    );
}
