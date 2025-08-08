import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, Calendar, BarChart3, Sparkles } from 'lucide-react';

const CustomIncomeChart = ({ data = [] }) => {
    const [chartType, setChartType] = useState('area'); // 'line' or 'area'
    const [showCumulative, setShowCumulative] = useState(false);

    // If no data, show beautiful empty state
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Income Data Yet</h3>
                <p className="text-gray-500 text-center max-w-md">
                    Start adding your income sources to see beautiful visualizations of your earning trends
                </p>
            </div>
        );
    }

    // Get summary data
    const summary = data.summary || {
        totalAmount: data.reduce((sum, item) => sum + (item.amount || 0), 0),
        totalDays: data.length,
        averageDailyIncome: 0,
        highestDay: Math.max(...data.map(d => d.amount || 0))
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
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <p className="font-semibold text-gray-800">{label}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Daily Income:</span>
                            <span className="font-bold text-green-600 text-lg">
                                {formatCurrency(data.amount)}
                            </span>
                        </div>

                        {showCumulative && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Cumulative:</span>
                                <span className="font-semibold text-blue-600">
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

                        {data.growthRate !== undefined && data.growthRate !== 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Growth:</span>
                                <span className={`font-semibold ${data.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {data.growthRate > 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
                                </span>
                            </div>
                        )}

                        {data.isPeak && (
                            <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full text-center">
                                🏆 Peak Day
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full space-y-6">
            {/* Beautiful Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Total Income</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold truncate">
                        {formatCurrency(summary.totalAmount)}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Daily Avg</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold truncate">
                        {formatCurrency(summary.averageDailyIncome || (summary.totalAmount / summary.totalDays))}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 md:p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm font-medium opacity-90">Best Day</span>
                    </div>
                    <p className="text-lg md:text-xl font-bold truncate">
                        {formatCurrency(summary.highestDay)}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 md:p-4 text-white">
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
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Area
                        </button>
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-3 py-1 rounded-r-lg text-sm font-medium transition-colors ${chartType === 'line'
                                    ? 'bg-blue-600 text-white'
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
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                                    </linearGradient>
                                    {showCumulative && (
                                        <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
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
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fill="url(#incomeGradient)"
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#059669' }}
                                />

                                {showCumulative && (
                                    <Area
                                        type="monotone"
                                        dataKey="cumulativeTotal"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        fill="url(#cumulativeGradient)"
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
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#059669' }}
                                />

                                {showCumulative && (
                                    <Line
                                        type="monotone"
                                        dataKey="cumulativeTotal"
                                        stroke="#3B82F6"
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

            {/* Income Insights */}
            {data.length > 1 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        Income Insights
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/60 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">Growth Trend</p>
                            <p className="font-semibold text-gray-800">
                                {data.filter(d => d.growthRate > 0).length > data.filter(d => d.growthRate < 0).length
                                    ? '📈 Generally Increasing'
                                    : '📉 Generally Decreasing'
                                }
                            </p>
                        </div>

                        <div className="bg-white/60 rounded-lg p-3">
                            <p className="text-gray-600 mb-1">Peak Days</p>
                            <p className="font-semibold text-gray-800">
                                {data.filter(d => d.isPeak).length} highest earning day{data.filter(d => d.isPeak).length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomIncomeChart;