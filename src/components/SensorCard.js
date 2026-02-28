import React from 'react';

const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  min, 
  max, 
  threshold 
}) => {
  // Determine color based on threshold
  const getCardStyle = () => {
    if (threshold && value > threshold) {
      return 'border-red-500 bg-gradient-to-br from-red-900 to-red-800 bg-opacity-40 hover:shadow-lg hover:shadow-red-500/50';
    }
    if (value > (max * 0.75)) {
      return 'border-yellow-500 bg-gradient-to-br from-yellow-900 to-yellow-800 bg-opacity-40 hover:shadow-lg hover:shadow-yellow-500/50';
    }
    return 'border-cyan-500 bg-gradient-to-br from-cyan-900 to-cyan-800 bg-opacity-40 hover:shadow-lg hover:shadow-cyan-500/50';
  };

  const getValueColor = () => {
    if (threshold && value > threshold) {
      return 'text-red-400';
    }
    if (value > (max * 0.75)) {
      return 'text-yellow-400';
    }
    return 'text-cyan-400';
  };

  const getProgressColor = () => {
    if (value > (max * 0.75)) {
      return 'bg-gradient-to-r from-red-500 to-red-400';
    }
    return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  };

  const getProgressBgColor = () => {
    if (threshold && value > threshold) {
      return 'bg-red-900 bg-opacity-30';
    }
    if (value > (max * 0.75)) {
      return 'bg-yellow-900 bg-opacity-30';
    }
    return 'bg-slate-700 bg-opacity-50';
  };

  return (
    <div className={`card-glow border-2 ${getCardStyle()} transform hover:scale-105 transition-all duration-500 group`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors duration-300">{title}</h3>
        <div className="text-4xl transform group-hover:rotate-12 transition-transform duration-500">{icon}</div>
      </div>
      
      <div className="mb-6">
        <p className={`text-5xl font-bold ${getValueColor()} transition-colors duration-300`}>
          {value.toFixed(2)}
        </p>
        <p className="text-sm text-slate-400 mt-2 font-semibold">{unit}</p>
      </div>

      {/* Progress bar */}
      <div className={`w-full ${getProgressBgColor()} rounded-full h-3 overflow-hidden`}>
        <div
          className={`h-3 rounded-full transition-all duration-500 shadow-glow ${getProgressColor()}`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400 mt-4 font-semibold">
        <span className="hover:text-slate-300 transition-colors">Min: {min.toFixed(2)}</span>
        <span className="hover:text-slate-300 transition-colors">Max: {max.toFixed(2)}</span>
      </div>

      {/* Threshold indicator */}
      {threshold && (
        <div className={`mt-4 px-3 py-2 rounded-lg text-xs font-bold text-center ${
          value > threshold 
            ? 'bg-red-500 bg-opacity-30 text-red-400 border border-red-500 border-opacity-50'
            : 'bg-yellow-500 bg-opacity-20 text-yellow-400 border border-yellow-500 border-opacity-30'
        }`}>
          ⚠️ Threshold: {threshold.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default SensorCard;
