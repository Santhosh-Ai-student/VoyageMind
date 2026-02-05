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
    ArrowLeft
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { generateItinerary } from '../services/api';

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

const paceOptions = [
    { id: 'chill', label: 'Chill', icon: Coffee, hours: '4-5h/day' },
    { id: 'active', label: 'Active', icon: Zap, hours: '6-8h/day' },
    { id: 'intense', label: 'Intense', icon: Sparkles, hours: '10h+/day' },
];

const budgetStyles = ['Backpacker', 'Standard', 'Luxury'];

const accommodationOptions = [
    { id: 'near_attractions', label: 'Near Attractions', icon: MapPin, desc: 'Within 1-2km of major sites' },
    { id: 'budget_friendly', label: 'Budget Friendly', icon: WalletIcon, desc: 'Best value for money' },
    { id: 'luxury', label: 'Luxury Stay', icon: Sparkles, desc: 'Premium experience' },
    { id: 'central', label: 'City Center', icon: Building2, desc: 'Heart of the city' },
];

export default function TripCustomizer() {
    const navigate = useNavigate();
    const { tripData, updateDates, updateBudget, updatePace, toggleInterest, resetTrip, updateItinerary } = useTrip();

    // Dynamic date calculation
    const getDefaultDates = () => {
        const today = new Date();
        const weekLater = new Date(today);
        weekLater.setDate(today.getDate() + 7);
        const formatDate = (date) => date.toISOString().split('T')[0];
        return { start: formatDate(today), end: formatDate(weekLater) };
    };

    const defaultDates = getDefaultDates();

    // Core State
    const [startDate, setStartDate] = useState(tripData.dates.start || defaultDates.start);
    const [endDate, setEndDate] = useState(tripData.dates.end || defaultDates.end);
    const [budget, setBudget] = useState(tripData.budget.amount || 50000);
    const [budgetStyle, setBudgetStyle] = useState(tripData.budget.style || 'Standard');
    const [pace, setPace] = useState(tripData.pace || 'active');
    const [interests, setInterests] = useState(tripData.interests.length > 0 ? tripData.interests : ['food', 'history']);

    // NEW: Daily Availability Windows
    const [availabilityStart, setAvailabilityStart] = useState('09:00');
    const [availabilityEnd, setAvailabilityEnd] = useState('18:00');

    // NEW: Accommodation Preference
    const [accommodation, setAccommodation] = useState('near_attractions');

    // UI State
    const [isGenerating, setIsGenerating] = useState(false);
    const [showMoreInterests, setShowMoreInterests] = useState(false);
    const [error, setError] = useState(null);

    const visibleInterests = showMoreInterests ? interestOptions : interestOptions.slice(0, 6);

    const handleInterestToggle = (interestId) => {
        if (interests.includes(interestId)) {
            setInterests(interests.filter(i => i !== interestId));
        } else {
            setInterests([...interests, interestId]);
        }
        toggleInterest(interestId);
    };

    const handleReset = () => {
        const freshDates = getDefaultDates();
        setStartDate(freshDates.start);
        setEndDate(freshDates.end);
        setBudget(50000);
        setBudgetStyle('Standard');
        setPace('active');
        setInterests(['food', 'history']);
        setAvailabilityStart('09:00');
        setAvailabilityEnd('18:00');
        setAccommodation('near_attractions');
        resetTrip();
    };

    const handleStartBuild = async () => {
        updateDates({ start: startDate, end: endDate });
        updateBudget({ amount: budget, style: budgetStyle });
        updatePace(pace);

        setIsGenerating(true);
        setError(null);

        try {
            const result = await generateItinerary({
                destination: tripData.destination,
                dates: { start: startDate, end: endDate },
                budget: { amount: budget, style: budgetStyle },
                pace,
                interests,
                // NEW FIELDS
                availability: { start: availabilityStart, end: availabilityEnd },
                accommodation,
            });

            if (result && result.itinerary) {
                updateItinerary(result);
                console.log('Itinerary updated:', result);
                navigate('/itinerary');
            } else {
                throw new Error('No itinerary data received');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Server error. Please try again.');
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
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                            AI Trip Configurator
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Customize Your Trip</h1>
                            <p className="text-gray-600 mt-1">
                                Configure preferences for <span className="font-semibold text-primary-600">{tripData.destination?.name || 'your destination'}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4">
                                <RotateCcw className="w-4 h-4 mr-2" /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-slide-up">
                        <span className="text-red-600 text-xl">⚠️</span>
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-800">Error</h4>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-red-600 text-xl">×</button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Configuration */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Date Selection */}
                        <div className="card p-6 animate-slide-up">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Travel Dates</h3>
                                    <p className="text-sm text-gray-500 mb-4">Select your travel window</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 p-3 bg-accent-50 rounded-lg">
                                        <CloudSun className="w-5 h-5 text-accent-600" />
                                        <span className="text-sm text-accent-700">Weather-optimized scheduling enabled</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Daily Availability Window */}
                        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Daily Availability</h3>
                                    <p className="text-sm text-gray-500 mb-4">When are you available for activities each day?</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                                            <input
                                                type="time"
                                                value={availabilityStart}
                                                onChange={(e) => setAvailabilityStart(e.target.value)}
                                                className="input"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Until</label>
                                            <input
                                                type="time"
                                                value={availabilityEnd}
                                                onChange={(e) => setAvailabilityEnd(e.target.value)}
                                                className="input"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                        📅 You have <span className="font-bold text-primary-600">{getAvailabilityHours()} hours</span> available per day
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Accommodation Preference */}
                        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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

                        {/* Budget & Pace Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Budget */}
                            <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-sm">₹</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Total Budget</h3>
                                        <p className="text-xs text-gray-500">Excluding flights</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-500">₹10K</span>
                                        <span className="text-2xl font-bold text-primary-600">{formatBudget(budget)}</span>
                                        <span className="text-gray-500">₹5L+</span>
                                    </div>
                                    <input
                                        type="range" min="10000" max="500000" step="5000"
                                        value={budget} onChange={(e) => setBudget(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {budgetStyles.map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => setBudgetStyle(style)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${budgetStyle === style
                                                ? 'bg-primary-100 text-primary-700 border-2 border-primary-400'
                                                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                                                }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Pace */}
                            <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Activity Pace</h3>
                                        <p className="text-xs text-gray-500">How busy each day?</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {paceOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setPace(option.id)}
                                                className={`p-3 rounded-xl border-2 text-center transition-all ${pace === option.id
                                                    ? 'border-orange-400 bg-orange-50'
                                                    : 'border-gray-200 hover:border-orange-200'
                                                    }`}
                                            >
                                                <Icon className={`w-6 h-6 mx-auto mb-1 ${pace === option.id ? 'text-orange-600' : 'text-gray-400'}`} />
                                                <span className={`text-sm font-medium ${pace === option.id ? 'text-orange-700' : 'text-gray-600'}`}>
                                                    {option.label}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-1">{option.hours}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Core Interests */}
                        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.25s' }}>
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
                    <div className="space-y-6">
                        {/* Generation Status */}
                        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500">Ready for AI</span>
                                <span className="text-sm font-semibold text-accent-600">100%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
                                <div className="h-2 bg-accent-500 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                            <div className="space-y-3 mb-6">
                                {[
                                    { label: 'Dates Set', complete: true },
                                    { label: 'Availability Configured', complete: true },
                                    { label: 'Accommodation Preference', complete: true },
                                    { label: 'Budget Validated', complete: true },
                                    { label: 'Interests Selected', complete: interests.length > 0 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.complete ? 'bg-accent-500' : 'bg-gray-200'}`}>
                                            {item.complete && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-sm ${item.complete ? 'text-gray-700' : 'text-gray-400'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleStartBuild}
                                disabled={isGenerating}
                                className="w-full btn-accent py-3 justify-center text-lg"
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

                        {/* Summary */}
                        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.35s' }}>
                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Summary</h4>
                            <div className="space-y-3 text-sm">
                                <div><span className="font-semibold text-gray-900">Destination:</span> <span className="text-gray-600">{tripData.destination?.name || 'Not selected'}</span></div>
                                <div><span className="font-semibold text-gray-900">Duration:</span> <span className="text-gray-600">{calculateDays()} days</span></div>
                                <div><span className="font-semibold text-gray-900">Budget:</span> <span className="text-gray-600">{formatBudget(budget)} ({budgetStyle})</span></div>
                                <div><span className="font-semibold text-gray-900">Availability:</span> <span className="text-gray-600">{availabilityStart} - {availabilityEnd}</span></div>
                                <div><span className="font-semibold text-gray-900">Stay:</span> <span className="text-gray-600">{accommodationOptions.find(a => a.id === accommodation)?.label}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
