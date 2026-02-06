import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircle,
    Twitter,
    Linkedin,
    Instagram,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';

export default function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: 'hello@voyagemind.ai',
            href: 'mailto:hello@voyagemind.ai',
        },
        {
            icon: Phone,
            label: 'Phone',
            value: '+91 98765 43210',
            href: 'tel:+919876543210',
        },
        {
            icon: MapPin,
            label: 'Location',
            value: 'Bangalore, India',
            href: '#',
        },
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
            {/* Header Section */}
            <div className="bg-[#013D7C] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCC00] rounded-full blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors absolute left-0 top-0 sm:-top-10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur border border-white/20 rounded-full mb-6 text-blue-50">
                        <MessageCircle className="w-4 h-4 text-[#FFCC00]" />
                        <span className="text-sm font-medium">Get in Touch</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-[Poppins]">
                        Let's Start a <span className="text-[#FFCC00]">Conversation</span>
                    </h1>

                    <p className="text-lg text-blue-100 max-w-2xl mx-auto font-[Open Sans]">
                        Have questions about VoyageMind? Want to partner with us?
                        We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="card p-8 animate-slide-up shadow-xl border-t-4 border-[#FFCC00]">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="John Doe"
                                                className="input w-full border-2 border-gray-200 focus:border-[#013D7C]"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="john@example.com"
                                                className="input w-full border-2 border-gray-200 focus:border-[#013D7C]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="How can we help you?"
                                            className="input w-full border-2 border-gray-200 focus:border-[#013D7C]"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            placeholder="Tell us more about your inquiry..."
                                            className="input resize-none w-full border-2 border-gray-200 focus:border-[#013D7C]"
                                        />
                                    </div>

                                    <button type="submit" className="btn-accent w-full py-4 justify-center shadow-lg hover:shadow-xl transition-all">
                                        Send Message
                                        <Send className="w-5 h-5 ml-2" />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        {/* Contact Details */}
                        <div className="card p-6 shadow-lg border-t-4 border-[#013D7C]">
                            <h3 className="font-semibold text-gray-900 mb-4 font-[Poppins]">Contact Information</h3>
                            <div className="space-y-4">
                                {contactInfo.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={idx}
                                            href={item.href}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-[#013D7C] group-hover:text-white transition-colors text-[#013D7C]">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">{item.label}</div>
                                                <div className="font-medium text-gray-900">{item.value}</div>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card p-6 shadow-lg">
                            <h3 className="font-semibold text-gray-900 mb-4 font-[Poppins]">Follow Us</h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social, idx) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={idx}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#013D7C] hover:text-white transition-colors text-gray-600"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Response */}
                        <div className="bg-[#013D7C] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCC00] rounded-full blur-[60px] opacity-20"></div>
                            <h3 className="font-semibold mb-2 relative z-10 font-[Poppins]">Quick Response Promise</h3>
                            <p className="text-blue-100 text-sm relative z-10 font-[Open Sans]">
                                We typically respond within 24 hours. For urgent inquiries,
                                reach out via phone or connect with us on social media.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
