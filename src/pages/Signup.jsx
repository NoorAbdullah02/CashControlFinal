import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import { validateEmail } from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import { LoaderCircle, Sparkles, Shield, Users, CheckCircle } from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";
import Header from "../components/Header.jsx";

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);

        //basic validation
        if (!fullName.trim()) {
            setError("Please enter your fullname");
            setIsLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter valid email address");
            setIsLoading(false);
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        setError("");

        //signup api call
        try {
            //upload image if present
            if (profilePhoto) {
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl
            })
            if (response.status === 201) {
                toast.success("Profile created successfully.");
                navigate("/login");
            }
        } catch (err) {
            console.error('Something went wrong', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Header />

            {/* Main Content */}
            <div className="flex-grow w-full relative flex items-center justify-center px-4 py-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-40 right-10 w-28 h-28 bg-purple-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Welcome Content */}
                    <div className="hidden lg:block space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-blue-200 rounded-full text-blue-700 text-sm font-medium backdrop-blur-sm shadow-lg">
                                <Sparkles className="h-4 w-4" />
                                <span>Join 150K+ Users</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                                <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                                    Start Your
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">
                                    Financial Journey
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                Take control of your finances with our AI-powered platform.
                                Track expenses, set budgets, and achieve your financial goals.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Bank-Level Security</h3>
                                    <p className="text-gray-600 text-sm">Your data is protected with 256-bit encryption</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Trusted Community</h3>
                                    <p className="text-gray-600 text-sm">Join thousands of satisfied users worldwide</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">Easy Setup</h3>
                                    <p className="text-gray-600 text-sm">Get started in less than 2 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-300/50 via-indigo-300/50 to-emerald-300/50 rounded-3xl blur opacity-60"></div>

                            {/* Form container */}
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent mb-2">
                                        Create Account
                                    </h2>
                                    <p className="text-gray-600">
                                        Join us and transform your financial future
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Profile Photo Selector */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                <Sparkles className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            label="Full Name"
                                            placeholder="John Doe"
                                            type="text"
                                        />

                                        <Input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            label="Email Address"
                                            placeholder="john@example.com"
                                            type="email"
                                        />

                                        <Input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            label="Password"
                                            placeholder="Create a strong password"
                                            type="password"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                            <p className="text-red-600 text-sm text-center font-medium">
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        disabled={isLoading}
                                        className={`w-full py-4 px-6 text-white font-bold text-lg rounded-xl shadow-xl transition-all duration-300 ${isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:via-indigo-700 hover:to-emerald-700 transform hover:scale-105 hover:shadow-2xl'
                                            }`}
                                        type="submit"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <LoaderCircle className="animate-spin w-5 h-5" />
                                                <span>Creating Account...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <span>Create Account</span>
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                        )}
                                    </button>

                                    {/* Login Link */}
                                    <div className="text-center pt-4">
                                        <p className="text-gray-600">
                                            Already have an account?{' '}
                                            <Link
                                                to="/login"
                                                className="font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
                                            >
                                                Sign In
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 flex items-center justify-center gap-6 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span>SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <span>GDPR Compliant</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;