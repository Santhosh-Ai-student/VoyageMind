import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import DestinationSelection from './pages/DestinationSelection';
import RegionDestinations from './pages/RegionDestinations';
import TripCustomizer from './pages/TripCustomizer';
import Itinerary from './pages/Itinerary';
import ThankYou from './pages/ThankYou';
import About from './pages/About';
import Contact from './pages/Contact';
import { TripProvider } from './context/TripContext';

function App() {
    return (
        <TripProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/destination" element={<DestinationSelection />} />
                            <Route path="/destination/:region" element={<RegionDestinations />} />
                            <Route path="/customize" element={<TripCustomizer />} />
                            <Route path="/itinerary" element={<Itinerary />} />
                            <Route path="/thank-you" element={<ThankYou />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </TripProvider>
    );
}

export default App;
