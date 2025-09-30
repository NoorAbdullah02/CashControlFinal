import { useState, useEffect } from "react";
import { Menu, X, ExternalLink, ArrowRight, Star, Sparkles, Zap, Shield, ChevronDown } from "lucide-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const navLinks = [
        { name: 'Home', to: '/home' },
        { name: 'About us', href: 'https://noor-abdullah.vercel.app/', type: 'external' },
        { name: 'Contact us', href: 'https://noor-abdullah.vercel.app/contact.html', type: 'external' }
    ];

    const handleExternalLink = (href) => {
        window.open(href, '_blank', 'noopener noreferrer');
        setIsMenuOpen(false);
    };

    const handleInternalLink = () => {
        setIsMenuOpen(false);
    };

    const renderNavLink = (link, isMobile = false) => {
        if (isMobile) {
            const mobileClasses = "group relative py-5 px-7 text-slate-800 font-bold transition-all duration-700 flex items-center justify-between rounded-3xl hover:bg-gradient-to-br hover:from-emerald-50 hover:via-teal-50 hover:to-cyan-50 hover:text-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] border border-transparent hover:border-emerald-200/50";

            if (link.type === 'external') {
                return (
                    <button
                        key={link.name}
                        onClick={() => handleExternalLink(link.href)}
                        className={mobileClasses}
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                            <span className="text-lg">{link.name}</span>
                        </span>
                        <ExternalLink className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                );
            } else {
                return (
                    <a
                        key={link.name}
                        href={link.to}
                        onClick={handleInternalLink}
                        className={mobileClasses}
                    >
                        <span className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                            <span className="text-lg">{link.name}</span>
                        </span>
                        <ArrowRight className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-500 group-hover:translate-x-2" />
                    </a>
                );
            }
        }

        const desktopClasses = "group relative px-7 py-3.5 text-slate-700 font-bold hover:text-slate-900 transition-all duration-700 rounded-2xl overflow-hidden";

        if (link.type === 'external') {
            return (
                <button
                    key={link.name}
                    onClick={() => handleExternalLink(link.href)}
                    className={desktopClasses}
                >
                    <span className="flex items-center gap-2 relative z-10">
                        {link.name}
                        <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:via-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-700 rounded-2xl"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full group-hover:w-12 transition-all duration-700 shadow-lg shadow-emerald-500/50"></div>
                </button>
            );
        } else {
            return (
                <a
                    key={link.name}
                    href={link.to}
                    className={desktopClasses}
                >
                    <span className="relative z-10">{link.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:via-teal-500/10 group-hover:to-cyan-500/10 transition-all duration-700 rounded-2xl"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full group-hover:w-12 transition-all duration-700 shadow-lg shadow-emerald-500/50"></div>
                </a>
            );
        }
    };

    return (
        <div className="relative">
            {/* Enhanced Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Larger ambient orbs */}
                <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/20 via-teal-400/15 to-cyan-300/10 rounded-full blur-3xl animate-float-slow"></div>
                <div className="absolute -top-40 -left-60 w-[400px] h-[400px] bg-gradient-to-br from-teal-300/20 via-emerald-400/15 to-cyan-300/10 rounded-full blur-3xl animate-float-slower" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-60 right-40 w-60 h-60 bg-gradient-to-br from-cyan-300/15 via-blue-400/10 to-emerald-300/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }}></div>
                
                {/* Mesh gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent"></div>
                
                {/* Enhanced floating particles */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-30 animate-float-particle"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 3}s`
                        }}
                    >
                        {i % 4 === 0 ? (
                            <Sparkles className="h-5 w-5 text-emerald-400" />
                        ) : i % 4 === 1 ? (
                            <Zap className="h-4 w-4 text-teal-400" />
                        ) : i % 4 === 2 ? (
                            <Star className="h-4 w-4 text-cyan-400" />
                        ) : (
                            <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                        )}
                    </div>
                ))}
            </div>

            <header className={`fixed top-0 w-full z-50 transition-all duration-1000 ${scrolled
                ? 'bg-white/98 backdrop-blur-3xl shadow-2xl shadow-emerald-900/10'
                : 'bg-white/90 backdrop-blur-2xl'
                }`}>
                
                {/* Multi-layer gradient border */}
                <div className="relative h-1 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 via-cyan-500 via-blue-500 to-indigo-500 animate-shimmer-fast"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 animate-shimmer-reverse"></div>
                </div>

                <div className="container mx-auto px-6 lg:px-10">
                    <div className="flex items-center justify-between h-24">
                        {/* Ultra-premium Logo */}
                        <div className="flex items-center gap-5 group cursor-pointer">
                            <div className="relative">
                                {/* Main logo with 3D effect */}
                                <div className="h-16 w-16 rounded-[1.2rem] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl group-hover:shadow-emerald-500/60 transition-all duration-1000 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden border-2 border-white/30">
                                    {/* Layered glass effects */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-[1.2rem]"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tl from-black/10 via-transparent to-white/10 rounded-[1.2rem]"></div>
                                    
                                    {/* Logo text with shadow */}
                                    <span className="text-3xl font-black text-white relative z-10 drop-shadow-2xl tracking-tight">CC</span>
                                    
                                    {/* Multiple shimmer layers */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 skew-x-12"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12" style={{ transitionDelay: '0.1s' }}></div>
                                </div>
                                
                                {/* Multi-layer glow */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-[1.5rem] opacity-0 group-hover:opacity-40 blur-2xl transition-all duration-1000 animate-pulse-slow"></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[1.2rem] opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700"></div>
                                
                                {/* Orbiting elements */}
                                <div className="absolute -top-3 -right-3 w-6 h-6">
                                    <Star className="w-full h-full text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-spin-slow drop-shadow-lg group-hover:scale-125" />
                                </div>
                                <div className="absolute -bottom-2 -left-2 w-5 h-5">
                                    <Sparkles className="w-full h-full text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-slow" style={{ animationDelay: '0.3s' }} />
                                </div>
                                
                                {/* Premium status badge */}
                                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-0.5">
                                <a href="/home">
                                    <span className="text-3xl font-black bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-700 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:via-teal-500 group-hover:to-cyan-600 transition-all duration-1000 tracking-tight drop-shadow-sm">
                                        Cash Control
                                    </span>
                                </a>
                                <span className="text-sm text-slate-500 font-bold tracking-wide group-hover:text-emerald-600 transition-colors duration-700 flex items-center gap-2 -mt-1">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span className="bg-gradient-to-r from-slate-600 to-emerald-600 bg-clip-text text-transparent">Control Your Money</span>
                                </span>
                            </div>
                        </div>

                        {/* Enhanced Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navLinks.map((link) => renderNavLink(link, false))}
                        </nav>

                        {/* Premium Action Buttons */}
                        <div className="flex items-center space-x-5">
                            <div className="hidden sm:flex items-center space-x-4">
                                {/* Login Button with hover effect */}
                                <a
                                    href="/login"
                                    className="group relative text-slate-700 hover:text-slate-900 font-bold transition-all duration-700 px-8 py-3.5 rounded-2xl overflow-hidden"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl"></div>
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full group-hover:w-10 transition-all duration-700"></div>
                                </a>
                                
                                {/* Premium Get Started Button */}
                                <a
                                    href="/signup"
                                    className="group relative inline-block px-10 py-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white font-black shadow-2xl hover:shadow-emerald-500/50 transition-all duration-700 hover:scale-105 overflow-hidden border border-white/20"
                                >
                                    <span className="relative z-10 flex items-center gap-2.5 text-base tracking-wide">
                                        Get Started
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-500" />
                                    </span>
                                    
                                    {/* Animated gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    
                                    {/* Multiple shine effects */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200 skew-x-12" style={{ transitionDelay: '0.1s' }}></div>
                                    
                                    {/* Corner sparkles */}
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
                                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-300/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" style={{ transitionDelay: '0.1s' }}></div>
                                    
                                    {/* Glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-700"></div>
                                </a>
                            </div>

                            {/* Premium Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden group p-4 rounded-2xl text-slate-700 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-700 hover:scale-110 relative overflow-hidden border border-transparent hover:border-emerald-200/50"
                                aria-label="Toggle menu"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-700 rounded-2xl"></div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700"></div>
                                {isMenuOpen ? 
                                    <X className="h-7 w-7 relative z-10 group-hover:rotate-90 transition-transform duration-500" /> : 
                                    <Menu className="h-7 w-7 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ultra-premium Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-1000 overflow-hidden ${isMenuOpen
                    ? 'max-h-screen opacity-100 translate-y-0'
                    : 'max-h-0 opacity-0 -translate-y-8'
                    }`}>
                    <div className="bg-gradient-to-br from-white/98 via-emerald-50/30 to-teal-50/30 backdrop-blur-3xl mx-6 mb-8 rounded-[2rem] shadow-2xl shadow-emerald-900/20 overflow-hidden border-2 border-emerald-200/40">
                        <div className="p-8">
                            <nav className="flex flex-col space-y-3">
                                {navLinks.map((link) => renderNavLink(link, true))}

                                <div className="flex flex-col space-y-4 pt-8 mt-6 border-t-2 border-gradient-to-r from-emerald-200/60 via-teal-200/60 to-cyan-200/60">
                                    <a
                                        href="/login"
                                        onClick={handleInternalLink}
                                        className="group text-slate-800 hover:text-slate-900 font-bold py-5 px-7 rounded-3xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 transition-all duration-700 flex items-center justify-between hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] border border-transparent hover:border-emerald-200/50"
                                    >
                                        <span className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                                            <span className="text-lg">Login</span>
                                        </span>
                                        <ArrowRight className="h-5 w-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
                                    </a>
                                    
                                    <a
                                        href="/signup"
                                        onClick={handleInternalLink}
                                        className="group bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white px-10 py-5 rounded-3xl font-black hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-700 text-center relative overflow-hidden hover:scale-[1.02] border border-white/20"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                                            Get Started
                                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1.5 transition-transform duration-500" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 skew-x-12"></div>
                                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-700"></div>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-24"></div>

            {/* Enhanced Keyframe Animations */}
            <style jsx>{`
                @keyframes shimmer-fast {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                
                @keyframes shimmer-reverse {
                    0% { background-position: 200% center; opacity: 0; }
                    50% { opacity: 0.3; }
                    100% { background-position: -200% center; opacity: 0; }
                }
                
                @keyframes float-particle {
                    0%, 100% { 
                        transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); 
                    }
                    25% { 
                        transform: translateY(-20px) translateX(10px) rotate(90deg) scale(1.1); 
                    }
                    50% { 
                        transform: translateY(-10px) translateX(-10px) rotate(180deg) scale(0.9); 
                    }
                    75% { 
                        transform: translateY(-25px) translateX(5px) rotate(270deg) scale(1.05); 
                    }
                }
                
                @keyframes float-slow {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1); 
                    }
                    50% { 
                        transform: translate(-30px, -30px) scale(1.1); 
                    }
                }
                
                @keyframes float-slower {
                    0%, 100% { 
                        transform: translate(0, 0) scale(1); 
                    }
                    50% { 
                        transform: translate(30px, -20px) scale(1.05); 
                    }
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                
                .animate-shimmer-fast {
                    background-size: 200% 100%;
                    animation: shimmer-fast 2s ease-in-out infinite;
                }
                
                .animate-shimmer-reverse {
                    background-size: 200% 100%;
                    animation: shimmer-reverse 3s ease-in-out infinite;
                }
                
                .animate-float-particle {
                    animation: float-particle 6s ease-in-out infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                
                .animate-float-slower {
                    animation: float-slower 10s ease-in-out infinite;
                }
                
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
                
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Header;