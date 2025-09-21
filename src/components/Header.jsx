import { useState, useEffect } from "react";
import { Menu, X, ExternalLink, ArrowRight, Star, Sparkles, Zap, Shield } from "lucide-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mouse tracking for gradient effects
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
            const mobileClasses = "group relative py-4 px-6 text-slate-700 font-semibold transition-all duration-500 flex items-center justify-between rounded-2xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:via-teal-500/5 hover:to-cyan-500/10 hover:text-emerald-700 hover:shadow-lg hover:shadow-emerald-500/10";

            if (link.type === 'external') {
                return (
                    <button
                        key={link.name}
                        onClick={() => handleExternalLink(link.href)}
                        className={mobileClasses}
                    >
                        <span className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                            {link.name}
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-300 group-hover:translate-x-1" />
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
                        <span className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                            {link.name}
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:text-emerald-600 transition-all duration-300 group-hover:translate-x-1" />
                    </a>
                );
            }
        }

        // Desktop navigation
        const desktopClasses = "group relative px-6 py-3 text-slate-700 font-semibold hover:text-slate-900 transition-all duration-500 rounded-2xl hover:bg-white/60 hover:backdrop-blur-xl hover:shadow-lg hover:shadow-emerald-500/10 hover:border hover:border-emerald-200/30";

        if (link.type === 'external') {
            return (
                <button
                    key={link.name}
                    onClick={() => handleExternalLink(link.href)}
                    className={desktopClasses}
                >
                    <span className="flex items-center gap-2 relative z-10">
                        {link.name}
                        <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12" />
                    </span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600/0 via-teal-600/0 to-cyan-600/0 group-hover:from-emerald-600/5 group-hover:via-teal-600/5 group-hover:to-cyan-600/5 transition-all duration-500"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-full group-hover:w-8 transition-all duration-500"></div>
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600/0 via-teal-600/0 to-cyan-600/0 group-hover:from-emerald-600/5 group-hover:via-teal-600/5 group-hover:to-cyan-600/5 transition-all duration-500"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-full group-hover:w-8 transition-all duration-500"></div>
                </a>
            );
        }
    };

    return (
        <div className="relative">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-20 -left-40 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-cyan-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-20 animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${4 + Math.random() * 2}s`
                        }}
                    >
                        {i % 3 === 0 ? (
                            <Sparkles className="h-4 w-4 text-emerald-500" />
                        ) : i % 3 === 1 ? (
                            <Zap className="h-3 w-3 text-teal-500" />
                        ) : (
                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                        )}
                    </div>
                ))}
            </div>

            <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled
                ? 'bg-white/95 backdrop-blur-2xl border-b border-emerald-200/40 shadow-2xl shadow-emerald-900/10'
                : 'bg-white/80 backdrop-blur-xl border-b border-white/30'
                }`}>
                
                {/* Dynamic Rainbow Gradient Border */}
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 via-cyan-500 via-blue-500 to-indigo-500 bg-[length:400%_100%] animate-shimmer shadow-lg shadow-emerald-400/30"></div>

                <div className="container mx-auto px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Enhanced Logo */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="relative">
                                {/* Main logo container */}
                                <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:shadow-emerald-500/40 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
                                    {/* Glass effect overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-3xl"></div>
                                    {/* Logo text */}
                                    <span className="text-2xl font-black text-white relative z-10 drop-shadow-lg">CC</span>
                                    {/* Animated shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                                </div>
                                
                                {/* Glow effect */}
                                <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-700"></div>
                                
                                {/* Floating star */}
                                <div className="absolute -top-2 -right-2 w-5 h-5">
                                    <Star className="w-full h-full text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin group-hover:scale-125" style={{ animationDuration: '3s' }} />
                                </div>
                                
                                {/* Status indicator */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg">
                                    <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-50"></div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-2xl font-black bg-gradient-to-r from-slate-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-cyan-600 transition-all duration-700">
                                    Cash Control
                                </span>
                                <span className="text-sm text-slate-500 font-semibold -mt-1 group-hover:text-emerald-600 transition-colors duration-500 flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    Control Your Money
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-2">
                            {navLinks.map((link) => renderNavLink(link, false))}
                        </nav>

                        {/* Enhanced Action Buttons & Hamburger Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-4">
                                {/* Login Button */}
                                <a
                                    href="/login"
                                    className="group relative text-slate-700 hover:text-slate-900 font-semibold transition-all duration-500 px-6 py-3 rounded-2xl hover:bg-white/70 hover:shadow-lg hover:shadow-emerald-500/10 hover:border hover:border-emerald-200/30"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full group-hover:w-6 transition-all duration-500"></div>
                                </a>
                                
                                {/* Enhanced Get Started Button */}
                                <a
                                    href="/signup"
                                    className="group relative inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:scale-105 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    
                                    {/* Corner decoration */}
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                                </a>
                            </div>

                            {/* Enhanced Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden group p-3 rounded-2xl text-slate-700 hover:bg-white/70 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-110 relative overflow-hidden border border-transparent hover:border-emerald-200/30"
                                aria-label="Toggle menu"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 to-teal-600/0 group-hover:from-emerald-600/5 group-hover:to-teal-600/5 transition-all duration-500 rounded-2xl"></div>
                                {isMenuOpen ? 
                                    <X className="h-6 w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" /> : 
                                    <Menu className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-700 overflow-hidden ${isMenuOpen
                    ? 'max-h-screen opacity-100 translate-y-0'
                    : 'max-h-0 opacity-0 -translate-y-4'
                    }`}>
                    <div className="bg-white/95 backdrop-blur-2xl border-t border-emerald-200/40 mx-6 mb-6 rounded-3xl shadow-2xl shadow-emerald-900/10 overflow-hidden border border-emerald-200/30">
                        <div className="p-8">
                            <nav className="flex flex-col space-y-3">
                                {navLinks.map((link) => renderNavLink(link, true))}

                                <div className="flex flex-col space-y-4 pt-6 mt-6 border-t border-gradient-to-r from-emerald-200/50 to-teal-200/50">
                                    <a
                                        href="/login"
                                        onClick={handleInternalLink}
                                        className="group text-slate-700 hover:text-slate-900 font-semibold py-4 px-6 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-500 flex items-center justify-between"
                                    >
                                        <span className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                                            Login
                                        </span>
                                        <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                    </a>
                                    
                                    <a
                                        href="/signup"
                                        onClick={handleInternalLink}
                                        className="group bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500 text-center relative overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Get Started
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-20"></div>

            {/* Enhanced Keyframe Animations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(180deg); }
                }
                
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-shimmer {
                    background-size: 400% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }
                
                .animate-gradient-shift {
                    background-size: 200% 200%;
                    animation: gradient-shift 4s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Header;