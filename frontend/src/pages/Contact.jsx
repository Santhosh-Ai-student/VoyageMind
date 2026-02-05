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
        <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-6">
                        <MessageCircle className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-700">Get in Touch</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Let's Start a <span className="gradient-text">Conversation</span>
                    </h1>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions about VoyageMind? Want to partner with us?
                        We'd love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="card p-8 animate-slide-up">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-accent-600" />
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
                                                className="input"
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
                                                className="input"
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
                                            className="input"
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
                                            className="input resize-none"
                                        />
                                    </div>

                                    <button type="submit" className="btn-accent w-full py-4 justify-center">
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
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                {contactInfo.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={idx}
                                            href={item.href}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                                <Icon className="w-5 h-5 text-primary-600" />
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
                        <div className="card p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social, idx) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={idx}
                                            href={social.href}
                                            aria-label={social.label}
                                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 hover:text-primary-600 transition-colors"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Response */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
                            <h3 className="font-semibold mb-2">Quick Response Promise</h3>
                            <p className="text-primary-100 text-sm">
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
