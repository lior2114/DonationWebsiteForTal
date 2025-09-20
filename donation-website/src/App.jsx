
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DonationProvider } from './Contexts/DonationContext';
import { ThemeProvider } from './Contexts/ThemeContext';
import HomePage from './Pages/HomePage';
import SuccessPage from './Pages/SuccessPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <DonationProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </DonationProvider>
    </ThemeProvider>
  );
}

export default App;
