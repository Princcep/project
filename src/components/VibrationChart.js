import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const VibrationChart = ({ data }) => {
  return (
    <div className="card-glow border-2 border-cyan-500 border-opacity-60 w-full rounded-xl shadow-glow p-6 backdrop-blur-md">
      <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center space-x-3">
        <span className="text-3xl">📈</span>
        <span>Vibration Trend (Last 30 seconds)</span>
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(148, 163, 184, 0.2)"
            vertical={true}
            horizontal={true}
          />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            domain={[0, 30]}
            stroke="rgba(148, 163, 184, 0.3)"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            domain={[0, 100]}
            stroke="rgba(148, 163, 184, 0.3)"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              border: '2px solid #06b6d4',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}
            labelStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
            formatter={(value) => [value.toFixed(2), 'Vibration Level']}
            itemStyle={{ color: '#00ff88' }}
          />
          <Legend 
            wrapperStyle={{ color: '#94a3b8', fontWeight: '500' }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="vibration"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            name="Vibration Level (m/s²)"
            filter="drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VibrationChart;
