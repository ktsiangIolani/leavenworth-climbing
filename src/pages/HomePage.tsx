import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Sun, Moon, Users, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { useSchedule, getActiveDayGroup } from '../hooks/useSchedule'
import { useAppStore } from '../store/appStore'
import { useSocialFeed } from '../hooks/useSocialFeed'
import { CountdownBanner } from '../components/home/CountdownBanner'
import { TodayScheduleCard } from '../components/home/TodayScheduleCard'
import { PostCard } from '../components/social/PostCard'
import { NewPostModal } from '../components/social/NewPostModal'

export function HomePage() {
  const { scheduleRefreshCount, triggerScheduleRefresh, darkMode, toggleDarkMode } = useAppStore()
  const { data, isLoading, isError, isFetching } = useSchedule(scheduleRefreshCount)
  const { posts } = useSocialFeed()
  const [newPostOpen, setNewPostOpen] = useState(false)

  const activeGroup = data ? getActiveDayGroup(data.groups) : null

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-card px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-tertiary font-medium uppercase tracking-widest">
              {format(new Date(), 'EEE, MMM d')}
            </p>
            <h1 className="text-lg font-black text-primary leading-tight">
              Leavenworth Climbing
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={triggerScheduleRefresh}
              disabled={isFetching}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary dark:bg-gray-800 border border-card text-secondary hover:text-primary transition-colors disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={toggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary dark:bg-gray-800 border border-card text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>
          </div>
        </div>

        {/* Live indicator */}
        {data && !data.fromFallback && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-[#99B898] animate-pulse" />
            <p className="text-[10px] text-tertiary">
              Live from Google Sheets{data.fromCache ? ' (cached)' : ''}
            </p>
          </div>
        )}
        {data?.fromFallback && (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Using offline schedule</p>
        )}
      </motion.header>

      {/* Page content */}
      <div className="pt-4">
        <CountdownBanner />
        <TodayScheduleCard
          group={activeGroup}
          isLoading={isLoading}
          isError={isError}
        />
        {/* Feed */}
        <div className="px-5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-brand-700 dark:text-[#FF847C]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-tertiary">Trip Feed</p>
            <span className="text-xs font-medium text-tertiary">{posts.length} sends</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setNewPostOpen(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={12} />
            Log Send
          </motion.button>
        </div>

        <div className="px-5 pb-4">
          {posts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-surface-secondary dark:bg-gray-800 border border-card flex items-center justify-center">
                <Users size={24} className="text-tertiary" />
              </div>
              <p className="text-base font-bold text-primary">No sends yet</p>
              <p className="text-sm text-secondary mt-1">Be the first to log a send!</p>
              <button
                onClick={() => setNewPostOpen(true)}
                className="mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 transition-colors cursor-pointer"
              >
                Log a Send
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>

      <NewPostModal open={newPostOpen} onClose={() => setNewPostOpen(false)} />
    </div>
  )
}
