import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#6B000D', '#002244', '#4B4B4B', '#D52027']; // dark red, navy blue, dark gray, bright red

export default function CapacityPieChart({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No user category data available.</p>;
  }

  return (
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={150}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
