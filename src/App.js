import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './contexts/ExpenseContext';
import Home from './pages/Home/Home';
import './App.css';

function App() {
  return (
    <ExpenseProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </ExpenseProvider>
  );
}

export default App;
