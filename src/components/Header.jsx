import { useState } from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import { Menu, X, ExternalLink } from "lucide-react";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // const navLinks = [
    //     { name: 'Home', to: '/home' },
    //     { name: 'About us', to: '/about' },
    //     { name: 'Contact us', to: '/contact' }
    // ];

    const navLinks = [
        { name: 'Home', to: '/home' }, // Internal link
        { name: 'About us', href: 'https://noor-abdullah.vercel.app/', type: 'external' }, // External link
        { name: 'Contact us', href: 'https://noor-abdullah.vercel.app/contact.html', type: 'external' } // External Link
    ];

    // Handle external link clicks
    const handleExternalLink = (href) => {
        window.open(href, '_blank', 'noopener noreferrer');
        setIsMenuOpen(false); // Close mobile menu after click
    };

    // Handle internal link clicks (for mobile menu)
    const handleInternalLink = () => {
        setIsMenuOpen(false); // Close mobile menu after click
    };

    // Render navigation link based on type
    const renderNavLink = (link, isMobile = false) => {
        const baseClasses = "text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1";
        const mobileClasses = isMobile ? "py-2" : "";
        const className = `${baseClasses} ${mobileClasses}`;

        if (link.type === 'external') {
            return (
                <button
                    key={link.name}
                    onClick={() => handleExternalLink(link.href)}
                    className={className}
                >
                    {link.name}
                    <ExternalLink className="h-3 w-3" />
                </button>
            );
        } else {
            return (
                <Link
                    key={link.name}
                    to={link.to}
                    onClick={isMobile ? handleInternalLink : undefined}
                    className={className}
                >
                    {link.name}
                </Link>
            );
        }
    };

    return (
        <header className="border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img src={assets.logo} alt="logo" className="h-10 w-10" />
                        <span className="text-lg font-bold text-black truncate">Cash Control</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => renderNavLink(link, false))}
                    </nav>

                    {/* Action Buttons & Hamburger Menu */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-purple-600 transition-colors">
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex flex-col space-y-4">
                            {navLinks.map((link) => renderNavLink(link, true))}
                            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                                <Link
                                    to="/login"
                                    onClick={handleInternalLink}
                                    className="text-gray-600 hover:text-purple-600 transition-colors w-full text-left"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={handleInternalLink}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;