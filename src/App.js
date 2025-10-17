import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import PublicView from './components/PublicView';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import TeamManagerLogin from './components/TeamManagerLogin';
import TeamManagerDashboard from './components/TeamManagerDashboard';
import { initializeDefaultData, loadFromLocalStorage } from './utils/dataStorage';
import ErrorBoundary from './components/ErrorBoundary';

// Add a simple console log to verify the app is loading
console.log('App component loading');

// Load theme from localStorage or use default
const getStoredTheme = () => {
  const savedTheme = loadFromLocalStorage('appTheme', {
    primary: '#6a11cb',
    secondary: '#2575fc',
    accent: 'gold'
  });
  return savedTheme;
};

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

// Protected route component for admin
const AdminRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/admin/login" />;
};

// Protected route component for team manager
const TeamManagerRoute = ({ children }) => {
  // Check if team manager is logged in
  const isTeamManagerLoggedIn = localStorage.getItem('isTeamManagerLoggedIn') === 'true';
  return isTeamManagerLoggedIn ? children : <Navigate to="/team-manager-login" />;
};

function App() {
  const [theme, setTheme] = useState(getStoredTheme());
  
  useEffect(() => {
    // Initialize default data when app starts
    console.log('Initializing default data...');
    initializeDefaultData();
    console.log('Default data initialization complete.');
    
    // Listen for theme changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'appTheme') {
        try {
          const newTheme = JSON.parse(e.newValue);
          setTheme(newTheme);
        } catch (error) {
          console.error('Error parsing theme from localStorage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Determine basename for router
  // For Vercel deployments, we use the environment variable or default to empty string
  const basename = process.env.PUBLIC_URL || '';

  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <AppContainer theme={theme}>
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/team-manager-login" element={<TeamManagerLogin />} />
            <Route path="/team-manager" element={
              <TeamManagerRoute>
                <TeamManagerDashboard />
              </TeamManagerRoute>
            } />
            {/* Catch-all route for SPA functionality on Vercel */}
            <Route path="*" element={<PublicView />} />
          </Routes>
        </AppContainer>
      </Router>
    </ErrorBoundary>
  );
}

export default App;