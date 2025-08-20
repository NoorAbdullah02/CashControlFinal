import { useState, useEffect } from "react";
import { Menu, X, ExternalLink, ArrowRight, Star } from "lucide-react";

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
            const mobileClasses = "group relative py-4 px-6 text-gray-700 font-medium transition-all duration-500 flex items-center justify-between rounded-2xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:via-pink-500/5 hover:to-blue-500/10 hover:text-purple-700 hover:shadow-lg hover:shadow-purple-500/10";

            if (link.type === 'external') {
                return (
                    <button
                        key={link.name}
                        onClick={() => handleExternalLink(link.href)}
                        className={mobileClasses}
                    >
                        <span className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {link.name}
                        </span>
                        <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:text-purple-600 transition-all duration-300 group-hover:translate-x-1" />
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
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {link.name}
                        </span>
                        <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:text-purple-600 transition-all duration-300 group-hover:translate-x-1" />
                    </a>
                );
            }
        }

        // Desktop navigation
        const desktopClasses = "group relative px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition-all duration-500 rounded-2xl hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-lg hover:shadow-purple-500/10";

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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:via-pink-600/5 group-hover:to-blue-600/5 transition-all duration-500"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full group-hover:w-8 transition-all duration-500"></div>
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
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-pink-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:via-pink-600/5 group-hover:to-blue-600/5 transition-all duration-500"></div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full group-hover:w-8 transition-all duration-500"></div>
                </a>
            );
        }
    };

    return (
        <div className="relative">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-20 -left-40 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-40 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <header className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled
                ? 'bg-white/95 backdrop-blur-2xl border-b border-purple-200/30 shadow-2xl shadow-purple-900/10'
                : 'bg-white/70 backdrop-blur-xl border-b border-white/20'
                }`}>
                {/* Gradient line at top */}
                {/* <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-purple-600 bg-[length:200%_100%] animate-gradient"></div> */}
                <div className="h-1 w-full rounded-full bg-gradient-to-r from-cyan-400 via-lime-400 to-fuchsia-500 bg-[length:200%_100%] animate-shimmer shadow-lg shadow-cyan-400/50"></div>
                {/* <div className="h-1 w-full rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-red-600 bg-[length:200%_100%] animate-shimmer shadow-lg shadow-amber-500/40"></div> */}
                {/* <div className="h-1 w-full rounded-full bg-gradient-to-r from-indigo-700 via-purple-600 via-fuchsia-600 to-sky-500 bg-[length:200%_100%] animate-shimmer shadow-lg shadow-fuchsia-500/40"></div> */}


                <div className="container mx-auto px-8">
                    <div className="flex items-center justify-between h-24">
                        {/* Logo */}
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="relative">
                                {/* Logo placeholder - you can replace with your actual logo */}
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-2xl group-hover:shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <span className="text-2xl font-black text-white relative z-10">CC</span>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500"></div>
                                <div className="absolute -top-1 -right-1 w-4 h-4">
                                    <Star className="w-full h-full text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-spin" style={{ animationDuration: '3s' }} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-800 via-pink-800 to-blue-800 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 transition-all duration-500">
                                    Cash Control
                                </span>
                                <span className="text-sm text-gray-500 font-medium -mt-1 group-hover:text-purple-600 transition-colors duration-300">
                                    Control Your Money
                                </span>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-2">
                            {navLinks.map((link) => renderNavLink(link, false))}
                        </nav>

                        {/* Action Buttons & Hamburger Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center space-x-4">
                                <a
                                    href="/login"
                                    className="group relative text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 px-6 py-3 rounded-2xl hover:bg-white/50 hover:shadow-lg hover:shadow-purple-500/10"
                                >
                                    <span className="relative z-10">Login</span>
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full group-hover:w-6 transition-all duration-300"></div>
                                </a>
                                <a
                                    href="/signup"
                                    className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                                </a>
                            </div>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden group p-3 rounded-2xl text-gray-700 hover:bg-white/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-110 relative overflow-hidden"
                                aria-label="Toggle menu"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-2xl"></div>
                                {isMenuOpen ? <X className="h-6 w-6 relative z-10" /> : <Menu className="h-6 w-6 relative z-10" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-700 overflow-hidden ${isMenuOpen
                    ? 'max-h-screen opacity-100 translate-y-0'
                    : 'max-h-0 opacity-0 -translate-y-4'
                    }`}>
                    <div className="bg-white/95 backdrop-blur-2xl border-t border-purple-200/30 mx-6 mb-6 rounded-3xl shadow-2xl shadow-purple-900/10 overflow-hidden">
                        <div className="p-8">
                            <nav className="flex flex-col space-y-3">
                                {navLinks.map((link) => renderNavLink(link, true))}

                                <div className="flex flex-col space-y-4 pt-6 mt-6 border-t border-gradient-to-r from-purple-200/50 to-pink-200/50">
                                    <a
                                        href="/login"
                                        onClick={handleInternalLink}
                                        className="group text-gray-700 hover:text-gray-900 font-medium py-4 px-6 rounded-2xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 flex items-center justify-between"
                                    >
                                        <span className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            Login
                                        </span>
                                        <ArrowRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                    </a>
                                    <a
                                        href="/signup"
                                        onClick={handleInternalLink}
                                        className="group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-500 text-center relative overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Get Started
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-24"></div>

            {/* Add keyframe animation */}
            <style jsx>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Header;