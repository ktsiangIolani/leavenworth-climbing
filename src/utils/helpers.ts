import { ActivityType } from '../types'
import { format, parse, isValid } from 'date-fns'

// ── Activity type detection ────────────────────────────────────────────────

export function detectActivityType(title: string, notes: string): ActivityType {
  const text = (title + ' ' + notes).toLowerCase()

  if (/depart hhl|depart hnl|depart sea|flight|airline|hhl-sea|hnl-sea|arrive.*am|arrives.*am|dl\d{3}/.test(text))
    return 'flight'
  if (/concert|music|rufus|show|festival/.test(text))
    return 'entertainment'
  if (/check.?in|check.?out|hotel|doubletree|hilton|airbnb|cabin|lodging|confirmation/.test(text))
    return 'lodging'
  if (/drive|driving|turo|pick.?up.*car|rental car|pick.?up.*bag|car.*pick|road trip/.test(text))
    return 'driving'
  if (/crash pad|bouldering|crag|climb|route|send|pitch|wall|pinnacle|buttress|rappel/.test(text))
    return 'climbing'
  if (/hike|hiking|trail|walk/.test(text))
    return 'hiking'
  if (/dinner|lunch|breakfast|brekky|eat|food|restaurant|potluck|spaghetti|snack|grocery|trader joe|andreas|cook/.test(text))
    return 'food'
  if (/shop|rei|store|buy|purchase/.test(text))
    return 'shopping'
  if (/sleep|wake|rest|nap|jetlag/.test(text))
    return 'rest'

  return 'other'
}

// ── Activity color/icon meta ──────────────────────────────────────────────

export interface ActivityMeta {
  colorClass: string       // Tailwind text color
  bgClass: string          // Tailwind bg color (light tint)
  borderClass: string
  dotClass: string         // bg color for timeline dot
  label: string
}

export function getActivityMeta(type: ActivityType): ActivityMeta {
  const map: Record<ActivityType, ActivityMeta> = {
    climbing:      { colorClass: 'text-[#E84A5F]',    bgClass: 'bg-[#E84A5F]/10',   borderClass: 'border-[#E84A5F]/30',   dotClass: 'bg-[#E84A5F]',    label: 'Climbing' },
    hiking:        { colorClass: 'text-[#99B898]',   bgClass: 'bg-[#99B898]/10',   borderClass: 'border-[#99B898]/30',   dotClass: 'bg-[#99B898]',   label: 'Hiking' },
    food:          { colorClass: 'text-amber-500',   bgClass: 'bg-amber-500/10',   borderClass: 'border-amber-500/30',   dotClass: 'bg-amber-500',   label: 'Food' },
    driving:       { colorClass: 'text-[#C4894A]',   bgClass: 'bg-[#FECEAB]/20',   borderClass: 'border-[#FECEAB]/40',   dotClass: 'bg-[#FECEAB]',   label: 'Driving' },
    rest:          { colorClass: 'text-[#99B898]',   bgClass: 'bg-[#99B898]/10',   borderClass: 'border-[#99B898]/30',   dotClass: 'bg-[#99B898]',   label: 'Rest' },
    lodging:       { colorClass: 'text-[#FF847C]',   bgClass: 'bg-[#FF847C]/10',   borderClass: 'border-[#FF847C]/30',   dotClass: 'bg-[#FF847C]',   label: 'Lodging' },
    shopping:      { colorClass: 'text-amber-400',   bgClass: 'bg-amber-500/10',   borderClass: 'border-amber-500/30',   dotClass: 'bg-amber-400',   label: 'Shopping' },
    entertainment: { colorClass: 'text-violet-400',  bgClass: 'bg-violet-500/10',  borderClass: 'border-violet-500/30',  dotClass: 'bg-violet-500',  label: 'Entertainment' },
    flight:        { colorClass: 'text-sky-400',     bgClass: 'bg-sky-500/10',     borderClass: 'border-sky-500/30',     dotClass: 'bg-sky-400',     label: 'Flight' },
    other:         { colorClass: 'text-[#94A7AB]',   bgClass: 'bg-[#94A7AB]/10',   borderClass: 'border-[#94A7AB]/30',   dotClass: 'bg-[#94A7AB]',  label: 'Other' },
  }
  return map[type]
}

// ── Date/time helpers ─────────────────────────────────────────────────────

export function parseSheetDate(dateStr: string): Date {
  if (!dateStr) return new Date(NaN)
  const d = parse(dateStr.trim(), 'M/d/yyyy', new Date())
  return isValid(d) ? d : new Date(NaN)
}

export function formatDisplayDate(date: Date): string {
  if (!isValid(date)) return ''
  return format(date, 'EEEE, MMMM d')
}

export function formatShortDate(date: Date): string {
  if (!isValid(date)) return ''
  return format(date, 'EEE MMM d')
}

export function formatTime(time: string): string {
  if (!time) return ''
  const cleaned = time.replace(/\s*(AM|PM)/i, '').trim()
  const [h, m] = cleaned.split(':').map(Number)
  if (isNaN(h)) return time
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const ampm = h < 12 ? 'AM' : 'PM'
  return m === 0 ? `${hour12} ${ampm}` : `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatTimeRange(start: string, end: string): string {
  if (!start && !end) return ''
  if (!start) return `Until ${formatTime(end)}`
  if (!end) return formatTime(start)
  return `${formatTime(start)} – ${formatTime(end)}`
}

// ── Grade helpers ─────────────────────────────────────────────────────────

const YOSEMITE_ORDER = [
  '5.0','5.1','5.2','5.3','5.4','5.5','5.6','5.7','5.8',
  '5.9','5.9+','5.10a','5.10b','5.10c','5.10d',
  '5.11a','5.11b','5.11c','5.11d',
  '5.12a','5.12b','5.12c','5.12d',
  '5.13a','5.13b','5.13c','5.13d',
]

export function gradeToNumber(grade: string): number {
  const idx = YOSEMITE_ORDER.indexOf(grade)
  if (idx >= 0) return idx
  const hueco = grade.match(/^V(\d+)$/)
  if (hueco) return 100 + parseInt(hueco[1])
  return 999
}

// ── Star rendering helper ─────────────────────────────────────────────────

export function starsArray(count: number): boolean[] {
  return Array.from({ length: 5 }, (_, i) => i < count)
}

// ── Color palette for avatars ─────────────────────────────────────────────

const AVATAR_COLORS = [
  'bg-orange-500', 'bg-[#99B898]', 'bg-[#FF847C]', 'bg-violet-500',
  'bg-pink-500', 'bg-amber-500', 'bg-[#E84A5F]', 'bg-rose-500',
]

export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ── Relative time ─────────────────────────────────────────────────────────

export function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
