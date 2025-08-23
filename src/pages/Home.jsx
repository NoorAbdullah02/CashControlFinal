import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import InfoCard from "../components/InfoCard.jsx";
import { Coins, Wallet, WalletCards, TrendingUp, Sparkles, Calendar, Activity, Target } from "lucide-react";
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
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
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
        <div>
            <Dashboard activeMenu="Dashboard">
                <div className="my-5 mx-auto">
                    {/* Enhanced Header Section */}
                    <div className="mb-6">
                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border-0 overflow-hidden relative">
                            {/* Animated gradient background */}
                            <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>

                            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                                <div className="flex items-center space-x-3 sm:space-x-4">
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                                        <Activity className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            {getGreeting()}!
                                        </h1>
                                        <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mt-1">
                                            Welcome to your financial dashboard
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                                            <Calendar className="text-gray-400" size={14} />
                                            <span className="text-gray-500 text-xs sm:text-sm">{formatDate(currentTime)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <TrendingUp className="text-green-600" size={16} />
                                            <span className="text-green-700 font-semibold text-xs sm:text-sm">Financial Growth</span>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="text-purple-600" size={16} />
                                            <span className="text-purple-700 font-semibold text-xs sm:text-sm">Smart Insights</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Stats Cards */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Target className="text-purple-600" size={20} />
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Financial Overview</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {loading ? (
                                // Loading skeleton cards
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border-0 animate-pulse">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl"></div>
                                            <div className="flex-1">
                                                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-4 sm:h-6 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="transform hover:scale-105 transition-all duration-300">
                                        <InfoCard
                                            icon={<WalletCards />}
                                            label="Total Balance"
                                            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                                            color="bg-purple-800"
                                        />
                                    </div>
                                    <div className="transform hover:scale-105 transition-all duration-300">
                                        <InfoCard
                                            icon={<Wallet />}
                                            label="Total Income"
                                            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                                            color="bg-green-800"
                                        />
                                    </div>
                                    <div className="transform hover:scale-105 transition-all duration-300">
                                        <InfoCard
                                            icon={<Coins />}
                                            label="Total Expense"
                                            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
                                            color="bg-red-800"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Enhanced Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Recent Transactions - Enhanced */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-0 overflow-hidden relative transform hover:shadow-xl transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                                    <Activity className="text-white" size={18} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Activity</h3>
                            </div>
                            {loading ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="animate-pulse">
                                            <div className="h-12 sm:h-16 bg-gray-100 rounded-xl"></div>
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

                        {/* Finance Overview Chart - Enhanced */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-0 overflow-hidden relative transform hover:shadow-xl transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                                    <TrendingUp className="text-white" size={18} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Financial Overview</h3>
                            </div>
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-48 sm:h-64 bg-gray-100 rounded-2xl"></div>
                                </div>
                            ) : (
                                <FinanceOverview
                                    totalBalance={dashboardData?.totalBalance || 0}
                                    totalIncome={dashboardData?.totalIncome || 0}
                                    totalExpense={dashboardData?.totalExpense || 0}
                                />
                            )}
                        </div>

                        {/* Income Transactions - Enhanced */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-0 overflow-hidden relative transform hover:shadow-xl transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
                                    <Wallet className="text-white" size={18} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Incomes</h3>
                            </div>
                            {loading ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="animate-pulse">
                                            <div className="h-12 sm:h-16 bg-gray-100 rounded-xl"></div>
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

                        {/* Expense Transactions - Enhanced */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-0 overflow-hidden relative transform hover:shadow-xl transition-all duration-300">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
                            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-xl">
                                    <Coins className="text-white" size={18} />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Expenses</h3>
                            </div>
                            {loading ? (
                                <div className="space-y-3 sm:space-y-4">
                                    {Array.from({ length: 3 }).map((_, index) => (
                                        <div key={index} className="animate-pulse">
                                            <div className="h-12 sm:h-16 bg-gray-100 rounded-xl"></div>
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
            </Dashboard>
        </div>
    )
}

export default Home;