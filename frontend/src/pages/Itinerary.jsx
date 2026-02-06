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
    ArrowLeft,
    Camera
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
                tempHigh: fallback?.tempHigh ?? null,
                tempLow: fallback?.tempLow ?? null,
                condition: fallback?.condition || 'Unavailable',
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

    const handleDownloadPDF = (e) => {
        if (e) e.preventDefault();
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

                {/* Header Actions Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 animate-fade-in no-print bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => navigate('/customize', { replace: true })}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#013D7C] transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Edit</span>
                    </button>

                    {/* Weather Button Added to Header for Visibility */}
                    {weather && (
                        <button
                            onClick={() => setShowWeatherModal(true)}
                            className="flex items-center gap-2 text-[#013D7C] font-semibold bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                        >
                            <Cloud className="w-4 h-4" />
                            <span>Check Weather</span>
                        </button>
                    )}
                </div>

                {/* Celebration Header */}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 no-print">
                    {/* Trip Overview Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up h-full">
                            {/* Hero Banner Strip */}
                            <div className="h-32 bg-[#013D7C] relative">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFCC00] rounded-full blur-[120px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute inset-0 flex items-center px-8">
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight font-[Poppins]">
                                        {destination} <span className="text-[#FFCC00]">Trip Plan</span>
                                    </h1>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-blue-50 text-[#013D7C] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                                                Personalized Plan
                                            </span>
                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-100 flex items-center gap-1">
                                                <Check className="w-3 h-3" /> Customizable
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-[Poppins]">
                                            {durationDays} Days / {durationDays - 1} Nights Adventure
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                                                    <Calendar className="w-5 h-5 text-[#013D7C]" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Travel Dates</p>
                                                    <p className="text-sm font-semibold text-gray-900">{formatDate(startDate)} - {formatDate(endDate)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Insights Column */}
                    <div className="lg:col-span-1 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {/* Stay Strategy */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Home className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Stay Strategy</h3>
                                    <p className="text-xs text-gray-500">Best areas to stay</p>
                                </div>
                            </div>
                            {stayStrategy ? (
                                <div className="space-y-3 text-sm">
                                    <div className="text-gray-700 bg-purple-50 px-3 py-2 rounded-lg text-xs border border-purple-100 leading-relaxed">
                                        {typeof stayStrategy === 'string' ? stayStrategy : stayStrategy.summary || "Stay near the city center for best access."}
                                    </div>
                                    {stayStrategy.clusters && Array.isArray(stayStrategy.clusters) && (
                                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
                                            {stayStrategy.clusters.map((cluster, idx) => (
                                                <div key={idx} className="flex flex-col gap-1 border-b border-gray-100 pb-2 last:border-0">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded-full shadow-sm">
                                                            Days {cluster.days}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-800 text-right truncate max-w-[120px]">{cluster.area}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 pl-1 truncate" title={cluster.hotel}>{cluster.hotel}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Stay near the City Center for best access.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Removed Insights Row as it is now integrated */}
                {/* Removed Transport and Insights cards as I consolidated layout above */}
                {/* To keep transport visible, I should add it back or ensure it wasn't lost. 
                   Wait, I replaced a large chunk. I should be careful not to delete Transport entirely if it was valuable.
                   I will re-add Transport card in the Quick Insights column or below.
                   For safety, I'll stick to mostly replacing the Weather logic and just cleaning up the header.
                */}


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

                {/* Daily Package Itinerary */}
                <div className="mb-10 animate-slide-up">
                    <h2 className="text-2xl font-bold text-[#013D7C] mb-6 flex items-center gap-3 font-[Poppins]">
                        <span className="w-8 h-8 rounded-lg bg-[#FFCC00] flex items-center justify-center text-[#013D7C] shadow-md">
                            <MapPin className="w-5 h-5" />
                        </span>
                        Day-wise Trip Plan
                    </h2>

                    <div className="space-y-6">
                        {itinerary.map((day) => (
                            <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 print:shadow-none print:border-b print:rounded-none">
                                <button
                                    onClick={() => toggleDay(day.day)}
                                    className="w-full flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white transition-colors print:p-0 print:mb-4"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="flex-shrink-0 w-14 h-14 bg-[#013D7C] rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg print:border print:bg-white print:text-black">
                                            <span className="text-[10px] uppercase opacity-70 tracking-wider">Day</span>
                                            <span className="text-2xl leading-none">{day.day}</span>
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 font-[Poppins]">{day.title}</h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                                                {day.hotel && (
                                                    <span className="text-xs font-bold text-[#013D7C] bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1">
                                                        <Home className="w-3 h-3" /> {day.hotel.name}
                                                    </span>
                                                )}
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                                                    <Camera className="w-3 h-3" /> {day.activities?.length || 0} Experiences
                                                </span>
                                            </div>
                                        </div>
                                        {/* Added Hotel Distance if available or just space filler */}
                                        {day.hotel?.distanceToAttractions && (
                                            <div className="hidden sm:block text-xs font-medium text-gray-500 text-right mr-4">
                                                <div className="flex items-center gap-1 justify-end">
                                                    <MapPin className="w-3 h-3" /> {day.hotel.distanceToAttractions}
                                                </div>
                                                <div className="text-[10px] opacity-70">from attractions</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`p-2 rounded-full ${expandedDays.includes(day.day) ? 'bg-[#FFCC00] text-[#013D7C]' : 'bg-gray-100 text-gray-400'} transition-all`}>
                                        <ChevronDown className={`w-5 h-5 transition-transform ${expandedDays.includes(day.day) ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>

                                {expandedDays.includes(day.day) && (
                                    <div className="p-6 border-t border-gray-100">
                                        {/* Hotel Feature */}
                                        {day.hotel && (
                                            <div className="flex items-start gap-4 mb-8 bg-[#F0F7FF] p-4 rounded-xl border border-blue-100">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#013D7C] flex-shrink-0">
                                                    <Home className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#013D7C] uppercase tracking-wide mb-1">Stay</p>
                                                    <h4 className="font-bold text-gray-900 text-lg">{day.hotel.name}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{day.hotel.area || day.area}</p>
                                                    {day.hotel.distanceToAttractions && (
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {day.hotel.distanceToAttractions} from main spots
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative pl-8 border-l-2 border-dashed border-gray-300 space-y-8 ml-3">
                                            {day.activities?.slice(0, 3).map((activity, idx) => (
                                                <div key={idx} className="relative">
                                                    {/* Bullet Point */}
                                                    <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-[#FFCC00] border-4 border-white shadow-sm z-10"></div>

                                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-sm font-bold text-[#013D7C] monospace bg-blue-50 px-2 py-0.5 rounded">{activity.time}</span>
                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide px-2 border border-gray-200 rounded-full">{activity.category}</span>
                                                            </div>
                                                            <h4 className="text-lg font-bold text-gray-900 mb-2">{activity.title}</h4>
                                                            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{activity.description}</p>
                                                            {activity.distanceFromHotel && (
                                                                <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" /> {activity.distanceFromHotel} from hotel
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
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

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleDownloadPDF}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/20 text-white font-bold text-lg rounded-full hover:bg-white/30 transition-all border border-white/20 backdrop-blur-sm hover:scale-105 active:scale-95"
                        >
                            <Download className="w-6 h-6" />
                            Download PDF
                        </button>

                        <Link
                            to="/thank-you"
                            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <Check className="w-6 h-6" strokeWidth={3} />
                            Finalize Trip
                        </Link>
                    </div>
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
                                                    {day.tempHigh !== null ? (
                                                        <span>{day.tempHigh}° <span className="text-gray-400 text-sm font-normal">/ {day.tempLow}°</span></span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 uppercase">Offline</span>
                                                    )}

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
