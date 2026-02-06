import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    CloudSun,
    Utensils,
    Landmark,
    TreePine,
    ShoppingBag,
    Moon,
    Building2,
    RotateCcw,
    Sparkles,
    Coffee,
    Zap,
    Check,
    Camera,
    Music,
    Palette,
    Heart,
    Clock,
    Home,
    MapPin,
    Wallet as WalletIcon,
    ArrowLeft,
    Users,
    Car,
    Bus,
    Plane,
    Bike,

    Globe,
    AlertTriangle,
    MapPinOff,
    AlertCircle
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { generateItinerary, validateLocation } from '../services/api';

const interestOptions = [
    { id: 'food', label: 'Food & Dining', icon: Utensils },
    { id: 'history', label: 'History', icon: Landmark },
    { id: 'nature', label: 'Nature', icon: TreePine },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'nightlife', label: 'Nightlife', icon: Moon },
    { id: 'architecture', label: 'Architecture', icon: Building2 },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'music', label: 'Music & Arts', icon: Music },
    { id: 'culture', label: 'Local Culture', icon: Palette },
    { id: 'wellness', label: 'Wellness & Spa', icon: Heart },
];

const accommodationOptions = [
    { id: 'near_attractions', label: 'Near Attractions', icon: MapPin, desc: 'Within 1-2km of major sites' },
    { id: 'budget_friendly', label: 'Budget Friendly', icon: WalletIcon, desc: 'Best value for money' },
    { id: 'luxury', label: 'Luxury Stay', icon: Sparkles, desc: 'Premium experience' },
    { id: 'central', label: 'City Center', icon: Building2, desc: 'Heart of the city' },
];

export default function TripCustomizer() {
    const navigate = useNavigate();
    const { tripData, updateDates, updateLogistics, toggleInterest, resetTrip, updateItinerary } = useTrip();

    // Dynamic date calculation
    const getDefaultDates = () => {
        const today = new Date();
        const weekLater = new Date(today);
        weekLater.setDate(today.getDate() + 7);

        // Format as YYYY-MM-DD using local time
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return { start: formatDate(today), end: formatDate(weekLater) };
    };

    const defaultDates = getDefaultDates();

    // Core State
    const [startDate, setStartDate] = useState(tripData.dates.start || defaultDates.start);
    const [endDate, setEndDate] = useState(tripData.dates.end || defaultDates.end);

    // NEW Logistics State
    const [travelers, setTravelers] = useState(tripData.logistics?.travelers || '');

    // Split departure into City and Country
    const initialDeparture = tripData.logistics?.departure || '';
    const [departureCity, setDepartureCity] = useState(initialDeparture.split(',')[0]?.trim() || '');
    const [departureCountry, setDepartureCountry] = useState(initialDeparture.split(',')[1]?.trim() || '');

    const [transport, setTransport] = useState(tripData.logistics?.transport || 'public');
    const [budget, setBudget] = useState(tripData.logistics?.budget || ''); // NEW

    const [interests, setInterests] = useState(tripData.interests.length > 0 ? tripData.interests : ['food', 'history']);

    // Availability & Accommodation State
    const [availabilityStart, setAvailabilityStart] = useState(tripData.availability?.start || '09:00');
    const [availabilityEnd, setAvailabilityEnd] = useState(tripData.availability?.end || '22:00');
    const [accommodation, setAccommodation] = useState(tripData.accommodation || 'near_attractions');

    // UI State
    const [showMoreInterests, setShowMoreInterests] = useState(false);
    const visibleInterests = showMoreInterests ? interestOptions : interestOptions.slice(0, 5);

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [errorType, setErrorType] = useState('info'); // 'info', 'validation', 'location', 'budget', 'error'
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleInterestToggle = (id) => {
        setInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleReset = () => {
        const freshDates = getDefaultDates();
        setStartDate(freshDates.start);
        setEndDate(freshDates.end);
        setTravelers('');
        setDepartureCity('');
        setDepartureCountry('');
        setTransport('public');
        setBudget(''); // NEW
        setInterests(['food', 'history']);
        setAvailabilityStart('09:00');
        setAvailabilityEnd('18:00');
        setAccommodation('near_attractions');
        resetTrip();
    };

    const handleStartBuild = async () => {
        // Validation: Mandatory Fields
        if (!travelers || !budget || !departureCity || !departureCountry) {
            setError("Please fill in all mandatory fields: Travelers, Budget, Departure City, and Country.");
            setErrorType('validation');
            setShowErrorModal(true);
            return;
        }

        if (parseInt(travelers) < 1) {
            setError("Please enter a valid number of travelers (at least 1).");
            setErrorType('validation');
            setShowErrorModal(true);
            return;
        }

        const fullDeparture = `${departureCity}, ${departureCountry}`;

        // Validate Location before proceeding
        setIsGenerating(true);
        setError(null);

        try {
            // 1. Verify Departure Location (City in Country check)
            const isValidLocation = await validateLocation(departureCity, departureCountry);
            if (!isValidLocation) {
                setErrorType('location');
                throw new Error(`We couldn't find "${departureCity}" in "${departureCountry}". Please check your spelling or try a major city nearby.`);
            }

            updateDates({ start: startDate, end: endDate });
            updateLogistics({ travelers, departure: fullDeparture, transport });

            const result = await generateItinerary({
                destination: tripData.destination,
                dates: { start: startDate, end: endDate },
                logistics: { travelers, departure: fullDeparture, transport, budget }, // NEW
                interests,
                availability: { start: availabilityStart, end: availabilityEnd },
                accommodation,
            });

            if (result.error) {
                throw new Error(result.reason || result.error);
            }

            if (result && result.itinerary && result.itinerary.length > 0) {
                updateItinerary(result);
                console.log('Itinerary updated:', result);
                navigate('/itinerary');
            } else {
                throw new Error('Generation failed: No itinerary data received. Please try again or adjust your budget.');
            }
        } catch (err) {
            console.error('Error:', err);
            let displayError = err.message;
            let type = 'error';

            // Clean up the error message if it contains technical prefixes
            if (displayError.includes('AI service error:')) {
                displayError = displayError.replace('AI service error:', '').trim();
            }

            // Robust Error Type Detection based on message content
            const lowerError = displayError.toLowerCase();

            if (lowerError.includes('budget')) {
                type = 'budget';
            } else if (lowerError.includes("couldn't find") || lowerError.includes("location")) {
                type = 'location';
            } else if (lowerError.includes('fill in') || lowerError.includes('missing')) {
                type = 'validation';
            }

            setError(displayError || 'Server error. Please try again.');
            setErrorType(type);
            setShowErrorModal(true);
            setIsGenerating(false);
        }
    };

    const calculateDays = () => {
        if (startDate && endDate) {
            const diff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            return diff > 0 ? diff : 0;
        }
        return 0;
    };

    const formatBudget = (value) => {
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        return `₹${(value / 1000).toFixed(0)}K`;
    };

    const getAvailabilityHours = () => {
        const start = parseInt(availabilityStart.split(':')[0]);
        const end = parseInt(availabilityEnd.split(':')[0]);
        return end - start;
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/destination')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header with Agency Vibes */}
                <div className="mb-8 animate-fade-in bg-[#013D7C] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCC00] rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-[#FFCC00] text-[#013D7C] text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                                New Trip
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight mb-2 font-[Poppins]">Plan Your Dream Getaway</h1>
                                <p className="text-blue-100 text-lg max-w-xl font-[Open Sans]">
                                    Customizing your package for <span className="font-bold text-[#FFCC00] border-b-2 border-[#FFCC00]">{tripData.destination?.name || 'your destination'}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={handleReset} className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all border border-white/30">
                                    <RotateCcw className="w-4 h-4 inline mr-2" /> Start Over
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
                    {/* Main Configuration */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Date Selection */}
                        <div className="card p-8 animate-slide-up border-2 border-[#013D7C]">
                            <div className="flex items-start gap-6">
                                <div className="hidden sm:flex w-14 h-14 bg-blue-50 rounded-2xl items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                                    <Calendar className="w-7 h-7 text-[#013D7C]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#013D7C] mb-1 font-[Poppins]">Travel Dates</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-[Open Sans]">Select your preferred dates for the package</p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Check-in</label>
                                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input border-2 border-[#013D7C] focus:border-[#FFCC00]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Check-out</label>
                                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input border-2 border-[#013D7C] focus:border-[#FFCC00]" />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-3 p-4 bg-[#FFF9E5] rounded-xl border border-[#FFE0B2]">
                                        <div className="p-1.5 bg-[#FFCC00] rounded-full">
                                            <CloudSun className="w-4 h-4 text-[#013D7C]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#013D7C]">Season Optimization</p>
                                            <p className="text-xs text-blue-900/70">Dates auto-adjusted for best weather</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Window */}
                        <div className="card p-8 animate-slide-up border-2 border-[#013D7C]" style={{ animationDelay: '0.05s' }}>
                            <div className="flex items-start gap-6">
                                <div className="hidden sm:flex w-14 h-14 bg-blue-50 rounded-2xl items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                                    <Clock className="w-7 h-7 text-[#013D7C]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#013D7C] mb-1 font-[Poppins]">Daily Schedule</h3>
                                    <p className="text-sm text-gray-500 mb-6 font-[Open Sans]">Define your active hours</p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Start Time</label>
                                            <input
                                                type="time"
                                                value={availabilityStart}
                                                onChange={(e) => setAvailabilityStart(e.target.value)}
                                                className="input border-2 border-[#013D7C] focus:border-[#FFCC00]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">End Time</label>
                                            <input
                                                type="time"
                                                value={availabilityEnd}
                                                onChange={(e) => setAvailabilityEnd(e.target.value)}
                                                className="input border-2 border-[#013D7C] focus:border-[#FFCC00]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Accommodation Preference */}
                        <div className="card p-6 animate-slide-up border-2 border-[#013D7C]" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Home className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Accommodation Preference</h3>
                                    <p className="text-sm text-gray-500 mb-4">How should we optimize your stay?</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {accommodationOptions.map((opt) => {
                                            const Icon = opt.icon;
                                            const isSelected = accommodation === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setAccommodation(opt.id)}
                                                    className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                                                        <span className={`font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>{opt.label}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{opt.desc}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Budget & Departure */}
                        <div className="card p-6 animate-slide-up border-2 border-[#013D7C]" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <WalletIcon className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Budget & Departure</h3>
                                    <p className="text-xs text-gray-500">Logistics details</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Travelers <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            placeholder="e.g. 2"
                                            value={travelers}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val < 0) return; // Prevent negative inputs
                                                setTravelers(e.target.value);
                                            }}
                                            className="input w-full border-2 border-[#013D7C] focus:border-[#FFCC00] pl-10"
                                        />
                                        <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Number of people
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (₹) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 15000"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="input w-full border-2 border-[#013D7C] focus:border-[#FFCC00]"
                                    />
                                    <p className="text-xs text-gray-400 mt-2">
                                        Total for all travelers
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Location <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="City e.g. Chennai"
                                                value={departureCity}
                                                onChange={(e) => setDepartureCity(e.target.value)}
                                                className="input w-full border-2 border-[#013D7C] focus:border-[#FFCC00] pl-10"
                                            />
                                            <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Country e.g. India"
                                                value={departureCountry}
                                                onChange={(e) => setDepartureCountry(e.target.value)}
                                                className="input w-full border-2 border-[#013D7C] focus:border-[#FFCC00] pl-10"
                                            />
                                            <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        City & Country for accurate planning
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Core Interests */}
                        <div className="card p-6 animate-slide-up border-2 border-[#013D7C]" style={{ animationDelay: '0.25s' }}>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900">Interests</h3>
                                <p className="text-sm text-gray-500">Select what you enjoy</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {visibleInterests.map((interest) => {
                                    const Icon = interest.icon;
                                    const isActive = interests.includes(interest.id);
                                    return (
                                        <button
                                            key={interest.id}
                                            onClick={() => handleInterestToggle(interest.id)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${isActive
                                                ? 'border-primary-400 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 text-gray-600 hover:border-primary-200'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{interest.label}</span>
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setShowMoreInterests(!showMoreInterests)}
                                    className="px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-full"
                                >
                                    {showMoreInterests ? '- Less' : '+ More'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 h-fit">
                        {/* Summary */}
                        <div className="card p-6 animate-slide-up border-2 border-[#013D7C]" style={{ animationDelay: '0.35s' }}>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Summary</h4>
                            <div className="space-y-3 text-sm mb-6">
                                <div><span className="font-semibold text-gray-900">Destination:</span> <span className="text-gray-600">{tripData.destination?.name || 'Not selected'}</span></div>
                                <div><span className="font-semibold text-gray-900">Duration:</span> <span className="text-gray-600">{calculateDays()} days</span></div>
                                <div><span className="font-semibold text-gray-900">Travelers:</span> <span className="text-gray-600">{travelers} Person{travelers > 1 ? 's' : ''}</span></div>
                                <div><span className="font-semibold text-gray-900">Departure:</span> <span className="text-gray-600">{departureCity ? `${departureCity}, ${departureCountry}` : 'Not specified'}</span></div>
                                <div><span className="font-semibold text-gray-900">Stay:</span> <span className="text-gray-600">{accommodationOptions.find(a => a.id === accommodation)?.label}</span></div>
                            </div>

                            <button
                                onClick={handleStartBuild}
                                disabled={isGenerating}
                                className="w-full btn-accent py-3 justify-center text-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2" />
                                        Generate Itinerary
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-scale-up">
                        {/* Dynamic Icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${errorType === 'budget' ? 'bg-red-100 text-red-600' :
                            errorType === 'location' ? 'bg-orange-100 text-orange-600' :
                                errorType === 'validation' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-gray-100 text-gray-600'
                            }`}>
                            {errorType === 'budget' && <WalletIcon className="w-6 h-6" />}
                            {errorType === 'location' && <MapPinOff className="w-6 h-6" />}
                            {errorType === 'validation' && <AlertTriangle className="w-6 h-6" />}
                            {errorType === 'error' && <AlertCircle className="w-6 h-6" />}
                        </div>

                        {/* Dynamic Title */}
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            {errorType === 'budget' ? 'Budget Too Low' :
                                errorType === 'location' ? 'Location Not Found' :
                                    errorType === 'validation' ? 'Missing Information' :
                                        'Something Went Wrong'}
                        </h3>

                        <p className="text-gray-600 text-center mb-6">
                            {error}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="flex-1 btn-primary py-3 justify-center"
                            >
                                {errorType === 'budget' ? 'Update Budget' : 'Fix Issue'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
