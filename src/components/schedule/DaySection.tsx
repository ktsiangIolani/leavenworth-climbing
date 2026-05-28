import { motion } from 'framer-motion'
import { isToday, isFuture } from 'date-fns'
import type { DayGroup, ActivityType } from '../../types'
import { EventCard } from './EventCard'
import { formatDisplayDate } from '../../utils/helpers'

interface Props {
  group: DayGroup
  filter?: ActivityType | 'all'
}

export function DaySection({ group, filter = 'all' }: Props) {
  const today    = isToday(group.dateObj)
  const upcoming = !today && isFuture(group.dateObj)

  const events = filter === 'all'
    ? group.events
    : group.events.filter(e => e.type === filter)

  if (events.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Sticky day header */}
      <div className="sticky top-[8.5rem] z-10 bg-surface/90 dark:bg-gray-900/90 backdrop-blur-lg px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Day dot */}
            <div className={`h-2 w-2 rounded-full ${today ? 'bg-brand-600 dark:bg-[#FF847C]' : upcoming ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
            <div>
              <p className={`font-bold text-sm ${today ? 'text-brand-700 dark:text-[#FF847C]' : 'text-primary'}`}>
                {group.day}
                {today && (
                  <span className="ml-2 text-xs font-semibold text-brand-600 dark:text-brand bg-brand-50 dark:bg-brand-subtle px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </p>
              <p className="text-xs text-tertiary mt-0.5">{formatDisplayDate(group.dateObj)}</p>
            </div>
          </div>
          <span className="text-xs font-medium text-tertiary">{events.length} event{events.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-2 pb-4 pt-1">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
