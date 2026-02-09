import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    getChapterById,
    getAllVolumes,
    addBookmark,
    removeBookmark,
    isBookmarked,
    saveReadingProgress
} from '../services/dataService';
import SEO from './SEO';
import './ReaderPage.css';

function ReaderPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [chapter, setChapter] = useState(null);
    const [fontSize, setFontSize] = useState(16);
    const [bookmarked, setBookmarked] = useState(false);
    const [navigation, setNavigation] = useState({ prev: null, next: null });

    // Footnote state
    const [activeFootnote, setActiveFootnote] = useState(null);

    useEffect(() => {
        const chapterData = getChapterById(id);
        if (chapterData) {
            setChapter(chapterData);
            setBookmarked(isBookmarked(id));
            saveReadingProgress(id);

            // Find prev/next chapters
            findNavigation(chapterData);
        }
    }, [id]);

    // Handle footnote links
    useEffect(() => {
        window.gotoFN = (fnId) => {
            // Try to find the element by ID or Name
            // The existing content likely uses id="1" or name="1" for footnotes
            let el = document.getElementById(fnId) || document.getElementsByName(fnId)[0];

            // If not found, try adding 'FN' prefix which is common
            if (!el) {
                el = document.getElementById('FN' + fnId) || document.getElementsByName('FN' + fnId)[0];
            }

            if (el) {
                // Determine content
                const content = el.innerHTML;
                setActiveFootnote({ id: fnId, content });
            } else {
                console.warn(`Footnote target ${fnId} not found.`);
            }
        };

        return () => {
            delete window.gotoFN;
        };
    }, []);

    const findNavigation = (currentChapter) => {
        const volumes = getAllVolumes();
        let allChapters = [];

        volumes.forEach(vol => {
            vol.parts.forEach(part => {
                allChapters = allChapters.concat(part.chapters);
            });
        });

        const currentIndex = allChapters.findIndex(ch => ch.id === id);
        setNavigation({
            prev: currentIndex > 0 ? allChapters[currentIndex - 1] : null,
            next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null
        });
    };

    const toggleBookmark = () => {
        if (bookmarked) {
            removeBookmark(id);
            setBookmarked(false);
        } else {
            addBookmark(id, chapter.title);
            setBookmarked(true);
        }
    };

    const adjustFontSize = (delta) => {
        setFontSize(prev => Math.max(12, Math.min(24, prev + delta)));
    };

    if (!chapter) {
        return (
            <div className="reader-page">
                <SEO title="Chapter Not Found" />
                <div className="reader-container">
                    <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <h2>Chapter not found</h2>
                        <Link to="/browse" className="btn btn-primary">Browse Chronicles</Link>
                    </div>
                </div>
            </div>
        );
    }

    const plainTitle = chapter.title.replace(/<[^>]+>/g, '');
    const canonicalUrl = `https://greatchronicle.com/read/${id}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": plainTitle,
        "description": `Read ${plainTitle} from Volume ${chapter.volume}, Part ${chapter.part} of The Great Chronicle of Buddhas.`,
        "url": canonicalUrl,
        "isPartOf": {
            "@type": "WebSite",
            "name": "The Great Chronicle of Buddhas",
            "url": "https://greatchronicle.com"
        }
    };

    return (
        <div className="reader-page">
            <SEO
                title={plainTitle}
                description={`Read ${plainTitle} from Volume ${chapter.volume}, Part ${chapter.part} of The Great Chronicle of Buddhas.`}
                url={`/read/${id}`}
                type="article"
                structuredData={structuredData}
            />
            <div className="reader-container">
                {/* Footnote Display Overlay */}
                {activeFootnote && (
                    <div className="footnote-overlay">
                        <div className="footnote-card glass-card">
                            <div className="footnote-header">
                                <strong>Note {activeFootnote.id}</strong>
                                <button
                                    onClick={() => setActiveFootnote(null)}
                                    className="btn-close"
                                >
                                    ×
                                </button>
                            </div>
                            <div
                                className="footnote-body"
                                dangerouslySetInnerHTML={{ __html: activeFootnote.content }}
                            />
                        </div>
                    </div>
                )}

                <div className="reader-toolbar glass-card">
                    <div className="toolbar-left">
                        <button onClick={() => navigate(-1)} className="btn btn-secondary">
                            ← Back
                        </button>
                        <div className="breadcrumb">
                            <span>Volume {chapter.volume}</span>
                            <span>•</span>
                            <span>Part {chapter.part}</span>
                            <span>•</span>
                            <span>Chapter {chapter.chapter}</span>
                        </div>
                    </div>
                    <div className="toolbar-right">
                        <button
                            onClick={() => window.print()}
                            className="btn btn-secondary"
                            title="Print/Save as PDF"
                            style={{ marginRight: '0.5rem' }}
                        >
                            🖨️
                        </button>
                        <button
                            onClick={() => adjustFontSize(-2)}
                            className="btn btn-secondary"
                            title="Decrease font size"
                        >
                            A-
                        </button>
                        <button
                            onClick={() => adjustFontSize(2)}
                            className="btn btn-secondary"
                            title="Increase font size"
                        >
                            A+
                        </button>
                        <button
                            onClick={toggleBookmark}
                            className={`btn ${bookmarked ? 'btn-primary' : 'btn-secondary'}`}
                            title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                        >
                            {bookmarked ? '★' : '☆'}
                        </button>
                    </div>
                </div>

                {/* Reader Content */}
                <article className="reader-content glass-card">
                    <header className="chapter-header">
                        <div className="chapter-meta">
                            <span className="badge">Chapter {chapter.chapter}</span>
                            <span className="page-range">Pages {chapter.startPage}-{chapter.endPage}</span>
                        </div>
                        <h1
                            className="chapter-title"
                            dangerouslySetInnerHTML={{ __html: chapter.title }}
                        />
                    </header>

                    <div
                        className="chapter-body"
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ __html: chapter.content }}
                    />
                </article>

                {/* Navigation */}
                <div className="reader-navigation">
                    {navigation.prev && (
                        <Link
                            to={`/read/${navigation.prev.id}`}
                            className="nav-button glass-card"
                        >
                            <span className="nav-label">← Previous</span>
                            <span
                                className="nav-title"
                                dangerouslySetInnerHTML={{ __html: navigation.prev.title }}
                            />
                        </Link>
                    )}
                    <div style={{ flex: 1 }} />
                    {navigation.next && (
                        <Link
                            to={`/read/${navigation.next.id}`}
                            className="nav-button glass-card"
                        >
                            <span className="nav-label">Next →</span>
                            <span
                                className="nav-title"
                                dangerouslySetInnerHTML={{ __html: navigation.next.title }}
                            />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReaderPage;
