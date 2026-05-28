import { useQuery } from '@tanstack/react-query'
import { fetchSchedule } from '../services/sheetsService'
import { DayGroup, ScheduleEvent } from '../types'
import { isValid } from 'date-fns'

export function useSchedule(refreshCount = 0) {
  return useQuery({
    queryKey: ['schedule', refreshCount],
    queryFn: () => fetchSchedule(refreshCount > 0),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })
}

export function getActiveDayGroup(groups: DayGroup[]): DayGroup | null {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Find today's group
  const todayGroup = groups.find(g => {
    if (!isValid(g.dateObj)) return false
    const d = new Date(g.dateObj.getFullYear(), g.dateObj.getMonth(), g.dateObj.getDate())
    return d.getTime() === today.getTime()
  })
  if (todayGroup) return todayGroup

  // If trip hasn't started, return the first day
  const firstGroup = groups[0]
  if (firstGroup && isValid(firstGroup.dateObj) && firstGroup.dateObj > today) {
    return firstGroup
  }

  // Trip is over — return the last day
  return groups[groups.length - 1] ?? null
}

export function getTodayEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return events.filter(e => {
    if (!isValid(e.dateObj)) return false
    const d = new Date(e.dateObj.getFullYear(), e.dateObj.getMonth(), e.dateObj.getDate())
    return d.getTime() === today.getTime()
  })
}
