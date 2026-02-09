# Supabase Analytics Setup Guide

This guide will help you set up visitor tracking for your SuperTool website using Supabase PostgreSQL.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note down your project URL and anon/public key

## 2. Database Schema

Run the following SQL commands in your Supabase SQL Editor to create the required tables:

### Table 1: page_visits
Tracks every page visit with visitor information.

```sql
CREATE TABLE page_visits (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  language TEXT,
  screen_resolution TEXT,
  timezone TEXT,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_page_visits_visitor_id ON page_visits(visitor_id);
CREATE INDEX idx_page_visits_session_id ON page_visits(session_id);
CREATE INDEX idx_page_visits_visited_at ON page_visits(visited_at);
CREATE INDEX idx_page_visits_page_path ON page_visits(page_path);

-- Add comments
COMMENT ON TABLE page_visits IS 'Tracks all page visits with visitor information';
COMMENT ON COLUMN page_visits.visitor_id IS 'Unique visitor identifier (persists across sessions)';
COMMENT ON COLUMN page_visits.session_id IS 'Session identifier (unique per browser session)';
```

### Table 2: tool_clicks
Tracks when users click/open tools.

```sql
CREATE TABLE tool_clicks (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  language TEXT,
  screen_resolution TEXT,
  timezone TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tool_clicks_visitor_id ON tool_clicks(visitor_id);
CREATE INDEX idx_tool_clicks_session_id ON tool_clicks(session_id);
CREATE INDEX idx_tool_clicks_tool_name ON tool_clicks(tool_name);
CREATE INDEX idx_tool_clicks_clicked_at ON tool_clicks(clicked_at);

-- Add comments
COMMENT ON TABLE tool_clicks IS 'Tracks tool usage/clicks';
COMMENT ON COLUMN tool_clicks.tool_name IS 'Name of the tool that was clicked';
COMMENT ON COLUMN tool_clicks.tool_id IS 'Unique identifier for the tool';
```

### Table 3: custom_events (Optional)
For tracking custom events.

```sql
CREATE TABLE custom_events (
  id BIGSERIAL PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT,
  language TEXT,
  screen_resolution TEXT,
  timezone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_custom_events_visitor_id ON custom_events(visitor_id);
CREATE INDEX idx_custom_events_session_id ON custom_events(session_id);
CREATE INDEX idx_custom_events_event_name ON custom_events(event_name);
CREATE INDEX idx_custom_events_created_at ON custom_events(created_at);
CREATE INDEX idx_custom_events_event_data ON custom_events USING GIN (event_data);

-- Add comments
COMMENT ON TABLE custom_events IS 'Tracks custom events with flexible data structure';
COMMENT ON COLUMN custom_events.event_data IS 'JSON data associated with the event';
```

## 3. Row Level Security (RLS)

Enable RLS and create policies to allow anonymous inserts:

```sql
-- Enable RLS on all tables
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON page_visits
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON tool_clicks
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON custom_events
  FOR INSERT TO anon
  WITH CHECK (true);

-- Optional: Allow authenticated users to read their own data
CREATE POLICY "Allow authenticated reads" ON page_visits
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads" ON tool_clicks
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated reads" ON custom_events
  FOR SELECT TO authenticated
  USING (true);
```

## 4. Environment Configuration

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Add `.env` to your `.gitignore` file to keep your keys secure!

## 5. Useful Analytics Queries

### Most visited pages
```sql
SELECT 
  page_path,
  COUNT(*) as visit_count,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '7 days'
GROUP BY page_path
ORDER BY visit_count DESC;
```

### Most popular tools
```sql
SELECT 
  tool_name,
  COUNT(*) as click_count,
  COUNT(DISTINCT visitor_id) as unique_users
FROM tool_clicks
WHERE clicked_at >= NOW() - INTERVAL '7 days'
GROUP BY tool_name
ORDER BY click_count DESC;
```

### Visitor statistics by device type
```sql
SELECT 
  device_type,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(*) as total_visits
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '7 days'
GROUP BY device_type
ORDER BY unique_visitors DESC;
```

### Browser distribution
```sql
SELECT 
  browser,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  ROUND(COUNT(DISTINCT visitor_id) * 100.0 / SUM(COUNT(DISTINCT visitor_id)) OVER (), 2) as percentage
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '30 days'
GROUP BY browser
ORDER BY unique_visitors DESC;
```

### Daily active users
```sql
SELECT 
  DATE(visited_at) as date,
  COUNT(DISTINCT visitor_id) as daily_active_users
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(visited_at)
ORDER BY date DESC;
```

### Referrer analysis
```sql
SELECT 
  CASE 
    WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
    WHEN referrer LIKE '%google%' THEN 'Google'
    WHEN referrer LIKE '%facebook%' THEN 'Facebook'
    WHEN referrer LIKE '%twitter%' THEN 'Twitter'
    ELSE 'Other'
  END as referrer_source,
  COUNT(DISTINCT visitor_id) as unique_visitors
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '7 days'
GROUP BY referrer_source
ORDER BY unique_visitors DESC;
```

## 6. Data Retention (Optional)

Set up automatic data cleanup for old records:

```sql
-- Create a function to delete old records
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  -- Delete page visits older than 1 year
  DELETE FROM page_visits WHERE visited_at < NOW() - INTERVAL '1 year';
  
  -- Delete tool clicks older than 1 year
  DELETE FROM tool_clicks WHERE clicked_at < NOW() - INTERVAL '1 year';
  
  -- Delete custom events older than 1 year
  DELETE FROM custom_events WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Schedule it to run daily (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-analytics', '0 2 * * *', 'SELECT cleanup_old_analytics()');
```

## 7. Privacy Considerations

- No personally identifiable information (PII) is collected
- Visitor IDs are randomly generated, not tied to real identities
- User agent and IP addresses are not stored permanently
- All data is anonymized
- Consider adding a privacy policy page explaining data collection

## 8. Testing

After setup, test the tracking:

1. Visit your website
2. Click on a few tools
3. Check Supabase dashboard → Table Editor
4. Verify data is being inserted into `page_visits` and `tool_clicks` tables

## Troubleshooting

- **No data appearing:** Check browser console for errors
- **CORS errors:** Verify Supabase URL and anon key are correct
- **Insert errors:** Ensure RLS policies are set up correctly
- **Missing columns:** Re-run the table creation SQL

## Next Steps

- Set up Supabase dashboard for visualizing analytics
- Create custom views for common queries
- Set up email alerts for traffic milestones
- Export data periodically for backup