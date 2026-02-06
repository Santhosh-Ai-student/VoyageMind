import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import worldMapImg from '../assets/world-map.png';

export default function Home() {
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

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-10 shadow-xl">
                    <span className="w-2.5 h-2.5 bg-[#FFCC00] rounded-full animate-pulse shadow-[0_0_10px_#FFCC00]"></span>
                    <span className="text-sm font-bold text-white tracking-widest uppercase font-[Open Sans]">AI-Powered Travel Agent</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 tracking-tight font-[Poppins]">
                    Travel <span className="text-[#FFCC00]">Smarter</span>,
                    <br />
                    Not Harder.
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed font-light font-[Open Sans]">
                    Your personal AI travel concierge. Get verified, minute-by-minute itineraries optimized for weather, budget, and experiences.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/destination"
                        className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-[#FFCC00]/20 flex items-center group"
                    >
                        Start Planning
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
