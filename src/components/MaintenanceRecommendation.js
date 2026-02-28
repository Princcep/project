import React, { useMemo } from 'react';

/**
 * Maintenance Recommendation Engine Component
 * Displays maintenance recommendations based on risk score
 */

const MaintenanceRecommendation = ({ riskScore }) => {
  // Generate recommendation details using useMemo for performance
  const details = useMemo(() => {
    if (riskScore < 40) {
      return {
        recommendation: "Routine Monitoring Recommended",
        priority: "LOW",
        bgColor: "bg-green-900 bg-opacity-20",
        borderColor: "border-green-500",
        textColor: "text-green-400",
        badgeColor: "bg-green-500 text-white",
        icon: "✅",
        actionItems: [
          "Continue regular monitoring schedule",
          "Review data logs weekly",
          "No immediate action required",
          "Maintain standard maintenance protocols",
        ],
        timeline: "Next scheduled inspection: 30 days",
        description: "Bridge is operating within normal parameters. Continue with standard maintenance protocols.",
      };
    }
    if (riskScore >= 40 && riskScore < 75) {
      return {
        recommendation: "Schedule Structural Inspection Within 7 Days",
        priority: "MEDIUM",
        bgColor: "bg-yellow-900 bg-opacity-20",
        borderColor: "border-yellow-500",
        textColor: "text-yellow-400",
        badgeColor: "bg-yellow-500 text-white",
        icon: "⚠️",
        actionItems: [
          "Schedule inspection within 7 days",
          "Increase monitoring frequency to daily",
          "Document sensor anomalies",
          "Alert maintenance team immediately",
        ],
        timeline: "Action required within: 7 days",
        description: "Structural integrity showing elevated stress levels. Professional inspection recommended to ensure continued safety.",
      };
    }
    return {
      recommendation: "Immediate Load Restriction & Emergency Inspection Required",
      priority: "CRITICAL",
      bgColor: "bg-red-900 bg-opacity-20",
      borderColor: "border-red-500",
      textColor: "text-red-400",
      badgeColor: "bg-red-600 text-white",
      icon: "🚨",
      actionItems: [
        "🔴 IMMEDIATE: Restrict vehicle loads",
        "🚦 Implement emergency traffic control",
        "🔧 Emergency structural inspection required",
        "📢 Notify authorities immediately",
        "🚫 Divert traffic if necessary",
      ],
      timeline: "Action required: IMMEDIATE (within 24 hours)",
      description: "CRITICAL: Bridge detected with severe structural stress. Immediate action and emergency inspection required.",
    };
  }, [riskScore]);

  return (
    <div className={`card-glow border-2 ${details.borderColor} ${details.bgColor} backdrop-blur-md transition-all duration-300 hover-lift`}>
      {/* Header with Icon and Priority Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl transform animate-bounce">{details.icon}</span>
          <h3 className="text-2xl font-bold text-cyan-400">Maintenance Recommendation</h3>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${details.badgeColor} shadow-lg`}>
          {details.priority}
        </span>
      </div>

      {/* Main Recommendation Text */}
      <div className={`mb-6 p-5 rounded-lg bg-slate-800 bg-opacity-40 border-2 ${details.borderColor} border-opacity-40`}>
        <p className={`text-xl font-bold ${details.textColor} mb-3`}>
          {details.recommendation}
        </p>
        <p className="text-slate-300 leading-relaxed">
          {details.description}
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-6 flex items-center gap-3 text-sm font-bold text-cyan-400 bg-slate-800 bg-opacity-40 p-4 rounded-lg">
        <span className="text-2xl">⏱️</span>
        <span>{details.timeline}</span>
      </div>

      {/* Action Items */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-cyan-400 mb-4 flex items-center space-x-2">
          <span>✓</span>
          <span>Required Actions:</span>
        </h4>
        <ul className="space-y-3">
          {details.actionItems.map((item, index) => (
            <li
              key={index}
              className={`text-base flex items-start gap-3 p-3 rounded-lg bg-slate-800 bg-opacity-30 border border-slate-600 border-opacity-50 ${details.textColor}`}
            >
              <span className="text-xl mt-0.5">→</span>
              <span className="font-semibold">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Score Meter */}
      <div className="card-elevated border-2 border-cyan-500 border-opacity-40 rounded-lg p-5 mb-6 text-center">
        <p className="text-sm text-slate-400 mb-3 font-semibold">Current Risk Score</p>
        <div className="flex items-center justify-center gap-3">
          <p className={`text-5xl font-bold ${details.textColor} glow-text`}>
            {riskScore.toFixed(1)}
          </p>
          <p className="text-lg text-slate-400 font-semibold">/ 100</p>
        </div>
        <div className="mt-4 w-full bg-slate-700 bg-opacity-50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 shadow-glow ${
              riskScore < 40
                ? "bg-gradient-to-r from-green-500 to-emerald-400"
                : riskScore < 75
                ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                : "bg-gradient-to-r from-red-600 to-pink-500"
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-4 bg-cyan-500 bg-opacity-15 rounded-lg border-2 border-cyan-500 border-opacity-30 backdrop-blur-sm">
        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="text-cyan-400 font-bold">📋 Disclaimer:</span>
          <br />
          This recommendation is based on real-time sensor data analysis. Always conduct professional inspections
          and consult with qualified structural engineers for critical decisions.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceRecommendation;
