import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Search, Filter, Calendar, TrendingUp, TrendingDown, Sparkles, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import TransactionInfoCard from "../components/TransactionInfoCard.jsx";
import moment from "moment";

const FilterPage = () => {
    useUser();
    const [type, setType] = useState("income");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [keyword, setKeyword] = useState("");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTERS, {
                type,
                startDate,
                endDate,
                keyword,
                sortField,
                sortOrder
            });
            console.log('transactions: ', response.data);
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions: ', error);
            toast.error(error.message || "Failed to fetch transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dashboard activeMenu="Filters">
            <div className="my-5 mx-auto">
                {/* Enhanced Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl shadow-lg">
                            <Filter className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Smart Filters
                            </h2>
                            <p className="text-gray-600 text-sm">Discover insights in your transactions</p>
                        </div>
                    </div>
                </div>

                {/* Filter Card - Enhanced Design */}
                <div className="card p-6 mb-6 bg-white rounded-2xl shadow-xl border-0 overflow-hidden relative">
                    {/* Decorative gradient background */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <Sparkles className="text-purple-600" size={20} />
                            <h5 className="text-xl font-semibold text-gray-800">Filter Options</h5>
                        </div>
                        <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                            Advanced Search
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-6">
                        {/* Transaction Type */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="type">
                                Transaction Type
                            </label>
                            <div className="relative">
                                <select
                                    value={type}
                                    id="type"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-purple-500 focus:bg-white transition-all duration-200 appearance-none font-medium"
                                    onChange={e => setType(e.target.value)}
                                >
                                    <option value="income">💰 Income</option>
                                    <option value="expense">💸 Expense</option>
                                </select>
                                {type === "income" ?
                                    <TrendingUp className="absolute right-3 top-4 text-green-500" size={18} /> :
                                    <TrendingDown className="absolute right-3 top-4 text-red-500" size={18} />
                                }
                            </div>
                        </div>

                        {/* Start Date */}
                        <div className="relative">
                            <label htmlFor="startdate" className="block text-sm font-semibold text-gray-700 mb-2">
                                Start Date
                            </label>
                            <div className="relative">
                                <input
                                    value={startDate}
                                    id="startdate"
                                    type="date"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-purple-500 focus:bg-white transition-all duration-200"
                                    onChange={e => setStartDate(e.target.value)}
                                />
                                {/* <Calendar className="absolute right-3 top-3 text-gray-400" size={18} /> */}
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="relative">
                            <label htmlFor="enddate" className="block text-sm font-semibold text-gray-700 mb-2">
                                End Date
                            </label>
                            <div className="relative">
                                <input
                                    value={endDate}
                                    id="enddate"
                                    type="date"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-purple-500 focus:bg-white transition-all duration-200"
                                    onChange={e => setEndDate(e.target.value)}
                                />
                                {/* <Calendar className="absolute right-3 top-3 text-gray-400" size={18} /> */}
                            </div>
                        </div>

                        {/* Sort Field */}
                        <div className="relative">
                            <label htmlFor="sortfield" className="block text-sm font-semibold text-gray-700 mb-2">
                                Sort Field
                            </label>
                            <select
                                value={sortField}
                                id="sortfield"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-purple-500 focus:bg-white transition-all duration-200 appearance-none"
                                onChange={e => setSortField(e.target.value)}
                            >
                                <option value="date">📅 Date</option>
                                <option value="amount">💵 Amount</option>
                                <option value="category">🏷️ Category</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="relative">
                            <label htmlFor="sortorder" className="block text-sm font-semibold text-gray-700 mb-2">
                                Sort Order
                            </label>
                            <div className="relative">
                                <select
                                    value={sortOrder}
                                    id="sortorder"
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-purple-500 focus:bg-white transition-all duration-200 appearance-none"
                                    onChange={e => setSortOrder(e.target.value)}
                                >
                                    <option value="asc">↗️ Ascending</option>
                                    <option value="desc">↘️ Descending</option>
                                </select>
                                <ArrowUpDown className="absolute right-3 top-3 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Search Field */}
                        <div className="sm:col-span-1 md:col-span-1 flex items-end">
                            <div className="w-full">
                                <label htmlFor="keyword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Search Keywords
                                </label>
                                <div className="relative">
                                    <input
                                        value={keyword}
                                        id="keyword"
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:border-purple-500 focus:bg-white transition-all duration-200"
                                        onChange={e => setKeyword(e.target.value)}
                                    />
                                    <Search className="absolute right-3 top-4 text-gray-400" size={18} />
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="ml-3 mb-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Search size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Card - Enhanced Design */}
                <div className="card p-6 bg-white rounded-2xl shadow-xl border-0 overflow-hidden relative">
                    {/* Decorative gradient background */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                                <Filter className="text-white" size={18} />
                            </div>
                            <div>
                                <h5 className="text-xl font-semibold text-gray-800">Transaction Results</h5>
                                <p className="text-sm text-gray-600">
                                    {transactions.length > 0 ? `Found ${transactions.length} transactions` : 'Apply filters to see results'}
                                </p>
                            </div>
                        </div>
                        {transactions.length > 0 && (
                            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                                {transactions.length} results
                            </div>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-700 font-semibold text-lg">Loading Transactions</p>
                                <p className="text-gray-500 text-sm mt-1">Please wait while we fetch your data...</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {transactions.length === 0 && !loading && (
                        <div className="text-center py-16">
                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="text-purple-600" size={28} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Search!</h3>
                            <p className="text-gray-600">Select the filters and click the search button to filter your transactions</p>
                        </div>
                    )}

                    {/* Transaction Results */}
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="transform hover:scale-[1.02] transition-all duration-200 hover:shadow-md rounded-xl"
                            >
                                <TransactionInfoCard
                                    title={transaction.name}
                                    icon={transaction.icon}
                                    date={moment(transaction.date).format('Do MMM YYYY')}
                                    amount={transaction.amount}
                                    type={type}
                                    hideDeleteBtn
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Dashboard>
    );
};

export default FilterPage;