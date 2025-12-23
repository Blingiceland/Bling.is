import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Send, User, Mail, Phone, Users, Music, Wine, Plus, Trash2, Link as LinkIcon, Sun, Moon, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Calendar from './Calendar'; // Import Custom Calendar
import { sendEmail } from '../services/email';

const BookingModal = ({ isOpen, onClose, venueId, venueName, ownerId }) => {
    const { currentUser } = useAuth();

    // Mode State: 'selection' | 'slot' | 'date' | 'form'
    // Flow: Selection -> Slot (Day/Night) -> Date (Calendar) -> Details (Gig/Private)
    const [step, setStep] = useState('selection');

    // --- Data State ---
    const [bookingType, setBookingType] = useState(''); // 'gig' | 'private'
    const [selectedSlot, setSelectedSlot] = useState(''); // 'day' | 'night'
    const [selectedDate, setSelectedDate] = useState(null);
    const [blockedDates, setBlockedDates] = useState([]);

    // --- Form State ---
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Private Event Specific ---
    const [expectedGuests, setExpectedGuests] = useState('');
    const [organization, setOrganization] = useState('');

    // --- Gig Specific ---
    const [applicantRole, setApplicantRole] = useState('artist');
    const [ticketSales, setTicketSales] = useState('yes');
    const [soundEngineer, setSoundEngineer] = useState('venue');
    const [riderDetails, setRiderDetails] = useState(''); // New State
    const [artists, setArtists] = useState([
        { name: '', socialLink: '', streamingLink: '' }
    ]);

    // Pre-fill
    useEffect(() => {
        if (currentUser) {
            setGuestName(currentUser.displayName || '');
            setGuestEmail(currentUser.email || '');
        }
    }, [currentUser]);

    // Fetch Availability when Slot/Venue changes
    useEffect(() => {
        if (isOpen && venueId && selectedSlot) {
            const fetchAvailability = async () => {
                try {
                    // Fetch ALL approved bookings for this venue
                    const q = query(
                        collection(db, "bookings"),
                        where("venueId", "==", venueId),
                        where("status", "==", "approved") // Only block Approved dates
                    );
                    const snap = await getDocs(q);
                    const bookings = snap.docs.map(doc => doc.data());

                    // Filter Blocked Dates based on Slot
                    const blocked = bookings
                        .filter(b => {
                            if (!b.date) return false;
                            // If I want 'day', block 'day' and 'full_day'
                            // If I want 'night', block 'night' and 'full_day'
                            if (b.slot === 'full_day') return true;
                            if (b.slot === selectedSlot) return true;
                            return false;
                        })
                        .map(b => b.date.toDate()); // Convert Timestamp to Date

                    setBlockedDates(blocked);
                } catch (err) {
                    console.error("Error fetching availability:", err);
                }
            };
            fetchAvailability();
        }
    }, [isOpen, venueId, selectedSlot]);

    // Reset when opening
    useEffect(() => {
        if (!isOpen) {
            setStep('selection');
            setSelectedDate(null);
            setSelectedSlot('');
            setMessage('');
            setArtists([{ name: '', socialLink: '', streamingLink: '' }]);
            setRiderDetails('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- Handlers ---

    const handleTypeSelect = (type) => {
        setBookingType(type);
        setStep('slot');
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setStep('date');
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setStep('form');
    };

    const addArtist = () => setArtists([...artists, { name: '', socialLink: '', streamingLink: '' }]);
    const removeArtist = (index) => setArtists(artists.filter((_, i) => i !== index));
    const updateArtist = (index, field, value) => {
        const newArtists = [...artists];
        newArtists[index][field] = value;
        setArtists(newArtists);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !guestName || !guestEmail) {
            toast.error("Please fill in contact info and date.");
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                venueId,
                venueName,
                ownerId,
                bookerId: currentUser ? currentUser.uid : 'guest',
                bookerName: guestName,
                bookerEmail: guestEmail,
                bookerPhone: guestPhone,
                eventType: bookingType === 'gig' ? 'live_gig' : 'private_event',
                date: selectedDate,
                slot: selectedSlot, // 'day' or 'night'
                message,
                status: 'pending',
                source: 'web_request',
                createdAt: serverTimestamp()
            };

            if (bookingType === 'gig') {
                bookingData.applicantRole = applicantRole;
                bookingData.ticketSales = ticketSales;
                bookingData.soundEngineer = soundEngineer;
                bookingData.riderDetails = riderDetails;
                bookingData.lineup = artists;
            } else {
                bookingData.expectedGuests = expectedGuests;
                bookingData.organization = organization;
            }

            // ... (inside component)

            console.log("Saving Booking:", bookingData);
            await addDoc(collection(db, "bookings"), bookingData);

            // --- Send Confirmation Email ---
            const emailSubject = `Booking Request Received: ${venueName}`;
            const emailHtml = `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>Booking Request Sent!</h2>
                    <p>Hi ${guestName},</p>
                    <p>Thanks for requesting to book <strong>${venueName}</strong>.</p>
                    <p><strong>Details:</strong></p>
                    <ul>
                        <li>Date: ${selectedDate.toLocaleDateString()}</li>
                        <li>Slot: ${selectedSlot === 'day' ? 'Day' : 'Night'}</li>
                        <li>Type: ${bookingType === 'gig' ? 'Live Gig' : 'Private Event'}</li>
                    </ul>
                    <p>The venue owner has been notified and will review your request shortly.</p>
                    <p>Best,<br/>The Bling Team</p>
                </div>
            `;

            // Fire and forget email (don't block UI)
            sendEmail(guestEmail, emailSubject, emailHtml).catch(console.error);

            toast.success("Request sent! The venue will contact you shortly.");
            onClose();
        } catch (error) {
            console.error("Error sending booking request:", error);
            toast.error("Failed to send request.");
        } finally {
            setLoading(false);
        }
    };

    // --- Render Logic ---

    // 1. Event Type Selection
    if (step === 'selection') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-2xl border border-[#ffd700]/20 shadow-2xl p-8 text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                    <h2 className="text-3xl font-bold text-white mb-2">Make a Booking</h2>
                    <p className="text-gray-400 mb-10">What kind of event are you planning at {venueName}?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button onClick={() => handleTypeSelect('gig')} className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#ffd700] hover:bg-[#ffd700]/10 transition-all flex flex-col items-center gap-4">
                            <div className="p-4 rounded-full bg-[#ffd700]/10 text-[#ffd700] group-hover:scale-110 transition-transform"><Music className="w-8 h-8" /></div>
                            <div><h3 className="text-xl font-bold text-white">Live Gig</h3><p className="text-sm text-gray-400 mt-2">Concerts, album releases, and shows.</p></div>
                        </button>
                        <button onClick={() => handleTypeSelect('private')} className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/10 transition-all flex flex-col items-center gap-4">
                            <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform"><Wine className="w-8 h-8" /></div>
                            <div><h3 className="text-xl font-bold text-white">Private Event</h3><p className="text-sm text-gray-400 mt-2">Weddings, parties, and gatherings.</p></div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Slot Selection
    if (step === 'slot') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-xl bg-[#0a0a0a] rounded-2xl border border-[#ffd700]/20 shadow-2xl p-8 text-center">
                    <button onClick={() => setStep('selection')} className="absolute top-4 left-4 text-gray-400 hover:text-white"><ArrowLeft className="w-6 h-6" /></button>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                    <h2 className="text-2xl font-bold text-white mb-8">Select Time of Day</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <button onClick={() => handleSlotSelect('day')} className="group p-8 rounded-xl bg-white/5 border border-white/10 hover:border-orange-400 hover:bg-orange-400/10 transition-all">
                            <Sun className="w-12 h-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white">Day Event</h3>
                            <p className="text-sm text-gray-500 mt-1">~12:00 - 17:00</p>
                        </button>
                        <button onClick={() => handleSlotSelect('night')} className="group p-8 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400 hover:bg-blue-400/10 transition-all">
                            <Moon className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold text-white">Night Event</h3>
                            <p className="text-sm text-gray-500 mt-1">~18:00 - Late</p>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Calendar Date Selection
    if (step === 'date') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-lg bg-[#0a0a0a] rounded-2xl border border-[#ffd700]/20 shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setStep('slot')} className="text-gray-400 hover:text-white flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
                        <h2 className="text-xl font-bold text-white">Select a Date</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                    </div>
                    <Calendar
                        blockedDates={blockedDates}
                        onDateClick={handleDateSelect}
                        minDate={new Date()}
                    />
                    <div className="flex gap-4 mt-6 text-xs text-gray-500 justify-center">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ffd700]/10 border border-[#ffd700]"></span> Selected</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1a1a1a] border border-white/10"></span> Unavailable</div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. Final Form (Gig/Private Details)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-[#0a0a0a] rounded-2xl border border-[#ffd700]/20 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center shrink-0">
                    <div>
                        <button onClick={() => setStep('date')} className="text-xs text-gray-400 hover:text-white mb-1">← Change Date</button>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {bookingType === 'gig' ? 'Gig Application' : 'Private Inquiry'}
                        </h2>
                        <div className="text-sm text-[#ffd700] mt-1 flex items-center gap-2">
                            {selectedDate?.toLocaleDateString()} • {selectedSlot === 'day' ? '☀️ Day' : '🌙 Night'}
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" required value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#ffd700]/50 outline-none" />
                                <input type="email" required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#ffd700]/50 outline-none" />
                            </div>
                            <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#ffd700]/50 outline-none" />
                        </div>

                        {/* Specific Fields */}
                        {bookingType === 'gig' && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gig Details</h3>
                                <div className="flex gap-4">
                                    <label className={`flex-1 p-3 rounded-xl border cursor-pointer ${applicantRole === 'artist' ? 'bg-[#ffd700]/20 border-[#ffd700] text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                        <input type="radio" className="hidden" checked={applicantRole === 'artist'} onChange={() => setApplicantRole('artist')} />
                                        <span className="block text-center font-bold">Artist</span>
                                    </label>
                                    <label className={`flex-1 p-3 rounded-xl border cursor-pointer ${applicantRole === 'promoter' ? 'bg-[#ffd700]/20 border-[#ffd700] text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                        <input type="radio" className="hidden" checked={applicantRole === 'promoter'} onChange={() => setApplicantRole('promoter')} />
                                        <span className="block text-center font-bold">Promoter</span>
                                    </label>
                                </div>

                                {/* Ticket & Sound Options */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Ticket Sales</label>
                                        <select value={ticketSales} onChange={e => setTicketSales(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#ffd700]/50">
                                            <option value="yes" className="bg-black">Yes, selling tickets</option>
                                            <option value="no" className="bg-black">No, free entry</option>
                                            <option value="undecided" className="bg-black">Undecided</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Sound Engineer</label>
                                        <select value={soundEngineer} onChange={e => setSoundEngineer(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[#ffd700]/50">
                                            <option value="venue" className="bg-black">Need Venue Engineer</option>
                                            <option value="own" className="bg-black">Bring Own Engineer</option>
                                        </select>
                                        <p className="text-[10px] text-gray-500 italic">
                                            * We cannot guarantee to find a sound engineer or give a fixed price.
                                        </p>
                                    </div>
                                </div>

                                {/* Artist List */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">Lineup</label>
                                        <button type="button" onClick={addArtist} className="text-xs text-[#ffd700] flex items-center gap-1">+ Add Act</button>
                                    </div>
                                    {artists.map((artist, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 relative">
                                            {idx > 0 && <button type="button" onClick={() => removeArtist(idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>}

                                            {/* Label helper */}
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                {idx === 0 ? 'Headliner / Main Act' : 'Support Act'}
                                            </div>

                                            <input type="text" placeholder="Artist Name" value={artist.name} onChange={e => updateArtist(idx, 'name', e.target.value)} className="w-full bg-transparent border-b border-white/10 pb-2 text-white outline-none focus:border-[#ffd700]" />

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-0 top-1 w-3 h-3 text-gray-500" />
                                                    <input type="text" placeholder="Social Link" value={artist.socialLink} onChange={e => updateArtist(idx, 'socialLink', e.target.value)} className="w-full bg-transparent pl-5 text-xs text-gray-300 outline-none placeholder:text-gray-600" />
                                                </div>
                                                <div className="relative">
                                                    <LinkIcon className="absolute left-0 top-1 w-3 h-3 text-gray-500" />
                                                    <input type="text" placeholder="Spotify/Soundcloud" value={artist.streamingLink} onChange={e => updateArtist(idx, 'streamingLink', e.target.value)} className="w-full bg-transparent pl-5 text-xs text-gray-300 outline-none placeholder:text-gray-600" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Rider Details */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Tech & Hospitality Rider</label>
                                    <textarea
                                        rows={3}
                                        value={riderDetails}
                                        onChange={e => setRiderDetails(e.target.value)}
                                        placeholder="Paste rider details or list specific technical/hospitality requirements..."
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#ffd700]/50 placeholder:text-gray-700 text-sm resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {bookingType === 'private' && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Event Details</h3>
                                <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Organization / Company" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none" />
                                <input type="number" value={expectedGuests} onChange={e => setExpectedGuests(e.target.value)} placeholder="Estimated Guests" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none" />
                            </div>
                        )}

                        <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Additional notes..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none resize-none" />

                        <button type="submit" disabled={loading} className="w-full py-4 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                            {loading ? 'Sending...' : 'Send Request'} <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
