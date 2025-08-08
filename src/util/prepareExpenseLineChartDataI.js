// prepareExpenseLineChartData.js

/**
 * Prepares expense transaction data for beautiful expense line chart visualization
 * Optimized for Bangladeshi Taka and modern 2025 design aesthetics
 * @param {Array} transactions - Array of expense transaction objects with date and amount
 * @returns {Array} Formatted chart data with cumulative totals and expense-specific metadata
 */
const prepareExpenseLineChartData = (transactions) => {
    // Handle empty or invalid data
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        return [];
    }

    // Step 1: Group transactions by date and calculate daily expense totals
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        try {
            // Parse and format date to beautiful display format (e.g., "৬ জুলাই" or "6 Jul")
            const date = new Date(transaction.date);

            // Handle invalid dates
            if (isNaN(date.getTime())) {
                console.warn('Invalid date found:', transaction.date);
                return acc;
            }

            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const formattedDate = `${day} ${month}`;

            // Initialize date group if it doesn't exist
            if (!acc[formattedDate]) {
                acc[formattedDate] = {
                    total: 0,
                    rawDate: date,
                    transactionCount: 0,
                    details: [],
                    averageTransaction: 0,
                    categories: new Set() // Track expense categories
                };
            }

            // Add transaction data
            const amount = parseFloat(transaction.amount) || 0;
            acc[formattedDate].total += amount;
            acc[formattedDate].transactionCount += 1;
            acc[formattedDate].details.push({
                ...transaction,
                amount: amount
            });

            // Track categories for expense analysis
            if (transaction.category || transaction.categoryName) {
                acc[formattedDate].categories.add(transaction.category || transaction.categoryName);
            }

            return acc;
        } catch (error) {
            console.warn('Error processing expense transaction:', error, transaction);
            return acc;
        }
    }, {});

    // Step 2: Sort dates chronologically for proper line progression
    const sortedEntries = Object.entries(groupedTransactions)
        .sort(([, a], [, b]) => a.rawDate - b.rawDate);

    // Step 3: Calculate expense-specific statistics
    const totalTransactions = sortedEntries.reduce((sum, [, data]) => sum + data.transactionCount, 0);
    const totalExpenseAmount = sortedEntries.reduce((sum, [, data]) => sum + data.total, 0);
    const averageDailyExpense = totalExpenseAmount / sortedEntries.length;

    // Find expense patterns
    const allCategories = new Set();
    sortedEntries.forEach(([, data]) => {
        data.categories.forEach(cat => allCategories.add(cat));
    });

    let cumulativeTotal = 0;
    const chartData = sortedEntries.map(([date, data], index) => {
        cumulativeTotal += data.total;

        // Calculate average transaction for this day
        data.averageTransaction = data.total / data.transactionCount;

        // Determine spending patterns
        const isHighSpendingDay = data.total > averageDailyExpense * 1.3;
        const isPeakSpendingDay = data.total === Math.max(...sortedEntries.map(([, d]) => d.total));
        const isLowSpendingDay = data.total < averageDailyExpense * 0.7;

        // Calculate spending change from previous day
        const previousTotal = index > 0 ? sortedEntries[index - 1][1].total : 0;
        const spendingChange = previousTotal > 0 ? ((data.total - previousTotal) / previousTotal) * 100 : 0;

        // Determine spending trend (for expenses, increases are concerning)
        const spendingTrend = index === 0 ? 'neutral' :
            spendingChange > 30 ? 'high-increase' :
                spendingChange > 0 ? 'increase' :
                    spendingChange < -30 ? 'major-decrease' :
                        spendingChange < 0 ? 'decrease' : 'stable';

        // Convert categories Set to Array for easier handling
        const categoriesArray = Array.from(data.categories);

        return {
            date,
            amount: Math.round(data.total),
            cumulativeTotal: Math.round(cumulativeTotal),
            transactionCount: data.transactionCount,
            averageTransaction: Math.round(data.averageTransaction),
            isHighSpending: isHighSpendingDay,
            isPeakSpending: isPeakSpendingDay,
            isLowSpending: isLowSpendingDay,
            spendingChange: Math.round(spendingChange * 100) / 100,
            spendingTrend,
            categories: categoriesArray,
            categoryCount: categoriesArray.length,
            details: data.details,
            // Beautiful formatting for tooltips
            formattedAmount: formatBangladeshiCurrency(data.total),
            formattedCumulative: formatBangladeshiCurrency(cumulativeTotal),
            // Metadata for enhanced display
            metadata: {
                dayOfWeek: data.rawDate.toLocaleDateString('en-US', { weekday: 'long' }),
                fullDate: data.rawDate.toLocaleDateString('en-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                percentOfTotal: Math.round((data.total / totalExpenseAmount) * 10000) / 100,
                expenseIntensity: isHighSpendingDay ? 'High' : isLowSpendingDay ? 'Low' : 'Normal'
            }
        };
    });

    // Step 4: Add expense-specific summary statistics
    if (chartData.length > 0) {
        const spendingChanges = chartData.map(d => d.spendingChange).filter(change => !isNaN(change));
        chartData.summary = {
            totalDays: chartData.length,
            totalExpenseAmount: Math.round(totalExpenseAmount),
            totalTransactions,
            averageDailyExpense: Math.round(averageDailyExpense),
            highestSpendingDay: Math.max(...chartData.map(d => d.amount)),
            lowestSpendingDay: Math.min(...chartData.map(d => d.amount)),
            mostActiveDay: Math.max(...chartData.map(d => d.transactionCount)),
            biggestSpendingIncrease: spendingChanges.length > 0 ? Math.max(...spendingChanges) : 0,
            totalCategories: allCategories.size,
            spendingConsistency: calculateSpendingConsistency(chartData.map(d => d.amount)),
            formattedTotal: formatBangladeshiCurrency(totalExpenseAmount),
            formattedAverage: formatBangladeshiCurrency(averageDailyExpense)
        };
    }

    return chartData;
};

/**
 * Helper function to calculate spending consistency (lower is more consistent)
 * @param {Array} amounts - Array of daily spending amounts
 * @returns {number} Consistency score (0-100, lower is more consistent)
 */
const calculateSpendingConsistency = (amounts) => {
    if (amounts.length < 2) return 100;

    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);

    // Convert to a 0-100 scale where lower is more consistent
    const coefficientOfVariation = (standardDeviation / mean) * 100;
    return Math.min(Math.round(coefficientOfVariation), 100);
};

/**
 * Beautiful Bangladeshi Taka formatter with proper locale
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatBangladeshiCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '৳০';

    // Format with Bengali numerals and proper spacing
    const formatted = amount.toLocaleString('bn-BD', {
        style: 'currency',
        currency: 'BDT',
        currencyDisplay: 'symbol'
    });

    // Clean up and ensure beautiful display
    return formatted.replace('BDT', '৳').replace(/\s+/g, ' ');
};

/**
 * Alternative English number format for better chart readability
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string with English numerals
 */
export const formatExpenseCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '৳0';

    // Use English numerals for better chart readability
    if (amount >= 10000000) { // 1 crore
        return `৳${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
        return `৳${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand
        return `৳${(amount / 1000).toFixed(1)}K`;
    }

    return `৳${amount.toLocaleString()}`;
};

/**
 * Get beautiful gradient colors for expense trends (red-based for expenses)
 * @param {string} spendingTrend - Spending trend direction
 * @returns {string} CSS gradient class
 */
export const getExpenseGradient = (spendingTrend) => {
    switch (spendingTrend) {
        case 'high-increase': return 'from-red-600 to-rose-500'; // Bad for expenses
        case 'increase': return 'from-orange-500 to-red-400'; // Concerning for expenses
        case 'stable': return 'from-blue-500 to-indigo-400'; // Neutral
        case 'decrease': return 'from-green-500 to-emerald-400'; // Good for expenses
        case 'major-decrease': return 'from-emerald-600 to-green-400'; // Very good for expenses
        default: return 'from-gray-500 to-slate-400';
    }
};

/**
 * Get spending trend color (expense-focused colors)
 * @param {string} spendingTrend - Spending trend direction
 * @returns {string} CSS color class
 */
export const getSpendingTrendColor = (spendingTrend) => {
    switch (spendingTrend) {
        case 'high-increase': return 'text-red-600'; // Bad for expenses
        case 'increase': return 'text-orange-600'; // Concerning for expenses
        case 'stable': return 'text-blue-600'; // Neutral
        case 'decrease': return 'text-green-600'; // Good for expenses
        case 'major-decrease': return 'text-emerald-600'; // Very good for expenses
        default: return 'text-gray-600';
    }
};

/**
 * Get trend emoji for expense display
 * @param {string} spendingTrend - Spending trend direction
 * @returns {string} Emoji representing trend
 */
export const getExpenseTrendEmoji = (spendingTrend) => {
    switch (spendingTrend) {
        case 'high-increase': return '🚨'; // Alert for high spending
        case 'increase': return '📈'; // Increasing spending
        case 'stable': return '➡️'; // Stable spending
        case 'decrease': return '📉'; // Decreasing spending (good)
        case 'major-decrease': return '💰'; // Major savings
        default: return '➡️';
    }
};

/**
 * Helper function to get expense intensity badge style
 * @param {string} intensity - Expense intensity level
 * @returns {string} CSS classes for badge styling
 */
export const getExpenseIntensityStyle = (intensity) => {
    switch (intensity) {
        case 'High': return 'bg-red-100 text-red-800 border-red-200';
        case 'Low': return 'bg-green-100 text-green-800 border-green-200';
        case 'Normal': return 'bg-blue-100 text-blue-800 border-blue-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export default prepareExpenseLineChartData;