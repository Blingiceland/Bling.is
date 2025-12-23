import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SignUpSeeker = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [seekerType, setSeekerType] = useState('artist'); // artist, promoter, private
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signup(email, password, 'seeker'); // Intention to tag as seeker

            toast.success('Account created! Welcome to the market.');
            navigate('/venues'); // Go to marketplace
        } catch (err) {
            setError('Failed to create account: ' + err.message);
            toast.error(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
            <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-blue-400/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-400" />

                <h1 className="text-3xl font-bold mb-2 text-white">Join the Marketplace</h1>
                <p className="text-gray-400 mb-6">Find venues for your gigs, events, or parties.</p>

                {error && <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">{error}</div>}

                <form onSubmit={handleSignUp} className="flex flex-col gap-5">

                    {/* Role Selector inside form */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        {['artist', 'promoter', 'private'].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSeekerType(type)}
                                className={`py-2 px-1 text-xs md:text-sm font-bold rounded-lg border transition-all ${seekerType === type
                                        ? 'bg-blue-500 text-white border-blue-400'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-400/50 outline-none" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-400/50 outline-none" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20">
                        {loading ? 'Creating...' : 'Create Profil'}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <Link to="/signup" className="text-gray-500 hover:text-white">← Back to selection</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpSeeker;
