import { Link } from "react-router-dom";
import { Mail, ArrowRight, Shield, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "../components/Header.jsx";

const EmailVerification = () => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-white">
            <Header />

            {/* Main Content */}
            <div className="flex-grow w-full relative flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
                <div className="w-full max-w-5xl mx-auto">
                    {/* Animated Mail Icon */}
                    <div className="flex justify-center mb-6 sm:mb-8 lg:mb-12">
                        <div className="relative">
                            {/* Outer glow rings */}
                            <div className="absolute inset-0 animate-ping">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-20"></div>
                            </div>
                            <div className="absolute inset-0 animate-pulse" style={{ animationDelay: '0.5s' }}>
                                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-30"></div>
                            </div>
                            
                            {/* Main icon container */}
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500">
                                <Mail className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white" />
                                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8 mb-8 sm:mb-12 lg:mb-16">
                        {/* Success Badge */}
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 lg:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-full shadow-lg">
                                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-emerald-600" />
                                <span className="text-emerald-700 font-semibold text-xs sm:text-sm lg:text-base">Email Sent Successfully</span>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight px-2">
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                                    Check Your Inbox
                                </span>
                            </h1>
                            <p className="text-base sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto px-4">
                                We've sent a verification email to your inbox. Click the link inside to activate your account.
                            </p>
                        </div>
                    </div>

                    {/* Instructions - Stacked on Mobile, Grid on Desktop */}
                    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 max-w-6xl mx-auto">
                        <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex items-center lg:flex-col lg:items-start gap-4 lg:gap-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform lg:mb-6">
                                    <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">1</span>
                                </div>
                                <div className="flex-1 lg:w-full">
                                    <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 lg:mb-3 text-base sm:text-lg lg:text-xl">Open Email</h3>
                                    <p className="text-gray-600 text-sm lg:text-base">Check your inbox for our verification email</p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex items-center lg:flex-col lg:items-start gap-4 lg:gap-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform lg:mb-6">
                                    <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">2</span>
                                </div>
                                <div className="flex-1 lg:w-full">
                                    <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 lg:mb-3 text-base sm:text-lg lg:text-xl">Click Link</h3>
                                    <p className="text-gray-600 text-sm lg:text-base">Click the verification link in the email</p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="flex items-center lg:flex-col lg:items-start gap-4 lg:gap-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform lg:mb-6">
                                    <span className="text-white text-xl sm:text-2xl lg:text-3xl font-bold">3</span>
                                </div>
                                <div className="flex-1 lg:w-full">
                                    <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 lg:mb-3 text-base sm:text-lg lg:text-xl">Get Started</h3>
                                    <p className="text-gray-600 text-sm lg:text-base">Your account will be activated instantly</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-12 shadow-lg max-w-4xl mx-auto">
                        <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-amber-900 mb-2 lg:mb-3 text-sm sm:text-base lg:text-lg">Can't find the email?</h4>
                                <ul className="space-y-1.5 lg:space-y-2.5 text-amber-800 text-xs sm:text-sm lg:text-base">
                                    <li className="flex items-start gap-2 lg:gap-3">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-600 rounded-full mt-1.5 lg:mt-2 flex-shrink-0"></div>
                                        <span>Check your <strong>Spam</strong> or <strong>Junk</strong> folder</span>
                                    </li>
                                    <li className="flex items-start gap-2 lg:gap-3">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-600 rounded-full mt-1.5 lg:mt-2 flex-shrink-0"></div>
                                        <span>Wait a few minutes - emails can be delayed</span>
                                    </li>
                                    <li className="flex items-start gap-2 lg:gap-3">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-600 rounded-full mt-1.5 lg:mt-2 flex-shrink-0"></div>
                                        <span>Add us to your contacts to avoid spam filters</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 sm:space-y-4 lg:space-y-5 max-w-2xl mx-auto">
                        <a
                            href="https://mail.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:via-indigo-700 hover:to-emerald-700"
                        >
                            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                                <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                                <span>Open Gmail</span>
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                            </div>
                        </a>

                        <Link
                            to="/login"
                            className="block w-full py-4 sm:py-5 lg:py-6 px-6 sm:px-8 lg:px-10 bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 font-bold text-base sm:text-lg lg:text-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
                                <span>Go to Login</span>
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                            </div>
                        </Link>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-8 sm:mt-12 lg:mt-16 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 text-gray-400 text-xs sm:text-sm lg:text-base px-4">
                        <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 flex-shrink-0" />
                        <span className="text-center">Your data is protected with enterprise-grade security</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;