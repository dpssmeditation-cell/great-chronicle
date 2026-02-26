import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVolumes, getReadingProgress } from '../services/dataService';
import SEO from './SEO';
import './HomePage.css';

function HomePage() {
    const [volumes, setVolumes] = useState([]);
    const [lastRead, setLastRead] = useState(null);

    useEffect(() => {
        const data = getAllVolumes();
        setVolumes(data);

        const progressId = getReadingProgress();
        if (progressId) {
            setLastRead(progressId);
        }
    }, []);

    const homeStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://greatchronicleofthebuddha.site/#website",
                "url": "https://greatchronicleofthebuddha.site/",
                "name": "The Great Chronicle of Buddhas",
                "description": "Explore profound teachings and life stories of the Buddhas through this comprehensive chronicle.",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://greatchronicleofthebuddha.site/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "@id": "https://greatchronicleofthebuddha.site/#organization",
                "name": "The Great Chronicle of Buddhas",
                "url": "https://greatchronicleofthebuddha.site/",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://greatchronicleofthebuddha.site/vite.svg"
                },
                "sameAs": []
            },
            {
                "@type": "WebPage",
                "@id": "https://greatchronicleofthebuddha.site/#webpage",
                "url": "https://greatchronicleofthebuddha.site/",
                "name": "The Great Chronicle of Buddhas",
                "isPartOf": { "@id": "https://greatchronicleofthebuddha.site/#website" },
                "about": { "@id": "https://greatchronicleofthebuddha.site/#organization" },
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://greatchronicleofthebuddha.site/"
                        }
                    ]
                }
            }
        ]
    };

    return (
        <div className="home-page">
            <SEO structuredData={homeStructuredData} />
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">The Great Chronicle of Buddhas</h1>
                        <p className="hero-subtitle">
                            Explore the profound teachings and life stories of the Buddhas through this comprehensive chronicle.
                            Journey through volumes of wisdom, enlightenment, and spiritual guidance.
                        </p>
                        <div className="hero-actions">
                            <Link to="/browse" className="btn btn-primary">
                                Start Reading
                            </Link>
                            <Link to="/search" className="btn btn-secondary">
                                Search Chronicles
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Continue Reading */}
            {lastRead && (
                <section className="continue-reading">
                    <div className="container">
                        <div className="glass-card">
                            <h3>Continue Reading</h3>
                            <Link to={`/read/${lastRead}`} className="btn btn-primary">
                                Resume from where you left off
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Volumes Overview */}
            <section className="volumes-section">
                <div className="container">
                    <h2 className="section-title">Explore Volumes</h2>
                    <div className="volumes-grid">
                        {volumes.map((volume, index) => (
                            <div
                                key={volume.volume}
                                className="volume-card glass-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="volume-header">
                                    <span className="badge">Volume {volume.volume}</span>
                                    <span className="volume-stats">
                                        {volume.parts.length} Parts • {' '}
                                        {volume.parts.reduce((sum, part) => sum + part.chapters.length, 0)} Chapters
                                    </span>
                                </div>
                                <h3>Volume {volume.volume}</h3>
                                <p className="volume-description">
                                    Explore {volume.parts.length} parts containing profound teachings and chronicles.
                                </p>
                                <Link
                                    to="/browse"
                                    state={{ scrollToVolume: volume.volume }}
                                    className="btn btn-secondary"
                                >
                                    Browse Volume
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Features</h2>
                    <div className="features-grid">
                        <div className="feature-card glass-card">
                            <div className="feature-icon">📚</div>
                            <h3>Comprehensive Collection</h3>
                            <p>Access the complete chronicle organized by volumes, parts, and chapters.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon">🔍</div>
                            <h3>Powerful Search</h3>
                            <p>Find specific teachings and stories with our advanced search functionality.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon">🔖</div>
                            <h3>Bookmarks & Progress</h3>
                            <p>Save your favorite chapters and track your reading progress.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon">📱</div>
                            <h3>Responsive Design</h3>
                            <p>Read seamlessly on any device - desktop, tablet, or mobile.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
