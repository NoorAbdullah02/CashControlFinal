const FloatingElements = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Sophisticated floating particles with light colors */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-40" style={{ animationDuration: '2s' }}></div>
            <div className="absolute top-60 right-32 w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-40 left-1/3 w-1 h-1 bg-indigo-400 rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-60 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-25" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-emerald-300 rounded-full animate-pulse opacity-30" style={{ animationDelay: '3s' }}></div>

            {/* Premium geometric shapes with subtle colors */}
            <div className="absolute top-40 right-1/3 w-6 h-6 border-2 border-blue-200/40 rounded-lg rotate-45 animate-spin opacity-20" style={{ animationDuration: '20s' }}></div>
            <div className="absolute bottom-40 left-1/5 w-4 h-4 border-2 border-emerald-200/40 rounded-full animate-pulse opacity-15" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 left-1/6 w-3 h-3 border-2 border-indigo-200/40 rounded-lg rotate-12 animate-spin opacity-10" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>

            {/* Elegant gradient orbs with soft colors */}
            <div className="absolute top-1/5 right-1/5 w-32 h-32 bg-gradient-to-r from-blue-100/20 to-indigo-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-100/20 to-cyan-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            <div className="absolute top-2/3 right-1/3 w-28 h-28 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

            {/* Sophisticated moving lines with light gradients */}
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/15 to-transparent transform -rotate-3 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-200/15 to-transparent transform rotate-2 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200/12 to-transparent transform -rotate-1 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>

            {/* Subtle corner accents with light colors */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-100/10 to-transparent rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-100/10 to-transparent rounded-full"></div>
            <div className="absolute top-1/2 right-0 w-32 h-32 bg-gradient-to-l from-indigo-100/8 to-transparent rounded-full"></div>
            <div className="absolute bottom-1/2 left-0 w-32 h-32 bg-gradient-to-r from-purple-100/8 to-transparent rounded-full"></div>

            {/* Additional decorative elements */}
            <div className="absolute top-16 left-1/2 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-20" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-16 right-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-25" style={{ animationDelay: '2.5s' }}></div>
            <div className="absolute top-1/4 right-16 w-2 h-2 bg-rose-300 rounded-full animate-ping opacity-15" style={{ animationDelay: '3.5s' }}></div>

            {/* Floating diamond shapes */}
            <div className="absolute top-80 left-80 w-3 h-3 bg-gradient-to-br from-blue-200/30 to-blue-300/30 transform rotate-45 animate-bounce opacity-20" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
            <div className="absolute bottom-80 right-80 w-2 h-2 bg-gradient-to-br from-emerald-200/30 to-emerald-300/30 transform rotate-45 animate-bounce opacity-15" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
        </div>
    );
};

export default FloatingElements;