import {
    Sparkles,
    Brain,
    Zap,
    Globe,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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

const stats = [
    { value: '50K+', label: 'Happy Travelers' },
    { value: '150+', label: 'Destinations' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'AI Support' },
];

const team = [
    {
        name: 'Santhosh',
        role: 'Full Stack Developer (Team Lead)',
        image: '/Assest/santhosh.jpeg',
    },
    {
        name: 'Mughal Rayhan',
        role: 'Web Tester',
        image: '/Assest/rayhan.jpeg',
    },
    {
        name: 'Bharath',
        role: 'UX Designer',
        image: '/Assest/bharath.jpeg',
    },
];

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-40"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors absolute left-0 top-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-primary-100 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-700">About VoyageMind</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Revolutionizing Travel with
                        <span className="gradient-text-blue"> Artificial Intelligence</span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        VoyageMind combines cutting-edge AI technology with deep travel expertise
                        to create personalized, intelligent travel experiences that adapt to your
                        preferences and real-world conditions.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                We believe travel planning should be effortless, not stressful. Our mission
                                is to democratize intelligent travel planning, making it accessible to everyone
                                regardless of their travel experience or planning expertise.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                By leveraging AI, we analyze millions of data points – from weather patterns
                                and crowd levels to local events and hidden gems – to craft itineraries that
                                are not just good, but perfect for you.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="card p-6 text-center">
                                    <div className="text-3xl font-bold gradient-text-blue mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why VoyageMind?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our AI-powered platform offers unique advantages that traditional travel
                            planning tools simply can't match.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="card p-8 text-center card-hover">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
                        <p className="text-gray-600">
                            The passionate minds behind VoyageMind
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-primary-100 bg-gray-200">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-primary-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Transform Your Travel Experience?
                    </h2>
                    <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of travelers who have discovered the power of AI-driven travel planning.
                    </p>
                    <Link to="/destination" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                        Start Planning Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
