import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingDown, CreditCard, Calendar, BarChart3, AlertTriangle, Target } from 'lucide-react';

const CustomExpenseChart = ({ data = [] }) => {
    const [chartType, setChartType] = useState('area'); // 'line' or 'area'
    const [showCumulative, setShowCumulative] = useState(false);

    // If no data, show beautiful empty state
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-br from-red-50 to-rose-100 rounded-xl border border-red-200">
                <div className="text-6xl mb-4">💸</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Expense Data Yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                    Start tracking your expenses to see beautiful visualizations of your spending patterns
                </p>
            </div>
        );
    }

    // Get summary data
    const summary = data.summary || {
        totalExpenseAmount: data.reduce((sum, item) => sum + (item.amount || 0), 0),
        totalDays: data.length,
        averageDailyExpense: 0,
        highestSpendingDay: Math.max(...data.map(d => d.amount || 0))
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || isNaN(amount)) return '৳০';

        if (amount >= 10000000) return `৳${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `৳${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `৳${(amount / 1000).toFixed(1)}K`;
        return `৳${amount.toLocaleString()}`;
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-red-600" />
                        <p className="font-semibold text-gray-800">{label}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Daily Expense:</span>
                            <span className="font-bold text-red-600 text-lg">
                                {formatCurrency(data.amount)}
                            </span>
                        </div>

                        {showCumulative && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cumulative:</span>
                                <span className="font-semibold text-orange-600">
                                    {formatCurrency(data.cumulativeTotal)}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Transactions:</span>
                            <span className="font-medium text-gray-800">
                                {data.transactionCount}
                            </span>
                        </div>

                        {data.categories && data.categories.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Categories:</span>
                                <span className="font-medium text-gray-800">
                                    {data.categories.length}
                                </span>
                            </div>
                        )}

                        {data.spendingChange !== undefined && data.spendingChange !== 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Change:</span>
                                <span className={`font-semibold ${data.spendingChange > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {data.spendingChange > 0 ? '+' : ''}{data.spendingChange.toFixed(1)}%
                                </span>
                            </div>
                        )}

                        {data.isPeakSpending && (
                            <div className="mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full text-center">
                                🚨 Highest Spending
                            </div>
                        )}

                        {data.isLowSpending && (
                            <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full text-center">
                                💰 Low Spending Day
                            </div>
                        )}

                        {data.metadata && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="text-xs text-gray-500">
                                    {data.metadata.expenseIntensity} spending day
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Calculate expense insights
    const highSpendingDays = data.filter(d => d.isHighSpending).length;
    const lowSpendingDays = data.filter(d => d.isLowSpending).length;
    const increasingTrend = data.filter(d => d.spendingChange > 0).length > data.filter(d => d.spendingChange < 0).length;

    return (
        <div className="w-full space-y-6">
            {/* Beautiful Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Total Spent</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold truncate">
                        {formatCurrency(summary.totalExpenseAmount)}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Daily Avg</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold truncate">
                        {formatCurrency(summary.averageDailyExpense || (summary.totalExpenseAmount / summary.totalDays))}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Peak Day</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold truncate">
                        {formatCurrency(summary.highestSpendingDay)}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Days</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold">
                        {summary.totalDays}
                    </p>
                </div>
            </div>

            {/* Chart Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Chart Type:</span>
                    <div className="flex bg-white rounded-lg border border-gray-200">
                        <button
                            onClick={() => setChartType('area')}
                            className={`px-3 py-1 rounded-l-lg text-sm font-medium transition-colors ${chartType === 'area'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Area
                        </button>
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-3 py-1 rounded-r-lg text-sm font-medium transition-colors ${chartType === 'line'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Line
                        </button>
                    </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showCumulative}
                        onChange={(e) => setShowCumulative(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Cumulative</span>
                </label>
            </div>

            {/* Beautiful Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
                <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'area' ? (
                            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0.1} />
                                    </linearGradient>
                                    {showCumulative && (
                                        <linearGradient id="cumulativeExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F97316" stopOpacity={0.6} />
                                            <stop offset="100%" stopColor="#F97316" stopOpacity={0.1} />
                                        </linearGradient>
                                    )}
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#EF4444"
                                    strokeWidth={3}
                                    fill="url(#expenseGradient)"
                                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#DC2626' }}
                                />

                                {showCumulative && (
                                    <Area
                                        type="monotone"
                                        dataKey="cumulativeTotal"
                                        stroke="#F97316"
                                        strokeWidth={2}
                                        fill="url(#cumulativeExpenseGradient)"
                                        dot={false}
                                        strokeDasharray="5 5"
                                    />
                                )}
                            </AreaChart>
                        ) : (
                            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={formatCurrency}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#EF4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#DC2626' }}
                                />

                                {showCumulative && (
                                    <Line
                                        type="monotone"
                                        dataKey="cumulativeTotal"
                                        stroke="#F97316"
                                        strokeWidth={2}
                                        dot={false}
                                        strokeDasharray="5 5"
                                    />
                                )}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Expense Insights */}
            {data.length > 1 && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                        <Target className="w-5 h-5 text-red-600" />
                        Spending Insights
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white/60 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">Spending Trend</p>
                            <p className="font-semibold text-gray-800">
                                {increasingTrend
                                    ? '📈 Generally Increasing'
                                    : '📉 Generally Decreasing'
                                }
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">High Spending Days</p>
                            <p className="font-semibold text-red-600">
                                {highSpendingDays} out of {data.length} days
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">Low Spending Days</p>
                            <p className="font-semibold text-green-600">
                                {lowSpendingDays} out of {data.length} days
                            </p>
                        </div>
                    </div>

                    {summary.spendingConsistency && (
                        <div className="mt-4 bg-white/60 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Spending Consistency:</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-16 h-2 rounded-full ${summary.spendingConsistency < 30 ? 'bg-green-400' :
                                            summary.spendingConsistency < 60 ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}></div>
                                    <span className="text-sm font-semibold">
                                        {summary.spendingConsistency < 30 ? 'Very Consistent' :
                                            summary.spendingConsistency < 60 ? 'Moderately Consistent' : 'Inconsistent'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomExpenseChart;