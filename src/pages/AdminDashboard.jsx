import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, X, Trash2, ExternalLink, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';

const ADMIN_EMAILS = ['admin@bling.is', 'jonbs@bling.is', 'jonb.steinsson@gmail.com', 'jon@bling.is']; // Whitelist

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'

    const fetchAllVenues = async () => {
        try {
            const q = query(collection(db, "venues"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const venueList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVenues(venueList);
        } catch (error) {
            console.error("Error fetching venues:", error);
            toast.error("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Security Check
        if (currentUser && !ADMIN_EMAILS.includes(currentUser.email)) {
            toast.error("Access Denied. Admins only.");
            navigate('/dashboard');
            return;
        }

        if (currentUser) {
            fetchAllVenues();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, navigate]);

    const handleStatusUpdate = async (venueId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
            await updateDoc(doc(db, "venues", venueId), {
                status: newStatus,
                updatedAt: new Date()
            });
            // Force re-fetch to ensure data integrity
            await fetchAllVenues();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status: " + error.message);
        }
    };

    const handleDelete = async (venueId) => {
        if (!window.confirm("Are you sure you want to DELETE this venue? This cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "venues", venueId));
            setVenues(prev => prev.filter(v => v.id !== venueId));
            toast.success("Venue deleted");
        } catch (error) {
            console.error("Error deleting venue:", error);
            toast.error("Failed to delete venue");
        }
    };

    const filteredVenues = venues.filter(v => {
        if (filter === 'all') return true;
        return v.status === filter;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 p-6 rounded-2xl border border-white/5 bg-white/5">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 rounded-xl border border-white/5 bg-white/5 relative overflow-hidden">
                            <Skeleton className="h-full w-full opacity-50" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 p-6 rounded-2xl bg-[#ffd700]/10 border border-[#ffd700]/30 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#ffd700]" />
                        Admin Dashboard
                    </h1>
                    <p className="text-[#ffd700]/80">Master Control: Approve, Reject, or Edit Venues.</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                    {['all', 'pending', 'approved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-[#ffd700] text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4">
                {filteredVenues.map(venue => (
                    <div key={venue.id} className="glass-card p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:bg-white/5 transition-colors">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-white truncate">{venue.name}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${venue.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                    venue.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {venue.status || 'Pending'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400 flex items-center gap-4">
                                <span>{venue.city}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span className="capitalize">{venue.venueType}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span>Owner ID: ...{venue.ownerId?.slice(-5)}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => navigate(`/v/${venue.id}`)}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="View Live Page"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => navigate(`/edit-venue/${venue.id}`)}
                                className="p-2 text-gray-400 hover:text-[#ffd700] hover:bg-white/10 rounded-lg transition-colors"
                                title="Review Application (Edit)"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">Edit</span>
                                </div>
                            </button>

                            <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                            {/* Status Actions */}
                            {venue.status !== 'approved' && (
                                <button
                                    onClick={() => handleStatusUpdate(venue.id, 'approved')}
                                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                    title="Approve Venue"
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                            )}

                            {venue.status !== 'rejected' && (
                                <button
                                    onClick={() => handleStatusUpdate(venue.id, 'rejected')}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Reject Venue"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}

                            <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                            <div className="w-px h-8 bg-white/10 hidden md:block"></div>

                            <button
                                onClick={() => handleDelete(venue.id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Venue"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredVenues.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No venues found matching this filter.
                    </div>
                )}
            </div>

            {/* DANGER ZONE */}
            <div className="mt-24 mb-12 border-t border-red-900/30 pt-12">
                <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
                    <Trash2 className="w-6 h-6" />
                    Danger Zone
                </h2>
                <div className="glass-card p-6 rounded-xl border border-red-900/30 bg-red-900/5">
                    <p className="text-gray-400 mb-6">
                        These actions are destructive and cannot be undone. Use with extreme caution.
                    </p>
                    <button
                        onClick={async () => {
                            if (!window.confirm("DANGER: This will delete ALL venues, bookings, profiles, and user data. Are you sure?")) return;
                            const confirm = window.prompt("Type 'NUKE' to confirm catastrophic deletion:");
                            if (confirm !== 'NUKE') return;

                            setLoading(true);
                            try {
                                const collections = ['venues', 'bookings', 'profiles', 'users'];
                                for (const colName of collections) {
                                    const q = query(collection(db, colName));
                                    const snapshot = await getDocs(q);
                                    if (snapshot.size > 0) {
                                        const batch = [];
                                        snapshot.docs.forEach(doc => deleteDoc(doc.ref)); // Client-side loop for simplicity (or batch if needed)
                                        // Simple loop for now
                                        await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)));
                                    }
                                }
                                toast.success("Database purged. System reset.");
                                navigate('/');
                                window.location.reload();
                            } catch (error) {
                                console.error("Purge failed:", error);
                                toast.error("Purge failed: " + error.message);
                                setLoading(false);
                            }
                        }}
                        className="py-3 px-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        PURGE ALL DATA
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
