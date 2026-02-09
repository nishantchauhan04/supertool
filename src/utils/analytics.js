import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Initialize Supabase client
let supabase = null
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Get visitor information from browser
 */
function getVisitorInfo() {
  const userAgent = navigator.userAgent
  const language = navigator.language || navigator.userLanguage
  const screenResolution = `${window.screen.width}x${window.screen.height}`
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Detect device type
  let deviceType = 'desktop'
  if (/mobile/i.test(userAgent)) {
    deviceType = 'mobile'
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'tablet'
  }
  
  // Detect browser
  let browser = 'unknown'
  if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  else if (userAgent.includes('Opera')) browser = 'Opera'
  
  // Detect OS
  let os = 'unknown'
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'
  
  return {
    user_agent: userAgent,
    language,
    screen_resolution: screenResolution,
    timezone,
    device_type: deviceType,
    browser,
    os,
    referrer: document.referrer || null,
    page_url: window.location.href,
    page_path: window.location.pathname
  }
}

/**
 * Get or create session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

/**
 * Get or create visitor ID (persists across sessions)
 */
function getVisitorId() {
  let visitorId = localStorage.getItem('analytics_visitor_id')
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('analytics_visitor_id', visitorId)
  }
  return visitorId
}

/**
 * Track page visit
 */
export async function trackPageVisit() {
  if (!supabase) {
    console.warn('Analytics: Supabase not configured')
    return
  }

  try {
    const visitorInfo = getVisitorInfo()
    const sessionId = getSessionId()
    const visitorId = getVisitorId()

    const { data, error } = await supabase
      .from('page_visits')
      .insert([
        {
          visitor_id: visitorId,
          session_id: sessionId,
          ...visitorInfo,
          visited_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Analytics: Error tracking page visit:', error)
    } else {
      console.log('Analytics: Page visit tracked successfully')
    }
  } catch (error) {
    console.error('Analytics: Exception tracking page visit:', error)
  }
}

/**
 * Track tool click/usage
 */
export async function trackToolClick(toolName, toolId) {
  if (!supabase) {
    console.warn('Analytics: Supabase not configured')
    return
  }

  try {
    const visitorInfo = getVisitorInfo()
    const sessionId = getSessionId()
    const visitorId = getVisitorId()

    const { data, error } = await supabase
      .from('tool_clicks')
      .insert([
        {
          visitor_id: visitorId,
          session_id: sessionId,
          tool_name: toolName,
          tool_id: toolId,
          ...visitorInfo,
          clicked_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Analytics: Error tracking tool click:', error)
    } else {
      console.log(`Analytics: Tool click tracked - ${toolName}`)
    }
  } catch (error) {
    console.error('Analytics: Exception tracking tool click:', error)
  }
}

/**
 * Track custom event
 */
export async function trackEvent(eventName, eventData = {}) {
  if (!supabase) {
    console.warn('Analytics: Supabase not configured')
    return
  }

  try {
    const visitorInfo = getVisitorInfo()
    const sessionId = getSessionId()
    const visitorId = getVisitorId()

    const { data, error } = await supabase
      .from('custom_events')
      .insert([
        {
          visitor_id: visitorId,
          session_id: sessionId,
          event_name: eventName,
          event_data: eventData,
          ...visitorInfo,
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Analytics: Error tracking custom event:', error)
    } else {
      console.log(`Analytics: Custom event tracked - ${eventName}`)
    }
  } catch (error) {
    console.error('Analytics: Exception tracking custom event:', error)
  }
}

// Made with Bob
