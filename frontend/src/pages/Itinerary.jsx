import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Check,
    Download,
    Calendar,
    Clock,
    MapPin,
    Wallet,
    Sparkles,
    Shield,
    Cloud,
    Thermometer,
    ChevronDown,
    X,
    Droplets,
    Home,
    AlertTriangle,
    Lightbulb,
    TrendingUp,
    ArrowLeft
} from 'lucide-react';
import { useTrip } from '../context/TripContext';

export default function Itinerary() {
    const navigate = useNavigate();
    const { tripData } = useTrip();
    const destination = tripData.destination?.name || 'Your Destination';
    const itinerary = tripData.itinerary || [];
    const hasItinerary = itinerary.length > 0;
    const weather = tripData.weather || null;
    const hotel = tripData.hotel || null;
    const stayStrategy = tripData.stayStrategy || null;
    const bookingInsights = tripData.bookingInsights || [];
    const scheduleAdjustments = tripData.scheduleAdjustments || [];

    // State - collapsed by default
    const [expandedDays, setExpandedDays] = useState([]);
    const [showWeatherModal, setShowWeatherModal] = useState(false);

    // Auto-print if query param exists
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('print') === 'true' && itinerary.length > 0) {
            const allDays = itinerary.map(d => d.day);
            setExpandedDays(allDays);
            // Wait for render
            setTimeout(() => {
                window.print();
            }, 500);
        }
    }, [itinerary]);


    // Date Calculation - Use local timezone by parsing as local date
    const parseLocalDate = (dateStr) => {
        if (!dateStr) return new Date();
        // If already a Date object, return it
        if (dateStr instanceof Date) return dateStr;
        // Parse YYYY-MM-DD as local date (add T00:00:00 to avoid UTC interpretation)
        const date = new Date(dateStr + 'T00:00:00');
        return isNaN(date.getTime()) ? new Date() : date;
    };

    const startDate = parseLocalDate(tripData.dates?.start);
    const endDate = parseLocalDate(tripData.dates?.end);

    // Get today in local timezone (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeDiff = startDate.getTime() - today.getTime();
    const daysToStart = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const durationDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1);
    const formatDate = (date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    // Helper to format date as YYYY-MM-DD in local timezone
    const toLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get weather data - show available data or generate estimates for future trips
    const getWeatherForTrip = () => {
        if (!weather?.forecast || weather.forecast.length === 0) {
            // Generate estimated weather for trip dates
            return Array.from({ length: Math.min(durationDays, 7) }, (_, i) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                return {
                    date: toLocalDateString(date),
                    tempHigh: 28 + Math.floor(Math.random() * 8),
                    tempLow: 20 + Math.floor(Math.random() * 5),
                    condition: ['Sunny', 'Partly Cloudy', 'Clear', 'Cloudy'][Math.floor(Math.random() * 4)],
                    rainMm: Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 0,
                    estimated: true
                };
            });
        }

        // If weather data exists, try to match trip dates or return available data
        const weatherByDate = {};
        weather.forecast.forEach(day => {
            const dateKey = typeof day.date === 'string' && day.date.includes('-')
                ? day.date
                : `Day ${weather.forecast.indexOf(day) + 1}`;
            weatherByDate[dateKey] = day;
        });

        // Generate weather for each trip day
        return Array.from({ length: Math.min(durationDays, 7) }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dateKey = toLocalDateString(date);

            if (weatherByDate[dateKey]) {
                return { ...weatherByDate[dateKey], date: dateKey };
            }

            // Use available weather as estimate
            const fallback = weather.forecast[i] || weather.forecast[0];
            return {
                date: dateKey,
                tempHigh: fallback?.tempHigh || 28,
                tempLow: fallback?.tempLow || 20,
                condition: fallback?.condition || 'Clear',
                rainMm: fallback?.rainMm || 0,
                estimated: true
            };
        });
    };

    const weatherForTrip = getWeatherForTrip();


    // Handlers
    const toggleDay = (day) => {
        if (expandedDays.includes(day)) {
            setExpandedDays(expandedDays.filter(d => d !== day));
        } else {
            setExpandedDays([...expandedDays, day]);
        }
    };

    const handleDownloadPDF = () => {
        const allDays = itinerary.map(d => d.day);
        setExpandedDays(allDays);
        setTimeout(() => window.print(), 300);
    };

    // Error state
    if (!hasItinerary) {
        return (
            <div className="min-h-[calc(100vh-4rem)] py-12 px-4 bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">No Itinerary Found</h1>
                    <p className="text-gray-600 mb-6">Please go back and generate your itinerary.</p>
                    <Link to="/customize" className="btn-primary">← Go Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 bg-gray-50 print:bg-white print:p-0">
            <div className="max-w-5xl mx-auto print:max-w-none">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors no-print"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header */}
                <div className="flex flex-col items-center mb-8 animate-fade-in text-center no-print">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Your Trip to <span className="text-emerald-500">{destination}</span> is Ready!
                    </h1>
                </div>

                {/* Print Header */}
                <div className="hidden print:block text-center mb-8 border-b pb-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination} Trip Plan</h1>
                    <p className="text-gray-600">{formatDate(startDate)} - {formatDate(endDate)}</p>
                </div>

                {/* Main Overview Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-slide-up print:shadow-none print:border-0 print:p-0">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 no-print">
                                <Sparkles className="w-4 h-4 text-primary-600" />
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">Summary</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{durationDays} Days in {destination}</h2>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{formatDate(startDate)} - {formatDate(endDate)}</span></div>
                                <div className="flex items-center gap-2"><Wallet className="w-4 h-4" /><span>{tripData.budget?.style || 'Standard'} Budget</span></div>
                            </div>
                        </div>

                        {/* Weather Widget */}
                        <div
                            onClick={() => weather && setShowWeatherModal(true)}
                            className={`md:w-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 transition-all ${weather ? 'hover:shadow-md cursor-pointer hover:border-blue-300' : ''} print:border print:bg-white`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Cloud className="w-5 h-5 text-blue-500" />
                                    <span className="font-semibold text-blue-800">Weather</span>
                                </div>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full no-print">{durationDays} DAYS</span>
                            </div>
                            {weatherForTrip.length > 0 ? (
                                <div>
                                    <span className="text-3xl font-bold text-gray-800">{weatherForTrip[0]?.tempHigh || '--'}°C</span>
                                    <p className="text-sm text-gray-600 mt-1">{weatherForTrip[0]?.condition || 'Clear'}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Loading...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Insights Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-slide-up">
                    {/* Stay Optimization Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Home className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Smart Stay Strategy</h3>
                                <p className="text-xs text-gray-500">Location-optimized hotels</p>
                            </div>
                        </div>
                        {stayStrategy ? (
                            <div className="space-y-3 text-sm">
                                <p className="text-gray-700 bg-purple-50 px-3 py-2 rounded-lg text-xs">{stayStrategy.summary}</p>
                                {stayStrategy.clusters && stayStrategy.clusters.map((cluster, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">Day {cluster.days}</span>
                                        <span className="font-medium text-gray-800">{cluster.hotel}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-500 text-xs">{cluster.area}</span>
                                    </div>
                                ))}
                            </div>
                        ) : hotel ? (
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-gray-900">{hotel.name}</p>
                                <p className="text-gray-600">{hotel.description}</p>
                                {hotel.distanceToAttractions && (
                                    <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                                        <MapPin className="w-4 h-4" />
                                        <span className="font-medium">{hotel.distanceToAttractions}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Expand a day to see hotel recommendations</p>
                        )}
                    </div>

                    {/* Booking Insights Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                <Lightbulb className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Booking Insights</h3>
                                <p className="text-xs text-gray-500">Timing recommendations</p>
                            </div>
                        </div>
                        {bookingInsights && bookingInsights.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {bookingInsights.slice(0, 3).map((insight, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span>
                                        <div>
                                            <span className="font-medium text-gray-800">{insight.activity}</span>
                                            <p className="text-gray-600 text-xs">{insight.insight}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Book activities 24-48 hours in advance for best prices.</p>
                        )}
                    </div>
                </div>

                {/* Schedule Adjustments Alert */}
                {scheduleAdjustments && scheduleAdjustments.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 animate-slide-up">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-amber-800 mb-2">Weather-Adjusted Schedule</h4>
                                <ul className="space-y-1 text-sm text-amber-700">
                                    {scheduleAdjustments.map((adj, idx) => (
                                        <li key={idx}>• {adj.adjustment}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}



                {/* Daily Itinerary - Collapsed by Default with Path Design */}
                <div className="mb-10 animate-slide-up">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary-600" /> Daily Itinerary
                    </h2>

                    <div className="space-y-4">
                        {itinerary.map((day) => (
                            <div key={day.day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-b print:rounded-none">
                                <button
                                    onClick={() => toggleDay(day.day)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors print:p-0 print:mb-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700 font-bold print:border print:bg-white">
                                            D{day.day}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-gray-900">Day {day.day}: {day.title}</h3>
                                            <p className="text-sm text-gray-500 no-print">{day.activities?.length || 0} activities</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 no-print transition-transform ${expandedDays.includes(day.day) ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedDays.includes(day.day) && (
                                    <div className="px-5 pb-5 pt-0 print:px-0">
                                        {/* Hotel Recommendation for this day */}
                                        {day.hotel && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Home className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="font-bold text-gray-900">{day.hotel.name}</h4>
                                                            {day.hotel.priceRange && (
                                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{day.hotel.priceRange}</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <MapPin className="w-3 h-3 inline mr-1" />{day.hotel.area || day.area}
                                                            {day.hotel.distance && <span className="ml-2 text-blue-600">• {day.hotel.distance}</span>}
                                                        </p>
                                                        {day.hotel.whyHere && (
                                                            <p className="text-xs text-gray-500 mt-1 italic">💡 {day.hotel.whyHere}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative pt-2">
                                            {/* Timeline Path - vertical line */}
                                            <div className="absolute left-4 top-6 bottom-4 w-0.5 bg-gradient-to-b from-primary-400 via-primary-300 to-primary-100 no-print"></div>

                                            <div className="space-y-4">
                                                {day.activities?.map((activity, idx, arr) => (
                                                    <div key={idx} className="relative flex items-start gap-4 print:mb-4">
                                                        {/* Timeline Node */}
                                                        <div className="relative z-10 flex-shrink-0">
                                                            <div className="w-8 h-8 bg-white border-2 border-primary-400 rounded-full flex items-center justify-center shadow-sm no-print">
                                                                <span className="text-xs font-bold text-primary-600">{idx + 1}</span>
                                                            </div>
                                                        </div>

                                                        {/* Activity Content */}
                                                        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-primary-200 transition-colors">
                                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                <span className="text-sm font-bold text-primary-600">
                                                                    {activity.time}{activity.endTime ? ` → ${activity.endTime}` : ''}
                                                                </span>
                                                                <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-200 rounded uppercase">{activity.category}</span>
                                                                {activity.crowdLevel && (
                                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activity.crowdLevel === 'low' ? 'bg-green-100 text-green-700' :
                                                                        activity.crowdLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                            'bg-red-100 text-red-700'
                                                                        }`}>
                                                                        {activity.crowdLevel} crowd
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="font-bold text-gray-900">{activity.title}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center text-sm text-gray-400 flex items-center justify-center gap-2 no-print">
                    <Shield className="w-4 h-4" /> Secure & Private Trip Planning
                </div>

                {/* Finalize Trip Section */}
                <div className="mt-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 shadow-lg text-center no-print animate-slide-up">
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Go? 🎉</h3>
                    <p className="text-emerald-100 mb-6">Your personalized itinerary is complete. Finalize your trip and get ready for an amazing adventure!</p>
                    <Link
                        to="/thank-you"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Check className="w-6 h-6" strokeWidth={3} />
                        Finalize Trip
                    </Link>
                </div>

                {/* Weather Modal */}
                {showWeatherModal && weather && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in no-print">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
                            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <Cloud className="w-6 h-6" /> Weather for Your Trip
                                    </h3>
                                    <p className="text-blue-100 mt-1">{destination} • {formatDate(startDate)} - {formatDate(endDate)}</p>
                                </div>
                                <button onClick={() => setShowWeatherModal(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {weatherForTrip.length > 0 ? weatherForTrip.map((day, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-lg font-bold text-gray-700">
                                                    {new Date(day.date + 'T00:00:00').getDate()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                                    <p className="text-sm text-gray-500">{day.condition}{day.estimated ? ' (Est.)' : ''}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-2 text-gray-900 font-bold">
                                                    <Thermometer className="w-4 h-4 text-orange-500" />
                                                    {day.tempHigh}° <span className="text-gray-400 text-sm font-normal">/ {day.tempLow}°</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-1 text-xs text-blue-500 mt-1">
                                                    <Droplets className="w-3 h-3" />
                                                    {day.rainMm}mm
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-500 py-4">Weather data for selected dates not available</p>
                                    )}
                                </div>
                                <button onClick={() => setShowWeatherModal(false)} className="btn-primary py-3 w-full mt-6">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
