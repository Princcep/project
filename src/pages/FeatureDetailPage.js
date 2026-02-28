import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChartBarIcon, WrenchIcon, BoltIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const FeatureDetailPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const features = {
    monitoring: {
      title: 'Real-time Structural Monitoring',
      icon: <ChartBarIcon className="h-12 w-12 text-cyan-400" />,
      color: 'from-blue-600 to-blue-700',
      overview: 'Monitor every aspect of your bridge infrastructure in real-time with advanced sensor networks and instant data processing.',
      benefits: [
        'Continuous vibration monitoring',
        'Live stress analysis',
        'Temperature and humidity tracking',
        'Load distribution visualization',
        'Instant alerts for anomalies',
        '24/7 system oversight'
      ],
      technicalDetails: [
        'Sensor Network: 50+ IoT sensors',
        'Data Refresh Rate: 100ms',
        'Accuracy: ±0.1%',
        'Coverage: Full infrastructure',
        'Latency: <5 seconds',
        'Uptime: 99.9%'
      ],
      useCases: [
        'Heavy traffic monitoring during peak hours',
        'Structural deformation detection',
        'Environmental condition tracking',
        'Long-term trend analysis',
        'Emergency incident response',
        'Preventive maintenance planning'
      ]
    },
    maintenance: {
      title: 'Predictive Maintenance',
      icon: <WrenchIcon className="h-12 w-12 text-green-400" />,
      color: 'from-green-600 to-green-700',
      overview: 'Leverage AI and machine learning to predict equipment failures before they happen and optimize maintenance schedules.',
      benefits: [
        'Failure prediction 30 days in advance',
        'Maintenance cost reduction by 40%',
        'Downtime elimination',
        'Optimized scheduling',
        'Resource allocation',
        'Component lifespan extension'
      ],
      technicalDetails: [
        'Algorithm: Deep Learning LSTM',
        'Historical Data: 10+ years',
        'Prediction Accuracy: 92%',
        'False Positive Rate: <3%',
        'Update Frequency: Daily',
        'Processing Time: Real-time'
      ],
      useCases: [
        'Bearing wear prediction',
        'Corrosion detection',
        'Paint deterioration forecast',
        'Joint degradation analysis',
        'Cable fatigue monitoring',
        'Structural crack progression'
      ]
    },
    'risk-assessment': {
      title: 'AI-based Risk Assessment',
      icon: <BoltIcon className="h-12 w-12 text-purple-400" />,
      color: 'from-purple-600 to-purple-700',
      overview: 'Advanced machine learning algorithms analyze structural data to identify risks and provide risk scoring for proactive decision-making.',
      benefits: [
        'Early risk detection',
        'Risk scoring system',
        'Pattern recognition',
        'Anomaly identification',
        'Threat level classification',
        'Safety recommendations'
      ],
      technicalDetails: [
        'Models: Ensemble Learning',
        'Features Analyzed: 200+',
        'Risk Categories: 15',
        'Detection Speed: <1 second',
        'Confidence Level: 95%+',
        'Update Interval: Real-time'
      ],
      useCases: [
        'Natural disaster assessment',
        'Traffic overload risk',
        'Age-related deterioration',
        'Environmental hazard analysis',
        'Combined stress evaluation',
        'Safety threshold management'
      ]
    },
    visualization: {
      title: '3D Digital Twin Visualization',
      icon: <GlobeAltIcon className="h-12 w-12 text-orange-400" />,
      color: 'from-orange-600 to-orange-700',
      overview: 'Interact with a detailed 3D model of your bridge infrastructure with real-time data overlays and historical comparisons.',
      benefits: [
        'Interactive 3D modeling',
        'Real-time data overlay',
        'Historical comparison view',
        'Component-level analysis',
        'Multi-angle inspection',
        'Custom report generation'
      ],
      technicalDetails: [
        'Model Resolution: High-fidelity',
        'Update Rate: Real-time',
        'Data Points: 10,000+',
        'Rendering: WebGL',
        'Performance: 60 FPS',
        'File Size: Optimized'
      ],
      useCases: [
        'Design verification',
        'Structural integrity assessment',
        'Maintenance planning visualization',
        'Training and education',
        'Client presentations',
        'Construction progress tracking'
      ]
    }
  };

  const getFeatureId = () => {
    const path = window.location.pathname;
    return path.split('/').pop();
  };

  const featureId = getFeatureId();
  const feature = features[featureId];

  if (!feature) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-6">Feature not found</p>
          <button
            onClick={() => navigate('/features')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg"
          >
            Back to Features
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      {/* Header */}
      <div className={`bg-gradient-to-r ${feature.color} py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/features')}
            className="text-white hover:text-blue-200 mb-6 text-lg"
          >
            ← Back to Features
          </button>
          <div className="text-6xl mb-6">{feature.icon}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{feature.title}</h1>
          <p className="text-lg text-blue-100">{feature.overview}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border-b border-blue-500 border-opacity-30 rounded-t-lg flex">
          {['overview', 'benefits', 'technical', 'usecases'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 font-bold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white border-b-4 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'benefits' && 'Benefits'}
              {tab === 'technical' && 'Technical'}
              {tab === 'usecases' && 'Use Cases'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-t-0 border-blue-500 border-opacity-30 rounded-b-lg p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">{feature.overview}</p>
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 rounded-lg p-6">
                <p className="text-blue-200">
                  This feature is a cornerstone of the Smart Bridge Digital Twin Platform, 
                  designed to provide comprehensive monitoring and analysis capabilities.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-slate-700 bg-opacity-50 rounded-lg">
                    <span className="text-2xl">✓</span>
                    <span className="text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Technical Specifications</h2>
              <div className="space-y-3">
                {feature.technicalDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-700 bg-opacity-50 rounded-lg border-l-4 border-blue-500">
                    <span className="text-blue-400 font-bold">{idx + 1}</span>
                    <span className="text-gray-200">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'usecases' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Real-world Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feature.useCases.map((useCase, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-blue-500 bg-opacity-10 to-purple-500 bg-opacity-10 rounded-lg border border-blue-500 border-opacity-30">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold text-lg">{idx + 1}.</span>
                      <span className="text-gray-200">{useCase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-slate-800 bg-opacity-50 backdrop-blur-sm border border-blue-500 border-opacity-30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to get started?</h3>
          <p className="text-gray-300 mb-6">Experience this feature in your dashboard today.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition transform hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailPage;
