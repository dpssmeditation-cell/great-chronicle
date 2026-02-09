import { useState } from 'react';
import PropTypes from 'prop-types';
import './ShareButton.css';

function ShareButton({ title, text, url }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const shareToFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        setShowMenu(false);
    };

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        setShowMenu(false);
    };

    const shareToTelegram = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(telegramUrl, '_blank', 'width=600,height=400');
        setShowMenu(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setShowMenu(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="share-button-container">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="btn btn-secondary share-button"
                title="Share this chapter"
                aria-label="Share this chapter"
            >
                🔗
            </button>

            {showMenu && (
                <>
                    <div
                        className="share-backdrop"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                        }}
                    />
                    <div
                        className="share-menu glass-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={shareToFacebook} className="share-option">
                            <span className="share-icon">👥</span>
                            <span>Facebook</span>
                        </button>
                        <button onClick={shareToTwitter} className="share-option">
                            <span className="share-icon">🐤</span>
                            <span>Twitter</span>
                        </button>
                        <button onClick={shareToTelegram} className="share-option">
                            <span className="share-icon">💬</span>
                            <span>Telegram</span>
                        </button>
                        <button onClick={copyToClipboard} className="share-option">
                            <span className="share-icon">🔗</span>
                            <span>Copy Link</span>
                        </button>
                    </div>
                </>
            )}

            {showToast && (
                <div className="share-toast show">
                    Link copied to clipboard!
                </div>
            )}
        </div>
    );
}

ShareButton.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    url: PropTypes.string.isRequired
};

export default ShareButton;
