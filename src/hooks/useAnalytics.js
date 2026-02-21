import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track page views in Google Analytics 4 (GA4).
 * This listens for location changes in react-router-dom and sends a 
 * page_view event to GA4.
 */
export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
                page_path: location.pathname + location.search,
                page_location: window.location.href,
                page_title: document.title,
            });
        }
    }, [location]);
};

/**
 * A wrapper component that initializes the analytics hook.
 * Must be placed inside the Router.
 */
export const AnalyticsTracker = () => {
    useAnalytics();
    return null;
};
