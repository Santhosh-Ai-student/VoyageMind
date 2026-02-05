import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Search, ArrowLeft, MapPin, Filter, Star, ArrowRight } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { allDestinations } from './DestinationSelection';

// Region metadata
const regionMeta = {
    'south-india': {
        title: 'South India',
        description: 'Discover the beaches, temples, and hill stations of South India',
        gradient: 'from-orange-500 to-amber-600',
        bgImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=400&fit=crop'
    },
    'north-india': {
        title: 'North India',
        description: 'Explore the mountains, heritage sites, and adventure destinations',
        gradient: 'from-blue-500 to-indigo-600',
        bgImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=400&fit=crop'
    },
    'international': {
        title: 'International',
        description: 'Discover amazing destinations around the world',
        gradient: 'from-purple-500 to-pink-600',
        bgImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=400&fit=crop'
    },
    'all-india': {
        title: 'All India',
        description: 'Explore every corner of incredible India',
        gradient: 'from-orange-600 via-white to-green-600',
        bgImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=400&fit=crop'
    }
};

export default function RegionDestinations() {
    const { region } = useParams();
    const navigate = useNavigate();
    const { updateDestination } = useTrip();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterFamous, setFilterFamous] = useState('all'); // 'all', 'famous', 'hidden'
    const [filterState, setFilterState] = useState('all');

    // Get destinations for this region
    const destinations = useMemo(() => {
        if (region === 'south-india') return allDestinations.southIndia;
        if (region === 'north-india') return allDestinations.northIndia;
        if (region === 'international') return allDestinations.international;
        if (region === 'all-india') return [...allDestinations.southIndia, ...allDestinations.northIndia];
        return [];
    }, [region]);

    // Get unique states for filter
    const uniqueStates = useMemo(() => {
        const states = destinations.map(d => d.state || d.country).filter(Boolean);
        return [...new Set(states)].sort();
    }, [destinations]);

    // Filter destinations
    const filteredDestinations = useMemo(() => {
        return destinations.filter(dest => {
            const matchesSearch =
                dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.country.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFamous =
                filterFamous === 'all' ||
                (filterFamous === 'famous' && dest.famous) ||
                (filterFamous === 'hidden' && !dest.famous);

            const matchesState =
                filterState === 'all' ||
                dest.state === filterState ||
                dest.country === filterState;

            return matchesSearch && matchesFamous && matchesState;
        });
    }, [destinations, searchQuery, filterFamous, filterState]);

    const meta = regionMeta[region] || regionMeta['south-india'];

    const handleSelect = (dest) => {
        updateDestination({
            name: dest.name,
            state: dest.state,
            country: dest.country,
            image: dest.image
        });
        navigate('/customize');
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
            {/* Hero Banner */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={meta.bgImage}
                    alt={meta.title}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.gradient} opacity-80`}></div>

                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto w-full">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate('/destination')}
                            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Regions</span>
                        </button>

                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{meta.title}</h1>
                        <p className="text-white/80 text-lg">{meta.description}</p>
                        <p className="text-white/60 mt-2">{destinations.length} destinations available</p>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="sticky top-0 bg-white shadow-sm z-40 py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search in ${meta.title}...`}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                    </div>

                    {/* Filters - Stack on mobile, side by side on desktop */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-4">
                        {/* Filter: Fame */}
                        <div className="relative">
                            <select
                                value={filterFamous}
                                onChange={(e) => setFilterFamous(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 bg-white appearance-none pr-10 text-sm sm:text-base"
                            >
                                <option value="all">All Places</option>
                                <option value="famous">Popular Spots</option>
                                <option value="hidden">Hidden Gems</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Filter: State/Country */}
                        <div className="relative">
                            <select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 bg-white appearance-none pr-10 text-sm sm:text-base"
                            >
                                <option value="all">All {region === 'international' ? 'Countries' : 'States'}</option>
                                {uniqueStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Destinations Grid */}
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600">
                            Showing <span className="font-semibold text-gray-900">{filteredDestinations.length}</span> destinations
                        </p>
                    </div>

                    {filteredDestinations.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredDestinations.map((dest) => (
                                <button
                                    key={dest.id}
                                    onClick={() => handleSelect(dest)}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left"
                                >
                                    {/* Image */}
                                    <div className="relative h-32 overflow-hidden">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {dest.famous && (
                                            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3" fill="white" />
                                                Popular
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">{dest.name}</h3>
                                        <p className="text-xs text-gray-500 truncate">{dest.state ? `${dest.state}, ` : ''}{dest.country}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No destinations found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query</p>
                            <button
                                onClick={() => { setSearchQuery(''); setFilterFamous('all'); setFilterState('all'); }}
                                className="mt-4 btn-primary"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
