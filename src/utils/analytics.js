import ReactGA from 'react-ga4';
import Cookies from 'js-cookie';

// Check if user has given consent
const hasConsent = () => {
    return Cookies.get('analytics-consent') === 'true';
};

// Initialize Google Analytics
export const initGA = () => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    // Only initialize if measurement ID is provided, not a placeholder, and user has consented
    if (measurementId && measurementId !== 'YOUR_MEASUREMENT_ID_HERE' && hasConsent()) {
        try {
            ReactGA.initialize(measurementId, {
                gaOptions: {
                    siteSpeedSampleRate: 100,
                },
                gtagOptions: {
                    send_page_view: false, // We'll manually track page views
                },
            });
            console.log('Google Analytics initialized with ID:', measurementId);
        } catch (error) {
            console.error('Failed to initialize Google Analytics:', error);
        }
    } else if (!hasConsent()) {
        console.log('Google Analytics not initialized - user has not consented to tracking');
    } else {
        console.log('Google Analytics not initialized - no measurement ID provided');
    }
};

// Track page views
export const trackPageView = (path, title) => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (measurementId && measurementId !== 'YOUR_MEASUREMENT_ID_HERE' && hasConsent()) {
        try {
            ReactGA.send({
                hitType: 'pageview',
                page: path,
                title: title || document.title,
            });
            console.log('Page view tracked:', path);
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    }
};

// Track custom events
export const trackEvent = (category, action, label = '', value = 0) => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

    if (measurementId && measurementId !== 'YOUR_MEASUREMENT_ID_HERE' && hasConsent()) {
        try {
            ReactGA.event({
                category,
                action,
                label,
                value,
            });
            console.log('Event tracked:', { category, action, label, value });
        } catch (error) {
            console.error('Failed to track event:', error);
        }
    }
};
