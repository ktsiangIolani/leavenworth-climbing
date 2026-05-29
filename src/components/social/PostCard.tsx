import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import type { FeedPost } from '../../types'
import { useSocialFeed } from '../../hooks/useSocialFeed'
import { useAppStore } from '../../store/appStore'
import { PARTICIPANTS } from '../../data/participants'
import { relativeTime } from '../../utils/helpers'
import { Modal } from '../ui/Modal'
import { cn } from '../ui/cn'

export function PostCard({ post }: { post: FeedPost }) {
  const { addComment } = useSocialFeed()
  const currentUser = useAppStore(s => s.currentUser) ?? ''
  const me = PARTICIPANTS.find(p => p.name === currentUser)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [imageModal, setImageModal] = useState(false)

  const handleComment = () => {
    if (!commentText.trim()) return
    addComment(post.id, currentUser, commentText.trim())
    setCommentText('')
  }

  return (
    <>
      <div className="bg-card border border-card rounded-2xl overflow-hidden shadow-token-card">
        {/* Author row */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold flex-shrink-0 select-none',
            post.avatarColor
          )}>
            {post.authorInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-primary">{post.authorName}</p>
            <p className="text-xs text-tertiary">{relativeTime(post.timestamp)}</p>
          </div>
          {/* Route chip */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs font-semibold text-brand-700 dark:text-[#FF847C] bg-brand-50 dark:bg-brand-subtle rounded-full px-2.5 py-1 border border-brand-border">
              {post.routeName}
            </span>
            <div className="flex items-center gap-1">
              {post.grade && <span className="text-xs text-tertiary font-medium">{post.grade}</span>}
              {post.difficulty && (
                <span className="text-xs font-bold text-white bg-brand-700 dark:bg-brand-600 rounded-full px-2 py-0.5">
                  {post.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Photo */}
        {post.imageDataUrl && (
          <button
            onClick={() => setImageModal(true)}
            className="block w-full overflow-hidden cursor-zoom-in"
          >
            <img
              src={post.imageDataUrl}
              alt={post.routeName}
              loading="lazy"
              decoding="async"
              className="w-full object-cover hover:opacity-95 transition-opacity"
              style={{ maxHeight: '280px' }}
            />
          </button>
        )}

        {/* Caption */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-sm text-primary leading-relaxed">{post.comment}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 px-3 pb-3 pt-1">
          <button
            onClick={() => setShowComments(s => !s)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all cursor-pointer',
              showComments
                ? 'bg-[#E84A5F]/10 dark:bg-[#FF847C]/12 text-[#E84A5F] dark:text-[#FF847C] border border-[#E84A5F]/25 dark:border-[#FF847C]/20'
                : 'bg-surface-secondary dark:bg-[#354449] text-secondary border border-card hover:text-[#E84A5F] dark:hover:text-[#FF847C]'
            )}
          >
            <MessageCircle size={15} />
            {post.comments.length}
          </button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden border-t border-card"
            >
              <div className="p-4 space-y-3">
                {post.comments.map(c => (
                  <div key={c.id} className="flex gap-2.5">
                    <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold', c.avatarColor)}>
                      {c.authorInitials}
                    </div>
                    <div className="flex-1 bg-surface-secondary dark:bg-gray-800 rounded-xl px-3 py-2">
                      <span className="text-xs font-bold text-brand-700 dark:text-[#FF847C]">{c.authorName} </span>
                      <span className="text-xs text-primary">{c.text}</span>
                    </div>
                  </div>
                ))}

                {/* Add comment */}
                <div className="flex gap-2.5">
                  <div className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold', me?.avatarColor ?? 'bg-brand-700')}>
                    {me?.initials ?? '?'}
                  </div>
                  <div className="flex flex-1 gap-2">
                    <input
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleComment()}
                      placeholder="Add a comment…"
                      className="flex-1 bg-surface-secondary dark:bg-gray-800 border border-card rounded-xl px-3 py-2 text-sm text-primary placeholder-tertiary outline-none focus:border-brand-300 dark:focus:border-brand-800 transition-colors"
                    />
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={handleComment}
                      disabled={!commentText.trim()}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 dark:bg-brand-800 text-white disabled:opacity-30 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Send size={14} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen image */}
      <Modal open={imageModal} onClose={() => setImageModal(false)} fullscreen>
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
          {post.imageDataUrl && (
            <img
              src={post.imageDataUrl}
              alt={post.routeName}
              className="max-w-full max-h-screen object-contain rounded-2xl"
              onClick={() => setImageModal(false)}
            />
          )}
        </div>
      </Modal>
    </>
  )
}
