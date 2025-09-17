import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PriceChart = ({ priceHistory }) => {
  const [selectedDate, setSelectedDate] = useState(priceHistory[priceHistory.length - 1].date);

  // Filter data up to selectedDate
  const filteredData = priceHistory.filter(item => item.date <= selectedDate);

  return (
    <div>
      <label>
        Compare up to date: 
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          {priceHistory.map((item) => (
            <option key={item.date} value={item.date}>{item.date}</option>
          ))}
        </select>
      </label>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
