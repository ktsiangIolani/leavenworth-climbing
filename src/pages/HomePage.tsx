import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Users, Plus, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { useSchedule, getActiveDayGroup } from '../hooks/useSchedule'
import { useAppStore } from '../store/appStore'
import { useSocialFeed } from '../hooks/useSocialFeed'
import { PARTICIPANTS } from '../data/participants'
import { CountdownBanner } from '../components/home/CountdownBanner'
import { TodayScheduleCard } from '../components/home/TodayScheduleCard'
import { PostCard } from '../components/social/PostCard'
import { NewPostModal } from '../components/social/NewPostModal'
import { Modal } from '../components/ui/Modal'
import { cn } from '../components/ui/cn'

const PULL_THRESHOLD = 72

export function HomePage() {
  const { scheduleRefreshCount, triggerScheduleRefresh, currentUser, setCurrentUser } = useAppStore()
  const { data, isLoading, isError, isFetching: schedFetching } = useSchedule(scheduleRefreshCount)
  const { posts, isFetching: feedFetching, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } = useSocialFeed()
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const currentParticipant = PARTICIPANTS.find(p => p.name === currentUser)

  // Pull-to-refresh state
  const touchStartY = useRef(0)
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage() },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const activeGroup = data ? getActiveDayGroup(data.groups) : null

  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY === 0) touchStartY.current = e.touches[0].clientY
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!touchStartY.current) return
    const dy = e.touches[0].clientY - touchStartY.current
    if (dy > 0) setPullY(Math.min(dy, PULL_THRESHOLD + 24))
  }

  async function onTouchEnd() {
    if (pullY >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true)
      setPullY(0)
      try {
        await refetch()
      } finally {
        setIsRefreshing(false)
      }
    } else {
      setPullY(0)
    }
    touchStartY.current = 0
  }

  const showIndicator = isRefreshing || pullY > 12

  return (
    <div
      className="min-h-screen bg-surface"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
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
              disabled={schedFetching}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary dark:bg-gray-800 border border-card text-secondary hover:text-primary transition-colors disabled:opacity-40 cursor-pointer"
            >
              <RefreshCw size={14} className={schedFetching ? 'animate-spin' : ''} />
            </motion.button>
            {currentParticipant && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setProfileOpen(true)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold shadow-sm cursor-pointer',
                  currentParticipant.avatarColor
                )}
                title={currentParticipant.name}
              >
                {currentParticipant.initials}
              </motion.button>
            )}
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

        {/* Feed header */}
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users size={14} className="text-brand-700 dark:text-[#FF847C]" />
            <p className="text-xs font-semibold uppercase tracking-widest text-tertiary">Trip Feed</p>
            <span className="text-xs font-medium text-tertiary">{posts.length} sends</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setNewPostOpen(true)}
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-base font-bold text-white bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 shadow-md transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Log a Send
          </motion.button>
        </div>

        {/* Pull-to-refresh indicator */}
        <div
          className="flex items-center justify-center overflow-hidden transition-all duration-200"
          style={{ height: showIndicator ? 36 : 0, opacity: showIndicator ? 1 : 0 }}
        >
          <Loader2
            size={18}
            className="text-brand-600 dark:text-[#FF847C]"
            style={{
              animation: isRefreshing || feedFetching ? 'spin 0.8s linear infinite' : 'none',
              transform: isRefreshing || feedFetching ? undefined : `rotate(${Math.min(pullY / PULL_THRESHOLD, 1) * 360}deg)`,
            }}
          />
          <span className="ml-2 text-xs text-tertiary">
            {isRefreshing || feedFetching ? 'Refreshing…' : pullY >= PULL_THRESHOLD ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>

        {/* Posts */}
        <div className="px-5 pb-4">
          {posts.length === 0 && !feedFetching ? (
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Infinite scroll sentinel + footer */}
        <div ref={sentinelRef} className="flex items-center justify-center py-4 px-5">
          {isFetchingNextPage && (
            <span className="flex items-center gap-2 text-xs text-tertiary">
              <Loader2 size={14} className="animate-spin text-brand-600 dark:text-[#FF847C]" />
              Loading more…
            </span>
          )}
          {!hasNextPage && posts.length > 0 && !feedFetching && (
            <p className="text-xs text-tertiary">All {posts.length} sends loaded</p>
          )}
        </div>
      </div>

      <NewPostModal open={newPostOpen} onClose={() => setNewPostOpen(false)} />

      {/* Change profile sheet */}
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="Switch Profile">
        <div className="px-5 pb-6 pt-2 space-y-2.5">
          {PARTICIPANTS.map(p => (
            <motion.button
              key={p.name}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setCurrentUser(p.name); setProfileOpen(false) }}
              className={cn(
                'flex items-center gap-4 w-full rounded-2xl px-4 py-3.5 border transition-all cursor-pointer',
                currentUser === p.name
                  ? 'bg-brand-50 dark:bg-brand-subtle border-brand-border'
                  : 'bg-surface-secondary dark:bg-gray-800 border-card hover:border-brand-300 dark:hover:border-brand-800'
              )}
            >
              <div className={cn(
                'h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold',
                p.avatarColor
              )}>
                {p.initials}
              </div>
              <span className={cn(
                'text-sm font-semibold flex-1 text-left',
                currentUser === p.name ? 'text-brand-700 dark:text-[#FF847C]' : 'text-primary'
              )}>
                {p.name}
              </span>
              {currentUser === p.name && (
                <span className="text-xs font-semibold text-brand-700 dark:text-[#FF847C]">You</span>
              )}
            </motion.button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
