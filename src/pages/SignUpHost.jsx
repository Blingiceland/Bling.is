import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SignUpHost = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signup(email, password, 'host'); // Pass role if auth supports it, or handle via context later.
            // For now, we assume signup just creates the user.

            toast.success('Host account created!');
            // Force them to create a venue immediately
            navigate('/create-venue');
        } catch (err) {
            setError('Failed to create account: ' + err.message);
            toast.error(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
            <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-[#ffd700]/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#ffd700]" />

                <h1 className="text-3xl font-bold mb-2 text-white">Venue Host Access</h1>
                <p className="text-gray-400 mb-8">Create an account to list and manage your spaces.</p>

                {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">{error}</div>}

                <form onSubmit={handleSignUp} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#ffd700]/50 outline-none" placeholder="venue@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#ffd700]/50 outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 px-6 bg-[#ffd700] hover:bg-[#ffd700]/90 text-black font-bold rounded-xl transition-all disabled:opacity-50">
                        {loading ? 'Creating...' : 'Start Listing Venue'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <Link to="/signup" className="text-gray-500 hover:text-white">← Back to selection</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpHost;
