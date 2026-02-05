# Future Enhancements Roadmap

This document outlines the planned enhancements for "The Great Chronicle of the Buddhas" web application.

## 1. Export/Print Functionality
**Goal:** Allow users to save chapters as PDF or print them cleanly.
**Strategy:**
- **Print Styles:** Add a `@media print` section in CSS to hide navigation and interactive elements.
- **PDF Generation:** Use `window.print()` or `jspdf`.

## 2. Personal Notes
**Goal:** Allow users to annotate chapters.
**Strategy:**
- **Storage:** Use `localStorage` with a key structure like `notes-{chapterId}`.
- **UI:** Add a "Add Note" button in the Reader interface.

## 3. Themes (Light Mode)
**Goal:** Provide alternative visual themes (Light, Sepia).
**Strategy:**
- **CSS Variables:** Define `[data-theme='light']` variables.
- **Context:** Create a `ThemeContext` to manage state.

## 4. Audio (Text-to-Speech)
**Goal:** Listen to chapter content.
**Strategy:**
- **Web Speech API:** Use `window.speechSynthesis`.
- **UI:** Play/Pause/Speed controls.

## 5. Offline Mode
**Goal:** Enable reading without internet.
**Strategy:**
- **PWA:** Use `vite-plugin-pwa` for service worker caching.

## 6. Social Sharing
**Goal:** Share deep links to chapters.
**Strategy:**
- **Web Share API:** Use `navigator.share()` for mobile.
- **Clipboard:** Fallback for desktop.

## 7. Advanced Search
**Goal:** Enhanced search capabilities.
**Strategy:**
- **Filters:** Boolean operators and scope filters.

## 8. Reading Statistics
**Goal:** Track reading habits.
**Strategy:**
- **Metrics:** Time read, chapters completed.
- **Display:** Dashboard modal.
