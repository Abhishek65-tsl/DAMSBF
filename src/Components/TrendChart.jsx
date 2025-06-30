
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Mon", value: 200 },
  { month: "Tue", value: 400 },
  { month: "Wed", value: 300 },
  { month: "Thur", value: 600 },
  { month: "Fri", value: 500 },
  { month: "Sat", value: 800 },
  { month: "Sun", value: 700 },
  
];

export default function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        {/* Gradient Fill */}
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c84ec4" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#366eff" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <XAxis dataKey="month" stroke="#cbd5e1" />
        <YAxis stroke="#cbd5e1" />
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "none",
            color: "#fff",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#c84ec4"
          fill="url(#colorValue)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}