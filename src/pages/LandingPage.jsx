import Header from "../components/Header.jsx";
import HeroSection from "../components/HeroSection.jsx";
import ProductShowcase from "../components/ProductShowcase.jsx";
import FeatureGrid from "../components/FeatureGrid.jsx";
import FloatingElements from "../components/FloatingElements.jsx";

const LandingPage = () => {
    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-gray-50 min-h-screen text-slate-800 font-sans relative overflow-hidden">
            <FloatingElements />

            {/* Ambient light effects with soft colors */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-emerald-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2000ms' }}></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-200/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3000ms' }}></div>
            </div>

            <Header />
            <main className="relative z-10">
                <HeroSection />
                <FeatureGrid />
                <ProductShowcase />
            </main>
        </div>
    )
}

export default LandingPage;