import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DemoPage from './pages/DemoPage';
import HistoryPage from './pages/HistoryPage';
import AlertsPage from './pages/AlertsPage';
import FinalizationPage from './pages/FinalizationPage';
import UserProfile from './pages/UserProfile';
import FeaturesPage from './pages/FeaturesPage';
import FeatureDetailPage from './pages/FeatureDetailPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/finalization" element={<FinalizationPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/feature/:id" element={<FeatureDetailPage />} />

          {/* Protected Pages */}
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/admin" element={<PrivateRoute component={AdminPage} adminOnly={true} />} />
          <Route path="/profile" element={<PrivateRoute component={UserProfile} />} />
          <Route path="/history" element={<PrivateRoute component={HistoryPage} />} />
          <Route path="/alerts" element={<PrivateRoute component={AlertsPage} />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
