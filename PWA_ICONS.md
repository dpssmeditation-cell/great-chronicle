# PWA Icons Setup

## Required Icons

The PWA manifest requires the following icon files in the `public/` directory:

1. **pwa-192x192.png** - 192x192 pixels
2. **pwa-512x512.png** - 512x512 pixels
3. **apple-touch-icon.png** - 180x180 pixels (optional, for iOS)

## Icon Design Guidelines

### Design Concept
- **Symbol**: Golden lotus flower (Buddhist symbol)
- **Background**: Deep purple gradient (#1a1a2e to #0f0f1e)
- **Style**: Minimalist, modern, spiritual
- **Format**: PNG with transparency or solid background

### Creating Icons

#### Option 1: Use Existing Favicon
If you have a favicon or logo, you can resize it:

```bash
# Using ImageMagick (if installed)
convert favicon.png -resize 192x192 public/pwa-192x192.png
convert favicon.png -resize 512x512 public/pwa-512x512.png
convert favicon.png -resize 180x180 public/apple-touch-icon.png
```

#### Option 2: Online Tools
Use free online tools to create PWA icons:
- **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **Favicon.io**: https://favicon.io/

#### Option 3: Design Software
Create in Figma, Photoshop, or Canva:
1. Create a 512x512 canvas
2. Add your logo/symbol centered
3. Export as PNG
4. Resize for other dimensions

## Temporary Placeholder

For now, the app will work without icons but will show browser defaults. To add icons:

1. Create or obtain your icon images
2. Save them in the `public/` folder with the exact names above
3. Rebuild the app: `npm run build`

## Current Status

⚠️ **Icons not yet created** - The PWA will function but won't have custom icons until you add them.

The manifest is already configured in `vite.config.js` and will automatically use the icons once they're placed in the public folder.
