# Analytics Implementation Guide

## Overview
Your SuperTool website now has comprehensive visitor tracking integrated with Supabase PostgreSQL. This tracks:
- **Page visits**: Every time someone visits your website
- **Tool clicks**: When users open/use specific tools
- **Visitor information**: Browser, OS, device type, location (timezone), screen resolution, referrer, etc.

## Setup Instructions

### 1. Set Up Supabase Database

Follow the detailed instructions in `SUPABASE_SETUP.md` to:
1. Create a Supabase account and project
2. Run the SQL schema to create tables
3. Configure Row Level Security (RLS) policies
4. Get your project URL and anon key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit `.env` to git (already in `.gitignore`)

### 3. Test the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and visit `http://localhost:5173`

3. Check the browser console for analytics messages:
   - "Analytics: Page visit tracked successfully"
   - "Analytics: Tool click tracked - [Tool Name]"

4. Click on a few tools to test tool tracking

5. Verify data in Supabase:
   - Go to your Supabase dashboard
   - Navigate to Table Editor
   - Check `page_visits` and `tool_clicks` tables
   - You should see new records with visitor information

## What Gets Tracked

### Page Visits (`page_visits` table)
- Visitor ID (persistent across sessions)
- Session ID (unique per browser session)
- Page URL and path
- Referrer (where they came from)
- User agent
- Browser (Chrome, Firefox, Safari, etc.)
- Operating System (Windows, macOS, Linux, iOS, Android)
- Device type (desktop, mobile, tablet)
- Language preference
- Screen resolution
- Timezone
- Timestamp

### Tool Clicks (`tool_clicks` table)
- All the above information, plus:
- Tool name
- Tool ID
- Timestamp of when tool was opened

## Privacy & Compliance

✅ **Privacy-Friendly**:
- No personally identifiable information (PII) collected
- No IP addresses stored
- Visitor IDs are randomly generated
- All data is anonymized

✅ **GDPR Compliant**:
- No cookies used for tracking
- Uses browser storage (localStorage/sessionStorage)
- Users can clear their data by clearing browser storage

⚠️ **Recommendations**:
- Add a privacy policy page explaining data collection
- Consider adding a cookie/tracking consent banner
- Implement data retention policies (see SUPABASE_SETUP.md)

## Viewing Analytics

### Quick Queries

**Most visited pages (last 7 days)**:
```sql
SELECT 
  page_path,
  COUNT(*) as visits,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '7 days'
GROUP BY page_path
ORDER BY visits DESC;
```

**Most popular tools (last 7 days)**:
```sql
SELECT 
  tool_name,
  COUNT(*) as clicks,
  COUNT(DISTINCT visitor_id) as unique_users
FROM tool_clicks
WHERE clicked_at >= NOW() - INTERVAL '7 days'
GROUP BY tool_name
ORDER BY clicks DESC;
```

**Device breakdown**:
```sql
SELECT 
  device_type,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '30 days'
GROUP BY device_type;
```

More queries available in `SUPABASE_SETUP.md`.

## Troubleshooting

### No data appearing in Supabase

1. **Check environment variables**:
   - Ensure `.env` file exists
   - Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correct
   - Restart dev server after changing `.env`

2. **Check browser console**:
   - Look for error messages
   - "Analytics: Supabase not configured" means env vars are missing
   - Network errors indicate connection issues

3. **Verify RLS policies**:
   - Ensure Row Level Security policies allow anonymous inserts
   - Check Supabase logs for permission errors

4. **Test Supabase connection**:
   ```javascript
   // In browser console
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

### Analytics not tracking in production

1. **Environment variables in production**:
   - Add env vars to your hosting platform (Vercel, Netlify, etc.)
   - Prefix must be `VITE_` for Vite to expose them to client

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Check build output**:
   - Ensure no errors during build
   - Verify env vars are being used

## Advanced Usage

### Track Custom Events

You can track custom events using the `trackEvent` function:

```javascript
import { trackEvent } from './utils/analytics.js'

// Track a custom event
trackEvent('newsletter_signup', {
  source: 'footer',
  email_domain: 'gmail.com'
})

// Track file download
trackEvent('file_download', {
  file_type: 'pdf',
  file_size: '2.5MB'
})
```

### Disable Analytics in Development

To disable analytics during development, add to `.env`:
```env
VITE_DISABLE_ANALYTICS=true
```

Then update `src/utils/analytics.js`:
```javascript
const DISABLE_ANALYTICS = import.meta.env.VITE_DISABLE_ANALYTICS === 'true'

if (DISABLE_ANALYTICS) {
  console.log('Analytics disabled in development')
  return
}
```

## Performance Impact

- **Minimal**: Analytics runs asynchronously
- **No blocking**: Page loads are not affected
- **Lightweight**: Supabase client is ~50KB gzipped
- **Efficient**: Uses browser storage for visitor/session IDs

## Next Steps

1. ✅ Set up Supabase database (see SUPABASE_SETUP.md)
2. ✅ Configure environment variables
3. ✅ Test locally
4. ✅ Deploy to production with env vars
5. 📊 Create analytics dashboard in Supabase
6. 📧 Set up email alerts for traffic milestones
7. 📈 Monitor and optimize based on data

## Support

For issues or questions:
1. Check `SUPABASE_SETUP.md` for detailed setup
2. Review Supabase documentation: https://supabase.com/docs
3. Check browser console for error messages
4. Verify RLS policies in Supabase dashboard

---

**Note**: This analytics system is designed to be privacy-friendly and GDPR-compliant. No personal data or IP addresses are collected.