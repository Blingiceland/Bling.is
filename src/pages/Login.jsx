import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await googleLogin();

            if (searchParams.get('intent') === 'profile') {
                navigate('/create-profile');
            } else if (searchParams.get('intent') === 'venue') {
                navigate('/create-venue');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Google Login failed: ' + err.message);
            toast.error('Google Login failed: ' + err.message);
        }
        setLoading(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            const userCredential = await login(email, password);
            const user = userCredential.user;

            if (searchParams.get('intent') === 'profile') {
                navigate('/create-profile');
                return;
            } else if (searchParams.get('intent') === 'venue') {
                navigate('/create-venue');
                return;
            }

            // Default to dashboard for everyone
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            setError('Failed to log in: ' + err.message);
            toast.error('Login failed: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <Link to="/" className="text-4xl mb-8 animate-fade-in hover:scale-110 transition-transform duration-300">
                🛎️
            </Link>

            <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/5 to-purple-900/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Log In
                </h1>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-4 px-6 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="text-center text-gray-400">
                    <p className="text-sm">We use Google for secure, verified access.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
