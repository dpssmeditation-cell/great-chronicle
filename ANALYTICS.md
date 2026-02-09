# Google Analytics & Search Console Integration

This application is integrated with Google Analytics 4 (GA4) and Google Search Console for tracking user behavior and search performance.

## Setup Instructions

### 1. Google Analytics 4 Setup

1. **Create a Google Analytics 4 property:**
   - Go to [Google Analytics](https://analytics.google.com)
   - Click "Admin" (gear icon in bottom left)
   - Under "Property" column, click "Create Property"
   - Follow the setup wizard to create a GA4 property
   - Select "Web" as the platform

2. **Get your Measurement ID:**
   - After creating the property, you'll see a "Measurement ID" (format: `G-XXXXXXXXXX`)
   - Copy this ID

3. **Configure the application:**
   - Create a `.env` file in the project root (copy from `.env.example`)
   - Add your Measurement ID:
     ```
     VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
     ```
   - Also update the Measurement ID in `index.html` on line 15:
     ```html
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     ```

### 2. Google Search Console Setup

1. **Add your property:**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Click "Add Property"
   - Enter your website URL

2. **Verify ownership using HTML tag method:**
   - Select "HTML tag" verification method
   - Copy the verification code from the meta tag (the content value)
   - Add it to your `.env` file:
     ```
     VITE_GSC_VERIFICATION=your_verification_code_here
     ```
   - Also update `index.html` on line 11:
     ```html
     <meta name="google-site-verification" content="your_verification_code_here" />
     ```

3. **Complete verification:**
   - Deploy your website with the updated verification tag
   - Return to Search Console and click "Verify"

## Features

### Automatic Page View Tracking

The application automatically tracks page views whenever users navigate between pages:
- Home page (`/`)
- Browse page (`/browse`)
- Reader page (`/read/:id`)
- Search page (`/search`)

### Custom Event Tracking

You can track custom events using the `trackEvent` function from `src/utils/analytics.js`:

```javascript
import { trackEvent } from './utils/analytics';

// Track a custom event
trackEvent('Category', 'Action', 'Label', value);

// Example: Track when user opens a chapter
trackEvent('Reader', 'Open Chapter', chapterTitle);

// Example: Track search queries
trackEvent('Search', 'Query', searchTerm);
```

## Testing

### Development Testing

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open browser DevTools:**
   - Press F12 or right-click → Inspect
   - Go to Console tab

3. **Verify initialization:**
   - You should see: `Google Analytics initialized with ID: G-XXXXXXXXXX`
   - Navigate between pages and check for: `Page view tracked: /path`

4. **Check network requests:**
   - Go to Network tab
   - Filter by "google-analytics" or "collect"
   - Navigate between pages
   - You should see analytics requests being sent

### Production Testing

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **Test in Google Analytics Real-Time:**
   - Go to Google Analytics → Reports → Realtime
   - Open your application in a browser
   - Navigate between pages
   - You should see active users and page views in real-time (updates within 30 seconds)

## Cookie Consent Banner

This application includes a **GDPR-compliant cookie consent banner** that appears on the first visit. Users must explicitly accept or decline analytics tracking before any data is collected.

### How It Works

1. **First Visit:** Cookie consent banner appears at the bottom of the page
2. **User Choice:**
   - **Accept:** Sets `analytics-consent=true` cookie and initializes Google Analytics
   - **Decline:** Sets `analytics-consent=false` cookie and prevents all tracking
3. **Subsequent Visits:** Banner doesn't appear again; consent choice is remembered for 365 days

### Consent Banner Features

- **Dual Action Buttons:** Accept or Decline options
- **Privacy Information:** Clear explanation of what data is collected
- **Learn More Link:** Quick access to privacy policy information
- **Theme Integration:** Styled to match the application's design system
- **Persistent Choice:** Consent stored for 1 year

### Technical Implementation

The consent system uses:
- `react-cookie-consent` for the banner UI
- `js-cookie` for cookie management
- Custom consent checking in `analytics.js`

**Analytics only initialize if:**
1. Valid Measurement ID is configured
2. User has explicitly accepted tracking
3. Consent cookie is present and set to `true`

## Privacy Considerations

This implementation tracks:
- Page views and navigation patterns (only with consent)
- User interactions via custom events (only with consent)
- Basic demographics and device information via Google Analytics (only with consent)

### GDPR/CCPA Compliance

✅ **Compliant Features:**
- Explicit opt-in consent required before any tracking
- Clear information about data collection
- Easy decline option
- Consent choice persisted and respected
- IP anonymization enabled by default in GA4
- No tracking without user consent

**Privacy Policy Recommendations:**
- Explain what data Google Analytics collects
- Describe how data is used (site improvement, user experience)
- Provide contact information for privacy inquiries
- Explain user rights (access, deletion, opt-out)

## Troubleshooting

### Analytics not working

1. **Check environment variables:**
   - Ensure `.env` file exists with valid `VITE_GA_MEASUREMENT_ID`
   - Restart dev server after changing `.env` file

2. **Check console for errors:**
   - Open browser DevTools → Console
   - Look for any error messages related to analytics

3. **Verify Measurement ID format:**
   - Should be `G-XXXXXXXXXX` (starts with `G-`)
   - Old Universal Analytics IDs (`UA-XXXXXXXXX`) won't work with GA4

### Search Console verification failing

1. **Check meta tag:**
   - View page source in browser
   - Search for `google-site-verification`
   - Ensure the content matches what Search Console expects

2. **Deploy to production:**
   - Verification only works on the live, deployed site
   - Local development URLs won't work

3. **Wait for DNS propagation:**
   - If you just deployed, wait 24-48 hours for DNS to propagate

## File Structure

```
src/
├── utils/
│   └── analytics.js          # Analytics utility functions with consent checking
├── App.jsx                    # Analytics initialization, tracking & cookie consent banner
└── main.jsx                   # App entry point

index.html                     # Google Analytics gtag.js script
.env.example                   # Environment variable template
.env                          # Your actual configuration (not committed)

package.json                   # Dependencies: react-ga4, react-cookie-consent, js-cookie
```

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Google Search Console Help](https://support.google.com/webmasters/answer/9008080)
- [react-ga4 Documentation](https://github.com/codler/react-ga4)
- [react-cookie-consent Documentation](https://github.com/Mastermindzh/react-cookie-consent)
