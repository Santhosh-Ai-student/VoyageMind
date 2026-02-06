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
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-[#013D7C]">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-[#FFCC00] rounded-full blur-[150px] opacity-20"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-[#4ECDC4] rounded-full blur-[150px] opacity-10"></div>
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url(${worldMapImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'contrast(1.2)'
                    }}
                ></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center animate-fade-in">

                {/* Success Icon */}
                <div className="mb-8 relative z-20">
                    <div className="relative inline-flex">
                        <div className="w-28 h-28 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
                            <CheckCircle className="w-14 h-14 text-[#FFCC00]" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#FFCC00] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <Star className="w-5 h-5 text-[#013D7C]" fill="#013D7C" />
                        </div>
                    </div>
                </div>

                {/* Thank You Message */}
                <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight font-[Poppins]">
                    Trip Finalized! 🎉
                </h1>

                <p className="text-xl text-blue-100 mb-2 font-[Open Sans]">
                    Thank you for using <span className="font-bold text-[#FFCC00]">VoyageMind</span>
                </p>

                <p className="text-blue-200/80 mb-10 flex items-center justify-center gap-1">
                    <Heart className="w-4 h-4 text-[#FFCC00]" fill="currentColor" />
                    We hope you have an amazing journey!
                </p>

                {/* Trip Summary Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border-4 border-[#FFCC00] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#013D7C]"></div>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Sparkles className="w-6 h-6 text-[#013D7C]" />
                        <h2 className="text-xl font-bold text-[#013D7C] font-[Poppins]">Your Trip Summary</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4 text-gray-800">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                                <MapPin className="w-6 h-6 text-[#013D7C]" />
                            </div>
                            <span className="text-2xl font-bold font-[Poppins]">{destination}</span>
                        </div>

                        {startDate && endDate && (
                            <div className="flex items-center justify-center gap-4 text-gray-600">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                                    <Calendar className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-lg font-medium">{formatDate(startDate)} → {formatDate(endDate)}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-center gap-4 text-gray-600">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                                <Plane className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-lg font-medium">{tripData.itinerary?.length || 0} days of adventure planned</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Link
                        to="/itinerary"
                        className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2 backdrop-blur-sm"
                    >
                        ← View Itinerary
                    </Link>



                    <Link
                        to="/"
                        onClick={handleNewTrip}
                        className="btn-primary px-8 py-4 flex items-center gap-2 shadow-xl shadow-[#FFCC00]/20"
                    >
                        <Home className="w-5 h-5" />
                        Plan New Trip
                    </Link>
                </div>

                {/* Footer Message */}
                <div className="border-t border-white/10 pt-8">
                    <p className="text-sm text-blue-200/60">
                        Made with <Heart className="w-3 h-3 inline text-[#FFCC00]" fill="currentColor" /> by VoyageMind AI
                    </p>
                </div>
            </div>
        </div>
    );
}
