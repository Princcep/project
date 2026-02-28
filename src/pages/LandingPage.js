import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBarIcon, WrenchIcon, BoltIcon, GlobeAltIcon, CheckBadgeIcon, ClockIcon, EyeIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      title: 'Real-time Monitoring',
      description: 'Monitor bridge vibration, load, and stress with live sensor data',
      icon: <ChartBarIcon className="h-12 w-12 mx-auto text-cyan-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Predictive Maintenance',
      description: 'AI-powered maintenance recommendations to prevent failures',
      icon: <WrenchIcon className="h-12 w-12 mx-auto text-green-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Risk Assessment',
      description: 'Advanced algorithms detect structural risks early and accurately',
      icon: <BoltIcon className="h-12 w-12 mx-auto text-yellow-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: '3D Digital Twin',
      description: 'Interactive 3D visualization of your entire bridge infrastructure',
      icon: <GlobeAltIcon className="h-12 w-12 mx-auto text-purple-400 group-hover:text-white transition-colors duration-300" />,
      gradient: 'from-purple-500 to-pink-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-500 border-opacity-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <img src="/logo.svg" alt="Smart Bridge" className="h-8 w-auto group-hover:scale-110 transition-transform duration-300" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Smart Bridge</h1>
          </div>
          <div className="space-x-4 flex items-center">
            <Link to="/login" className="px-6 py-2 text-slate-300 hover:text-cyan-400 transition-colors duration-300 font-semibold">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-glow transform hover:scale-105 active:scale-95">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Smart Bridge<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Digital Twin Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Advanced structural health monitoring and predictive maintenance for critical infrastructure.
            <span className="block mt-3 text-cyan-400 font-semibold">Detect risks early with AI-powered analysis and real-time sensor data.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="btn-primary shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Login to Dashboard</span>
            </Link>
            <Link
              to="/demo"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 border-2 border-cyan-500 border-opacity-50 hover:border-opacity-100 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <EyeIcon className="h-5 w-5" />
              <span>View Demo</span>
            </Link>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="card-glow mb-20 border-2 border-cyan-500 border-opacity-40 hover:border-opacity-100">
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center space-x-3">
            <CheckBadgeIcon className="h-6 w-6" />
            <span>Why Smart Bridge Digital Twin?</span>
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            Critical infrastructure like bridges requires continuous monitoring to ensure public safety. 
            Traditional inspection methods are manual, expensive, and often miss emerging problems. 
            Our platform uses real-time sensor data and AI analysis to detect structural issues before they become critical, 
            enabling predictive maintenance and reducing downtime and costs.
          </p>
        </div>

        {/* Features Section */}
        <section>
          <h2 className="section-header"><SparklesIcon className="h-8 w-8 inline-block mr-2" />Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group card-glow border-2 border-cyan-500 border-opacity-30 hover:border-opacity-100 cursor-pointer"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`text-5xl mb-4 text-center group-hover:scale-110 transform transition-transform duration-500`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-r ${feature.gradient}`}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '99.9%', label: 'Uptime Guarantee', icon: <ChartBarIcon className="h-8 w-8 mx-auto text-cyan-400" /> },
            { number: '24/7', label: 'Real-time Monitoring', icon: <ClockIcon className="h-8 w-8 mx-auto text-green-400" /> },
            { number: '<2s', label: 'Alert Response Time', icon: <BoltIcon className="h-8 w-8 mx-auto text-yellow-400" /> },
          ].map((stat, index) => (
            <div key={index} className="card-glow text-center hover-lift">
              <div className="text-4xl mb-3 text-center">{stat.icon}</div>
              <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 border-2 border-cyan-500 border-opacity-50 rounded-2xl p-12 text-center backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <RocketLaunchIcon className="h-6 w-6" />
              <span>Ready to Get Started?</span>
            </h2>
            <p className="text-slate-300 mb-8 text-lg">Join the infrastructure revolution with real-time bridge monitoring</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary shadow-glow hover:shadow-glow-lg"
              >
                Create Free Account
              </Link>
              <a
                href="#features"
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 border-2 border-cyan-500 border-opacity-50 hover:border-opacity-100"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500 border-opacity-30 mt-20 py-8 text-center text-slate-400">
        <p>&copy; 2026 Smart Bridge Digital Twin Platform. <span className="text-cyan-400">Built for Hackathon</span></p>
      </footer>
    </div>
  );
};

export default LandingPage;
