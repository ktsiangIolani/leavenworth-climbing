import { motion } from 'framer-motion'
import { Calendar, ChevronRight } from 'lucide-react'
import { isToday } from 'date-fns'
import type { DayGroup } from '../../types'
import { EventCard } from '../schedule/EventCard'
import { formatShortDate } from '../../utils/helpers'
import { useAppStore } from '../../store/appStore'
import { Skeleton } from '../ui/Skeleton'

interface Props {
  group: DayGroup | null
  isLoading?: boolean
  isError?: boolean
}

export function TodayScheduleCard({ group, isLoading, isError }: Props) {
  const { setActiveTab } = useAppStore()

  if (isLoading) {
    return (
      <div className="mx-5 mb-5 bg-card border border-card rounded-3xl shadow-token-card overflow-hidden">
        <div className="p-5 pb-3 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
        <div className="pb-3 space-y-1">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="mx-5 h-16 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (isError || !group) {
    return (
      <div className="mx-5 mb-5 bg-card border border-card rounded-3xl shadow-token-card p-8 text-center">
        <Calendar size={32} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-secondary">Schedule unavailable</p>
        <p className="text-xs text-tertiary mt-1">Pull to refresh or check connection</p>
      </div>
    )
  }

  const todayLabel = isToday(group.dateObj)
  const heading    = todayLabel ? "Today's Plan" : `Coming up · ${group.day}`
  const dateStr    = formatShortDate(group.dateObj)
  const preview    = group.events.slice(0, 4)
  const overflow   = group.events.length - preview.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="mx-5 mb-5 bg-card border border-card rounded-3xl shadow-token-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <p className="font-bold text-base text-primary">{heading}</p>
          <p className="text-sm text-secondary mt-0.5">{dateStr}</p>
        </div>
        <button
          onClick={() => setActiveTab('schedule')}
          className="flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand hover:opacity-75 transition-opacity cursor-pointer"
        >
          View all <ChevronRight size={15} />
        </button>
      </div>

      {/* Events */}
      <div className="pb-3 space-y-1">
        {preview.map(event => (
          <EventCard key={event.id} event={event} compact />
        ))}
        {overflow > 0 && (
          <button
            onClick={() => setActiveTab('schedule')}
            className="mx-5 mt-1 flex w-[calc(100%-2.5rem)] items-center justify-center gap-1 rounded-2xl py-3 text-sm font-semibold text-brand-600 dark:text-brand bg-brand-50 dark:bg-brand-subtle hover:bg-brand-100 dark:hover:opacity-80 transition-colors cursor-pointer"
          >
            +{overflow} more <ChevronRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
