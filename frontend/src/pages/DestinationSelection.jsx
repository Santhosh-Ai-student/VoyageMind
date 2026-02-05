import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin, ArrowLeft, Globe, Mountain, Sun, Plane } from 'lucide-react';
import { useTrip } from '../context/TripContext';

// Import South India images
import chennaiImg from '../assets/destinations/south-india/chennai.jpeg';
import ootyImg from '../assets/destinations/south-india/ooty.jpeg';
import kodaikanalImg from '../assets/destinations/south-india/kodaikanal.jpeg';
import mahabalipuramImg from '../assets/destinations/south-india/mahabalipuram.jpeg';
import maduraiImg from '../assets/destinations/south-india/madurai.jpeg';
import thanjavurImg from '../assets/destinations/south-india/thanjavur.jpeg';
import rameswaramImg from '../assets/destinations/south-india/rameswaram.jpeg';
import kanyakumariImg from '../assets/destinations/south-india/kanyakumari.jpeg';
import pondicherryImg from '../assets/destinations/south-india/pondicherry.jpeg';
import yercaudImg from '../assets/destinations/south-india/yercaud.jpeg';
import kochiImg from '../assets/destinations/south-india/kochi.jpeg';
import munnarImg from '../assets/destinations/south-india/munnar.jpeg';
import alleppeyImg from '../assets/destinations/south-india/alleppey.jpeg';
import thekkadyImg from '../assets/destinations/south-india/thekkady.jpeg';
import wayanadImg from '../assets/destinations/south-india/wayanad.jpeg';
import kovalamImg from '../assets/destinations/south-india/kovalam.jpeg';
import varkalaImg from '../assets/destinations/south-india/varkala.jpeg';
import trivandrumImg from '../assets/destinations/south-india/trivandrum.jpeg';
import bangaloreImg from '../assets/destinations/south-india/banglore.jpeg';
import mysoreImg from '../assets/destinations/south-india/mysore.jpeg';
import coorgImg from '../assets/destinations/south-india/coorg.jpeg';
import hampiImg from '../assets/destinations/south-india/hampi.jpeg';
import gokarnaImg from '../assets/destinations/south-india/gokarna.jpeg';
import badamiImg from '../assets/destinations/south-india/badami.jpeg';
import chikmagalurImg from '../assets/destinations/south-india/chikmagalur.jpeg';
import hyderabadImg from '../assets/destinations/south-india/hyderabad.jpeg';
import visakhapatnamImg from '../assets/destinations/south-india/vishakapatanam.jpeg';
import tirupatiImg from '../assets/destinations/south-india/tirupati.jpeg';
import arakuValleyImg from '../assets/destinations/south-india/aruku-valley.jpeg';
import goaImg from '../assets/destinations/south-india/goa.jpeg';

// Import North India images
import jaipurImg from '../assets/destinations/north-india/jaipur.jpeg';
import udaipurImg from '../assets/destinations/north-india/udaipur.jpeg';
import jodhpurImg from '../assets/destinations/north-india/jodhpur.jpeg';
import jaisalmerImg from '../assets/destinations/north-india/jaisalmer.jpeg';
import agraImg from '../assets/destinations/north-india/agra.jpeg';
import varanasiImg from '../assets/destinations/north-india/varanasi.jpeg';
import lucknowImg from '../assets/destinations/north-india/luckmow.jpeg';
import shimlaImg from '../assets/destinations/north-india/shimla.jpeg';
import manaliImg from '../assets/destinations/north-india/manali.jpeg';
import dharamshalaImg from '../assets/destinations/north-india/dharmashala.jpeg';
import kasolImg from '../assets/destinations/north-india/kasol.jpeg';
import spitiValleyImg from '../assets/destinations/north-india/spiti-valley.jpeg';
import rishikeshImg from '../assets/destinations/north-india/rishikesh.jpeg';
import haridwarImg from '../assets/destinations/north-india/haridwar.jpeg';
import nainitalImg from '../assets/destinations/north-india/nainital.jpeg';
import mussoorieImg from '../assets/destinations/north-india/mussoorie.jpeg';
import jimCorbettImg from '../assets/destinations/north-india/jim corbett.jpeg';
import newDelhiImg from '../assets/destinations/north-india/newdelhi.jpeg';
import amritsarImg from '../assets/destinations/north-india/amristar.jpeg';
import srinagarImg from '../assets/destinations/north-india/srinagar.jpeg';
import gulmargImg from '../assets/destinations/north-india/gulmarg.jpeg';
import lehLadakhImg from '../assets/destinations/north-india/lehladak.jpeg';
import darjeelingImg from '../assets/destinations/north-india/darjeeling.jpeg';
import kolkataImg from '../assets/destinations/north-india/kolkata.jpeg';
import gangtokImg from '../assets/destinations/north-india/gangtok.jpeg';
import shillongImg from '../assets/destinations/north-india/shilong.jpeg';
import mumbaiImg from '../assets/destinations/north-india/mumbai.jpeg';
import lonavalaImg from '../assets/destinations/north-india/lonavala.jpeg';
import kutchImg from '../assets/destinations/north-india/kutch.jpeg';
import puriImg from '../assets/destinations/north-india/puri.jpeg';

// Import International image (Egypt only - others use Unsplash)
// Import International images
// UAE
import dubaiImg from '../assets/destinations/international/dubai.jpeg';
import abuDhabiImg from '../assets/destinations/international/abudhabi.jpeg';
import sharjahImg from '../assets/destinations/international/sharjah.jpeg';
import rasAlKhaimahImg from '../assets/destinations/international/rasalkhaimah.jpeg';
import fujairahImg from '../assets/destinations/international/fujairah.jpeg';

// Thailand
import bangkokImg from '../assets/destinations/international/bangkok.jpeg';
import phuketImg from '../assets/destinations/international/phuket.jpeg';
import chiangMaiImg from '../assets/destinations/international/chiangMai.jpeg';
import krabiImg from '../assets/destinations/international/krabi.jpeg';
import pattayaImg from '../assets/destinations/international/pattaya.jpeg';

// Indonesia
import baliImg from '../assets/destinations/international/Bali.jpeg';
import ubudImg from '../assets/destinations/international/ubud.jpeg';
import jakartaImg from '../assets/destinations/international/jakarta.jpeg';
import lombokImg from '../assets/destinations/international/lombok.jpeg';
import komodoIslandImg from '../assets/destinations/international/komodoisland.jpeg';

// Japan
import tokyoImg from '../assets/destinations/international/tokyo.jpeg';
import kyotoImg from '../assets/destinations/international/kyoto.jpeg';
import osakaImg from '../assets/destinations/international/osaka.jpeg';
import naraImg from '../assets/destinations/international/nara.jpeg';
import hiroshimaImg from '../assets/destinations/international/hiroshima.jpeg';

// Vietnam
import hanoiImg from '../assets/destinations/international/hanoi.jpeg';
import hoChiMinhCityImg from '../assets/destinations/international/hochiminh.jpeg';
import daNangImg from '../assets/destinations/international/danang.jpeg';
import hoiAnImg from '../assets/destinations/international/HoiAn.jpeg';
import haLongBayImg from '../assets/destinations/international/halongbay.jpeg';

// France
import parisImg from '../assets/destinations/international/paris.jpeg';
import niceImg from '../assets/destinations/international/nice.jpeg';
import lyonImg from '../assets/destinations/international/lyon.jpeg';
import bordeauxImg from '../assets/destinations/international/bordeaux.jpeg';
import marseilleImg from '../assets/destinations/international/marseille.jpeg';

// UK
import londonImg from '../assets/destinations/international/london.jpeg';
import edinburghImg from '../assets/destinations/international/edinburgh.jpeg';
import manchesterImg from '../assets/destinations/international/manchester.jpeg';
import liverpoolImg from '../assets/destinations/international/liverpool.jpeg';
import glasgowImg from '../assets/destinations/international/glasgow.jpeg';

// Italy
import romeImg from '../assets/destinations/international/rome.jpeg';
import veniceImg from '../assets/destinations/international/venice.jpeg';
import florenceImg from '../assets/destinations/international/florence.jpeg';
import milanImg from '../assets/destinations/international/milan.jpeg';
import naplesImg from '../assets/destinations/international/naples.jpeg';

// USA
import newYorkImg from '../assets/destinations/international/newyork.jpeg';
import losAngelesImg from '../assets/destinations/international/losangeles.jpeg';
import lasVegasImg from '../assets/destinations/international/lasvegas.jpeg';
import sanFranciscoImg from '../assets/destinations/international/sanfrancisco.jpeg';
import miamiImg from '../assets/destinations/international/miami.jpeg';

// Australia
import sydneyImg from '../assets/destinations/international/sydney.jpeg';
import melbourneImg from '../assets/destinations/international/melbourne.jpeg';
import brisbaneImg from '../assets/destinations/international/brisbane_new.jpeg';
import goldCoastImg from '../assets/destinations/international/goldcoast_new.jpeg';
import perthImg from '../assets/destinations/international/perth_new.jpeg';

// Comprehensive destination database with local images (Verified)
export const allDestinations = {
    southIndia: [
        // Tamil Nadu
        { id: 's1', name: 'Chennai', state: 'Tamil Nadu', country: 'INDIA', image: chennaiImg, famous: true },
        { id: 's2', name: 'Ooty', state: 'Tamil Nadu', country: 'INDIA', image: ootyImg, famous: true },
        { id: 's3', name: 'Kodaikanal', state: 'Tamil Nadu', country: 'INDIA', image: kodaikanalImg, famous: true },
        { id: 's4', name: 'Mahabalipuram', state: 'Tamil Nadu', country: 'INDIA', image: mahabalipuramImg, famous: true },
        { id: 's5', name: 'Madurai', state: 'Tamil Nadu', country: 'INDIA', image: maduraiImg, famous: true },
        { id: 's6', name: 'Thanjavur', state: 'Tamil Nadu', country: 'INDIA', image: thanjavurImg, famous: false },
        { id: 's7', name: 'Rameswaram', state: 'Tamil Nadu', country: 'INDIA', image: rameswaramImg, famous: true },
        { id: 's8', name: 'Kanyakumari', state: 'Tamil Nadu', country: 'INDIA', image: kanyakumariImg, famous: true },
        { id: 's9', name: 'Pondicherry', state: 'Tamil Nadu', country: 'INDIA', image: pondicherryImg, famous: true },
        { id: 's10', name: 'Yercaud', state: 'Tamil Nadu', country: 'INDIA', image: yercaudImg, famous: false },
        // Kerala
        { id: 's11', name: 'Kochi', state: 'Kerala', country: 'INDIA', image: kochiImg, famous: true },
        { id: 's12', name: 'Munnar', state: 'Kerala', country: 'INDIA', image: munnarImg, famous: true },
        { id: 's13', name: 'Alleppey', state: 'Kerala', country: 'INDIA', image: alleppeyImg, famous: true },
        { id: 's14', name: 'Thekkady', state: 'Kerala', country: 'INDIA', image: thekkadyImg, famous: true },
        { id: 's15', name: 'Wayanad', state: 'Kerala', country: 'INDIA', image: wayanadImg, famous: true },
        { id: 's16', name: 'Kovalam', state: 'Kerala', country: 'INDIA', image: kovalamImg, famous: true },
        { id: 's17', name: 'Varkala', state: 'Kerala', country: 'INDIA', image: varkalaImg, famous: false },
        { id: 's18', name: 'Trivandrum', state: 'Kerala', country: 'INDIA', image: trivandrumImg, famous: true },
        // Karnataka
        { id: 's19', name: 'Bangalore', state: 'Karnataka', country: 'INDIA', image: bangaloreImg, famous: true },
        { id: 's20', name: 'Mysore', state: 'Karnataka', country: 'INDIA', image: mysoreImg, famous: true },
        { id: 's21', name: 'Coorg', state: 'Karnataka', country: 'INDIA', image: coorgImg, famous: true },
        { id: 's22', name: 'Hampi', state: 'Karnataka', country: 'INDIA', image: hampiImg, famous: true },
        { id: 's23', name: 'Gokarna', state: 'Karnataka', country: 'INDIA', image: gokarnaImg, famous: true },
        { id: 's24', name: 'Badami', state: 'Karnataka', country: 'INDIA', image: badamiImg, famous: false },
        { id: 's25', name: 'Chikmagalur', state: 'Karnataka', country: 'INDIA', image: chikmagalurImg, famous: true },
        // Andhra Pradesh & Telangana
        { id: 's26', name: 'Hyderabad', state: 'Telangana', country: 'INDIA', image: hyderabadImg, famous: true },
        { id: 's27', name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'INDIA', image: visakhapatnamImg, famous: true },
        { id: 's28', name: 'Tirupati', state: 'Andhra Pradesh', country: 'INDIA', image: tirupatiImg, famous: true },
        { id: 's29', name: 'Araku Valley', state: 'Andhra Pradesh', country: 'INDIA', image: arakuValleyImg, famous: false },
        // Goa
        { id: 's30', name: 'Goa', state: 'Goa', country: 'INDIA', image: goaImg, famous: true },
    ],
    northIndia: [
        // Rajasthan
        { id: 'n1', name: 'Jaipur', state: 'Rajasthan', country: 'INDIA', image: jaipurImg, famous: true },
        { id: 'n2', name: 'Udaipur', state: 'Rajasthan', country: 'INDIA', image: udaipurImg, famous: true },
        { id: 'n3', name: 'Jodhpur', state: 'Rajasthan', country: 'INDIA', image: jodhpurImg, famous: true },
        { id: 'n4', name: 'Jaisalmer', state: 'Rajasthan', country: 'INDIA', image: jaisalmerImg, famous: true },
        // Uttar Pradesh
        { id: 'n5', name: 'Agra', state: 'Uttar Pradesh', country: 'INDIA', image: agraImg, famous: true },
        { id: 'n6', name: 'Varanasi', state: 'Uttar Pradesh', country: 'INDIA', image: varanasiImg, famous: true },
        { id: 'n7', name: 'Lucknow', state: 'Uttar Pradesh', country: 'INDIA', image: lucknowImg, famous: true },
        // Himachal Pradesh
        { id: 'n8', name: 'Shimla', state: 'Himachal Pradesh', country: 'INDIA', image: shimlaImg, famous: true },
        { id: 'n9', name: 'Manali', state: 'Himachal Pradesh', country: 'INDIA', image: manaliImg, famous: true },
        { id: 'n10', name: 'Dharamshala', state: 'Himachal Pradesh', country: 'INDIA', image: dharamshalaImg, famous: true },
        { id: 'n11', name: 'Kasol', state: 'Himachal Pradesh', country: 'INDIA', image: kasolImg, famous: true },
        { id: 'n12', name: 'Spiti Valley', state: 'Himachal Pradesh', country: 'INDIA', image: spitiValleyImg, famous: true },
        // Uttarakhand
        { id: 'n13', name: 'Rishikesh', state: 'Uttarakhand', country: 'INDIA', image: rishikeshImg, famous: true },
        { id: 'n14', name: 'Haridwar', state: 'Uttarakhand', country: 'INDIA', image: haridwarImg, famous: true },
        { id: 'n15', name: 'Nainital', state: 'Uttarakhand', country: 'INDIA', image: nainitalImg, famous: true },
        { id: 'n16', name: 'Mussoorie', state: 'Uttarakhand', country: 'INDIA', image: mussoorieImg, famous: true },
        { id: 'n17', name: 'Jim Corbett', state: 'Uttarakhand', country: 'INDIA', image: jimCorbettImg, famous: true },
        // Delhi & Punjab
        { id: 'n18', name: 'New Delhi', state: 'Delhi', country: 'INDIA', image: newDelhiImg, famous: true },
        { id: 'n19', name: 'Amritsar', state: 'Punjab', country: 'INDIA', image: amritsarImg, famous: true },
        // Jammu & Kashmir / Ladakh
        { id: 'n20', name: 'Srinagar', state: 'J&K', country: 'INDIA', image: srinagarImg, famous: true },
        { id: 'n21', name: 'Gulmarg', state: 'J&K', country: 'INDIA', image: gulmargImg, famous: true },
        { id: 'n22', name: 'Leh Ladakh', state: 'Ladakh', country: 'INDIA', image: lehLadakhImg, famous: true },
        // East & Northeast
        { id: 'n23', name: 'Darjeeling', state: 'West Bengal', country: 'INDIA', image: darjeelingImg, famous: true },
        { id: 'n24', name: 'Kolkata', state: 'West Bengal', country: 'INDIA', image: kolkataImg, famous: true },
        { id: 'n25', name: 'Gangtok', state: 'Sikkim', country: 'INDIA', image: gangtokImg, famous: true },
        { id: 'n26', name: 'Shillong', state: 'Meghalaya', country: 'INDIA', image: shillongImg, famous: true },
        // Maharashtra & Gujarat
        { id: 'n27', name: 'Mumbai', state: 'Maharashtra', country: 'INDIA', image: mumbaiImg, famous: true },
        { id: 'n28', name: 'Lonavala', state: 'Maharashtra', country: 'INDIA', image: lonavalaImg, famous: true },
        { id: 'n29', name: 'Kutch', state: 'Gujarat', country: 'INDIA', image: kutchImg, famous: true },
        // Odisha
        { id: 'n30', name: 'Puri', state: 'Odisha', country: 'INDIA', image: puriImg, famous: true },
    ],
    international: [
        // UAE (5)
        { id: 'uae1', name: 'Dubai', state: 'Dubai', country: 'UAE', image: dubaiImg, famous: true },
        { id: 'uae2', name: 'Abu Dhabi', state: 'Abu Dhabi', country: 'UAE', image: abuDhabiImg, famous: true },
        { id: 'uae3', name: 'Sharjah', state: 'Sharjah', country: 'UAE', image: sharjahImg, famous: false },
        { id: 'uae4', name: 'Ras Al Khaimah', state: 'Ras Al Khaimah', country: 'UAE', image: rasAlKhaimahImg, famous: false },
        { id: 'uae5', name: 'Fujairah', state: 'Fujairah', country: 'UAE', image: fujairahImg, famous: false },

        // Thailand (5)
        { id: 'th1', name: 'Bangkok', state: '', country: 'Thailand', image: bangkokImg, famous: true },
        { id: 'th2', name: 'Phuket', state: '', country: 'Thailand', image: phuketImg, famous: true },
        { id: 'th3', name: 'Chiang Mai', state: '', country: 'Thailand', image: chiangMaiImg, famous: true },
        { id: 'th4', name: 'Krabi', state: '', country: 'Thailand', image: krabiImg, famous: true },
        { id: 'th5', name: 'Pattaya', state: '', country: 'Thailand', image: pattayaImg, famous: true },

        // Indonesia (5)
        { id: 'id1', name: 'Bali', state: '', country: 'Indonesia', image: baliImg, famous: true },
        { id: 'id2', name: 'Ubud', state: 'Bali', country: 'Indonesia', image: ubudImg, famous: true },
        { id: 'id3', name: 'Jakarta', state: '', country: 'Indonesia', image: jakartaImg, famous: false },
        { id: 'id4', name: 'Lombok', state: '', country: 'Indonesia', image: lombokImg, famous: true },
        { id: 'id5', name: 'Komodo Island', state: '', country: 'Indonesia', image: komodoIslandImg, famous: true },

        // Japan (5)
        { id: 'jp1', name: 'Tokyo', state: '', country: 'Japan', image: tokyoImg, famous: true },
        { id: 'jp2', name: 'Kyoto', state: '', country: 'Japan', image: kyotoImg, famous: true },
        { id: 'jp3', name: 'Osaka', state: '', country: 'Japan', image: osakaImg, famous: true },
        { id: 'jp4', name: 'Nara', state: '', country: 'Japan', image: naraImg, famous: true },
        { id: 'jp5', name: 'Hiroshima', state: '', country: 'Japan', image: hiroshimaImg, famous: true },

        // Vietnam (5)
        { id: 'vn1', name: 'Hanoi', state: '', country: 'Vietnam', image: hanoiImg, famous: true },
        { id: 'vn2', name: 'Ho Chi Minh City', state: '', country: 'Vietnam', image: hoChiMinhCityImg, famous: true },
        { id: 'vn3', name: 'Da Nang', state: '', country: 'Vietnam', image: daNangImg, famous: true },
        { id: 'vn4', name: 'Hoi An', state: '', country: 'Vietnam', image: hoiAnImg, famous: true },
        { id: 'vn5', name: 'Ha Long Bay', state: '', country: 'Vietnam', image: haLongBayImg, famous: true },

        // France (5)
        { id: 'fr1', name: 'Paris', state: '', country: 'France', image: parisImg, famous: true },
        { id: 'fr2', name: 'Nice', state: '', country: 'France', image: niceImg, famous: true },
        { id: 'fr3', name: 'Lyon', state: '', country: 'France', image: lyonImg, famous: true },
        { id: 'fr4', name: 'Bordeaux', state: '', country: 'France', image: bordeauxImg, famous: false },
        { id: 'fr5', name: 'Marseille', state: '', country: 'France', image: marseilleImg, famous: true },

        // UK (5)
        { id: 'uk1', name: 'London', state: '', country: 'UK', image: londonImg, famous: true },
        { id: 'uk2', name: 'Edinburgh', state: 'Scotland', country: 'UK', image: edinburghImg, famous: true },
        { id: 'uk3', name: 'Manchester', state: '', country: 'UK', image: manchesterImg, famous: true },
        { id: 'uk4', name: 'Liverpool', state: '', country: 'UK', image: liverpoolImg, famous: true },
        { id: 'uk5', name: 'Glasgow', state: '', country: 'UK', image: glasgowImg, famous: false },

        // Italy (5)
        { id: 'it1', name: 'Rome', state: '', country: 'Italy', image: romeImg, famous: true },
        { id: 'it2', name: 'Venice', state: '', country: 'Italy', image: veniceImg, famous: true },
        { id: 'it3', name: 'Florence', state: '', country: 'Italy', image: florenceImg, famous: true },
        { id: 'it4', name: 'Milan', state: '', country: 'Italy', image: milanImg, famous: true },
        { id: 'it5', name: 'Naples', state: '', country: 'Italy', image: naplesImg, famous: true },

        // USA (5)
        { id: 'us1', name: 'New York', state: 'NY', country: 'USA', image: newYorkImg, famous: true },
        { id: 'us2', name: 'Los Angeles', state: 'CA', country: 'USA', image: losAngelesImg, famous: true },
        { id: 'us3', name: 'Las Vegas', state: 'NV', country: 'USA', image: lasVegasImg, famous: true },
        { id: 'us4', name: 'San Francisco', state: 'CA', country: 'USA', image: sanFranciscoImg, famous: true },
        { id: 'us5', name: 'Miami', state: 'FL', country: 'USA', image: miamiImg, famous: true },

        // Australia (5)
        { id: 'au1', name: 'Sydney', state: '', country: 'Australia', image: sydneyImg, famous: true },
        { id: 'au2', name: 'Melbourne', state: '', country: 'Australia', image: melbourneImg, famous: true },
        { id: 'au3', name: 'Brisbane', state: '', country: 'Australia', image: brisbaneImg, famous: true },
        { id: 'au4', name: 'Gold Coast', state: '', country: 'Australia', image: goldCoastImg, famous: true },
        { id: 'au5', name: 'Perth', state: '', country: 'Australia', image: perthImg, famous: false },
    ]
};

// Region cards configuration for Domestic only
const domesticRegions = [
    {
        id: 'north-india',
        title: 'North India',
        description: 'Mountains, Heritage & Adventure',
        gradient: 'from-blue-500 to-indigo-600',
        icon: Mountain,
        count: allDestinations.northIndia.length,
        image: manaliImg
    },
    {
        id: 'south-india',
        title: 'South India',
        description: 'Beaches, Temples & Hill Stations',
        gradient: 'from-orange-500 to-amber-600',
        icon: Sun,
        count: allDestinations.southIndia.length,
        image: chennaiImg
    }
];

// Helper to get grouped international destinations
const getInternationalGroups = () => {
    const groups = {};
    allDestinations.international.forEach(dest => {
        if (!groups[dest.country]) {
            groups[dest.country] = [];
        }
        groups[dest.country].push(dest);
    });
    // Sort grouping keys by name
    return Object.keys(groups).sort().reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
    }, {});
};

// Get all destinations as flat array for search
const getAllDestinations = () => {
    return [
        ...allDestinations.southIndia,
        ...allDestinations.northIndia,
        ...allDestinations.international
    ];
};

export default function DestinationSelection() {
    const navigate = useNavigate();
    const { updateDestination } = useTrip();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [activeTab, setActiveTab] = useState('domestic'); // 'domestic' | 'international'
    const [selectedDomesticRegion, setSelectedDomesticRegion] = useState(null); // 'north-india' | 'south-india' | null
    const [selectedInternationalCountry, setSelectedInternationalCountry] = useState(null); // countryName | null
    const searchRef = useRef(null);

    const allPlaces = getAllDestinations();
    const internationalGroups = getInternationalGroups();

    // Filter Logic
    const filteredDestinations = allPlaces.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDestinationSelect = (dest) => {
        updateDestination({
            name: dest.name,
            state: dest.state,
            country: dest.country,
            image: dest.image
        });
        setShowSearchResults(false);
        navigate('/customize');
    };

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => {
                        if (selectedDomesticRegion) {
                            setSelectedDomesticRegion(null);
                        } else if (selectedInternationalCountry) {
                            setSelectedInternationalCountry(null);
                        } else {
                            navigate(-1);
                        }
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">
                        {selectedDomesticRegion || selectedInternationalCountry ? 'Back to Regions' : 'Back'}
                    </span>
                </button>

                {/* Header */}
                <div className="text-center mb-10 animate-fade-in">
                    <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">Step 01</span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-3">
                        Where do you want to travel?
                    </h1>
                    <p className="text-gray-600">Choose your next adventure</p>
                </div>

                {/* Search Bar */}
                <div ref={searchRef} className="max-w-2xl mx-auto mb-12 animate-slide-up relative z-50">
                    <div className="relative bg-white rounded-2xl shadow-lg border-2 border-gray-100 focus-within:border-primary-500 transition-colors">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearchResults(e.target.value.length > 0);
                            }}
                            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                            placeholder="Search any destination (e.g., Goa, Paris, Dubai)..."
                            className="w-full pl-14 pr-6 py-5 text-lg rounded-2xl focus:outline-none bg-transparent"
                        />
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-80 overflow-y-auto z-50">
                            {filteredDestinations.length > 0 ? (
                                <div className="p-2">
                                    {filteredDestinations.map((dest) => (
                                        <button
                                            key={dest.id}
                                            onClick={() => handleDestinationSelect(dest)}
                                            className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                        >
                                            <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{dest.name}</div>
                                                <div className="text-sm text-gray-500">{dest.state ? `${dest.state}, ` : ''}{dest.country}</div>
                                            </div>
                                            {dest.famous && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Popular</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    <p>No destinations found for "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Tabs (Domestic vs International) - Only show if no sub-region/country selected */}
                {!selectedDomesticRegion && !selectedInternationalCountry && (
                    <div className="flex justify-center gap-4 mb-12 animate-slide-up">
                        <button
                            onClick={() => setActiveTab('domestic')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all ${activeTab === 'domestic'
                                ? 'bg-primary-600 text-white shadow-xl scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-600 shadow-md'
                                }`}
                        >
                            <MapPin className="w-5 h-5" />
                            Domestic (India)
                        </button>
                        <button
                            onClick={() => setActiveTab('international')}
                            className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all ${activeTab === 'international'
                                ? 'bg-blue-600 text-white shadow-xl scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 shadow-md'
                                }`}
                        >
                            <Globe className="w-5 h-5" />
                            International
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="animate-fade-in-up">

                    {/* DOMESTIC VIEW */}
                    {activeTab === 'domestic' && (
                        <>
                            {/* Region Selection (North vs South) */}
                            {!selectedDomesticRegion && (
                                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                    {domesticRegions.map((region) => {
                                        const Icon = region.icon;
                                        return (
                                            <button
                                                key={region.id}
                                                onClick={() => setSelectedDomesticRegion(region.id)}
                                                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-80 text-left"
                                            >
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={region.image}
                                                        alt={region.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                    <div className={`absolute inset-0 bg-gradient-to-t ${region.gradient} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                                                </div>
                                                <div className="relative p-8 h-full flex flex-col justify-end text-white">
                                                    <div className="absolute top-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                                                        <Icon className="w-7 h-7" />
                                                    </div>
                                                    <h3 className="text-3xl font-bold mb-2">{region.title}</h3>
                                                    <p className="text-white/90 text-lg mb-4">{region.description}</p>
                                                    <div className="flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur w-fit px-4 py-2 rounded-full">
                                                        {region.count} Destinations
                                                        <ArrowRight className="w-4 h-4 ml-1" />
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Selected Domestic Region View */}
                            {selectedDomesticRegion && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        Exploing {selectedDomesticRegion === 'north-india' ? 'North India' : 'South India'}
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                            ({selectedDomesticRegion === 'north-india' ? allDestinations.northIndia.length : allDestinations.southIndia.length} places)
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {(selectedDomesticRegion === 'north-india' ? allDestinations.northIndia : allDestinations.southIndia).map((dest) => (
                                            <button
                                                key={dest.id}
                                                onClick={() => handleDestinationSelect(dest)}
                                                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left flex flex-col h-full"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    {dest.famous && (
                                                        <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                                            Popular
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{dest.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-4">{dest.state}</p>
                                                    <div className="mt-auto flex items-center text-primary-600 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                        Plan Trip <ArrowRight className="w-4 h-4 ml-1" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* INTERNATIONAL VIEW */}
                    {activeTab === 'international' && (
                        <div className="animate-fade-in">
                            {/* Country Cards Grid */}
                            {!selectedInternationalCountry && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Object.entries(internationalGroups).map(([country, destinations]) => (
                                        <button
                                            key={country}
                                            onClick={() => setSelectedInternationalCountry(country)}
                                            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-64 text-left"
                                        >
                                            {/* Use the first destination's image as the country cover */}
                                            <div className="absolute inset-0">
                                                <img
                                                    src={destinations[0].image}
                                                    alt={country}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                            </div>

                                            <div className="relative p-6 h-full flex flex-col justify-end text-white">
                                                <h3 className="text-2xl font-bold mb-1">{country}</h3>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                                        {destinations.length} destinations
                                                    </span>
                                                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                                        <ArrowRight className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Selected Country Destinations Grid */}
                            {selectedInternationalCountry && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        Exploring {selectedInternationalCountry}
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                            ({internationalGroups[selectedInternationalCountry].length} places)
                                        </span>
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {internationalGroups[selectedInternationalCountry].map((dest) => (
                                            <button
                                                key={dest.id}
                                                onClick={() => handleDestinationSelect(dest)}
                                                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left flex flex-col h-full hover:-translate-y-1"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={dest.image}
                                                        alt={dest.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{dest.name}</h3>
                                                    {dest.state && <p className="text-sm text-gray-500 mb-1">{dest.state}</p>}
                                                    <div className="mt-auto flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                        Explore <Plane className="w-4 h-4 ml-1" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


