import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import BrowsePage from './components/BrowsePage';
import ReaderPage from './components/ReaderPage';
import SearchPage from './components/SearchPage';

import MemberPage from './components/MemberPage';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import Header from './components/Header';
import { loadChronicles } from './services/dataService';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // [NEW]
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preload data
    loadChronicles().then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="spinner"></div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading The Great Chronicle of Buddhas...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider> {/* [NEW] */}
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/read/:id" element={<ReaderPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/member" element={<MemberPage />} />
                <Route path="/login" element={<LoginPage />} /> {/* [NEW] */}
                <Route path="/signup" element={<SignupPage />} /> {/* [NEW] */}
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider> {/* [NEW] */}
    </ThemeProvider>
  );
}

export default App;
