import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { Coins, Wallet, WalletCards, TrendingUp, Sparkles, Calendar, Activity, Target, Zap, BarChart3, ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank, CreditCard, TrendingDown } from "lucide-react";
import { addThousandsSeparator } from "../util/util.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import RecentTransactions from "../components/RecentTransactions.jsx";
import FinanceOverview from "../components/FinanceOverview.jsx";
import Transactions from "../components/Transactions.jsx";

const Home = () => {
    useUser();

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.DASHBOARD_DATA);
            if (response.status === 200) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Something went wrong while fetching dashboard data:', error);
            toast.error('Something went wrong!');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();

        if (hour < 12) return "Good Morning";
        if (hour === 12) return "Good Noon";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Good Night";
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Floating geometric shapes */}
                <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-emerald-200/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-32 left-16 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-amber-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-rose-200/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                {/* Floating icons */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-10 animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                        }}
                    >
                        {i % 4 === 0 ? (
                            <DollarSign className="h-8 w-8 text-emerald-500" />
                        ) : i % 4 === 1 ? (
                            <TrendingUp className="h-6 w-6 text-orange-500" />
                        ) : i % 4 === 2 ? (
                            <PiggyBank className="h-7 w-7 text-rose-500" />
                        ) : (
                            <BarChart3 className="h-6 w-6 text-teal-500" />
                        )}
                    </div>
                ))}
            </div>

            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto relative z-10">
                    {/* Enhanced Header Section with Glassmorphism */}
                    <div className="mb-8">
                        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/30 overflow-hidden">
                            {/* Dynamic gradient border */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-orange-500 animate-gradient-x"></div>
                            
                            {/* Corner decorations */}
                            <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-full blur-sm"></div>
                            <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-tr from-orange-100/50 to-amber-100/50 rounded-full blur-sm"></div>
                            
                            <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                <div className="flex items-center space-x-6">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-4 lg:p-5 rounded-3xl shadow-2xl transform transition-all group-hover:scale-110">
                                            <Activity className="text-white" size={28} />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                            {getGreeting()}!
                                        </h1>
                                        <p className="text-slate-600 text-base sm:text-lg lg:text-xl font-medium mt-2">
                                            Welcome to your financial command center
                                        </p>
                                        <div className="flex items-center space-x-3 mt-3">
                                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-1.5 rounded-lg">
                                                <Calendar className="text-white" size={16} />
                                            </div>
                                            <span className="text-slate-500 text-sm sm:text-base font-medium">{formatDate(currentTime)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                                        <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 rounded-2xl border border-emerald-200/50 backdrop-blur-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2 rounded-xl">
                                                    <TrendingUp className="text-white" size={18} />
                                                </div>
                                                <span className="text-emerald-700 font-bold text-sm">Financial Growth</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                                        <div className="relative bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 rounded-2xl border border-orange-200/50 backdrop-blur-sm">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-xl">
                                                    <Zap className="text-white" size={18} />
                                                </div>
                                                <span className="text-orange-700 font-bold text-sm">Smart Analytics</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Stats Cards */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-3 rounded-2xl">
                                <Target className="text-white" size={24} />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Financial Snapshot</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {loading ? (
                                // Enhanced loading skeleton cards
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="relative bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 animate-pulse overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-14 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded-lg mb-3"></div>
                                                <div className="h-8 bg-gray-300 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="group relative transform hover:scale-105 transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 to-slate-600"></div>
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4 rounded-2xl shadow-lg">
                                                    <WalletCards className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-600 font-semibold text-sm mb-1">Total Balance</p>
                                                    <p className="text-2xl font-bold text-slate-800"> ৳{addThousandsSeparator(dashboardData?.totalBalance || 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="group relative transform hover:scale-105 transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                                                    <ArrowUpRight className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-600 font-semibold text-sm mb-1">Total Income</p>
                                                    <p className="text-2xl font-bold text-slate-800"> ৳{addThousandsSeparator(dashboardData?.totalIncome || 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="group relative transform hover:scale-105 transition-all duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-600"></div>
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 rounded-2xl shadow-lg">
                                                    <ArrowDownRight className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-slate-600 font-semibold text-sm mb-1">Total Expense</p>
                                                    <p className="text-2xl font-bold text-slate-800"> ৳{addThousandsSeparator(dashboardData?.totalExpense || 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Transactions - Ultra Enhanced */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-500">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-teal-100/30 to-cyan-100/30 rounded-full blur-lg"></div>
                                
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-md opacity-50"></div>
                                        <div className="relative bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-2xl">
                                            <Activity className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
                                </div>
                                {loading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="animate-pulse">
                                                <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <RecentTransactions
                                        transactions={dashboardData?.recentTransactions}
                                        onMore={() => navigate("/expense")}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Finance Overview Chart - Ultra Enhanced */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-500">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100/30 to-amber-100/30 rounded-full blur-lg"></div>
                                
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-md opacity-50"></div>
                                        <div className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl">
                                            <BarChart3 className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Financial Overview</h3>
                                </div>
                                {loading ? (
                                    <div className="animate-pulse">
                                        <div className="h-64 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl"></div>
                                    </div>
                                ) : (
                                    <FinanceOverview
                                        totalBalance={dashboardData?.totalBalance || 0}
                                        totalIncome={dashboardData?.totalIncome || 0}
                                        totalExpense={dashboardData?.totalExpense || 0}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Income Transactions - Ultra Enhanced */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-500">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-100/30 to-green-100/30 rounded-full blur-lg"></div>
                                
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur-md opacity-50"></div>
                                        <div className="relative bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-2xl">
                                            <TrendingUp className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Recent Incomes</h3>
                                </div>
                                {loading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="animate-pulse">
                                                <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Transactions
                                        transactions={dashboardData?.recent5Incomes || []}
                                        onMore={() => navigate("/income")}
                                        type="income"
                                        title="Recent Incomes"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Expense Transactions - Ultra Enhanced */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                            <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30 overflow-hidden transform group-hover:scale-[1.02] transition-all duration-500">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-rose-100/30 to-pink-100/30 rounded-full blur-lg"></div>
                                
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur-md opacity-50"></div>
                                        <div className="relative bg-gradient-to-r from-rose-500 to-pink-500 p-3 rounded-2xl">
                                            <TrendingDown className="text-white" size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Recent Expenses</h3>
                                </div>
                                {loading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="animate-pulse">
                                                <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Transactions
                                        transactions={dashboardData?.recent5Expenses || []}
                                        onMore={() => navigate("/expense")}
                                        type="expense"
                                        title="Recent Expenses"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Dashboard>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 4s ease infinite;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .backdrop-blur-xl {
                    backdrop-filter: blur(16px);
                }
            `}</style>
        </div>
    )
}

export default Home;