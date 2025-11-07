import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Area,
  AreaChart,
  Legend,
  ReferenceLine
} from "recharts";
import usePriceHistory from "../../../../hooks/usePriceHistory";
import { 
  FaChartLine, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaArrowUp, 
  FaArrowDown,
  FaCalendarAlt,
  FaDollarSign
} from "react-icons/fa";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <p className="text-gray-600 font-semibold mb-2 flex items-center gap-2">
          <FaCalendarAlt className="text-blue-500" />
          {label}
        </p>
        <div className="space-y-1">
          <p className="text-gray-800 font-bold flex items-center gap-2">
            <FaDollarSign className="text-green-500" />
            Price: <span className="text-green-600">${payload[0].value?.toFixed(2)}</span>
          </p>
          {payload[0].payload.change && (
            <p className={`text-sm flex items-center gap-1 ${
              payload[0].payload.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {payload[0].payload.change >= 0 ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
              {Math.abs(payload[0].payload.change)}% 
              {payload[0].payload.change >= 0 ? ' increase' : ' decrease'}
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Loading Skeleton Component
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded mb-4"></div>
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

// Calculate price statistics
const calculateStats = (data) => {
  if (!data.length) return null;
  
  const prices = data.map(item => item.price);
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2] || currentPrice;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const change = ((currentPrice - previousPrice) / previousPrice) * 100;
  
  return {
    currentPrice,
    previousPrice,
    minPrice,
    maxPrice,
    change,
    isIncreasing: change >= 0,
    priceRange: maxPrice - minPrice
  };
};

const PriceTrendChart = ({ productId, productName }) => {
  const { data, loading, error } = usePriceHistory(productId);

  if (!productId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaInfoCircle className="text-yellow-500 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Product Selection Required
        </h3>
        <p className="text-yellow-600">
          Please select a product to view price trends and historical data.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Unable to Load Price Data
        </h3>
        <p className="text-red-600 mb-4">
          There was an error loading the price trend information.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaChartLine className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Price Data Available
        </h3>
        <p className="text-gray-500">
          Historical price data is not available for this product yet.
        </p>
      </div>
    );
  }

  // Process data for chart
  const chartData = data.map((item, index) => {
    const previousPrice = index > 0 ? data[index - 1].price : item.price;
    const change = ((item.price - previousPrice) / previousPrice) * 100;
    
    return {
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      change: isFinite(change) ? change : 0
    };
  });

  const stats = calculateStats(data);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <FaChartLine className="text-green-500" />
            Price Trends
          </h2>
          {productName && (
            <p className="text-gray-600 text-sm">
              Historical pricing for <span className="font-semibold">{productName}</span>
            </p>
          )}
        </div>
        
        {/* Stats Summary */}
        {stats && (
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="text-center">
              <div className={`text-lg font-bold flex items-center gap-1 ${
                stats.isIncreasing ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.isIncreasing ? <FaArrowUp size={14} /> : <FaArrowDown size={14} />}
                ${stats.currentPrice.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className={`text-sm font-semibold ${
                stats.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Change</div>
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              vertical={false}
            />
            
            <XAxis 
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
            />
            
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `$${value}`}
              width={60}
            />
            
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Reference line for average price */}
            {stats && (
              <ReferenceLine 
                y={stats.currentPrice} 
                stroke="#6b7280" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Current', 
                  position: 'right',
                  fill: '#6b7280',
                  fontSize: 12
                }} 
              />
            )}
            
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
              name="Price ($)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Statistics */}
      {stats && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${stats.currentPrice.toFixed(2)}
            </div>
            <div className="text-xs text-blue-500 font-medium">Current Price</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${stats.minPrice.toFixed(2)}
            </div>
            <div className="text-xs text-green-500 font-medium">Lowest Price</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${stats.maxPrice.toFixed(2)}
            </div>
            <div className="text-xs text-purple-500 font-medium">Highest Price</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${stats.priceRange.toFixed(2)}
            </div>
            <div className="text-xs text-orange-500 font-medium">Price Range</div>
          </div>
        </div>
      )}

      {/* Chart Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" />
          Price Insights
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Track price fluctuations over time</li>
          <li>• Identify the best time to buy</li>
          <li>• Compare current price with historical data</li>
          {stats && stats.change !== 0 && (
            <li className={stats.change >= 0 ? 'text-red-600' : 'text-green-600'}>
              • Price has {stats.change >= 0 ? 'increased' : 'decreased'} by {Math.abs(stats.change).toFixed(1)}% from previous period
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PriceTrendChart;