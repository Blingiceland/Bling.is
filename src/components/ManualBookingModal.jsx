import React, { useState } from 'react';
import { X, Calendar, User, Clock, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'sonner';

const ManualBookingModal = ({ isOpen, onClose, venues, currentUser, onBookingAdded }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        venueId: venues.length > 0 ? venues[0].id : '',
        bookerName: '', // Acts as the "Event Name" or "Artist Name"
        date: '',
        slot: 'night', // 'day' or 'night'
        message: '', // Description / Notes
        ticketSales: 'no',
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.venueId || !formData.bookerName || !formData.date) {
            toast.error("Please fill in required fields");
            return;
        }

        setLoading(true);
        try { // Correctly parse the date string to a Date object at midnight
            const eventDate = new Date(formData.date);
            // Adjust for timezone offset if necessary, or just treat as local date at 00:00
            // Simple approach: set time to 12:00 PM to avoid timezone rollover issues for now
            eventDate.setHours(12, 0, 0, 0);

            const selectedVenue = venues.find(v => v.id === formData.venueId);

            const bookingData = {
                venueId: formData.venueId,
                venueName: selectedVenue?.name || 'Unknown Venue',
                ownerId: currentUser.uid,
                bookerId: currentUser.uid, // Self-booking
                bookerName: formData.bookerName, // Using this for Artist/Event Title
                bookerEmail: currentUser.email,
                date: eventDate,
                slot: formData.slot,
                status: 'approved', // Auto-approve manual bookings
                message: formData.message || 'Manual Entry',
                ticketSales: formData.ticketSales,
                eventType: 'manual_entry',
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, "bookings"), bookingData);

            toast.success("Event added successfully");
            onBookingAdded({ id: docRef.id, ...bookingData, date: { seconds: eventDate.getTime() / 1000 } });
            onClose();
            // Reset form (optional, but good for next use)
            setFormData(prev => ({ ...prev, bookerName: '', message: '' }));

        } catch (error) {
            console.error("Error creating manual booking:", error);
            toast.error("Failed to add event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a1a] border border-[#ffd700]/20 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#ffd700]" />
                    Add Manual Event
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Venue Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Venue</label>
                        <select
                            name="venueId"
                            value={formData.venueId}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
                        >
                            {venues.map(v => (
                                <option key={v.id} value={v.id} className="bg-gray-900">{v.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Event Name / Artist */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Event / Artist Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                name="bookerName"
                                value={formData.bookerName}
                                onChange={handleChange}
                                placeholder="e.g. Jazz Trio or Private Party"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors [color-scheme:dark]"
                                required
                            />
                        </div>

                        {/* Slot */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Time Slot</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <select
                                    name="slot"
                                    value={formData.slot}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="night" className="bg-gray-900">🌙 Night</option>
                                    <option value="day" className="bg-gray-900">☀️ Day</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Info */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Ticket Sales?</label>
                        <select
                            name="ticketSales"
                            value={formData.ticketSales}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors"
                        >
                            <option value="no" className="bg-gray-900">No (Free Entry / Private)</option>
                            <option value="yes" className="bg-gray-900">Yes (Ticketed)</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Notes (Internal)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Additional details..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#ffd700] focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-[#ffd700] text-black hover:bg-[#ffd700]/90 transition-colors font-bold flex items-center justify-center gap-2"
                        >
                            {loading ? 'Adding...' : <><Check className="w-5 h-5" /> Add Event</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualBookingModal;
