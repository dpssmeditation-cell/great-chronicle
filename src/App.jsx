import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';
import Cookies from 'js-cookie';
import HomePage from './components/HomePage';
import BrowsePage from './components/BrowsePage';
import ReaderPage from './components/ReaderPage';
import SearchPage from './components/SearchPage';
import Header from './components/Header';
import { loadChronicles } from './services/dataService';
import { ThemeProvider } from './context/ThemeContext';
import { initGA, trackPageView } from './utils/analytics';
import './index.css';

// Component to track page views
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Analytics
    initGA();

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
      <Router>
        <AnalyticsTracker />
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/read/:id" element={<ReaderPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
        </div>

        <CookieConsent
          location="bottom"
          buttonText="Accept"
          declineButtonText="Decline"
          enableDeclineButton
          cookieName="analytics-consent"
          cookieValue="true"
          declineCookieValue="false"
          expires={365}
          style={{
            background: 'var(--color-bg-secondary)',
            borderTop: '1px solid var(--color-border)',
            padding: '1rem 2rem',
            alignItems: 'center',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          }}
          buttonStyle={{
            background: 'var(--color-primary)',
            color: 'white',
            fontSize: '14px',
            padding: '0.5rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
          }}
          declineButtonStyle={{
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            padding: '0.5rem 1.5rem',
            borderRadius: '4px',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            marginRight: '1rem',
          }}
          contentStyle={{
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            margin: '0',
            flex: '1 1 auto',
          }}
          onAccept={() => {
            Cookies.set('analytics-consent', 'true', { expires: 365 });
            console.log('User accepted analytics tracking');
            // Initialize analytics after consent
            initGA();
          }}
          onDecline={() => {
            Cookies.set('analytics-consent', 'false', { expires: 365 });
            console.log('User declined analytics tracking');
          }}
        >
          <span style={{ fontSize: '14px' }}>
            This website uses cookies to enhance your experience and analyze site traffic.
            By clicking "Accept", you consent to our use of cookies and analytics tracking.{' '}
            <a
              href="#"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'underline'
              }}
              onClick={(e) => {
                e.preventDefault();
                alert('Privacy Policy: We use Google Analytics to understand how visitors interact with our site. This helps us improve your experience. No personal information is collected without your consent.');
              }}
            >
              Learn more
            </a>
          </span>
        </CookieConsent>
      </Router>
    </ThemeProvider>
  );
}

export default App;
