import { XCircle, Mail, ArrowLeft, AlertCircle, Clock, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ActivationFailed() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className={`relative z-10 max-w-2xl w-full transform transition-all duration-1000 ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Failed Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 text-center relative overflow-hidden">
                    {/* Decorative Corner Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-rose-400 opacity-10 rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-rose-400 to-pink-400 opacity-10 rounded-tr-full"></div>

                    {/* Error Icon with Animation */}
                    <div className="mb-8 relative inline-block">
                        <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-500 rounded-full animate-pulse opacity-30"></div>
                        <div className="relative bg-gradient-to-br from-red-50 to-rose-50 rounded-full p-8 shadow-lg">
                            <XCircle className="w-24 h-24 text-red-500" strokeWidth={2.5} />
                        </div>
                        <AlertCircle className="absolute -top-2 -right-2 w-8 h-8 text-orange-400 animate-bounce" />
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Activation Failed
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        We couldn't activate your account. The link may be <span className="font-semibold text-red-600">invalid or expired</span>
                    </p>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100 text-left">
                            <Clock className="w-8 h-8 text-red-600 mb-3" />
                            <p className="text-sm font-semibold text-gray-700 mb-2">Link Expired?</p>
                            <p className="text-xs text-gray-500">Activation links expire after 24 hours for security reasons</p>
                        </div>
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 text-left">
                            <RotateCcw className="w-8 h-8 text-rose-600 mb-3" />
                            <p className="text-sm font-semibold text-gray-700 mb-2">Already Used?</p>
                            <p className="text-xs text-gray-500">Each activation link can only be used once</p>
                        </div>
                    </div>

                    {/* Error Message Box */}
                    <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-800 mb-1">What should I do?</p>
                                <p className="text-sm text-gray-600">
                                    Request a new activation link using the button below. We'll send it to your registered email address.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.href = '/resend-activation'}
                            className="group w-full bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 hover:from-red-600 hover:via-rose-600 hover:to-pink-600 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                        >
                            <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            Resend Activation Email
                        </button>

                        <button
                            onClick={() => window.location.href = '/login'}
                            className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold py-5 px-10 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-gray-300 flex items-center justify-center gap-3"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Login
                        </button>
                    </div>

                    {/* Footer Text */}
                    <p className="mt-8 text-sm text-gray-500">
                        Still having issues? We're here to help!
                    </p>
                </div>

                {/* Bottom Info */}
                <div className="text-center mt-8 space-y-3">
                    <p className="text-sm text-gray-500">
                        Need assistance? <a href="mailto:support@cashcontrol.com" className="text-red-500 hover:text-red-600 font-semibold hover:underline">Contact our support team</a>
                    </p>
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                        <a href="/help" className="hover:text-gray-600 transition-colors">Help Center</a>
                        <span>•</span>
                        <a href="/faq" className="hover:text-gray-600 transition-colors">FAQ</a>
                        <span>•</span>
                        <a href="/terms" className="hover:text-gray-600 transition-colors">Terms</a>
                    </div>
                </div>
            </div>

            <style>{`
@keyframes blob {
0% { transform: translate(0px, 0px) scale(1); }
33% { transform: translate(30px, -50px) scale(1.1); }
66% { transform: translate(-20px, 20px) scale(0.9); }
100% { transform: translate(0px, 0px) scale(1); }
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
`}</style>
        </div>
    );
}