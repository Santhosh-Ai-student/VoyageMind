import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import worldMapImg from '../assets/world-map.png';
import {
    CheckCircle,
    Heart,
    Plane,
    MapPin,
    Calendar,
    Download,
    Share2,
    Home,
    Sparkles,
    Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function ThankYou() {
    const { tripData, resetTrip } = useTrip();
    const destination = tripData.destination?.name || 'Your Destination';
    const startDate = tripData.dates?.start;
    const endDate = tripData.dates?.end;

    // Trigger confetti on page load
    useEffect(() => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleNewTrip = () => {
        resetTrip();
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Real World Map Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${worldMapImg})`,
                        backgroundSize: '120% auto',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.15,
                        filter: 'grayscale(100%)'
                    }}
                ></div>

                <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '-3s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '-5s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center animate-fade-in">

                {/* Success Icon */}
                <div className="mb-8">
                    <div className="relative inline-flex">
                        <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200">
                            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <Star className="w-5 h-5 text-white" fill="white" />
                        </div>
                    </div>
                </div>

                {/* Thank You Message */}
                <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Trip Finalized! 🎉
                </h1>

                <p className="text-xl text-gray-600 mb-2">
                    Thank you for using <span className="font-bold text-emerald-600">VoyageMind</span>
                </p>

                <p className="text-gray-500 mb-8 flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
                    We hope you have an amazing journey!
                </p>

                {/* Trip Summary Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-bold text-gray-900">Your Trip Summary</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <span className="text-xl font-semibold">{destination}</span>
                        </div>

                        {startDate && endDate && (
                            <div className="flex items-center justify-center gap-3 text-gray-600">
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <span>{formatDate(startDate)} → {formatDate(endDate)}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-3 text-gray-600">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Plane className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span>{tripData.itinerary?.length || 0} days of adventure planned</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <Link
                        to="/itinerary?print=true"
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-full font-semibold text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-all shadow-sm"
                    >
                        <Download className="w-5 h-5" />
                        Download Itinerary
                    </Link>


                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/itinerary"
                        className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
                    >
                        ← View Itinerary
                    </Link>

                    <Link
                        to="/"
                        onClick={handleNewTrip}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Plan New Trip
                    </Link>
                </div>

                {/* Footer Message */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                        Made with <Heart className="w-3 h-3 inline text-red-400" fill="currentColor" /> by VoyageMind AI
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                        Your AI-powered travel companion
                    </p>
                </div>
            </div>
        </div>
    );
}
