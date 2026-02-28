import React from 'react';

const RiskMeter = ({ riskScore, vibration, crack, load }) => {
  // Determine risk level
  const getRiskLevel = () => {
    if (riskScore > 75) return { 
      level: 'CRITICAL', 
      color: 'text-red-400', 
      bgColor: 'bg-red-500 bg-opacity-20', 
      borderColor: 'border-red-500',
      icon: '🔴'
    };
    if (riskScore > 50) return { 
      level: 'HIGH', 
      color: 'text-orange-400', 
      bgColor: 'bg-orange-500 bg-opacity-20', 
      borderColor: 'border-orange-500',
      icon: '🟠'
    };
    if (riskScore > 25) return { 
      level: 'MEDIUM', 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-500 bg-opacity-20', 
      borderColor: 'border-yellow-500',
      icon: '🟡'
    };
    return { 
      level: 'LOW', 
      color: 'text-green-400', 
      bgColor: 'bg-green-500 bg-opacity-20', 
      borderColor: 'border-green-500',
      icon: '🟢'
    };
  };

  const riskLevel = getRiskLevel();
  const progressColor = riskScore > 50 ? 'from-red-500 to-orange-500' : riskScore > 25 ? 'from-yellow-500 to-orange-500' : 'from-cyan-500 to-blue-500';

  return (
    <div className={`card-glow border-2 ${riskLevel.borderColor} ${riskLevel.bgColor} backdrop-blur-md`}>
      <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center space-x-3">
        <span className="text-3xl">📊</span>
        <span>Structural Risk Assessment</span>
      </h3>
      
      {/* Risk Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90 drop-shadow-glow">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${(riskScore / 100) * 439.82} 439.82`}
              className="transition-all duration-750"
              strokeLinecap="round"
              filter="drop-shadow(0 0 10px rgba(6, 182, 212, 0.6))"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={riskScore > 50 ? "#ef4444" : riskScore > 25 ? "#f97316" : "#06b6d4"} />
                <stop offset="100%" stopColor={riskScore > 50 ? "#f97316" : riskScore > 25 ? "#eab308" : "#0ea5e9"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <p className={`text-5xl font-bold ${riskLevel.color} glow-text`}>
              {riskScore.toFixed(1)}
            </p>
            <p className="text-sm text-slate-400 font-semibold">/ 100</p>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className={`text-center mb-6 py-3 px-4 rounded-lg ${riskLevel.bgColor} border-2 ${riskLevel.borderColor}`}>
        <p className={`text-2xl font-bold ${riskLevel.color} flex items-center justify-center space-x-2`}>
          <span className="text-3xl">{riskLevel.icon}</span>
          <span>{riskLevel.level} RISK</span>
        </p>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📈</span>
            <span className="font-semibold text-slate-300">Vibration (40%):</span>
          </div>
          <span className="font-bold text-cyan-400 text-lg">{vibration.toFixed(2)}</span>
        </div>
        <div className="w-full bg-slate-700 bg-opacity-40 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 shadow-glow"
            style={{ width: `${Math.min((vibration / 100) * 100, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔍</span>
            <span className="font-semibold text-slate-300">Crack Width (30%):</span>
          </div>
          <span className="font-bold text-yellow-400 text-lg">{crack.toFixed(2)}</span>
        </div>
        <div className="w-full bg-slate-700 bg-opacity-40 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500 shadow-glow"
            style={{ width: `${Math.min((crack / 100) * 100, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl">⚖️</span>
            <span className="font-semibold text-slate-300">Load Stress (30%):</span>
          </div>
          <span className="font-bold text-orange-400 text-lg">{load.toFixed(2)}</span>
        </div>
        <div className="w-full bg-slate-700 bg-opacity-40 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 shadow-glow"
            style={{ width: `${Math.min((load / 100) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Risk Formula */}
      <div className="p-4 bg-cyan-500 bg-opacity-10 border-2 border-cyan-500 border-opacity-30 rounded-lg backdrop-blur-sm">
        <p className="text-xs text-slate-300 font-mono text-center">
          <span className="text-cyan-400 font-bold">📐 Risk Formula:</span>
          <br />
          Risk = (V × 0.4) + (C × 0.3) + (L × 0.3)
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;
