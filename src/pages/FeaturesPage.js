import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ChartBarIcon, WrenchIcon, BoltIcon, GlobeAltIcon, UserGroupIcon, CogIcon, CubeIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../utils/AuthContext';

const FeaturesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isEngineer } = useAuth();

  // define features along with the roles that can access them
  const features = [
    {
      id: 'monitoring',
      title: 'Real-time Structural Monitoring',
      description: 'Monitor bridge vibration, load, and stress in real-time with advanced sensor integration',
      icon: <ChartBarIcon className="h-12 w-12 text-cyan-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-cyan-500 to-blue-600',
      roles: ['all', 'engineer', 'admin'],
      details: [
        '✓ Live vibration analysis',
        '✓ Load measurement sensors',
        '✓ Stress distribution monitoring',
        '✓ Temperature tracking',
        '✓ Humidity control system',
        '✓ Real-time alerts'
      ]
    },
    {
      id: 'maintenance',
      title: 'Predictive Maintenance',
      description: 'Get AI-powered maintenance recommendations based on wear patterns and sensor data',
      icon: <WrenchIcon className="h-12 w-12 text-green-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-green-500 to-emerald-600',
      roles: ['engineer', 'admin'],
      details: [
        '✓ Maintenance scheduling',
        '✓ Equipment health prediction',
        '✓ Failure risk analysis',
        '✓ Service recommendations',
        '✓ Cost optimization',
        '✓ Work order management'
      ]
    },
    {
      id: 'risk-assessment',
      title: 'AI-based Risk Assessment',
      description: 'Advanced algorithms detect structural risks early with machine learning capabilities',
      icon: <BoltIcon className="h-12 w-12 text-yellow-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-purple-500 to-pink-600',
      roles: ['engineer', 'admin'],
      details: [
        '✓ Machine learning algorithms',
        '✓ Pattern recognition',
        '✓ Anomaly detection',
        '✓ Risk scoring system',
        '✓ Predictive modeling',
        '✓ Safety thresholds'
      ]
    },
    {
      id: 'visualization',
      title: '3D Digital Twin Visualization',
      description: 'Interactive 3D model of your bridge infrastructure with detailed overlay data',
      icon: <GlobeAltIcon className="h-12 w-12 text-purple-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-orange-500 to-red-600',
      roles: ['engineer', 'admin'],
      details: [
        '✓ Interactive 3D model',
        '✓ Real-time data overlay',
        '✓ Component analysis',
        '✓ Structural health view',
        '✓ Historical comparison',
        '✓ Custom reporting'
      ]
    },
    // admin-only features
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Create, edit or remove users and assign roles to staff members',
      icon: <UserGroupIcon className="h-12 w-12 text-pink-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-purple-600 to-pink-600',
      roles: ['admin'],
      details: [
        '✓ Add new users',
        '✓ Change user roles',
        '✓ Disable accounts',
        '✓ View user activity logs'
      ]
    },
    {
      id: 'system-config',
      title: 'System Configuration',
      description: 'Adjust global settings, thresholds, and maintenance schedules for the platform',
      icon: <CogIcon className="h-12 w-12 text-blue-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-blue-600 to-cyan-600',
      roles: ['admin'],
      details: [
        '✓ Set risk thresholds',
        '✓ Configure alert rules',
        '✓ Manage API keys',
        '✓ Adjust notification preferences'
      ]
    },
    {
      id: 'bridge-creation',
      title: 'Bridge Administration',
      description: 'Add new bridges to the system and maintain metadata such as name and location',
      icon: <CubeIcon className="h-12 w-12 text-green-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-green-600 to-emerald-600',
      roles: ['admin'],
      details: [
        '✓ Create bridges',
        '✓ Edit bridge details',
        '✓ Remove obsolete bridges'
      ]
    },
  ];

  const handleFeatureClick = (featureId) => {
    navigate(`/feature/${featureId}`);
  };

  // apply role-based filtering
  const filteredFeatures = features.filter((f) => {
    if (!isAuthenticated) {
      // unauthenticated visitors only see generic/all features
      return f.roles.includes('all');
    }
    if (isAdmin) {
      // admin can see everything
      return true;
    }
    if (isEngineer) {
      // engineers see engineer+all features only
      return f.roles.includes('engineer') || f.roles.includes('all');
    }
    // default to showing only 'all' to other roles
    return f.roles.includes('all');
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Key Features</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explore all the powerful features of Smart Bridge Digital Twin Platform for professional infrastructure monitoring
          </p>
          <p className="text-sm text-yellow-300 mt-2">
            <em>Note: after logging in the list of features will adapt to your role. Admin users get extra options and an Admin Panel link appears in the navbar.</em>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {filteredFeatures.map((feature, idx) => {
            const restricted = feature.roles && feature.roles.length === 1 && feature.roles[0] === 'admin' && !isAdmin;
            return (
              <div
                key={feature.id}
                onClick={() => !restricted && handleFeatureClick(feature.id)}
                className={`cursor-pointer transform transition-all duration-500 hover:scale-105 active:scale-95 hover-lift animate-fade-in group ${restricted ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className={`card-glow border-2 border-cyan-500 border-opacity-40 rounded-xl p-8 h-full group-hover:border-opacity-100 shadow-glow group-hover:shadow-glow-lg`}>                
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transform transition-transform duration-500`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-3 group-hover:text-white transition-colors duration-300">{feature.title}</h2>
                  <p className="text-slate-300 mb-6 line-clamp-2 group-hover:text-slate-200 transition-colors">{feature.description}</p>
                  {restricted && (
                    <div className="text-xs text-yellow-300 italic mb-2">Admin only</div>
                  )}
                  
                  <div className="mb-6 space-y-2">
                    {feature.details.slice(0, 3).map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-300 group-hover:text-slate-200 transition-colors">
                        <span className="text-green-400">✓</span>
                        <span className="text-sm font-medium">{detail}</span>
                      </div>
                    ))}
                    <div className="text-cyan-400 text-sm pt-2 font-semibold">
                      + {feature.details.length - 3} more features
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-glow" disabled={restricted}>
                    Explore Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="card-glow border-2 border-cyan-500 border-opacity-60 rounded-xl p-12 backdrop-blur-md shadow-glow-lg">
          <h2 className="text-4xl font-bold text-cyan-400 mb-12 text-center">Why These Features Matter</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-elevated border-2 border-cyan-500 border-opacity-30 p-6 rounded-lg hover-lift">
              <BoltIcon className="h-10 w-10 mx-auto text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-cyan-400 mb-3">Real-time Intelligence</h3>
              <p className="text-slate-300 leading-relaxed">Get instant insights into your bridge's structural health with continuous monitoring and immediate alerts for critical issues.</p>
            </div>
            <div className="card-elevated border-2 border-green-500 border-opacity-30 p-6 rounded-lg hover-lift">
              <CurrencyDollarIcon className="h-10 w-10 mx-auto text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-green-400 mb-3">Cost Savings</h3>
              <p className="text-slate-300 leading-relaxed">Reduce maintenance costs by 40% through predictive analytics and optimized maintenance scheduling.</p>
            </div>
            <div className="card-elevated border-2 border-red-500 border-opacity-30 p-6 rounded-lg hover-lift">
              <ShieldCheckIcon className="h-10 w-10 mx-auto text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-red-400 mb-3">Safety First</h3>
              <p className="text-slate-300 leading-relaxed">Ensure public safety with AI-powered risk detection and early warning systems before failures occur.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
