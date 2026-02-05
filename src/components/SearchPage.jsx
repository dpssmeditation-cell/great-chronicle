import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchContent } from '../services/dataService';
import './SearchPage.css';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setSearched(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setSearching(true);
            const searchResults = await searchContent(query);
            setResults(searchResults);
            setSearching(false);
            setSearched(true);
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [query]);

    const highlightText = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
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
                        placeholder="Enter keywords to search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {searching && (
                        <div className="search-spinner">
                            <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
                        </div>
                    )}
                </div>

                {/* Results */}
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
