import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../util/apiEndpoints';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const FORGOT_PASSWORD_URL = API_ENDPOINTS.FORGET_PASSWORD;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!email || !email.trim()) {
            setMessage('Please enter your email address');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(FORGOT_PASSWORD_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email.trim() })
            });

            // if (!response.ok) {
            //     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            // }

            const data = await response.json();

            if (!response.ok) {
                // Handle specific cases
                if (data.message && data.message.toLowerCase().includes('not found')) {
                    setMessage("Oops! We couldn’t find an account with that email 😢. Please double-check and try again.");
                } else {
                    setMessage(data.message || "Something went wrong. Please try again.");
                }
                setSuccess(false);
                return;
            }

            setMessage(data.message || 'Reset link sent successfully!');
            setEmail('');
            setSuccess(true);
        } catch (error) {
            console.error('Full error:', error);
            setMessage(`Request error: ${error.message}`);  
        } finally {
            setLoading(false);
        }
    };

    const handleSignInRedirect = () => {
        navigate('/login');
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate('/reset-password');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (

        <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-300 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-indigo-300 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-sky-300 rounded-full animate-bounce"></div>
                <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-blue-400 rounded-full animate-ping animation-delay-1000"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-6 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                        <p className="text-gray-600">
                            No worries! Enter your email address and we'll send you a password reset link.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        <span>Send Reset Link</span>
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Success/Error Message */}
                        {message && (
                            <div
                                className={`mt-6 p-4 rounded-xl border transition-all duration-500 ${success
                                    ? 'bg-green-50 text-green-800 border-green-200'
                                    : 'bg-red-50 text-red-800 border-red-200'
                                    }`}
                            >
                                <div className="flex items-start space-x-2">
                                    {success ? (
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{message}</p>
                                        {success && (
                                            <p className="text-xs mt-1 text-green-600">
                                                Redirecting to reset page in a few seconds...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Remember your password?</span>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            onClick={handleSignInRedirect}
                            className="w-full py-3 px-6 bg-white border-2 border-blue-200 text-blue-600 font-semibold rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span>Back to Sign In</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                        Need help?{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .bg-grid-pattern {
                    background-image: radial-gradient(circle, #93c5fd 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>

    );
};

export default ForgotPassword;