import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import usePriceHistory from "../../../../hooks/usePriceHistory";


const PriceTrendChart = ({ productId }) => {
  if (!productId) return <p className="text-center mt-4 text-gray-500">Please select a product</p>;

  const { data, loading } = usePriceHistory(productId);

  if (loading) return <p className="text-center mt-4">Loading chart...</p>;
  if (!data.length) return <p className="text-center mt-4 text-gray-500">No price data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceTrendChart;
