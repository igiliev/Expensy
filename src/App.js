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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
