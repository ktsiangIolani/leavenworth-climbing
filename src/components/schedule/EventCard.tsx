import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Car, Utensils, Moon, Home, ShoppingBag, Music, Plane, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react'
import type { ScheduleEvent, ActivityType } from '../../types'
import { formatTimeRange, getActivityMeta } from '../../utils/helpers'
import { useAppStore } from '../../store/appStore'
import { cn } from '../ui/cn'

const ICONS: Record<ActivityType, typeof Mountain> = {
  climbing:      Mountain,
  hiking:        MapPin,
  food:          Utensils,
  driving:       Car,
  rest:          Moon,
  lodging:       Home,
  shopping:      ShoppingBag,
  entertainment: Music,
  flight:        Plane,
  other:         MapPin,
}

// Map activity type → icon background color class
const ICON_BG: Record<ActivityType, string> = {
  climbing:      'bg-brand-50 dark:bg-brand-subtle text-brand-700 dark:text-[#FF847C]',
  hiking:        'bg-[#99B898]/15 dark:bg-[#99B898]/20 text-[#5A7A6A] dark:text-[#99B898]',
  food:          'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  driving:       'bg-[#FECEAB]/25 dark:bg-[#FECEAB]/15 text-[#C4894A] dark:text-[#FECEAB]',
  rest:          'bg-[#99B898]/15 dark:bg-[#99B898]/20 text-[#5A7A6A] dark:text-[#99B898]',
  lodging:       'bg-[#FF847C]/15 dark:bg-[#FF847C]/15 text-[#C44236] dark:text-[#FF847C]',
  shopping:      'bg-[#FECEAB]/25 dark:bg-[#FECEAB]/15 text-[#C4894A] dark:text-[#FECEAB]',
  entertainment: 'bg-[#E84A5F]/10 dark:bg-[#E84A5F]/15 text-[#BE2B41] dark:text-[#FF847C]',
  flight:        'bg-[#99B898]/15 dark:bg-[#99B898]/20 text-[#5A7A6A] dark:text-[#99B898]',
  other:         'bg-[#F6EDE4] dark:bg-[#354449] text-[#5E6E72] dark:text-[#A4B8BC]',
}

interface EventCardProps {
  event: ScheduleEvent
  compact?: boolean
}

export function EventCard({ event, compact = false }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { completedEvents, toggleEventComplete } = useAppStore()
  const done = completedEvents.includes(event.id)
  const meta = getActivityMeta(event.type)
  const Icon = ICONS[event.type]
  const timeLabel = formatTimeRange(event.startTime, event.endTime)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'mx-5 rounded-2xl cursor-pointer select-none',
        done ? 'opacity-50' : ''
      )}
    >
      <div
        onClick={() => setExpanded(e => !e)}
        className={cn(
          'flex items-center gap-3.5 p-4 rounded-2xl border border-card bg-card shadow-token-card',
          'hover:shadow-token-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-token-card',
          'transition-all duration-150',
        )}
      >
        {/* Category dot strip */}
        <div className={cn('w-1 self-stretch rounded-full flex-shrink-0', meta.dotClass)} />

        {/* Icon */}
        <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', ICON_BG[event.type])}>
          <Icon size={18} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm text-primary leading-snug', done && 'line-through text-secondary')}>
            {event.title}
          </p>
          {timeLabel && (
            <p className="text-xs font-medium text-secondary mt-0.5">{timeLabel}</p>
          )}
          {event.notes && !expanded && !compact && (
            <p className="text-xs text-tertiary mt-0.5 truncate">{event.notes}</p>
          )}
        </div>

        {/* Done indicator / expand chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {done && <CheckCircle2 size={16} className="text-brand-600 dark:text-brand" />}
          {!compact && (
            <ChevronDown
              size={15}
              className={cn('text-tertiary transition-transform duration-200', expanded && 'rotate-180')}
            />
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {!compact && (
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="mx-1 border border-t-0 border-card rounded-b-2xl bg-surface-secondary dark:bg-gray-800/50 px-4 pb-4 pt-3 space-y-3">
                {event.notes && (
                  <p className="text-sm text-secondary leading-relaxed">{event.notes}</p>
                )}
                {event.duration && (
                  <p className="text-xs text-tertiary">Duration: {event.duration}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-white dark:bg-gray-700 rounded-full px-3 py-1 border border-card">
                    {meta.label}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleEventComplete(event.id) }}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border transition-colors cursor-pointer',
                      done
                        ? 'bg-brand-50 dark:bg-brand-subtle text-brand-700 dark:text-[#FF847C] border-brand-200 dark:border-[#FF847C]/25'
                        : 'bg-white dark:bg-gray-700 text-secondary border-card hover:text-primary'
                    )}
                  >
                    <CheckCircle2 size={13} />
                    {done ? 'Completed' : 'Mark done'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}
