# Social Sharing Documentation

## Overview

The Great Chronicle of Buddhas now supports **social sharing** for individual chapters. Users can share specific chapters directly to Facebook, Twitter, or Telegram, or copy the link to clipboard.

## Features

### 🔗 Share Button
- **Location**: Reader toolbar (next to print and bookmark buttons)
- **Icon**: 🔗 link icon
- **Dropdown Menu**: Click to reveal share options

### 📱 Platform-Specific Sharing
- **Facebook** (📘): Share to Facebook timeline
- **Twitter** (🐦): Tweet with chapter link
- **Telegram** (✈️): Share via Telegram
- **Copy Link** (📋): Copy URL to clipboard

### 🎨 Dropdown Menu
- **Glassmorphic Design**: Matches app aesthetic
- **Smooth Animation**: Slide-down effect
- **Click Outside to Close**: Backdrop dismissal
- **Hover Effects**: Visual feedback on options

### 📝 Share Metadata
Each share includes:
- **Title**: Chapter title + "The Great Chronicle of Buddhas"
- **Description**: "Read [Chapter Title] from The Great Chronicle of Buddhas"
- **URL**: Direct link to specific chapter (e.g., `https://greatchronicle.com/read/chapter-id`)

## How to Use

### Sharing to Social Media

1. Open any chapter in the reader
2. Click the **🔗 share button** in the toolbar
3. Dropdown menu appears with options:
   - **📘 Facebook**: Share to your timeline
   - **🐦 Twitter**: Create a tweet
   - **✈️ Telegram**: Share via Telegram
   - **📋 Copy Link**: Copy to clipboard
4. Click your preferred option
5. New window opens (Facebook/Twitter/Telegram) or link is copied

### Copying Link

1. Open any chapter in the reader
2. Click the **🔗 share button** in the toolbar
3. Click **📋 Copy Link**
4. Toast notification appears: "Link copied to clipboard!"
5. Paste the link anywhere (Ctrl+V / Cmd+V)

## Shared Link Format

When someone clicks a shared link, they'll be taken directly to that specific chapter:

```
https://greatchronicle.com/read/v1p1c1
```

The link includes:
- Full chapter title in metadata
- SEO-optimized description
- Proper Open Graph tags for rich previews

## Technical Details

### Web Share API Detection

The component automatically detects browser capabilities:

```javascript
if (navigator.share) {
    // Use native share dialog
    await navigator.share(shareData);
} else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(url);
}
```

### Share Data Structure

```javascript
{
    title: "Chapter Title - The Great Chronicle of Buddhas",
    text: "Read 'Chapter Title' from The Great Chronicle of Buddhas",
    url: "https://greatchronicle.com/read/chapter-id"
}
```

### Toast Notification

- **Duration**: 3 seconds
- **Position**: Bottom center (mobile: bottom with margins)
- **Style**: Glassmorphism matching app design
- **Animation**: Smooth slide-up transition

## Browser Support

### Full Support (Web Share API)
- ✅ Chrome/Edge Mobile (Android)
- ✅ Safari (iOS/iPadOS)
- ✅ Samsung Internet
- ✅ Firefox Mobile (Android)

### Clipboard Fallback
- ✅ Chrome/Edge (Desktop)
- ✅ Firefox (Desktop)
- ✅ Safari (macOS)
- ✅ All modern browsers

## Use Cases

### Students & Researchers
- Share specific chapters with study groups
- Email references to colleagues
- Bookmark chapters in note-taking apps

### Teachers
- Share reading assignments with students
- Create reading lists with direct links
- Distribute chapter references

### General Readers
- Share favorite passages with friends
- Save chapters to read-later apps
- Post on social media

## Privacy

- **No Tracking**: Sharing doesn't track user behavior
- **No Analytics**: Share actions are not logged
- **Direct Links**: URLs go straight to content, no redirects

## Troubleshooting

### Share Button Not Working

**Mobile:**
1. Ensure you're using a supported browser (Chrome, Safari)
2. Check browser permissions for clipboard access
3. Try updating your browser

**Desktop:**
1. Check clipboard permissions in browser settings
2. Try a different browser
3. Manually copy URL from address bar

### Toast Not Appearing
- Toast shows for 3 seconds then disappears
- Only appears on desktop (clipboard fallback)
- Check browser console for errors

### Shared Links Not Working
- Verify the app is deployed and accessible
- Check that the chapter ID in URL is correct
- Ensure recipient has internet connection

## Examples

### Sharing to WhatsApp (Mobile)
1. Click 🔗 share button
2. Select WhatsApp from share sheet
3. Choose contact or group
4. Message sent with chapter title and link

### Copying Link (Desktop)
1. Click 🔗 share button
2. See "Link copied!" notification
3. Paste in email, document, or message
4. Recipient clicks link to read chapter

## Future Enhancements

Potential improvements:
- Custom share messages
- Share to specific platforms (Twitter, Facebook)
- QR code generation for chapters
- Share statistics (optional, privacy-respecting)
- Share with custom notes

---

**Share the wisdom! 📖✨**
