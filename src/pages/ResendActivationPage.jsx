import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, Loader2, ArrowLeft, Sparkles, Send } from 'lucide-react';

export default function ResendActivationPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleResend = async () => {
        if (!email) {
            setMessage('Please enter your email address');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(
                `https://cash-control-final-api.onrender.com/api/v1.0/resend-activation?email=${encodeURIComponent(email)}`,

                //`http://localhost:8080/api/v1.0/resend-activation?email=${encodeURIComponent(email)}`,
                { method: 'POST' }
            );

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setMessageType('success');
                setEmail('');
            } else {
                setMessage(data.message);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Failed to send email. Please try again later.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleResend();
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            {/* Innovative Animated Background */}
            <div className="absolute inset-0 bg-white">
                {/* Gradient Orbs */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-rose-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
                
                {/* Floating Geometric Shapes */}
                <div className="absolute top-20 left-10 w-16 h-16 border-4 border-rose-200 rounded-lg opacity-30 animate-float"></div>
                <div className="absolute top-40 right-20 w-20 h-20 border-4 border-purple-200 rounded-full opacity-30 animate-float animation-delay-1000"></div>
                <div className="absolute bottom-40 left-1/4 w-24 h-24 border-4 border-blue-200 rotate-45 opacity-30 animate-float animation-delay-2000"></div>
                <div className="absolute bottom-20 right-1/3 w-12 h-12 border-4 border-pink-200 rounded-lg opacity-30 animate-float animation-delay-3000"></div>
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(219, 39, 119, 0.05) 1px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}></div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent"></div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30px, -50px) scale(1.1); }
                    50% { transform: translate(-30px, 30px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(10deg); }
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-blob {
                    animation: blob 8s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animation-delay-3000 {
                    animation-delay: 3s;
                }
            `}</style>

            <div className="w-full max-w-lg relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => window.location.href = '/login'}
                    className="mb-8 flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-all duration-300 group bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-200 hover:border-rose-300 shadow-sm hover:shadow-md"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Back to Login</span>
                </button>

                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:shadow-3xl border-2 border-white/50">
                    
                    {/* Animated Icon */}
                    <div className="flex justify-center mb-8 relative">
                        {/* Pulsing rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-rose-300 to-pink-300 rounded-full opacity-20 animate-ping"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center animation-delay-1000">
                            <div className="w-28 h-28 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-15 animate-ping"></div>
                        </div>
                        
                        {/* Main icon container */}
                        <div className="relative w-24 h-24 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500">
                            <Mail className="w-12 h-12 text-white" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <Send className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8 space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-full mb-3">
                            <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
                            <span className="text-rose-700 font-semibold text-sm">Quick Resend</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                                Resend Activation
                            </span>
                        </h1>

                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                            Didn't receive the activation email? No worries! Enter your email and we'll send it again.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-rose-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="noor@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-white/90 border-2 border-gray-200 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 font-medium"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Message Alert */}
                        {message && (
                            <div
                                className={`p-4 rounded-2xl flex items-start gap-3 shadow-lg border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                                    messageType === 'success'
                                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300'
                                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                                }`}
                            >
                                {messageType === 'success' ? (
                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                ) : (
                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-red-400 to-rose-400 rounded-full flex items-center justify-center">
                                        <XCircle className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <p
                                    className={`text-sm font-semibold leading-relaxed ${
                                        messageType === 'success' ? 'text-emerald-800' : 'text-red-800'
                                    }`}
                                >
                                    {message}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="group relative w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer"></div>
                            
                            <div className="relative flex items-center justify-center gap-3">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="text-lg">Sending Magic...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span className="text-lg">Send Activation Email</span>
                                    </>
                                )}
                            </div>
                        </button>

                        {/* Info Box */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4">
                            <p className="text-sm text-blue-800 text-center">
                                <span className="font-bold">💡 Pro Tip:</span> Check your spam folder if you don't see the email within a few minutes
                            </p>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-100">
                        <p className="text-sm text-gray-600 text-center">
                            Already activated?{' '}
                            <a
                                href="/login"
                                className="font-bold text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text hover:from-rose-700 hover:to-pink-700 transition-all"
                            >
                                Sign in here →
                            </a>
                        </p>
                    </div>
                </div>

                {/* Support Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full inline-block border-2 border-gray-200 shadow-sm">
                        Still having trouble?{' '}
                        <a href="/support" className="font-bold text-transparent bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text hover:from-rose-700 hover:to-purple-700">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}