import { useState, useEffect } from 'react';
import './InstallPrompt.css';

function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install prompt after a short delay
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Don't show again for this session
        sessionStorage.setItem('installPromptDismissed', 'true');
    };

    // Don't show if dismissed in this session or already installed
    if (isInstalled || sessionStorage.getItem('installPromptDismissed') === 'true') {
        return null;
    }

    if (!showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="install-prompt glass-card">
            <div className="install-prompt-content">
                <div className="install-icon">📱</div>
                <div className="install-text">
                    <h3>Install Chronicle</h3>
                    <p>Install the app for offline reading and faster access</p>
                </div>
                <div className="install-actions">
                    <button onClick={handleInstallClick} className="btn btn-primary">
                        Install
                    </button>
                    <button onClick={handleDismiss} className="btn btn-ghost">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InstallPrompt;
