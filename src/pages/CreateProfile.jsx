import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, setDoc, doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { Mic2, Users, Music, Link as LinkIcon, Instagram, Calendar, User, ArrowRight } from 'lucide-react';
import Button from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

const CreateProfile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [role, setRole] = useState(null); // 'artist' | 'promoter'
    const [formData, setFormData] = useState({
        name: '',
        location: 'Reykjavík',
        bio: '',

        // Artist Specific
        genre: '',
        spotifyUrl: '',
        instagramUrl: '',
        techRider: '', // Detailed text for now

        // Promoter Specific
        dob: '',
        pastGigs: [''], // Array of strings
    });

    const updateForm = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePastGigChange = (index, value) => {
        const newGigs = [...formData.pastGigs];
        newGigs[index] = value;
        setFormData(prev => ({ ...prev, pastGigs: newGigs }));
    };

    const addGigField = () => {
        setFormData(prev => ({ ...prev, pastGigs: [...prev.pastGigs, ''] }));
    };

    const handleSubmit = async () => {
        if (!currentUser) return;
        setLoading(true);

        try {
            // 1. Create Profile Document
            const profileData = {
                uid: currentUser.uid,
                type: role,
                name: formData.name,
                location: formData.location,
                bio: formData.bio,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),

                // Conditionally add fields based on role
                ...(role === 'artist' ? {
                    genre: formData.genre,
                    spotifyUrl: formData.spotifyUrl,
                    instagramUrl: formData.instagramUrl,
                    techRider: formData.techRider,
                } : {
                    dateOfBirth: formData.dob,
                    pastGigs: formData.pastGigs.filter(g => g.trim() !== ''), // Remove empty strings
                })
            };

            const docRef = await addDoc(collection(db, "profiles"), profileData);

            // 2. Link to User Account
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                managedProfiles: arrayUnion(docRef.id)
            });

            // 3. Success
            // 3. Success
            toast.success("Profile created successfully!");
            navigate('/dashboard');

        } catch (error) {
            console.error("Error creating profile:", error);
            toast.error("Failed to create profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Styling for consistent dark inputs
    const inputClass = "bg-[#111] border-white/10 text-white placeholder:text-gray-500 focus:border-[#ffd700]/50";
    const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            {step === 1 && (
                <div className="animate-fade-in text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#ffd700] to-[#ffd700] mb-6">
                        What is your role?
                    </h1>
                    <p className="text-gray-400 mb-12 text-lg">
                        Create a profile to identify yourself when booking venues.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Artist Option */}
                        <button
                            onClick={() => { setRole('artist'); setStep(2); }}
                            className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffd700]/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/0 to-[#ffd700]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                                <Mic2 className="w-8 h-8 text-[#ffd700]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Artist / Band</h3>
                            <p className="text-gray-400 text-sm">
                                I perform music or entertainment. I need to handle tech specs and promote my brand.
                            </p>
                        </button>

                        {/* Promoter Option */}
                        <button
                            onClick={() => { setRole('promoter'); setStep(2); }}
                            className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffd700]/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/0 to-[#ffd700]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                                <Users className="w-8 h-8 text-[#ffd700]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Promoter</h3>
                            <p className="text-gray-400 text-sm">
                                I organize events and book acts. I need to build trust and show my track record.
                            </p>
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="animate-fade-in max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {role === 'artist' ? 'Artist Details' : 'Promoter Profile'}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {role === 'artist' ? 'Showcase your talent to venues.' : 'Build trust with your experience.'}
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>{role === 'artist' ? "Artist / Band Name" : "Organization / Name"}</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => updateForm('name', e.target.value)}
                                placeholder={role === 'artist' ? "e.g. The Night Owls" : "e.g. Jon Smith Productions"}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Home Base</label>
                                <Input
                                    value={formData.location}
                                    onChange={(e) => updateForm('location', e.target.value)}
                                    placeholder="Reykjavík"
                                    className={inputClass}
                                />
                            </div>
                            {role === 'promoter' && (
                                <div className="space-y-2">
                                    <label className={labelClass}>Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => updateForm('dob', e.target.value)}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ffd700]/50 transition-colors"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Bio / Description</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => updateForm('bio', e.target.value)}
                                className="w-full h-32 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffd700]/50 transition-colors resize-none placeholder:text-gray-500"
                                placeholder={role === 'artist' ? "Describe your sound and style..." : "Describe your experience and what kind of events you organize..."}
                            />
                        </div>

                        {/* Artist Specific Fields */}
                        {role === 'artist' && (
                            <>
                                <div>
                                    <label className={labelClass}>Genre</label>
                                    <Input
                                        value={formData.genre}
                                        onChange={(e) => updateForm('genre', e.target.value)}
                                        placeholder="e.g. Indie Rock, Jazz, Techno"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Spotify / SoundCloud URL</label>
                                        <Input
                                            value={formData.spotifyUrl}
                                            onChange={(e) => updateForm('spotifyUrl', e.target.value)}
                                            placeholder="https://..."
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Instagram URL</label>
                                        <Input
                                            value={formData.instagramUrl}
                                            onChange={(e) => updateForm('instagramUrl', e.target.value)}
                                            placeholder="https://instagram.com/..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Tech Rider (Summary)</label>
                                    <p className="text-xs text-gray-500 mb-2">Briefly list your technical needs (e.g. "4 Vocal Mics, Drum Kit provided"). You can upload a full PDF later.</p>
                                    <textarea
                                        value={formData.techRider}
                                        onChange={(e) => updateForm('techRider', e.target.value)}
                                        className="w-full h-24 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ffd700]/50 transition-colors placeholder:text-gray-500"
                                        placeholder="We need 3 DI boxes and a bass amp..."
                                    />
                                </div>
                            </>
                        )}

                        {/* Promoter Specific Fields */}
                        {role === 'promoter' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-[#ffd700]">Past Events / Portfolio</label>
                                    <button onClick={addGigField} className="text-xs text-white hover:underline">+ Add Event</button>
                                </div>
                                {formData.pastGigs.map((gig, index) => (
                                    <div key={index} className="flex gap-2">
                                        <span className="pt-3 text-gray-500 text-xs">{index + 1}.</span>
                                        <Input
                                            value={gig}
                                            onChange={(e) => handlePastGigChange(index, e.target.value)}
                                            placeholder="e.g. 'Summer Bash at Prikið, June 2024'"
                                            className={`${inputClass} flex-1`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-8 flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-3 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating...' : 'Create Profile'}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateProfile;
