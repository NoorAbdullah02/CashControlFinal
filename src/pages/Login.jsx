import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Input from "../components/Input.jsx";
import { validateEmail } from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import { AppContext } from "../context/AppContext.jsx";
import { LoaderCircle, ArrowRight, TrendingUp, Shield, Zap, Eye, EyeOff } from "lucide-react";
import Header from "../components/Header.jsx";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser } = useContext(AppContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        //basic validation
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

        //LOGIN API call
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });
            const { token, user } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                console.error('Something went wrong', error);
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <Header />

            {/* Main Content */}
            <div className="flex-grow w-full relative flex items-center justify-center px-4 py-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-60 left-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 right-20 w-36 h-36 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-60 left-20 w-24 h-24 bg-purple-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
                </div>

                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side - Welcome Back Content */}
                    <div className="hidden lg:block space-y-8">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium backdrop-blur-sm shadow-lg">
                                <TrendingUp className="h-4 w-4" />
                                <span>Welcome Back</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                                <span className="bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
                                    Continue Your
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 bg-clip-text text-transparent">
                                    Success Story
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                Welcome back! Sign in to access your personalized dashboard and
                                continue managing your finances like a pro.
                            </p>
                        </div>

                        {/* Stats or highlights */}
                        <div className="grid grid-cols-2 gap-6 max-w-lg">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-slate-800 mb-1">99.9%</div>
                                <div className="text-gray-600 text-sm">Uptime</div>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-slate-800 mb-1">Fast</div>
                                <div className="text-gray-600 text-sm">Access</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-300/50 via-blue-300/50 to-emerald-300/50 rounded-3xl blur opacity-60"></div>

                            {/* Form container */}
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent mb-2">
                                        Welcome Back
                                    </h2>
                                    <p className="text-gray-600">
                                        Sign in to your account to continue
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Form Fields */}
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                label="Enter Your Registered Email Address"
                                                placeholder="Enter your email"
                                                type="email"
                                            />
                                        </div>

                                        <div className="space-y-2 relative">
                                            <Input
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                label="Enter Your Password"
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot Password */}
                                    <div className="text-right">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-blue-700 transition-all duration-300"
                                        >
                                            Forgot password?
                                        </Link>
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
                                            : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600 hover:from-indigo-700 hover:via-blue-700 hover:to-emerald-700 transform hover:scale-105 hover:shadow-2xl'
                                            }`}
                                        type="submit"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <LoaderCircle className="animate-spin w-5 h-5" />
                                                <span>Signing In...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <span>Sign In</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        )}
                                    </button>

                                    {/* Signup Link */}
                                    <div className="text-center pt-4">
                                        <p className="text-gray-600">
                                            Don't have an account?{' '}
                                            <Link
                                                to="/signup"
                                                className="font-semibold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-emerald-700 transition-all duration-300"
                                            >
                                                Create Account
                                            </Link>
                                        </p>
                                    </div>
                                </form>

                                {/* Social Login (Optional) */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="text-center">
                                        <p className="text-gray-500 text-sm mb-4">Or continue with</p>
                                        <div className="flex justify-center gap-3">
                                            <button className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all duration-300">
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            </button>
                                            <button className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all duration-300">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security badge */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <Shield className="h-4 w-4" />
                            <span>Secured with 256-bit SSL encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;