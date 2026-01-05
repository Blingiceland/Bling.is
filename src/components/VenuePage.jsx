import React, { useEffect, useState } from 'react';
import { fetchBookings, saveBooking } from '../services/api';
import Calendar from './Calendar';
import BookingModal from './BookingModal';
import { format } from 'date-fns';
import { CONFIG } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const formatPolicy = (value) => {
    switch (value) {
        case 'venue_only': return 'Venue Bar Only';
        case 'byob': return 'BYOB Allowed';
        case 'corkage': return 'BYOB + Corkage Fee';
        default: return value;
    }
};

const VenuePage = ({ venueId: propVenueId, onBack, previewData }) => {
    const { id: paramVenueId, slug: paramSlug } = useParams();
    const venueIdentifier = propVenueId || paramVenueId || paramSlug;
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [venueData, setVenueData] = useState(null);
    const [actualVenueId, setActualVenueId] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Provisioning State
    const [provisioningLoading, setProvisioningLoading] = useState(false);

    // Helper to fetch bookings (Legacy Wrapper)
    const fetchData = (id) => {
        fetchBookings(id)
            .then(data => {
                setBookings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching bookings:", err);
                setError("Error: " + (err.message || JSON.stringify(err) || err.toString()));
                setLoading(false);
            });
    }

    // 1. Fetch Venue Configuration
    useEffect(() => {
        if (venueData && venueData === previewData) return; // duplicate check

        const loadVenue = async () => {
            setLoading(true);

            // 0. Preview Mode
            if (previewData) {
                setVenueData({
                    ...previewData,
                    sheetUrl: previewData.sheetUrl || 'mock-url'
                });
                setLoading(false);
                return;
            }

            // A. Firestore (SaaS Venues) - Try slug first, then ID
            try {
                if (venueIdentifier) {
                    // Try slug lookup first
                    const slugQuery = query(collection(db, "venues"), where("slug", "==", venueIdentifier));
                    const slugSnapshot = await getDocs(slugQuery);

                    if (!slugSnapshot.empty) {
                        const venueDoc = slugSnapshot.docs[0];
                        const data = venueDoc.data();
                        setVenueData(data);
                        setActualVenueId(venueDoc.id);
                        setLoading(false);
                        return;
                    }

                    // Fall back to ID lookup
                    const docRef = doc(db, "venues", venueIdentifier);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setVenueData(data);
                        setActualVenueId(venueIdentifier);
                        // If we have data, we are done
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error("Error checking Firestore:", err);
            }

            // B. Legacy/Demo (Fallback)
            if (CONFIG.venues[venueIdentifier]) {
                setVenueData({
                    name: venueIdentifier === 'dillon' ? 'Dillon Whiskey Bar' : 'Demo Venue',
                    ...CONFIG.venues[venueIdentifier]
                });
                fetchData(venueIdentifier);
                return;
            }

            // C. Not Found
            setError("Venue not found.");
            setLoading(false);
        };

        loadVenue();
    }, [venueIdentifier, previewData]);

    // Legacy date click handler - optional to keep or remove
    const handleDateClick = (date) => {
        console.log("Date clicked:", date);
    };

    const playDing = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Audio play failed", e));
    };

    // Legacy handleSaveBooking removed - BookingModal handles it now

    // --- Provisioning Repair Tools ---

    // Provisioning logic removed

    const handleDeleteVenue = async () => {
        if (!window.confirm("Are you sure you want to delete this venue? This cannot be undone.")) return;
        setProvisioningLoading(true);
        try {
            await deleteDoc(doc(db, "venues", actualVenueId || venueIdentifier));
            // Navigate to main landing or create venue, ensuring we don't trigger a "no venue -> logout" guard if one exists
            navigate('/create-venue');
        } catch (e) {
            console.error("Delete failed:", e);
            alert("Failed to delete venue. You may not have permission.");
            setProvisioningLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto font-sans">
            <header className="mb-8 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Market
                </button>
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    {venueData ? venueData.name : 'Loading...'}
                </h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#ffd700] hover:bg-[#ffd700]/90 text-black px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:scale-105 transition-all"
                    >
                        Book this Space
                    </button>
                </div>
            </header>

            <main>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Venue Header & Hero */}
                {venueData && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Top Info Card */}
                        <div className="glass-card p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-8 items-start">
                            {venueData.logoUrl && (
                                <img
                                    src={venueData.logoUrl}
                                    alt="Venue Logo"
                                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-2 border-[#ffd700]/20 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                                />
                            )}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">About the Venue</h2>
                                    <p className="text-gray-300 leading-relaxed text-lg">
                                        {venueData.description || "Welcome to our venue page."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                                    {venueData.city && <div className="flex items-center gap-2">📍 <span className="text-white">{venueData.city}</span></div>}
                                    {venueData.address && <div className="flex items-center gap-2">🏠 <span className="text-white">{venueData.address}</span></div>}
                                    {venueData.phoneNumber && <div className="flex items-center gap-2">📞 <span className="text-white">{venueData.phoneNumber}</span></div>}
                                    <div className="flex items-center gap-2">
                                        🏷️ <span className="capitalize text-[#ffd700]">{venueData.venueType} Venue</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Capacity & Logistics */}
                            <div className="glass-card p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                                    🎯 Capacity & Access
                                </h3>
                                <div className="space-y-3">
                                    <Row label="General Capacity" value={venueData.capacity} />
                                    <Row label="Seated Capacity" value={venueData.capacitySeated || venueData.privateCapacitySeated} />
                                    <Row label="Standing Capacity" value={venueData.capacityStanding || venueData.privateCapacityStanding} />
                                    <div className="h-px bg-white/10 my-3" />
                                    <Row label="Wheelchair Access" value={venueData.wheelchairAccess ? 'Yes' : 'No'} />
                                    <Row label="Parking" value={venueData.parkingInfo} />
                                    <Row label="Load-in Info" value={venueData.loadInInfo} />
                                </div>
                            </div>

                            {/* Stage & Tech (Public Venues) */}
                            {(venueData.venueType === 'public' || venueData.venueType === 'both') && (
                                <div className="glass-card p-6 rounded-xl border border-white/10">
                                    <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                                        🎸 Stage & Tech
                                    </h3>
                                    <div className="space-y-3">
                                        <Row label="Stage Dims" value={`${venueData.stageWidth || '?'}x${venueData.stageDepth || '?'}x${venueData.stageHeight || '?'}`} />
                                        <Row label="PA System" value={venueData.paDescription} />
                                        <Row label="Mixing Console" value={venueData.mixingConsole} />
                                        <Row label="Lighting" value={venueData.lightingInfo} />
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <Badge label="Sound Eng." active={venueData.soundEngineer} />
                                            <Badge label="Backline" active={venueData.backlineAvailable} />
                                            <Badge label="Projector" active={venueData.projector} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Hospitality & Amenities */}
                            <div className="glass-card p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                                    🍹 Hospitality & Services
                                </h3>
                                <div className="space-y-3">
                                    <Row label="Alcohol Policy" value={formatPolicy(venueData.alcoholPolicy)} />
                                    <Row label="Food Policy" value={venueData.artistFoodPolicy} />
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <Badge label="Green Room" active={venueData.greenRoom} />
                                        <Badge label="Shower" active={venueData.shower} />
                                        <Badge label="WiFi" active={venueData.amenities?.wifi} />
                                        <Badge label="Kitchen" active={venueData.kitchenAccess} />
                                        <Badge label="Catering" active={venueData.inHouseCatering} />
                                    </div>
                                </div>
                            </div>

                            {/* Staff & Support */}
                            <div className="glass-card p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-[#ffd700] mb-4 flex items-center gap-2">
                                    👥 Staff & Support
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Badge label="Door Staff" active={venueData.doorStaff} />
                                    <Badge label="Security" active={venueData.securityAvailable} />
                                    <Badge label="Coordinator" active={venueData.eventCoordinator} />
                                    <Badge label="Cleaning" active={venueData.cleaningIncluded} />
                                </div>
                                {venueData.anythingElse && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Additional Notes</p>
                                        <p className="text-sm text-gray-300">{venueData.anythingElse}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* Provisioning Block Removed */}

                {error && (
                    <div className="text-red-400 text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20 my-4">
                        <strong>Warning:</strong> {error}
                    </div>
                )}

                {!loading && (venueData?.sheetUrl || CONFIG.venues[venueIdentifier]) && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Availability Calendar</h2>
                        <Calendar bookings={bookings} onDateClick={handleDateClick} />
                    </div>
                )}
            </main>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                venueId={actualVenueId || venueIdentifier}
                venueName={venueData?.name}
                ownerId={venueData?.ownerId}
            />
        </div>
    );
};

// Helper Components
const Row = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start text-sm">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="text-gray-200 text-right max-w-[60%]">{value}</span>
        </div>
    );
};

const Badge = ({ label, active }) => (
    <div className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border ${active
        ? 'bg-green-500/10 border-green-500/20 text-green-400'
        : 'bg-white/5 border-white/5 text-gray-600'
        }`}>
        {active ? '✓' : 'x'} {label}
    </div>
);

export default VenuePage;
