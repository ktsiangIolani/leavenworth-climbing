import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, RefreshCw } from 'lucide-react'
import { useSchedule } from '../hooks/useSchedule'
import { useAppStore } from '../store/appStore'
import { DaySection } from '../components/schedule/DaySection'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { cn } from '../components/ui/cn'

export function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState<string | 'all'>('all')
  const { scheduleRefreshCount, triggerScheduleRefresh } = useAppStore()
  const { data, isLoading, isError, isFetching } = useSchedule(scheduleRefreshCount)

  const filteredGroups = !data
    ? []
    : selectedDay === 'all'
      ? data.groups
      : data.groups.filter(g => g.day === selectedDay)

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-card px-4 pt-[max(env(safe-area-inset-top),12px)] pb-0"
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-brand-700 dark:text-[#FF847C]" />
            <h1 className="text-lg font-black text-primary">Trip Schedule</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={triggerScheduleRefresh}
            disabled={isFetching}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary dark:bg-gray-800 border border-card text-secondary hover:text-primary transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          </motion.button>
        </div>

        {/* Day filter chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          <button
            onClick={() => setSelectedDay('all')}
            className={cn(
              'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border cursor-pointer',
              selectedDay === 'all'
                ? 'bg-brand-700 dark:bg-brand-600 text-white border-brand-700 dark:border-brand-600'
                : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
            )}
          >
            All Days
          </button>
          {data?.groups.map(group => (
            <button
              key={group.date}
              onClick={() => setSelectedDay(group.day)}
              className={cn(
                'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border cursor-pointer',
                selectedDay === group.day
                  ? 'bg-brand-700 dark:bg-brand-600 text-white border-brand-700 dark:border-brand-600'
                  : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
              )}
            >
              {group.day}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Content */}
      {isLoading && (
        <div className="space-y-1 pt-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-3 px-4 py-2.5">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<Calendar size={40} />}
          title="Couldn't load schedule"
          description="Check your connection and pull to refresh."
          action={
            <button
              onClick={triggerScheduleRefresh}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-brand-700 dark:text-[#FF847C] bg-brand-50 dark:bg-brand-subtle border border-brand-border hover:bg-brand-100 dark:hover:bg-brand-subtle/80 transition-colors cursor-pointer"
            >
              Try again
            </button>
          }
        />
      )}

      {data && (
        <div className="pt-1 pb-4">
          {filteredGroups.map(group => (
            <DaySection key={group.date} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
