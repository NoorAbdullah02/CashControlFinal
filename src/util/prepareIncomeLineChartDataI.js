// prepareIncomeLineChartData.js

/**
 * Prepares transaction data for beautiful income line chart visualization
 * Optimized for Bangladeshi Taka and modern 2025 design aesthetics
 * @param {Array} transactions - Array of transaction objects with date and amount
 * @returns {Array} Formatted chart data with cumulative totals and metadata
 */
const prepareIncomeLineChartData = (transactions) => {
    // Handle empty or invalid data
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        return [];
    }

    // Step 1: Group transactions by date and calculate daily totals
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
                    averageTransaction: 0
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

            return acc;
        } catch (error) {
            console.warn('Error processing transaction:', error, transaction);
            return acc;
        }
    }, {});

    // Step 2: Sort dates chronologically for proper line progression
    const sortedEntries = Object.entries(groupedTransactions)
        .sort(([, a], [, b]) => a.rawDate - b.rawDate);

    // Step 3: Calculate statistics and prepare enhanced chart data
    const totalTransactions = sortedEntries.reduce((sum, [, data]) => sum + data.transactionCount, 0);
    const totalAmount = sortedEntries.reduce((sum, [, data]) => sum + data.total, 0);
    const averageDailyIncome = totalAmount / sortedEntries.length;

    let cumulativeTotal = 0;
    const chartData = sortedEntries.map(([date, data], index) => {
        cumulativeTotal += data.total;

        // Calculate average transaction for this day
        data.averageTransaction = data.total / data.transactionCount;

        // Determine if this is a significant day (above average)
        const isSignificantDay = data.total > averageDailyIncome * 1.2;
        const isPeakDay = data.total === Math.max(...sortedEntries.map(([, d]) => d.total));

        // Calculate growth rate from previous day
        const previousTotal = index > 0 ? sortedEntries[index - 1][1].total : 0;
        const growthRate = previousTotal > 0 ? ((data.total - previousTotal) / previousTotal) * 100 : 0;

        return {
            date,
            amount: Math.round(data.total),
            cumulativeTotal: Math.round(cumulativeTotal),
            transactionCount: data.transactionCount,
            averageTransaction: Math.round(data.averageTransaction),
            isSignificant: isSignificantDay,
            isPeak: isPeakDay,
            growthRate: Math.round(growthRate * 100) / 100,
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
                percentOfTotal: Math.round((data.total / totalAmount) * 10000) / 100
            }
        };
    });

    // Add summary statistics
    if (chartData.length > 0) {
        chartData.summary = {
            totalDays: chartData.length,
            totalAmount: Math.round(totalAmount),
            totalTransactions,
            averageDailyIncome: Math.round(averageDailyIncome),
            highestDay: Math.max(...chartData.map(d => d.amount)),
            lowestDay: Math.min(...chartData.map(d => d.amount)),
            formattedTotal: formatBangladeshiCurrency(totalAmount),
            formattedAverage: formatBangladeshiCurrency(averageDailyIncome)
        };
    }

    return chartData;
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
export const formatCurrencyEnglish = (amount) => {
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
 * Get beautiful gradient colors for income trends
 * @param {number} growthRate - Growth percentage
 * @returns {string} CSS gradient class
 */
export const getIncomeGradient = (growthRate) => {
    if (growthRate > 20) return 'from-emerald-500 to-green-400';
    if (growthRate > 0) return 'from-blue-500 to-cyan-400';
    if (growthRate < -20) return 'from-red-500 to-orange-400';
    if (growthRate < 0) return 'from-orange-500 to-yellow-400';
    return 'from-gray-500 to-slate-400';
};

/**
 * Get trend emoji for fun display
 * @param {number} growthRate - Growth percentage
 * @returns {string} Emoji representing trend
 */
export const getTrendEmoji = (growthRate) => {
    if (growthRate > 20) return '🚀';
    if (growthRate > 5) return '📈';
    if (growthRate > 0) return '⬆️';
    if (growthRate < -20) return '📉';
    if (growthRate < 0) return '⬇️';
    return '➡️';
};

export default prepareIncomeLineChartData;