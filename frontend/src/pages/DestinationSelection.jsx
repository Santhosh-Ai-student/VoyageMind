import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Sparkles, Globe } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export default function DestinationSelection() {
    const navigate = useNavigate();
    const { updateDestination } = useTrip();
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = useRef(null);

    const handleDestinationSelect = (destName, imageUrl) => {
        updateDestination({
            name: destName,
            state: '',
            country: '', // We can let AI fill this or generic
            image: imageUrl
        });
        navigate('/customize');
    };

    // 3 Static Suggestions as requested
    const suggestions = [
        {
            id: 1,
            name: 'Paris',
            location: 'France',
            image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
            tag: 'Romance'
        },
        {
            id: 2,
            name: 'Bali',
            location: 'Indonesia',
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
            tag: 'Nature'
        },
        {
            id: 3,
            name: 'Goa',
            location: 'India',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
            tag: 'Beaches'
        }
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#013D7C 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#013D7C] mb-8 transition-colors group"
                >
                    <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-[#013D7C] text-xs font-bold uppercase tracking-widest mb-4">
                        Start Your Journey
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black text-[#013D7C] mb-6 font-[Poppins] tracking-tight leading-tight">
                        Where to next?
                    </h1>
                    <p className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto font-[Open Sans]">
                        Search for any destination in the world or pick from our top trending spots.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-20 relative z-50">
                    <div className="relative bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-200 focus-within:border-[#013D7C] focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300 transform hover:-translate-y-1 p-2 flex items-center">
                        <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery) {
                                    handleDestinationSelect(searchQuery, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80');
                                }
                            }}
                            placeholder="Type a destination (e.g., Tokyo, New York)..."
                            className="flex-1 px-4 py-3 text-lg focus:outline-none bg-transparent font-medium text-gray-900 placeholder-gray-400 w-full"
                        />
                        <button
                            onClick={() => {
                                if (searchQuery) handleDestinationSelect(searchQuery, 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80');
                            }}
                            className="aspect-square h-12 bg-[#013D7C] rounded-xl flex items-center justify-center hover:bg-[#FFCC00] hover:text-[#013D7C] transition-all text-white shadow-lg"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Suggestions Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <Sparkles className="w-5 h-5 text-[#FFCC00]" />
                        <h2 className="text-xl font-bold text-[#013D7C] uppercase tracking-wide">Trending Now</h2>
                        <Sparkles className="w-5 h-5 text-[#FFCC00]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
                        {suggestions.map((place) => (
                            <button
                                key={place.id}
                                onClick={() => handleDestinationSelect(place.name, place.image)}
                                className="group relative h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 w-full text-left"
                            >
                                {/* Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={place.image}
                                        alt={place.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#013D7C]/90 via-[#013D7C]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <span className="inline-block px-3 py-1 bg-[#FFCC00] text-[#013D7C] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                                        {place.tag}
                                    </span>
                                    <h3 className="text-4xl font-black text-white mb-2 font-[Poppins]">{place.name}</h3>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <MapPin className="w-4 h-4" />
                                        <span className="font-medium tracking-wide">{place.location}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
