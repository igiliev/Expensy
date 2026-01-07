import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import Home from './pages/Home/Home';
import Auth from './components/Login/Auth';
import './App.css';

// Component to handle authentication routing
function AppContent() {
  const { isAuthenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-spinner-small"></div>
        </div>
      </div>
    );
  }

  return (
    <ExpenseProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <Auth />} />
          </Routes>
        </div>
      </Router>
    </ExpenseProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
