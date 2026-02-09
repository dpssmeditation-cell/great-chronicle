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

export async function searchContent(query) {
    const index = await loadSearchIndex();
    const lowerQuery = query.toLowerCase();

    return index.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.excerpt.toLowerCase().includes(lowerQuery)
    ).slice(0, 50); // Limit to 50 results
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
