// ── Activity / Schedule ──────────────────────────────────────────────────────

export type ActivityType =
  | 'climbing'
  | 'hiking'
  | 'food'
  | 'driving'
  | 'rest'
  | 'lodging'
  | 'shopping'
  | 'entertainment'
  | 'flight'
  | 'other'

export interface ScheduleEvent {
  id: string
  day: string       // "Tuesday"
  date: string      // "6/2/2026"
  dateObj: Date
  startTime: string // "15:00" or ""
  endTime: string   // "23:59" or ""
  duration: string  // "8:57" or ""
  title: string
  notes: string
  type: ActivityType
  completed: boolean
}

export interface DayGroup {
  day: string
  date: string
  dateObj: Date
  events: ScheduleEvent[]
}

// ── Routes ───────────────────────────────────────────────────────────────────

export type ClimbingStyle = 'Sport' | 'Trad' | 'Boulder' | 'Mixed' | 'Aid'
export type GradeSystem = 'Yosemite' | 'Hueco'

export interface ClimbingRoute {
  id: string
  name: string
  grade: string
  style: ClimbingStyle
  pitches: number
  height: string
  stars: number       // 1-5
  area: string
  lat: number
  lng: number
  notes: string
  mpUrl?: string
  interested: boolean
  completed: boolean
}

// ── Weather ───────────────────────────────────────────────────────────────────

export interface WeatherDay {
  date: Date
  maxTemp: number
  minTemp: number
  precipProbability: number
  windspeed: number
  weatherCode: number
  description: string
  icon: string        // emoji
}

export interface WeatherData {
  days: WeatherDay[]
  fetchedAt: Date
}

// ── Social Feed ───────────────────────────────────────────────────────────────

export interface FeedComment {
  id: string
  authorName: string
  authorInitials: string
  avatarColor: string
  text: string
  timestamp: string // ISO
}

export interface FeedPost {
  id: string
  authorName: string
  authorInitials: string
  avatarColor: string
  routeName: string
  grade: string
  difficulty?: string
  comment: string
  timestamp: string // ISO
  imageDataUrl?: string
  likes: number
  likedByMe: boolean
  comments: FeedComment[]
}

// ── Participants ──────────────────────────────────────────────────────────────

export interface Participant {
  name: string
  initials: string
  avatarColor: string
  notes: string
}

// ── App State ─────────────────────────────────────────────────────────────────

export type NavTab = 'home' | 'schedule' | 'routes'

export interface AppState {
  activeTab: NavTab
  darkMode: boolean
  completedEvents: Set<string>
  interestedRoutes: Set<string>
  completedRoutes: Set<string>
}
