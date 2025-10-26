import React, { useState } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes, Navigate, Outlet } from 'react-router-dom';
import queryClient from './queryClient';
import './App.css';
import Login from './components/login/login ';
import Dashboard from './components/Dashboard/Dashboard';
import PanchayatReport from './components/PanchayatReport/PanchayatReport';
import PanchayatManagement from './components/PanchayatReport/PanchayatManagement';
import Sidebar from './components/Sidebar/Sidebar';
import BoothManagement from './components/BoothManagement/BoothManagement';
import BoothDetails from "./components/BoothManagement/BoothDetails"

// Layout component to include Sidebar and main content
const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-red-50/50 to-white relative">
        {/* Page content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
        
        {/* Floating Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/sign-in" replace />} 
          />
          
          {/* Login route - Protected with PublicRoute */}
          <Route
            path="/sign-in"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          
          {/* Protected routes wrapped in Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/panchayat-report" element={<PanchayatReport />} />
            <Route path="/panchayat/:id/manage" element={<PanchayatManagement />} />
            <Route path="/ward/:wardId/booths" element={<BoothManagement />} />
            <Route path="/booth-details/:boothId" element={<BoothDetails />} />
          </Route>
          
          {/* Catch all */}
          <Route 
            path="*" 
            element={<Navigate to="/sign-in" replace />} 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;