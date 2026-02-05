import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import worldMapImg from '../assets/world-map.png';

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">

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

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/80 backdrop-blur-sm border border-accent-200 rounded-full mb-12 shadow-sm">
                    <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold text-accent-700 tracking-wide uppercase">AI Travel Intelligence</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-gray-900 leading-none mb-8 tracking-tight">
                    Travel Smarter,
                    <br />
                    <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                        Not Harder.
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
                    Generate personalized, minute-by-minute itineraries powered by advanced AI.
                    Optimized for weather, budget, and your unique style.
                </p>

                {/* CTA Button */}
                <div className="flex items-center justify-center">
                    <Link
                        to="/destination"
                        className="btn-accent group text-xl px-12 py-5 rounded-full shadow-xl shadow-accent-200/50 hover:shadow-2xl hover:shadow-accent-300/50 hover:-translate-y-1 transition-all duration-300 flex items-center"
                    >
                        Start Planning
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
