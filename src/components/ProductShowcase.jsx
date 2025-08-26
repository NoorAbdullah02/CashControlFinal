import { assets } from "../assets/assets.js";
import { Monitor, Smartphone, Tablet, Star, Award, Users } from "lucide-react";

const ProductShowcase = () => {
    return (
        <section className="py-24 md:py-40 relative bg-gradient-to-br from-slate-50 via-white to-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Elegant section header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-full text-gray-600 text-sm font-medium mb-6 backdrop-blur-sm shadow-lg">
                        <Award className="h-4 w-4" />
                        <span>Award-Winning Design</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 bg-clip-text text-transparent">
                            Experience
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent bg-300% animate-gradient">
                            Excellence
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Meticulously crafted interfaces that make complex financial management feel effortless and intuitive.
                    </p>
                </div>

                {/* Premium showcase with sophisticated glassmorphism */}
                <div className="relative mb-20">
                    {/* Ambient glow effects */}
                    <div className="absolute -inset-10 bg-gradient-to-r from-blue-200/30 via-indigo-200/30 to-emerald-200/30 rounded-[3rem] blur-3xl opacity-60"></div>
                    <div className="absolute -inset-5 bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-emerald-100/20 rounded-[2.5rem] blur-2xl"></div>

                    {/* Main container with ultra-premium glassmorphism */}
                    <div className="relative bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 backdrop-blur-2xl border-2 border-gray-200/60 rounded-[2rem] p-6 shadow-2xl overflow-hidden">
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/50 rounded-[2rem]"></div>

                        {/* Image container */}
                        <div className="relative rounded-[1.5rem] overflow-hidden shadow-2xl">
                            <img
                                src={assets.landing}
                                className="w-full h-auto object-cover"
                                alt="MoneyWise Financial Dashboard"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&crop=center';
                                }}
                            />

                            {/* Overlay gradient for premium effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating premium badges */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce backdrop-blur-sm border-2 border-white/60">
                            <div className="text-center">
                                <div className="text-white font-bold text-lg">AI</div>
                                <div className="text-white/90 font-medium text-xs">POWERED</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-24 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-2xl animate-pulse backdrop-blur-sm border-2 border-white/60">
                            <div className="text-center">
                                <div className="text-white font-bold text-sm">SECURE</div>
                                <div className="text-white/90 font-medium text-xs">256-BIT SSL</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sophisticated device compatibility */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    <div className="group text-center">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border-2 border-white/60">
                                <Monitor className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 mx-auto"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Desktop Mastery</h3>
                        <p className="text-gray-600 leading-relaxed">Full-featured dashboard with advanced analytics and comprehensive financial management tools.</p>
                    </div>

                    <div className="group text-center">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border-2 border-white/60">
                                <Smartphone className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 mx-auto"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Mobile Excellence</h3>
                        <p className="text-gray-600 leading-relaxed">Native iOS and Android apps with instant transaction tracking and real-time notifications.</p>
                    </div>

                    <div className="group text-center">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm border-2 border-white/60">
                                <Tablet className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 mx-auto"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Tablet Precision</h3>
                        <p className="text-gray-600 leading-relaxed">Optimized for detailed financial analysis with touch-friendly charts and data visualization.</p>
                    </div>
                </div>

                {/* Premium statistics with gorgeous cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group">
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 backdrop-blur-sm border-2 border-orange-200/60 rounded-3xl p-6 group-hover:border-orange-300/80 group-hover:shadow-2xl transition-all duration-500 shadow-lg transform group-hover:scale-105">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    <Star className="h-6 w-6 text-white fill-current" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                                    4.9★
                                </div>
                                <div className="text-gray-700 font-semibold mb-2">User Rating</div>
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-yellow-600 font-medium">Excellent</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm border-2 border-blue-200/60 rounded-3xl p-6 group-hover:border-blue-300/80 group-hover:shadow-2xl transition-all duration-500 shadow-lg transform group-hover:scale-105">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                                    500+
                                </div>
                                <div className="text-gray-700 font-semibold mb-2">Active Users</div>
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-blue-600 font-medium">Growing Daily</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 backdrop-blur-sm border-2 border-emerald-200/60 rounded-3xl p-6 group-hover:border-emerald-300/80 group-hover:shadow-2xl transition-all duration-500 shadow-lg transform group-hover:scale-105">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    <Star className="h-6 w-6 text-white fill-current" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                                    $1M+
                                </div>
                                <div className="text-gray-700 font-semibold mb-2">Tracked Safely</div>
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-emerald-600 font-medium">Secured</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm border-2 border-purple-200/60 rounded-3xl p-6 group-hover:border-purple-300/80 group-hover:shadow-2xl transition-all duration-500 shadow-lg transform group-hover:scale-105">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                    <Award className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    99.99%
                                </div>
                                <div className="text-gray-700 font-semibold mb-2">Uptime SLA</div>
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600 font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    animation: gradient 4s ease-in-out infinite;
                }
                .bg-300% {
                    background-size: 300% 300%;
                }
            `}</style>
        </section>
    );
};

export default ProductShowcase;