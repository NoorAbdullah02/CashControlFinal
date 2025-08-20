import { Brain, Shield, TrendingUp, Zap, Globe, Users, Sparkles, Eye } from "lucide-react";

const FeatureGrid = () => {
    const features = [
        {
            icon: Brain,
            title: "AI Intelligence",
            description: "Advanced machine learning algorithms that understand your spending patterns and provide intelligent recommendations.",
            gradient: "from-blue-500 to-indigo-600",
            cardGradient: "from-blue-50/80 to-indigo-50/80",
            borderGradient: "from-blue-200 to-indigo-200",
            hoverShadow: "blue-300/30"
        },
        {
            icon: Shield,
            title: "Fort Knox Security",
            description: "Military-grade encryption and biometric authentication keep your financial data safer than traditional banks.",
            gradient: "from-emerald-500 to-teal-600",
            cardGradient: "from-emerald-50/80 to-teal-50/80",
            borderGradient: "from-emerald-200 to-teal-200",
            hoverShadow: "emerald-300/30"
        },
        {
            icon: TrendingUp,
            title: "Predictive Analytics",
            description: "See into your financial future with AI-powered forecasting and trend analysis that adapts to your lifestyle.",
            gradient: "from-purple-500 to-pink-600",
            cardGradient: "from-purple-50/80 to-pink-50/80",
            borderGradient: "from-purple-200 to-pink-200",
            hoverShadow: "purple-300/30"
        },
        {
            icon: Zap,
            title: "Instant Insights",
            description: "Real-time processing delivers instant financial insights the moment you make a transaction.",
            gradient: "from-amber-500 to-orange-600",
            cardGradient: "from-amber-50/80 to-orange-50/80",
            borderGradient: "from-amber-200 to-orange-200",
            hoverShadow: "amber-300/30"
        },
        {
            icon: Globe,
            title: "Global Ready",
            description: "Support for 150+ currencies with real-time exchange rates and international banking integration.",
            gradient: "from-cyan-500 to-blue-600",
            cardGradient: "from-cyan-50/80 to-blue-50/80",
            borderGradient: "from-cyan-200 to-blue-200",
            hoverShadow: "cyan-300/30"
        },
        {
            icon: Users,
            title: "Smart Collaboration",
            description: "Share budgets, track family goals, and manage joint accounts with intelligent permission controls.",
            gradient: "from-rose-500 to-purple-600",
            cardGradient: "from-rose-50/80 to-purple-50/80",
            borderGradient: "from-rose-200 to-purple-200",
            hoverShadow: "rose-300/30"
        }
    ];

    return (
        <section className="py-24 md:py-40 relative bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Sophisticated section header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-full text-gray-600 text-sm font-medium mb-6 backdrop-blur-sm shadow-lg">
                        <Eye className="h-4 w-4" />
                        <span>Revolutionary Features</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-slate-800 via-gray-700 to-slate-800 bg-clip-text text-transparent">
                            Built for the
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent bg-300% animate-gradient">
                            Future of Finance
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Every feature crafted with precision, powered by cutting-edge technology,
                        and designed to transform how you think about money management.
                    </p>
                </div>

                {/* Premium features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={index}
                                className={`group relative bg-gradient-to-br ${feature.cardGradient} backdrop-blur-xl border-2 border-gray-200/60 rounded-3xl p-8 hover:border-gray-300/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden shadow-lg`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Premium glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.cardGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                {/* Animated border gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.borderGradient} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 p-[2px]`}>
                                    <div className="w-full h-full rounded-3xl bg-white/95 backdrop-blur-xl"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Premium icon design */}
                                    <div className="relative mb-6">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 relative`}>
                                            <IconComponent className="h-8 w-8 text-white relative z-10" />
                                            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
                                    </div>

                                    {/* Title with premium typography */}
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-slate-800 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                        {feature.description}
                                    </p>

                                    {/* Subtle interaction indicator */}
                                    <div className="mt-6 flex items-center gap-2">
                                        <div className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full shadow-lg`}></div>
                                        <div className={`w-4 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-60`}></div>
                                        <div className={`w-6 h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-40`}></div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-tr from-white/40 to-white/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Premium call to action */}
                <div className="text-center mt-20">
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-white/80 to-gray-50/80 border-2 border-gray-200 rounded-2xl text-slate-800 font-semibold hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-lg transform hover:scale-105 backdrop-blur-xl">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <span>Discover All Premium Features</span>
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-0 h-0 border-l-[4px] border-l-white border-y-[3px] border-y-transparent ml-0.5"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
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

export default FeatureGrid;