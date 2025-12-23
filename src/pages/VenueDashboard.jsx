import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Plus, MapPin, Calendar, Settings, Check, X, Clock, Send, Link as LinkIcon } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

const VenueDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [venues, setVenues] = useState([]);
    const [requests, setRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]); // New state for booker view
    const [loading, setLoading] = useState(true);
    const [expandedReq, setExpandedReq] = useState(null); // Track which request is open

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!currentUser) return;

            try {
                // 1. Fetch Venues
                const venuesQuery = query(
                    collection(db, "venues"),
                    where("ownerId", "==", currentUser.uid)
                );
                const venuesSnap = await getDocs(venuesQuery);
                const venuesData = venuesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 2. Fetch Profiles (Artists/Promoters)
                const profilesQuery = query(
                    collection(db, "profiles"),
                    where("uid", "==", currentUser.uid)
                );
                const profilesSnap = await getDocs(profilesQuery);
                const profilesData = profilesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 3. Fetch ALL Incoming Requests (AS OWNER) - both pending and approved
                const requestsQuery = query(
                    collection(db, "bookings"),
                    where("ownerId", "==", currentUser.uid)
                );
                const requestsSnap = await getDocs(requestsQuery);
                const requestsData = requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // 4. Fetch Sent Requests (AS BOOKER)
                const sentQuery = query(
                    collection(db, "bookings"),
                    where("bookerId", "==", currentUser.uid)
                );
                const sentSnap = await getDocs(sentQuery);
                const sentData = sentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort client-side
                const sortByDate = (a, b) => {
                    const dateA = a.createdAt?.seconds || 0;
                    const dateB = b.createdAt?.seconds || 0;
                    return dateB - dateA;
                };

                venuesData.sort(sortByDate);
                profilesData.sort(sortByDate);
                requestsData.sort(sortByDate);
                sentData.sort(sortByDate);

                setVenues(venuesData);
                setProfiles(profilesData);
                setRequests(requestsData);
                setSentRequests(sentData);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const handleCopyLink = (venueId) => {
        const url = `${window.location.origin}/v/${venueId}`;
        navigator.clipboard.writeText(url);
        toast.success("Public link copied to clipboard");
    };

    const handleRequestAction = async (requestId, newStatus) => {
        try {
            await updateDoc(doc(db, "bookings", requestId), {
                status: newStatus
            });
            setRequests(prev => prev.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            ));
            toast.success(`Request ${newStatus}`);
        } catch (error) {
            console.error("Error updating booking:", error);
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/5 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Filter Logic
    const pendingRequests = requests.filter(r => r.status === 'pending');
    // For approved, let's sort by Event Date (soonest first) rather than created date
    const approvedRequests = requests
        .filter(r => r.status === 'approved')
        .sort((a, b) => (a.date?.seconds || 0) - (b.date?.seconds || 0));

    // ----------------------------------------------------------------------
    // 1. THE SWITCHBOARD (Empty State)
    // ----------------------------------------------------------------------
    if (venues.length === 0 && profiles.length === 0) {
        return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center max-w-5xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ffd700] to-[#ffd700] mb-6">
                        Welcome to Bling
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        How would you like to use the platform today?
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-slide-up">
                    <button onClick={() => navigate('/create-profile')} className="group relative p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 text-left">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/0 to-[#ffd700]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="w-16 h-16 rounded-2xl bg-[#ffd700]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><span className="text-4xl">🎤</span></div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#ffd700] transition-colors">Find a Stage</h3>
                        <p className="text-gray-400">Create an Artist or Promoter profile to book gigs and manage specific events.</p>
                    </button>
                    <button onClick={() => navigate('/create-venue')} className="group relative p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 text-left">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/0 to-[#ffd700]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        <div className="w-16 h-16 rounded-2xl bg-[#ffd700]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><span className="text-4xl">✨</span></div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#ffd700] transition-colors">List Your Space</h3>
                        <p className="text-gray-400">Register your venue to receive booking requests for concerts and private events.</p>
                    </button>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // 2. THE DASHBOARD
    // ----------------------------------------------------------------------
    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
                    <p className="text-gray-400">Manage your profiles, venues, and bookings.</p>
                </div>
                <div className="flex gap-3">
                    {profiles.length > 0 && (
                        <button onClick={() => navigate('/create-venue')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                            <Plus className="w-4 h-4" /> Space
                        </button>
                    )}
                    {venues.length > 0 && (
                        <button onClick={() => navigate('/create-profile')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                            <Plus className="w-4 h-4" /> Profile
                        </button>
                    )}
                </div>
            </div>

            {/* UPCOMING BOOKINGS (Approved) */}
            {venues.length > 0 && approvedRequests.length > 0 && (
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Upcoming Bookings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedRequests.map((req) => (
                            <div key={req.id} className="glass-card p-6 rounded-2xl border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{req.bookerName || 'Guest'}</h3>
                                        <div className="text-green-400 text-sm font-bold flex items-center gap-1">
                                            {req.date?.seconds ? new Date(req.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                                            <span className="text-xs font-normal text-gray-400">• {req.slot === 'day' ? '☀️ Day' : '🌙 Night'}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{req.venueName}</div>
                                    </div>
                                    <div className="bg-green-500/20 px-3 py-1 rounded-full text-xs font-bold text-green-400 uppercase tracking-wider">
                                        Confirmed
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setExpandedReq(expandedReq === req.id ? null : req.id)}
                                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        {expandedReq === req.id ? 'Hide Details' : 'View Rider / Info'}
                                    </button>
                                </div>

                                {expandedReq === req.id && (
                                    <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in text-sm space-y-4">
                                        {/* Contact Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block text-gray-500 text-xs uppercase">Email</span>
                                                <a href={`mailto:${req.bookerEmail}`} className="text-[#ffd700] hover:underline">{req.bookerEmail}</a>
                                            </div>
                                            <div>
                                                <span className="block text-gray-500 text-xs uppercase">Phone</span>
                                                <span className="text-white">{req.bookerPhone || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Gig Details Snippet */}
                                        {req.eventType === 'live_gig' && (
                                            <div className="bg-black/20 p-3 rounded-lg">
                                                <span className="block text-gray-500 text-xs uppercase mb-1">Act</span>
                                                <span className="text-white">{req.lineup?.[0]?.name || 'Unknown Artist'}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* INCOMING REQUESTS (Pending) */}
            {venues.length > 0 && (
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#ffd700]" />
                        Incoming Requests
                    </h2>
                    {pendingRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingRequests.map((req) => (
                                <div key={req.id} className="glass-card p-6 rounded-2xl border border-[#ffd700]/30 bg-[#ffd700]/5 hover:bg-[#ffd700]/10 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{req.bookerName || 'Guest'}</h3>
                                            <div className="text-[#ffd700] text-sm font-medium">For: {req.venueName}</div>
                                        </div>
                                        <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-gray-300">
                                            {req.date?.seconds ? new Date(req.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 italic">"{req.message}"</p>

                                    <div className="flex gap-2">
                                        <button onClick={() => setExpandedReq(expandedReq === req.id ? null : req.id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${expandedReq === req.id ? 'bg-[#ffd700] text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                                            {expandedReq === req.id ? 'Hide Details' : 'Details'}
                                        </button>
                                        <button onClick={() => handleRequestAction(req.id, 'declined')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20" title="Decline"><X className="w-5 h-5" /></button>
                                        <button onClick={() => handleRequestAction(req.id, 'approved')} className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors border border-green-500/20" title="Approve"><Check className="w-5 h-5" /></button>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedReq === req.id && (
                                        <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in text-sm space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><span className="block text-gray-500 text-xs uppercase">Email</span><a href={`mailto:${req.bookerEmail}`} className="text-[#ffd700] hover:underline">{req.bookerEmail}</a></div>
                                                <div><span className="block text-gray-500 text-xs uppercase">Phone</span><span className="text-white">{req.bookerPhone || 'N/A'}</span></div>
                                            </div>

                                            {req.eventType === 'live_gig' && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4 bg-black/20 p-3 rounded-lg">
                                                        <div><span className="block text-gray-500 text-xs">Role</span><span className="text-white capitalize">{req.applicantRole}</span></div>
                                                        <div><span className="block text-gray-500 text-xs">Tickets</span><span className="text-white capitalize">{req.ticketSales === 'yes' ? 'Selling' : (req.ticketSales === 'no' ? 'Free' : 'Undecided')}</span></div>
                                                        <div><span className="block text-gray-500 text-xs">Sound</span><span className="text-white capitalize">{req.soundEngineer === 'venue' ? 'Need Engineer' : 'Bringing Own'}</span></div>
                                                    </div>
                                                    {req.lineup && req.lineup.length > 0 && (
                                                        <div>
                                                            <span className="block text-gray-500 text-xs uppercase mb-2">Lineup</span>
                                                            <div className="space-y-2">
                                                                {req.lineup.map((act, idx) => (
                                                                    <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                                                        <span className={idx === 0 ? "font-bold text-[#ffd700]" : "text-gray-300"}>{act.name}</span>
                                                                        <div className="flex gap-2 text-xs">
                                                                            {act.socialLink && <a href={act.socialLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Social</a>}
                                                                            {act.streamingLink && <a href={act.streamingLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">Stream</a>}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {req.riderDetails && (
                                                        <div>
                                                            <span className="block text-gray-500 text-xs uppercase mb-1">Tech / Rider</span>
                                                            <div className="bg-black/30 p-3 rounded-lg text-gray-300 whitespace-pre-wrap font-mono text-xs">{req.riderDetails}</div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {req.eventType === 'private_event' && (
                                                <div className="bg-black/20 p-3 rounded-lg flex justify-between">
                                                    <div><span className="block text-gray-500 text-xs">Organization</span><span className="text-white">{req.organization || 'Private'}</span></div>
                                                    <div><span className="block text-gray-500 text-xs">Guests</span><span className="text-white">{req.expectedGuests || 'Unknown'}</span></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4"><span className="text-2xl">💤</span></div>
                            <h3 className="text-lg font-bold text-white mb-2">No Incoming Requests</h3>
                            <p className="text-gray-400 max-w-sm mb-4">Share your venue profile to start getting bookings!</p>
                            {/* Show quick copy link for the first venue if available */}
                            {venues.length > 0 && (
                                <button
                                    onClick={() => handleCopyLink(venues[0].id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl transition-all shadow-lg shadow-[#ffd700]/20"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    Copy Link for {venues[0].name}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Sent Requests Section (As Booker/Guest) */}
            <div className="mb-12 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-400" />
                    My Sent Requests
                </h2>
                {sentRequests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sentRequests.map((req) => (
                            <div key={req.id} className="glass-card p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{req.venueName}</h3>
                                        <div className="text-blue-400 text-sm font-medium">Status: {req.status}</div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-gray-300">{req.date?.seconds ? new Date(req.date.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
                                </div>
                                <p className="text-gray-400 text-sm italic">"{req.message}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 text-center text-gray-400">
                        You haven't sent any booking requests yet.
                    </div>
                )}
            </div>

            {/* MY PORTFOLIO SECTION (Merged) */}
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-[#ffd700]" />
                    My Portfolio
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. Render Profiles */}
                    {profiles.map((profile) => (
                        <div key={profile.id} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-[#ffd700]/30 transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    {profile.type === 'artist' ? '🎸' : '👔'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{profile.name}</h3>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">{profile.type}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* 2. Render Venues */}
                    {venues.map((venue) => (
                        <div key={venue.id} className="glass-card hover:bg-[#ffd700]/5 p-6 rounded-2xl border border-white/10 hover:border-[#ffd700]/30 transition-all duration-300 group relative">
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${venue.status === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                    {venue.status || 'Pending'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-[#ffd700] transition-colors">{venue.name}</h3>
                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                    <MapPin className="w-3 h-3" /> {venue.city}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <button onClick={() => navigate(`/v/${venue.id}`)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
                                    View
                                </button>
                                <button
                                    onClick={() => handleCopyLink(venue.id)}
                                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                                    title="Copy Public Link"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => navigate(`/edit-venue/${venue.id}`)} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
                                    <Settings className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* 3. Add Actions */}
                    <button onClick={() => navigate('/create-venue')} className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/10 hover:border-[#ffd700]/50 hover:bg-white/5 transition-all min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-[#ffd700]/20 flex items-center justify-center mb-3 transition-colors">
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#ffd700]" />
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white">Add Venue</span>
                    </button>

                    <button onClick={() => navigate('/create-profile')} className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-purple-500/20 flex items-center justify-center mb-3 transition-colors">
                            <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white">Add Profile</span>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default VenueDashboard;
