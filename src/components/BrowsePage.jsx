import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllVolumes } from '../services/dataService';
import SEO from './SEO';
import './BrowsePage.css';

function BrowsePage() {
    const [volumes, setVolumes] = useState([]);
    const [expandedVolumes, setExpandedVolumes] = useState(new Set());
    const [expandedParts, setExpandedParts] = useState(new Set());
    const location = useLocation();

    useEffect(() => {
        const data = getAllVolumes();
        setVolumes(data);

        // Auto-expand if coming from home page with specific volume
        if (location.state?.scrollToVolume) {
            setExpandedVolumes(new Set([location.state.scrollToVolume]));
        }
    }, [location]);

    const toggleVolume = (volumeNum) => {
        const newExpanded = new Set(expandedVolumes);
        if (newExpanded.has(volumeNum)) {
            newExpanded.delete(volumeNum);
        } else {
            newExpanded.add(volumeNum);
        }
        setExpandedVolumes(newExpanded);
    };

    const togglePart = (key) => {
        const newExpanded = new Set(expandedParts);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedParts(newExpanded);
    };

    return (
        <div className="browse-page">
            <SEO title="Browse Chronicles" description="Browse the volumes and chapters of The Great Chronicle of Buddhas." url="/browse" />
            <div className="container">
                <div className="browse-header">
                    <h1>Browse Chronicles</h1>
                    <p>Navigate through volumes, parts, and chapters</p>
                </div>

                <div className="browse-content">
                    {volumes.map((volume) => {
                        const isVolumeExpanded = expandedVolumes.has(volume.volume);

                        return (
                            <div key={volume.volume} className="volume-section glass-card">
                                <button
                                    className="volume-toggle"
                                    onClick={() => toggleVolume(volume.volume)}
                                >
                                    <span className="toggle-icon">{isVolumeExpanded ? '▼' : '▶'}</span>
                                    <h2>Volume {volume.volume}</h2>
                                    <span className="item-count">
                                        {volume.parts.length} parts • {' '}
                                        {volume.parts.reduce((sum, part) => sum + part.chapters.length, 0)} chapters
                                    </span>
                                </button>

                                {isVolumeExpanded && (
                                    <div className="parts-list">
                                        {volume.parts.map((part) => {
                                            const partKey = `v${volume.volume}-p${part.part}`;
                                            const isPartExpanded = expandedParts.has(partKey);

                                            return (
                                                <div key={partKey} className="part-section">
                                                    <button
                                                        className="part-toggle"
                                                        onClick={() => togglePart(partKey)}
                                                    >
                                                        <span className="toggle-icon">{isPartExpanded ? '▼' : '▶'}</span>
                                                        <h3>Part {part.part}</h3>
                                                        <span className="item-count">{part.chapters.length} chapters</span>
                                                    </button>

                                                    {isPartExpanded && (
                                                        <div className="chapters-list">
                                                            {part.chapters.map((chapter) => (
                                                                <Link
                                                                    key={chapter.id}
                                                                    to={`/read/${chapter.id}`}
                                                                    className="chapter-item"
                                                                >
                                                                    <div className="chapter-info">
                                                                        <span className="chapter-number">Chapter {chapter.chapter}</span>
                                                                        <h4
                                                                            className="chapter-title"
                                                                            dangerouslySetInnerHTML={{ __html: chapter.title }}
                                                                        />
                                                                    </div>
                                                                    <span className="chapter-pages">
                                                                        pp. {chapter.startPage}-{chapter.endPage}
                                                                    </span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default BrowsePage;
