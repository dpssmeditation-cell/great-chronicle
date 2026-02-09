# Offline Mode Documentation

## Overview

The Great Chronicle of Buddhas now supports **offline reading** through Progressive Web App (PWA) technology. This means you can read chapters without an internet connection and install the app on your device for a native app-like experience.

## Features

### 🔌 Offline Reading
- **Automatic Caching**: Chapters you visit are automatically cached for offline access
- **Smart Caching Strategy**: 
  - Static assets (CSS, JS, fonts) use cache-first strategy for instant loading
  - Chapter content uses network-first with cache fallback
  - Up to 50 chapters cached at a time
  - Cache expires after 7 days to ensure fresh content

### 📱 Install as App
- **Desktop & Mobile**: Install the app on any device
- **Standalone Mode**: Runs in its own window without browser UI
- **Home Screen Icon**: Add to your device's home screen
- **Automatic Updates**: Service worker updates automatically in the background

### ⚡ Performance Benefits
- **Faster Loading**: Cached resources load instantly
- **Reduced Data Usage**: Less network requests after initial visit
- **Reliable Experience**: Works even with poor connectivity

## How to Use

### Installing the App

#### Desktop (Chrome/Edge)
1. Visit the website
2. Look for the install prompt at the bottom of the page
3. Click "Install" button
4. The app will be added to your applications

Alternatively:
- Click the install icon in the address bar (⊕ or computer icon)
- Or go to Menu → Install Chronicle

#### Mobile (Android)
1. Visit the website in Chrome
2. Tap the install banner when it appears
3. Or tap Menu (⋮) → "Add to Home screen"
4. The app icon will appear on your home screen

#### Mobile (iOS)
1. Open the website in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Reading Offline

1. **While Online**: Browse and read chapters normally
   - Each chapter you visit is automatically cached
   - No action needed from you

2. **Going Offline**: 
   - Turn off your internet connection
   - Open the app (or visit the website)
   - Navigate to previously visited chapters
   - They will load from cache instantly

3. **Offline Limitations**:
   - Only previously visited chapters are available offline
   - New chapters require internet connection
   - Search functionality requires internet
   - User authentication requires internet

### Checking Offline Status

The app automatically detects your connection status. When offline:
- Previously cached pages load normally
- Uncached pages show an offline fallback message
- You can still navigate to cached content

## Technical Details

### Caching Strategy

#### Static Assets (Cache First)
- HTML, CSS, JavaScript files
- Fonts (Google Fonts)
- Images and icons
- **Benefit**: Instant loading, works offline

#### Dynamic Content (Network First)
- Chapter content (`/read/*` routes)
- **Benefit**: Always fresh when online, available offline
- **Fallback**: Serves cached version if offline

### Cache Limits
- **Maximum Chapters**: 50 chapters cached
- **Expiration**: 7 days for chapter content
- **Fonts**: 1 year cache (rarely change)
- **Static Assets**: Controlled by service worker updates

### Service Worker

The app uses Workbox (via vite-plugin-pwa) to manage caching:
- **Auto-Update**: Service worker updates automatically
- **Background Sync**: Updates happen in the background
- **Cache Management**: Old caches are cleaned automatically

## Troubleshooting

### App Not Installing
- **Chrome/Edge**: Ensure you're using HTTPS or localhost
- **Safari**: Use "Add to Home Screen" instead
- **Firefox**: PWA support varies by version

### Offline Content Not Loading
1. **Visit chapters while online first**: Content must be cached before going offline
2. **Check cache storage**: 
   - Open DevTools (F12)
   - Go to Application → Cache Storage
   - Look for `chapters-cache`
3. **Clear cache if issues persist**:
   - DevTools → Application → Clear Storage
   - Revisit chapters to re-cache

### Service Worker Not Updating
1. **Hard refresh**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. **Clear service workers**:
   - DevTools → Application → Service Workers
   - Click "Unregister"
   - Refresh the page

### Storage Space Issues
- The app limits cache to 50 chapters
- Old chapters are automatically removed
- You can manually clear cache in browser settings

## Privacy & Data

### What's Stored Locally
- Visited chapter content (HTML)
- Static assets (CSS, JS, fonts, images)
- Reading progress and bookmarks (localStorage)
- User preferences (theme, font size)

### What's NOT Stored
- User credentials (requires server authentication)
- Personal information
- Analytics data (requires consent and internet)

### Clearing Data
To remove all offline data:
1. Browser Settings → Privacy → Clear Browsing Data
2. Select "Cached images and files"
3. Or use DevTools → Application → Clear Storage

## Browser Support

### Full Support
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop & Android)
- ✅ Samsung Internet

### Limited Support
- ⚠️ Safari (macOS): Install feature limited
- ⚠️ Firefox iOS: Uses Safari engine

## Benefits Summary

| Feature | Online | Offline |
|---------|--------|---------|
| Read cached chapters | ✅ | ✅ |
| Read new chapters | ✅ | ❌ |
| Search | ✅ | ❌ |
| Bookmarks | ✅ | ✅ (local) |
| Reading progress | ✅ | ✅ (local) |
| Install app | ✅ | N/A |
| Theme switching | ✅ | ✅ |
| Font size adjustment | ✅ | ✅ |

## Updates

The service worker automatically checks for updates:
- **Frequency**: On page load
- **Process**: Downloads in background
- **Activation**: On next visit or refresh
- **User Action**: None required (automatic)

When a new version is available, the app will update seamlessly without interrupting your reading.

## For Developers

### Testing Offline Mode

1. **Dev Mode**: Service worker enabled in development
   ```bash
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Test Offline**:
   - Chrome DevTools → Network → Offline checkbox
   - Or disable network adapter

### Cache Inspection

Chrome DevTools → Application tab:
- **Service Workers**: View registration status
- **Cache Storage**: Inspect cached resources
- **Clear Storage**: Reset everything

### Configuration

Edit `vite.config.js` to modify:
- Cache strategies
- Cache limits
- Included assets
- Manifest settings

---

**Enjoy reading The Great Chronicle of Buddhas offline! 📖**
