import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import useAxios from "../../../hooks/useAxios";

const PriceComparisonChart = ({ productId }) => {
  const axiosPrivate = useAxios();
  const [compareData, setCompareData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // ব্যবহারকারী যে দিন তুলনা করবে

  // Fetch comparison data from API
  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await axiosPrivate.get(`/product/${productId}/price-comparison`, {
          params: { date: selectedDate }
        });
        setCompareData(res.data); // [{name: 'Yesterday', Tomato: 50, Onion: 30}, ...]
      } catch (err) {
        console.error("Fetch comparison error:", err);
      }
    };

    if (productId) fetchComparison();
  }, [productId, selectedDate]);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-2">Comparison with Previous Data</h3>

      {/* Date selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Chart */}
      <BarChart width={600} height={300} data={compareData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* প্রতিটি item এর জন্য Bar */}
        {compareData[0] &&
          Object.keys(compareData[0])
            .filter((key) => key !== "name")
            .map((key, index) => (
              <Bar key={index} dataKey={key} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
            ))}
      </BarChart>
    </div>
  );
};

export default PriceComparisonChart;
