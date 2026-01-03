import React, { useEffect, useState } from 'react';
import { ICELAND_REGIONS, getRegionForCity, getCityCoordinates } from '../constants/locations';
import { VENUE_TYPES, getVenueTypeLabel } from '../constants/venueTypes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { MapPin, Mic2, Wine, Filter, Search, Check, Map as MapIcon, List } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const VenueCard = ({ venue }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/v/${venue.id}`)}
            className="group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#ffd700]/50 transition-all duration-300 shadow-2xl bg-white/5"
        >
            {/* Image Background */}
            <div className="absolute inset-0">
                <img
                    src={venue.logoUrl || "/api/placeholder/400/320"}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
            </div>

            {/* Badges (Top Left/Right) */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[85%]">
                {venue.venueSubTypes && venue.venueSubTypes.length > 0 ? (
                    venue.venueSubTypes.slice(0, 3).map((subType, index) => (
                        <span key={index} className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg border ${venue.venueType === 'private'
                            ? 'bg-purple-600/90 text-white border-white/10'
                            : 'bg-[#ffd700]/90 text-black border-[#ffd700]/10'
                            }`}>
                            {subType}
                        </span>
                    ))
                ) : (
                    venue.venueType === 'private' || venue.venueType === 'hall' ? (
                        <span className="bg-purple-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg border border-white/10">
                            Private Hall
                        </span>
                    ) : (
                        <span className="bg-[#ffd700]/90 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg border border-[#ffd700]/10">
                            {venue.venueType === 'bar' ? 'Bar / Pub' : 'Live Venue'}
                        </span>
                    )
                )}
            </div>

            <div className="absolute top-4 right-4 animate-fade-in">
                <div className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
                    <Check className="w-3 h-3 text-[#ffd700]" /> Verified
                </div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">

                    {/* Location Tag */}
                    {venue.city && (
                        <div className="mb-2">
                            <span className="flex w-fit items-center gap-1 text-[11px] font-medium text-gray-300 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5">
                                <MapPin className="w-3 h-3 text-gray-400" /> {venue.city}
                            </span>
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#ffd700] transition-colors truncate">
                        {venue.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 h-5">
                        {/* Placeholder for rating or genre in future */}
                        <span>Event Space & Production</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-200">
                            {venue.venueType !== 'private' ? (
                                <div className="flex items-center gap-1.5">
                                    <Mic2 className="w-4 h-4 text-[#ffd700]" />
                                    <span>{venue.capacityStanding || venue.capacity || 'N/A'} Cap</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <Wine className="w-4 h-4 text-purple-400" />
                                    <span>{venue.capacitySeated || venue.capacity || 'N/A'} Guests</span>
                                </div>
                            )}
                        </div>

                        <div className="text-right">
                            <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Starting from</span>
                            <span className="text-[#ffd700] font-bold text-sm">Request Quote</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterCheckbox = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked
            ? 'bg-[#ffd700] border-[#ffd700] text-black'
            : 'border-white/20 bg-white/5 group-hover:border-[#ffd700]/50'}`}>
            {checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
        </div>
        <span className={`text-sm ${checked ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>
            {label}
        </span>
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
);

const PublicVenuesPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
    // Filters State
    const [locations, setLocations] = useState(searchParams.get('location') ? [searchParams.get('location')] : []); // ['Reykjavik', 'Kopavogur']
    const [types, setTypes] = useState([]); // ['bar', 'club']
    const [minCapacity, setMinCapacity] = useState(0);
    const [amenities, setAmenities] = useState([]); // ['wifi', 'stage']

    // Sync with URL on Mount
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const q = query(collection(db, "venues"), where("status", "==", "approved"));
                const querySnapshot = await getDocs(q);
                const venueList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVenues(venueList);
            } catch (error) {
                console.error("Error fetching venues:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVenues();

        // Initial URL Params
        const locParam = searchParams.get('location');
        if (locParam) setLocations([locParam]);

        const typeParam = searchParams.get('type');
        if (typeParam) {
            setTypes(typeParam.split(','));
        }

    }, []); // Run once on mount

    // Update URL when filters change (Optional, but good UX)
    /* 
    const updateURL = () => {
        const params = new URLSearchParams();
        if (locations.length) params.set('location', locations.join(','));
        if (types.length) params.set('type', types.join(','));
        setSearchParams(params);
    }
    */

    // Filter Logic
    const filteredVenues = venues.filter(venue => {
        // Location Filter (Region based)
        if (locations.length > 0) {
            const venueRegion = getRegionForCity(venue.city);

            // Allow loose matching for legacy data (e.g. "REykjavik" vs "Reykjavík")
            const looseMatch = locations.some(loc => {
                // Check if location is a Region
                const regionObj = ICELAND_REGIONS.find(r => r.name === loc);
                if (regionObj) {
                    // Check if venue city matches any city in this region (case insensitive)
                    return regionObj.cities.some(c => c.toLowerCase() === venue.city?.toLowerCase());
                }
                // Fallback: Check direct city match
                return loc.toLowerCase() === venue.city?.toLowerCase();
            });

            if (!looseMatch) return false;
        }
        // Venue Type Filter
        if (types.length > 0) {
            const hasMatchingType = types.some(t => {
                // Check exact sub-type match
                if (venue.venueSubTypes?.includes(t)) return true;

                // Fallback for legacy data/broad categories
                if (t === 'Live Venue' || t === 'Nightclub' || t === 'Bar / Pub') {
                    return venue.venueType === 'public' || venue.venueType === 'both';
                }
                if (t === 'Banquet Hall' || t === 'Conference Hall') {
                    return venue.venueType === 'private' || venue.venueType === 'both';
                }
                return false;
            });
            if (!hasMatchingType) return false;
        }

        // Capacity
        const cap = parseInt(venue.capacityStanding || venue.capacity || venue.privateCapacityStanding || 0);
        if (cap < minCapacity) return false;

        return true;
    });

    const toggleFilter = (state, setter, value) => {
        if (state.includes(value)) {
            setter(state.filter(item => item !== value));
        } else {
            setter([...state, value]);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Header />

            <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Explore Venues</h1>
                        <p className="text-gray-400">
                            Found <span className="text-[#ffd700] font-bold">{filteredVenues.length}</span> spaces for your event.
                        </p>
                    </div>

                    {/* Mobile Filter Toggle (Future) */}
                    <div className="flex bg-white/10 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-[#ffd700] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" /> List
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-[#ffd700] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <MapIcon className="w-4 h-4" /> Map
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">

                        {/* Location (Regions) */}
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#ffd700]" /> Region
                            </h3>
                            <div className="space-y-2">
                                {ICELAND_REGIONS.map(region => (
                                    <FilterCheckbox
                                        key={region.name}
                                        label={region.name}
                                        checked={locations.includes(region.name)}
                                        onChange={() => toggleFilter(locations, setLocations, region.name)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Venue Type */}
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-[#ffd700]" /> Type
                            </h3>
                            <div className="space-y-2">
                                {VENUE_TYPES.map(type => (
                                    <FilterCheckbox
                                        key={type.id}
                                        label={getVenueTypeLabel(type.id, 'en')} // Start with EN, or use context if available
                                        checked={types.includes(type.id)}
                                        onChange={() => toggleFilter(types, setTypes, type.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Mic2 className="w-4 h-4 text-[#ffd700]" /> Min Capacity
                            </h3>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                step="50"
                                value={minCapacity}
                                onChange={(e) => setMinCapacity(Number(e.target.value))}
                                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>0</span>
                                <span className="text-[#ffd700] font-bold">{minCapacity}+ Guests</span>
                                <span>1000+</span>
                            </div>
                        </div>
                    </aside>

                    {/* Venue Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="h-[300px] bg-white/5 rounded-2xl border border-white/10" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {viewMode === 'map' ? (
                                    <div className="h-[600px] rounded-2xl overflow-hidden border border-white/10 relative z-0 animate-fade-in text-black">
                                        <MapContainer center={[64.9631, -19.0208]} zoom={6} className="h-full w-full">
                                            <TileLayer
                                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                            />
                                            {filteredVenues.map(venue => {
                                                const coords = getCityCoordinates(venue.city);
                                                // Simple jitter
                                                const lat = coords.lat + (Math.random() - 0.5) * 0.02;
                                                const lng = coords.lng + (Math.random() - 0.5) * 0.02;

                                                return (
                                                    <Marker position={[lat, lng]} key={venue.id}>
                                                        <Popup className="text-black">
                                                            <div className="p-1 min-w-[200px]">
                                                                <h3 className="font-bold text-sm mb-1">{venue.name}</h3>
                                                                <p className="text-xs text-gray-500 mb-2">{venue.city}</p>
                                                                <button
                                                                    onClick={() => navigate(`/v/${venue.id}`)}
                                                                    className="w-full bg-black text-white text-xs py-1 rounded hover:bg-gray-800"
                                                                >
                                                                    View Venue
                                                                </button>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                )
                                            })}
                                        </MapContainer>
                                    </div>
                                ) : (
                                    filteredVenues.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                                            {filteredVenues.map(venue => (
                                                <VenueCard key={venue.id} venue={venue} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                                            <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Search className="w-8 h-8 text-gray-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">No venues found</h3>
                                            <p className="text-gray-400 mb-6">Try adjusting your filters to find what you're looking for.</p>
                                            <button
                                                onClick={() => {
                                                    setLocations([]);
                                                    setTypes([]);
                                                    setMinCapacity(0);
                                                }}
                                                className="px-6 py-2 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-lg transition-colors"
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </div>

                </div>
            </main >

            <Footer />
        </div >
    );
};

export default PublicVenuesPage;
