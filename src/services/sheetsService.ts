import { parseCsv, groupByDay, FALLBACK_CSV } from '../utils/scheduleParser'
import { ScheduleEvent, DayGroup } from '../types'

const SHEET_ID = '1PGJrobk9nE9Uu1cqFCsBvpaNDXXdEhrk_X_n-JIRuBg'

// gviz/tq endpoint works for sheets shared as "Anyone with the link can view"
// without requiring an API key. It handles CORS in the browser.
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Sheet1`

const CACHE_KEY = 'leavenworth-schedule-cache'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  csv: string
  fetchedAt: number
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const entry: CacheEntry = JSON.parse(raw)
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return null
    return entry
  } catch {
    return null
  }
}

function writeCache(csv: string) {
  try {
    const entry: CacheEntry = { csv, fetchedAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // localStorage unavailable (private browsing etc.)
  }
}

async function fetchLiveCsv(): Promise<string> {
  const response = await fetch(SHEET_URL, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Sheet fetch failed: ${response.status}`)
  const csv = await response.text()
  // Sanity-check: must look like a real CSV, not an HTML error page
  if (csv.trim().startsWith('<')) throw new Error('Received HTML instead of CSV')
  writeCache(csv)
  return csv
}

export async function fetchSchedule(_forceRefresh = false): Promise<{
  events: ScheduleEvent[]
  groups: DayGroup[]
  fromCache: boolean
  fromFallback: boolean
}> {
  // 1. Always try the live sheet first
  try {
    const csv = await fetchLiveCsv()
    const events = parseCsv(csv)
    const groups = groupByDay(events)
    return { events, groups, fromCache: false, fromFallback: false }
  } catch {
    // 2. Network unavailable — try localStorage cache
    const cached = readCache()
    if (cached) {
      const events = parseCsv(cached.csv)
      const groups = groupByDay(events)
      return { events, groups, fromCache: true, fromFallback: false }
    }
    // 3. Last resort: hardcoded fallback
    const events = parseCsv(FALLBACK_CSV)
    const groups = groupByDay(events)
    return { events, groups, fromCache: false, fromFallback: true }
  }
}
