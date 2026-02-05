import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">VoyageMind</span>
                    </Link>

                    {/* Credits */}
                    <p className="text-sm text-gray-500">
                        Developed by <span className="font-semibold text-gray-700">Santhosh</span> and team
                    </p>
                </div>
            </div>
        </footer>
    );
}
