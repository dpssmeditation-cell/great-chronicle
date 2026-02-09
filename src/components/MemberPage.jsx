import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { useAuth } from '../context/AuthContext'; // [NEW]
import { getBookmarks, getAllVolumes, getChapterById } from '../services/dataService';
import './MemberPage.css';

function MemberPage() {
    const { currentUser, logout } = useAuth(); // [NEW]
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalTime: 0,
        chaptersRead: 0,
        streak: 0
    });
    const [bookmarks, setBookmarks] = useState([]);
    const [notes, setNotes] = useState([]);

    // [NEW] Logout handler
    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error('Failed to log out');
        }
    }

    useEffect(() => {
        // Load Bookmarks
        const loadedBookmarks = getBookmarks();
        setBookmarks(loadedBookmarks);

        // Load Stats (Aggregate from all 'reading_stats_' keys)
        let totalSeconds = 0;
        let chaptersInteracted = 0;

        // Scan localStorage for reading stats
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('reading_stats_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.time) totalSeconds += data.time;
                    chaptersInteracted++;
                } catch (e) {
                    console.error('Error parsing stats for', key);
                }
            }
        });

        setStats({
            totalTime: totalSeconds,
            chaptersRead: chaptersInteracted,
            streak: 0
        });

        const loadedNotes = [];
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('chapter_note_')) {
                const chapterId = key.replace('chapter_note_', '');
                const content = localStorage.getItem(key);
                const chapter = getChapterById(chapterId);
                if (content && content.trim()) {
                    loadedNotes.push({
                        id: chapterId,
                        title: chapter ? chapter.title : `Chapter ${chapterId}`,
                        excerpt: content.substring(0, 100) + (content.length > 100 ? '...' : '')
                    });
                }
            }
        });
        setNotes(loadedNotes);

    }, []);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    };

    return (
        <div className="member-page">
            <SEO title="Member Panel" />

            <div className="member-container">
                <header className="member-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>My Chronicle</h1>
                        {currentUser && (
                            <p style={{ color: 'var(--color-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                Welcome, {currentUser.displayName || currentUser.email}
                            </p>
                        )}
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Your personal reading dashboard. Data is stored locally on this device.
                        </p>
                    </div>
                    {currentUser ? (
                        <button onClick={handleLogout} className="btn btn-secondary">Sign Out</button>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Sign In</Link>
                    )}
                </header>

                {/* Stats Overview */}
                <section className="stats-overview glass-card">
                    <div className="stat-card">
                        <span className="stat-value">{formatTime(stats.totalTime)}</span>
                        <span className="stat-label">Time Read</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{stats.chaptersRead}</span>
                        <span className="stat-label">Chapters Started</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{bookmarks.length}</span>
                        <span className="stat-label">Bookmarks</span>
                    </div>
                </section>

                <div className="dashboard-grid">
                    {/* Bookmarks Section */}
                    <section className="dashboard-section glass-card">
                        <div className="section-header">
                            <h2 className="section-title">Bookmarks</h2>
                            <span className="section-count">{bookmarks.length}</span>
                        </div>
                        {bookmarks.length > 0 ? (
                            <ul className="item-list">
                                {bookmarks.map(b => (
                                    <li key={b.id} className="list-item">
                                        <Link to={`/read/${b.id}`} className="item-link">
                                            <div className="item-info">
                                                <span
                                                    className="item-title"
                                                    dangerouslySetInnerHTML={{ __html: b.title }}
                                                />
                                                <span className="item-meta">Saved {new Date(b.date).toLocaleDateString()}</span>
                                            </div>
                                            <span className="item-icon">🔖</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-state">
                                <p>No bookmarks yet.</p>
                                <Link to="/browse" className="btn btn-secondary" style={{ marginTop: '1rem' }}>Browse Chapters</Link>
                            </div>
                        )}
                    </section>

                    {/* Notes Section */}
                    <section className="dashboard-section glass-card">
                        <div className="section-header">
                            <h2 className="section-title">My Notes</h2>
                            <span className="section-count">{notes.length}</span>
                        </div>
                        {notes.length > 0 ? (
                            <ul className="item-list">
                                {notes.map(n => (
                                    <li key={n.id} className="list-item">
                                        <Link to={`/read/${n.id}`} className="item-link">
                                            <div className="item-info">
                                                <span
                                                    className="item-title"
                                                    dangerouslySetInnerHTML={{ __html: n.title }}
                                                />
                                                <span className="item-meta">"{n.excerpt}"</span>
                                            </div>
                                            <span className="item-icon">📝</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-state">
                                <p>No notes found.</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Add notes while reading any chapter.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default MemberPage;
