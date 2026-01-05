import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc, where, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, Trash2, ExternalLink, Users, Repeat, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';
import { useLanguage } from "../context/LanguageContext";

const ADMIN_EMAILS = ['admin@bling.is', 'jonbs@bling.is', 'jon@bling.is'];

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const { language } = useLanguage();
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState('venues'); // 'venues' | 'users'
    const [venues, setVenues] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
    const [searchTerm, setSearchTerm] = useState('');

    const text = {
        en: {
            title: "Admin Dashboard",
            subtitle: "Master Control",
            venuesTab: "Venues",
            usersTab: "Users",
            transfer: "Transfer Ownership",
            transferPrompt: "Enter the email of the new owner:",
            transferSuccess: "Venue transferred successfully to",
            userDeleted: "User profile deleted",
            confirmDeleteUser: "Are you sure you want to delete this user profile? This does not remove them from auth, only the database."
        },
        is: {
            title: "Stjórnborð",
            subtitle: "Yfirlitskerfi",
            venuesTab: "Staðir",
            usersTab: "Notendur",
            transfer: "Færa Eignarhald",
            transferPrompt: "Sláðu inn netfang nýja eigandans:",
            transferSuccess: "Staður færður á",
            userDeleted: "Notanda eytt",
            confirmDeleteUser: "Ertu viss um að þú viljir eyða þessum notanda? Þetta eyðir honum ekki úr innskráningarkerfinu, bara gagnagrunninum."
        }
    };

    const content = text[language] || text.is;

    // Fetch Data
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
            toast.error("Error fetching venues");
        }
    };

    const fetchAllUsers = async () => {
        try {
            // Removing orderBy temporarily to debug "No users found" (likely missing index)
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            const userList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error fetching users: " + error.message);
        }
    };

    const refreshData = async () => {
        setLoading(true);
        await Promise.all([fetchAllVenues(), fetchAllUsers()]);
        setLoading(false);
    };

    useEffect(() => {
        if (currentUser && !ADMIN_EMAILS.includes(currentUser.email)) {
            toast.error("Access Denied");
            navigate('/dashboard');
            return;
        }
        if (currentUser) {
            refreshData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, navigate]);

    // --- ACTIONS ---

    const handleStatusUpdate = async (venueId, newStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) return;
        try {
            await updateDoc(doc(db, "venues", venueId), {
                status: newStatus,
                updatedAt: new Date()
            });
            await fetchAllVenues();
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDeleteVenue = (venueId) => {
        console.log("Delete venue clicked:", venueId);
        toast("Are you sure? This cannot be undone.", {
            action: {
                label: 'Delete',
                onClick: async () => {
                    console.log("Confirmed delete for venue:", venueId);
                    try {
                        await deleteDoc(doc(db, "venues", venueId));
                        setVenues(prev => prev.filter(v => v.id !== venueId));
                        toast.success("Venue deleted");
                    } catch (error) {
                        console.error("Delete venue error:", error);
                        toast.error("Failed to delete venue: " + error.message);
                    }
                }
            },
            cancel: {
                label: 'Cancel'
            },
            duration: 5000,
        });
    };

    const handleDeleteUser = (userId) => {
        console.log("Delete user clicked:", userId);
        toast("Delete this user? This cannot be undone.", {
            action: {
                label: 'Delete',
                onClick: async () => {
                    console.log("Confirmed delete for user:", userId);
                    try {
                        await deleteDoc(doc(db, "users", userId));
                        setUsers(prev => prev.filter(u => u.id !== userId));
                        toast.success("User deleted");
                    } catch (error) {
                        console.error("Delete user error:", error);
                        toast.error("Failed to delete user: " + error.message);
                    }
                }
            },
            cancel: {
                label: 'Cancel'
            },
            duration: 5000,
        });
    };

    const handleTransferVenue = async (venue) => {
        const newOwnerEmail = window.prompt(content.transferPrompt);
        if (!newOwnerEmail) return;

        // 1. Find the new user by email
        // Note: This matches exact email string.
        const targetUser = users.find(u => u.email.toLowerCase() === newOwnerEmail.toLowerCase());

        if (!targetUser) {
            toast.error("User not found in database! They must sign up first.");
            return;
        }

        try {
            const oldOwnerId = venue.ownerId;

            // 2. Update Venue Document
            await updateDoc(doc(db, "venues", venue.id), {
                ownerId: targetUser.id,
                updatedAt: new Date()
            });

            // 3. Remove from Old Owner's managedVenues (if exists)
            if (oldOwnerId) {
                const oldOwnerRef = doc(db, "users", oldOwnerId);
                // We check if the doc exists just in case
                const oldOwnerSnap = await getDoc(oldOwnerRef);
                if (oldOwnerSnap.exists()) {
                    await updateDoc(oldOwnerRef, {
                        managedVenues: arrayRemove(venue.id)
                    });
                }
            }

            // 4. Add to New Owner's managedVenues
            await updateDoc(doc(db, "users", targetUser.id), {
                managedVenues: arrayUnion(venue.id)
            });

            await fetchAllVenues();
            toast.success(`${content.transferSuccess} ${targetUser.email}`);

        } catch (error) {
            console.error("Transfer failed:", error);
            toast.error("Transfer failed: " + error.message);
        }
    };

    // --- RENDER HELPERS ---

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto">
                <Skeleton className="h-12 w-full mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    const filteredVenues = venues.filter(v => {
        if (filter !== 'all' && v.status !== filter) return false;
        if (searchTerm && !v.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const filteredUsers = users.filter(u => {
        if (!searchTerm) return true;
        return u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-2xl bg-[#ffd700]/10 border border-[#ffd700]/30 shadow-[0_0_50px_rgba(255,215,0,0.1)] gap-4">
                <div className="flex items-center gap-4">
                    <Shield className="w-10 h-10 text-[#ffd700]" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{content.title}</h1>
                        <p className="text-[#ffd700]/80">{content.subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('venues')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'venues' ? 'bg-[#ffd700] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {content.venuesTab}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-[#ffd700] text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {content.usersTab}
                    </button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={activeTab === 'venues' ? "Search venues..." : "Search users..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ffd700]/50"
                    />
                </div>

                {activeTab === 'venues' && (
                    <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        {['all', 'pending', 'approved', 'rejected'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* CONTENT: VENUES */}
            {activeTab === 'venues' && (
                <div className="grid gap-4 animate-fade-in">
                    {filteredVenues.map(venue => (
                        <div key={venue.id} className="glass-card p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 items-center justify-between group hover:bg-white/5 transition-colors">
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
                                <div className="text-sm text-gray-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                                    <span>{venue.city}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span className="capitalize">{venue.venueType}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span title={venue.ownerId}>Owner: ...{venue.ownerId?.slice(-5)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* TRANSFER BUTTON */}
                                <button
                                    onClick={() => handleTransferVenue(venue)}
                                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                    title={content.transfer}
                                >
                                    <Repeat className="w-5 h-5" />
                                </button>

                                <div className="w-px h-8 bg-white/10 mx-2"></div>

                                {/* STATUS BUTTONS */}
                                {venue.status !== 'approved' && (
                                    <button
                                        onClick={() => handleStatusUpdate(venue.id, 'approved')}
                                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"
                                        title="Approve"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate(`/v/${venue.id}`)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                                    title="View"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </button>

                                <button
                                    onClick={() => navigate(`/edit-venue/${venue.id}`)}
                                    className="p-2 text-gray-400 hover:text-[#ffd700] hover:bg-white/10 rounded-lg"
                                    title="Edit"
                                >
                                    <span className="text-sm font-bold">Edit</span>
                                </button>

                                <button
                                    onClick={() => handleDeleteVenue(venue.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredVenues.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No venues found.</div>
                    )}
                </div>
            )}

            {/* CONTENT: USERS */}
            {activeTab === 'users' && (
                <div className="grid gap-4 animate-fade-in">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between group hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gra-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">{user.email}</div>
                                    <div className="text-xs text-gray-500 font-mono">{user.id}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 capitalize">
                                    {user.role}
                                </span>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete User"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No users found.</div>
                    )}
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
