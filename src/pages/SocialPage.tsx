import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus } from 'lucide-react'
import { useSocialFeed } from '../hooks/useSocialFeed'
import { PostCard } from '../components/social/PostCard'
import { NewPostModal } from '../components/social/NewPostModal'

export function SocialPage() {
  const { posts } = useSocialFeed()
  const [newPostOpen, setNewPostOpen] = useState(false)

  const col1 = posts.filter((_, i) => i % 2 === 0)
  const col2 = posts.filter((_, i) => i % 2 === 1)

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-card px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-brand-700 dark:text-[#FF847C]" />
            <h1 className="text-lg font-black text-primary">Trip Feed</h1>
            <span className="text-xs font-medium text-tertiary">{posts.length} sends</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setNewPostOpen(true)}
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Log Send
          </motion.button>
        </div>
      </motion.header>

      {/* Feed */}
      <div className="px-3 pt-3 pb-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-surface-secondary dark:bg-gray-800 border border-card flex items-center justify-center">
              <Users size={28} className="text-tertiary" />
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
          <div className="flex gap-3">
            {/* Column 1 */}
            <div className="flex-1 space-y-3">
              {col1.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
            {/* Column 2 */}
            <div className="flex-1 space-y-3 mt-4">
              {col2.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.04 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NewPostModal open={newPostOpen} onClose={() => setNewPostOpen(false)} />
    </div>
  )
}
