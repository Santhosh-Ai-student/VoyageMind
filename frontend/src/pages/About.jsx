import {
    Sparkles,
    Brain,
    Zap,
    Globe,
    ArrowRight,
    ArrowLeft,
    Target,
    Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Team Images
import santhoshImg from '../assets/team/santhosh.jpeg';
import bharathImg from '../assets/team/bharath.jpeg';
import rayhanImg from '../assets/team/rayhan.jpeg';

const features = [
    {
        icon: Brain,
        title: 'AI-Powered Planning',
        description: 'Our advanced algorithms analyze thousands of data points to create the perfect itinerary tailored to your preferences.',
    },
    {
        icon: Zap,
        title: 'Real-Time Optimization',
        description: 'Weather changes? Crowd alerts? We dynamically adjust your plans to ensure the best experience.',
    },
    {
        icon: Globe,
        title: 'Local Intelligence',
        description: 'Access insider knowledge and hidden gems that only locals know about, curated by our AI.',
    },
];

const team = [
    {
        name: 'Bharath',
        role: 'Frontend Developer',
        image: bharathImg,
    },
    {
        name: 'Santhosh',
        role: 'Backend Developer & Lead',
        image: santhoshImg,
    },
    {
        name: 'Rayhan',
        role: 'UI/UX Designer',
        image: rayhanImg,
    },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#013D7C] to-[#002a5c] overflow-hidden text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FFCC00] rounded-full blur-[120px] opacity-20"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors absolute left-0 top-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-[#FFCC00]" />
                        <span className="text-sm font-medium text-blue-50">About VoyageMind</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight font-[Poppins]">
                        Travel Planning, <br />
                        <span className="text-[#FFCC00]">Finally Solved.</span>
                    </h1>

                    <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed font-[Open Sans]">
                        We built VoyageMind because we love exploring the world but hate the hours spent planning it.
                        We're here to fix that.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16">
                        {/* Mission */}
                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Target className="w-8 h-8 text-[#013D7C]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#013D7C] mb-4 font-[Poppins]">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    To bring the joy back to travel. We want you to spend less time scrolling through tabs
                                    and more time dreaming about your next adventure.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Eye className="w-8 h-8 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#013D7C] mb-4 font-[Poppins]">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    A future where your perfect trip is just one click away. No stress, no confusion—just
                                    pure excitement for the journey ahead.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="card p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-[#013D7C]">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Icon className="w-7 h-7 text-[#013D7C]" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 font-[Poppins]">{feature.title}</h3>
                                    <p className="text-gray-600 font-[Open Sans]">{
                                        feature.title === 'AI-Powered Planning' ? "We do the heavy lifting. Our tech finds the best spots so you don't have to." :
                                            feature.title === 'Real-Time Optimization' ? "Rain check? We've got you. Plans adjust automatically so your trip stays smooth." :
                                                "Discover the places the guidebooks miss. We help you travel like a local, not a tourist."
                                    }</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#013D7C] mb-4 font-[Poppins]">Meet the Developers</h2>
                        <p className="text-gray-600">The passionate minds building the future of travel.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 justify-center">
                        {team.map((member, idx) => (
                            <div key={idx} className="group relative text-center">
                                <div className="w-32 h-32 mx-auto mb-6 relative">
                                    <div className="absolute inset-0 bg-[#FFCC00] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg relative z-10"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-[Poppins]">{member.name}</h3>
                                <p className="text-sm font-semibold text-[#013D7C] uppercase tracking-wide mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#013D7C]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4 font-[Poppins]">
                        Ready to Transform Your Travel Experience?
                    </h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                        Join us on this journey.
                    </p>
                    <Link to="/destination" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFCC00] text-[#013D7C] font-bold rounded-full hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                        Start Planning Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
