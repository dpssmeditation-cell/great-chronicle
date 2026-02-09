import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { searchContent, getAllVolumes } from '../services/dataService';
import './SearchPage.css';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({ volume: '', part: '' });
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [volumes, setVolumes] = useState([]);

    useEffect(() => {
        const loadVolumes = async () => {
            const data = await getAllVolumes();
            setVolumes(data || []);
        };
        loadVolumes();
    }, []);

    // Get parts based on selected volume
    const availableParts = useMemo(() => {
        if (!filters.volume) return [];
        const volume = volumes.find(v => v.volume === parseInt(filters.volume));
        return volume ? volume.parts : [];
    }, [filters.volume, volumes]);

    useEffect(() => {
        // Only auto-search if query is long enough OR a filter is applied
        const hasFilter = filters.volume !== '';

        if (query.length < 2 && !hasFilter) {
            setResults([]);
            setSearched(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setSearching(true);
            const searchResults = await searchContent(query, filters);
            setResults(searchResults);
            setSearching(false);
            setSearched(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };
            // Reset part if volume changes
            if (key === 'volume') newFilters.part = '';
            return newFilters;
        });
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        // Strip special chars for highlighting
        const cleanQuery = query.replace(/["+\-|]/g, ' ').trim();
        if (!cleanQuery) return text;

        const terms = cleanQuery.split(/\s+/).filter(t => t.length > 1);
        if (terms.length === 0) return text;

        const regex = new RegExp(`(${terms.join('|')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    return (
        <div className="search-page">
            <div className="container">
                <div className="search-header">
                    <h1>Search Chronicles</h1>
                    <p>Search through all volumes, parts, and chapters</p>
                </div>

                <div className="search-box glass-card">
                    <input
                        type="text"
                        className="input search-input"
                        placeholder="Search keywords (e.g., 'Buddha -Mara', 'Four Truths')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {searching ? (
                        <div className="search-spinner">
                            <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
                        </div>
                    ) : (
                        <button
                            className="help-btn"
                            onClick={() => setShowHelp(!showHelp)}
                            title="Search Syntax Help"
                        >
                            ?
                        </button>
                    )}
                </div>

                {showHelp && (
                    <div className="search-help-modal glass-card">
                        <h3>Advanced Search Syntax</h3>
                        <div className="help-grid">
                            <div className="help-item">
                                <code>word1 word2</code>
                                <p>Finds results containing <strong>both</strong> words (AND)</p>
                            </div>
                            <div className="help-item">
                                <code>"exact phrase"</code>
                                <p>Finds results with the <strong>exact phrase</strong></p>
                            </div>
                            <div className="help-item">
                                <code>word1 | word2</code>
                                <p>Finds results with <strong>either</strong> word (OR)</p>
                            </div>
                            <div className="help-item">
                                <code>-word</code>
                                <p><strong>Excludes</strong> results containing the word (NOT)</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="search-filters">
                    <select
                        className="filter-select"
                        value={filters.volume}
                        onChange={(e) => handleFilterChange('volume', e.target.value)}
                    >
                        <option value="">All Volumes</option>
                        {volumes.map(v => (
                            <option key={v.volume} value={v.volume}>Volume {v.volume}</option>
                        ))}
                    </select>

                    <select
                        className="filter-select"
                        value={filters.part}
                        onChange={(e) => handleFilterChange('part', e.target.value)}
                        disabled={!filters.volume}
                        style={{ opacity: !filters.volume ? 0.5 : 1 }}
                    >
                        <option value="">All Parts</option>
                        {availableParts.map(p => (
                            <option key={p.part} value={p.part}>Part {p.part}</option>
                        ))}
                    </select>
                </div>

                <div className="search-results">
                    {searched && results.length === 0 && (
                        <div className="no-results glass-card">
                            <h3>No results found</h3>
                            <p>Try different keywords or browse the chronicles</p>
                            <Link to="/browse" className="btn btn-primary">Browse Chronicles</Link>
                        </div>
                    )}

                    {results.length > 0 && (
                        <>
                            <div className="results-count">
                                Found {results.length} result{results.length !== 1 ? 's' : ''}
                            </div>
                            <div className="results-list">
                                {results.map((result) => (
                                    <Link
                                        key={result.id}
                                        to={`/read/${result.id}`}
                                        className="result-item glass-card"
                                    >
                                        <div className="result-header">
                                            <div className="result-meta">
                                                <span className="badge">
                                                    Vol {result.volume} • Part {result.part} • Ch {result.chapter}
                                                </span>
                                            </div>
                                            <h3
                                                className="result-title"
                                                dangerouslySetInnerHTML={{
                                                    __html: highlightText(result.title, query)
                                                }}
                                            />
                                        </div>
                                        <p
                                            className="result-excerpt"
                                            dangerouslySetInnerHTML={{
                                                __html: highlightText(result.excerpt, query) + '...'
                                            }}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Search Tips */}
                {!searched && (
                    <div className="search-tips glass-card">
                        <h3>Search Tips</h3>
                        <ul>
                            <li>Enter at least 2 characters to start searching</li>
                            <li>Search results include chapter titles and content</li>
                            <li>Results are limited to the top 50 matches</li>
                            <li>Use specific keywords for better results</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
