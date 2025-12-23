import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { MapPin, Music, Star } from 'lucide-react';

export function FeaturedVenues() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                // Query for APPROVED venues only
                // REMOVED orderBy("createdAt", "desc") to avoid Index Error
                const q = query(
                    collection(db, "venues"),
                    where("status", "==", "approved"),
                    limit(20)
                );

                const querySnapshot = await getDocs(q);
                const venueList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Client-side sort to avoid requiring a composite index right now
                venueList.sort((a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA; // Descending
                });

                setVenues(venueList);
            } catch (error) {
                console.error("Error fetching featured venues:", error);
                // Fallback (e.g. if index is missing, just try fetching approved)
                try {
                    const qFallback = query(
                        collection(db, "venues"),
                        where("status", "==", "approved"),
                        limit(6)
                    );
                    const fallbackSnap = await getDocs(qFallback);
                    const fallbackList = fallbackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setVenues(fallbackList);
                } catch (e) {
                    console.error("Fallback failed", e);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    if (loading) return (
        <section className="py-24 px-6 relative bg-black/50 text-center">
            <h2 className="text-2xl text-white animate-pulse">Loading Spaces...</h2>
        </section>
    );

    if (venues.length === 0) return (
        <section className="py-24 px-6 relative bg-black/50 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Spaces</h2>
            <p className="text-gray-400">No approved venues found yet. Go to Admin Dashboard to approve some!</p>
        </section>
    );

    return (
        <section className="py-24 px-6 relative bg-black/50">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#ffd700]/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">
                        Featured Spaces
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Discover Iceland's top venues ready for your next event.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {venues.map(venue => (
                        <div
                            key={venue.id}
                            onClick={() => navigate(`/v/${venue.id}`)}
                            className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#ffd700]/50 transition-all duration-500 shadow-2xl"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <img
                                    src={venue.logoUrl || "/api/placeholder/400/320"}
                                    alt={venue.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${venue.venueType === 'private' ? 'bg-purple-500/80 text-white' : 'bg-[#ffd700] text-black'
                                            }`}>
                                            {venue.venueType === 'both' ? 'Public & Private' : venue.venueType}
                                        </span>
                                        {venue.region && (
                                            <span className="flex items-center gap-1 text-xs font-medium text-gray-300 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                                                <MapPin className="w-3 h-3" /> {venue.city || 'Iceland'}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#ffd700] transition-colors">
                                        {venue.name}
                                    </h3>

                                    <p className="text-gray-300 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {venue.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-white/20 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-300">
                                            <Music className="w-4 h-4 text-[#ffd700]" />
                                            <span>{venue.capacity || venue.capacityStanding || '50+'} Capacity</span>
                                        </div>
                                        <span className="text-[#ffd700] font-bold text-sm">View Venue →</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all font-medium uppercase tracking-widest text-sm">
                        View All Venues
                    </button>
                </div>
            </div>
        </section>
    );
}

export default FeaturedVenues;
