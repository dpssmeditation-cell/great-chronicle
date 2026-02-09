// Data service for loading and managing chronicle data
let chroniclesData = null;
let searchIndexData = null;

export async function loadChronicles() {
    if (chroniclesData) return chroniclesData;

    try {
        const response = await fetch('/data/chronicles.json');
        chroniclesData = await response.json();
        return chroniclesData;
    } catch (error) {
        console.error('Error loading chronicles:', error);
        return [];
    }
}

export async function loadSearchIndex() {
    if (searchIndexData) return searchIndexData;

    try {
        const response = await fetch('/data/search-index.json');
        searchIndexData = await response.json();
        return searchIndexData;
    } catch (error) {
        console.error('Error loading search index:', error);
        return [];
    }
}

export function getChapterById(id) {
    if (!chroniclesData) return null;

    for (const volume of chroniclesData) {
        for (const part of volume.parts) {
            const chapter = part.chapters.find(ch => ch.id === id);
            if (chapter) {
                return {
                    ...chapter,
                    volume: volume.volume,
                    part: part.part
                };
            }
        }
    }
    return null;
}

export function getAllVolumes() {
    return chroniclesData || [];
}

export async function searchContent(query, filters = {}) {
    const index = await loadSearchIndex();
    if (!query && !filters.volume) return [];

    let results = index;

    // 1. Apply Filters (Volume & Part)
    if (filters.volume) {
        results = results.filter(item => item.volume === parseInt(filters.volume));
    }
    if (filters.part) {
        results = results.filter(item => item.part === parseInt(filters.part));
    }

    if (!query) return results.slice(0, 50);

    // 2. Parse Query
    const terms = parseQuery(query);

    // 3. Score & Filter Results
    return results.filter(item => {
        const title = item.title.toLowerCase();
        const content = item.excerpt.toLowerCase();
        const fullText = title + ' ' + content;

        // Evaluate boolean logic
        return terms.every(term => {
            if (term.type === 'AND') return fullText.includes(term.value);
            if (term.type === 'OR') return term.values.some(v => fullText.includes(v));
            if (term.type === 'NOT') return !fullText.includes(term.value);
            if (term.type === 'PHRASE') return fullText.includes(term.value);
            return fullText.includes(term.value); // Default AND
        });
    }).slice(0, 50);
}

function parseQuery(query) {
    const terms = [];
    const lowerQuery = query.toLowerCase();

    // Extract phrases ("...")
    const phraseRegex = /"([^"]+)"/g;
    let match;
    let cleanQuery = lowerQuery;

    while ((match = phraseRegex.exec(lowerQuery)) !== null) {
        terms.push({ type: 'PHRASE', value: match[1] });
        cleanQuery = cleanQuery.replace(match[0], ''); // Remove phrase from query
    }

    // Extract NOT operators (-term)
    const notRegex = /-(\w+)/g;
    while ((match = notRegex.exec(cleanQuery)) !== null) {
        terms.push({ type: 'NOT', value: match[1] });
        cleanQuery = cleanQuery.replace(match[0], '');
    }

    // Extract OR operators (term1 | term2 OR term3)
    // Note: Simple implementation, splits remaining by space
    const parts = cleanQuery.split(/\s+/).filter(Boolean);

    // Handle explicit OR (todo: simplify for now, treat space as AND)
    // For now, treat all remaining words as AND terms unless they contain |

    parts.forEach(part => {
        if (part.includes('|')) {
            const options = part.split('|').filter(Boolean);
            terms.push({ type: 'OR', values: options });
        } else if (part !== 'and' && part !== 'or') { // Ignore standalone operators for now
            terms.push({ type: 'AND', value: part });
        }
    });

    return terms;
}

// Bookmark management (localStorage)
const BOOKMARKS_KEY = 'buddha-chronicles-bookmarks';

export function getBookmarks() {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function addBookmark(chapterId, title) {
    const bookmarks = getBookmarks();
    if (!bookmarks.find(b => b.id === chapterId)) {
        bookmarks.push({ id: chapterId, title, date: new Date().toISOString() });
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
}

export function removeBookmark(chapterId) {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(b => b.id !== chapterId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
}

export function isBookmarked(chapterId) {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.id === chapterId);
}

// Reading progress (localStorage)
const PROGRESS_KEY = 'buddha-chronicles-progress';

export function saveReadingProgress(chapterId) {
    localStorage.setItem(PROGRESS_KEY, chapterId);
}

export function getReadingProgress() {
    return localStorage.getItem(PROGRESS_KEY);
}
