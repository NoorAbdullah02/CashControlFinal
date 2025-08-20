import { ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <section className="relative text-center py-32 md:py-48 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="container mx-auto max-w-7xl">
                {/* Floating badge with premium effect */}
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/60 rounded-full text-gray-700 text-sm font-medium mb-12 shadow-xl hover:shadow-blue-200/40 transition-all duration-500 animate-bounce backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent font-semibold">
                        Powered by Advanced AI Technology
                    </span>
                    <Sparkles className="h-4 w-4 text-emerald-500 animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                {/* Revolutionary heading with sophisticated gradients */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.9] mb-8">
                    <div className="mb-4">
                        <span className="inline-block bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 bg-clip-text text-transparent hover:from-blue-700 hover:via-slate-800 hover:to-blue-700 transition-all duration-700">
                            Smart
                        </span>
                    </div>
                    <div className="mb-4">
                        <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent bg-300% animate-gradient">
                            Financial
                        </span>
                    </div>
                    <div>
                        <span className="inline-block bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent bg-300% animate-gradient-reverse">
                            Control
                        </span>
                    </div>
                </h1>

                {/* Elegant subtitle */}
                <p className="mt-8 max-w-4xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
                    Experience the future of personal finance with our
                    <span className="text-transparent bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text font-semibold mx-2">
                        AI-driven platform
                    </span>
                    that turns complex financial data into actionable insights.
                </p>

                {/* Premium CTA section */}
                <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6">
                    <Link
                        to="/signup"
                        className="group relative w-full sm:w-auto overflow-hidden"
                    >
                        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 p-1 rounded-2xl shadow-2xl">
                            <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-12 py-5 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-xl">
                                <span className="flex items-center justify-center gap-3">
                                    Get Started Free
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
                    </Link>

                    <Link
                        to="/login"
                        className="group w-full sm:w-auto bg-white/80 backdrop-blur-xl border-2 border-gray-200 text-gray-700 px-12 py-5 rounded-xl font-bold text-lg hover:bg-white hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                    >
                        <span>Watch Demo</span>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                        </div>
                    </Link>
                </div>

                {/* Refined feature highlights */}
                <div className="mt-20 flex flex-wrap justify-center items-center gap-12 text-gray-500">
                    <div className="group flex items-center gap-3 hover:text-blue-600 transition-colors duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center border border-blue-200 shadow-lg group-hover:shadow-blue-200/50 transition-all duration-300">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="font-semibold">Advanced Analytics</span>
                    </div>
                    <div className="group flex items-center gap-3 hover:text-indigo-600 transition-colors duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl flex items-center justify-center border border-indigo-200 shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-300">
                            <Shield className="h-6 w-6 text-indigo-600" />
                        </div>
                        <span className="font-semibold">Military-Grade Security</span>
                    </div>
                    <div className="group flex items-center gap-3 hover:text-emerald-600 transition-colors duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200 shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-300">
                            <Zap className="h-6 w-6 text-emerald-600" />
                        </div>
                        <span className="font-semibold">Lightning Fast</span>
                    </div>
                </div>
            </div>

            {/* Custom CSS for gradient animations */}
            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-reverse {
                    0%, 100% { background-position: 100% 50%; }
                    50% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 4s ease-in-out infinite;
                }
                .animate-gradient-reverse {
                    animation: gradient-reverse 4s ease-in-out infinite;
                }
                .bg-300% {
                    background-size: 300% 300%;
                }
            `}</style>
        </section>
    );
};

export default HeroSection;