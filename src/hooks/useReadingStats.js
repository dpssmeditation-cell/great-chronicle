import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY_PREFIX = 'reading_stats_';

export const useReadingStats = (chapterId) => {
    const [readingTime, setReadingTime] = useState(0); // in seconds
    const [scrollProgress, setScrollProgress] = useState(0); // percentage 0-100
    const startTimeRef = useRef(Date.now());
    const intervalRef = useRef(null);

    // Load initial stats
    useEffect(() => {
        if (!chapterId) return;

        const savedStats = localStorage.getItem(`${STORAGE_KEY_PREFIX}${chapterId}`);
        if (savedStats) {
            try {
                const { time, progress } = JSON.parse(savedStats);
                setReadingTime(time || 0);
                setScrollProgress(progress || 0);
            } catch (e) {
                console.error('Failed to parse reading stats', e);
            }
        } else {
            setReadingTime(0);
            setScrollProgress(0);
        }

        // Reset start time for this session
        startTimeRef.current = Date.now();

    }, [chapterId]);

    // Track reading time
    useEffect(() => {
        if (!chapterId) return;

        const updateTime = () => {
            setReadingTime(prev => {
                const newTime = prev + 1;
                // Save periodically (every 5 seconds) could be an option, 
                // but let's save on unmount/visibility change instead to reduce writes?
                // For now, let's keep state up to date and save in a separate effect or on unmount.
                return newTime;
            });
        };

        // Only count time if page is visible
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            } else {
                if (!intervalRef.current) {
                    intervalRef.current = setInterval(updateTime, 1000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Start initial timer
        if (!document.hidden) {
            intervalRef.current = setInterval(updateTime, 1000);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [chapterId]);

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (fullHeight <= windowHeight) {
                setScrollProgress(100);
                return;
            }

            const progress = (scrollTop / (fullHeight - windowHeight)) * 100;
            setScrollProgress(Math.min(100, Math.max(0, Math.round(progress))));
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Save stats to localStorage
    useEffect(() => {
        if (!chapterId) return;

        const saveStats = () => {
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${chapterId}`, JSON.stringify({
                time: readingTime,
                progress: scrollProgress,
                lastUpdated: Date.now()
            }));
        };

        // Save on readingTime update (debounced or periodic would be better for high frequency, 
        // but readingTime updates every second. Let's save every 5 seconds or on unmount)
        // Actually, let's just save when readingTime % 5 === 0 to reduce writes
        if (readingTime > 0 && readingTime % 5 === 0) {
            saveStats();
        }

        // Also save on scroll progress change if significant?
        // Let's rely on the cleanup effect for final save usually, but 'beforeunload' is tricky.

        // Save on unmount
        return () => saveStats();
    }, [chapterId, readingTime, scrollProgress]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins === 0) return `${secs}s`;
        return `${mins}m ${secs}s`;
    };

    return { readingTime, scrollProgress, formatTime };
};
