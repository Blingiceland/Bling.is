import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare } from 'lucide-react';
import { sendEmail } from '../services/email';
import { toast } from 'sonner';

const ContactModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await sendEmail(
                'jon@bling.is',
                `New Contact Request from ${email}`,
                `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>New Contact Request</h2>
                    <p><strong>From:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px;">${message}</p>
                </div>
                `
            );
            toast.success('Message sent! We will be in touch shortly.');
            onClose();
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md bg-[#0a0a0a] rounded-2xl border border-[#ffd700]/20 shadow-2xl p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>

                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Mail className="w-6 h-6 text-[#ffd700]" /> Get in Touch
                </h2>
                <p className="text-gray-400 mb-6 text-sm">Send us a message and we'll get back to you.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Your Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#ffd700]/50 outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Message</label>
                        <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="How can we help you?"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#ffd700]/50 outline-none resize-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactModal;
