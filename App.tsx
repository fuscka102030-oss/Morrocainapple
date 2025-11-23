
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Home } from './pages/public/Home';
import { ProductDetail } from './pages/public/ProductDetail';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ResellerDashboard } from './pages/reseller/ResellerDashboard';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center text-gray-900 dark:text-white">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin mb-4"></div>
    <p className="text-sm font-medium animate-pulse">Chargement de la boutique...</p>
  </div>
);

const AppContent = () => {
  const { isLoading } = useApp();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reseller" element={<ResellerDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
