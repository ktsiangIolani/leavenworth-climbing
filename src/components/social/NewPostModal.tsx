import { useState, useRef } from 'react'
import { Image, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Modal } from '../ui/Modal'
import { useSocialFeed } from '../../hooks/useSocialFeed'
import { PARTICIPANTS } from '../../data/participants'
import { LEAVENWORTH_ROUTES } from '../../data/routes'
import { cn } from '../ui/cn'

interface NewPostModalProps {
  open: boolean
  onClose: () => void
}

export function NewPostModal({ open, onClose }: NewPostModalProps) {
  const { addPost } = useSocialFeed()
  const fileRef = useRef<HTMLInputElement>(null)

  const [authorName, setAuthorName] = useState(PARTICIPANTS[0].name)
  const [routeName, setRouteName] = useState(LEAVENWORTH_ROUTES[0].name)
  const [customRoute, setCustomRoute] = useState('')
  const [useCustomRoute, setUseCustomRoute] = useState(false)
  const [comment, setComment] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImageDataUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!comment.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 300))
    const resolvedName = useCustomRoute ? customRoute || routeName : routeName
    const resolvedGrade = LEAVENWORTH_ROUTES.find(r => r.name === resolvedName)?.grade ?? ''
    addPost({
      authorName,
      routeName: resolvedName,
      grade: resolvedGrade,
      comment: comment.trim(),
      imageDataUrl,
    })
    setComment('')
    setImageDataUrl(undefined)
    setCustomRoute('')
    setUseCustomRoute(false)
    setSubmitting(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Log a Send">
      <div className="px-5 pb-6 pt-3 space-y-5">

        {/* Climber */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-tertiary block mb-2">Climber</label>
          <div className="flex gap-2 flex-wrap">
            {PARTICIPANTS.map(p => (
              <button
                key={p.name}
                onClick={() => setAuthorName(p.name)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all border cursor-pointer',
                  authorName === p.name
                    ? 'bg-brand-50 dark:bg-brand-subtle border-brand-border text-brand-700 dark:text-[#FF847C]'
                    : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
                )}
              >
                <div className={cn('h-5 w-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold', p.avatarColor)}>
                  {p.initials}
                </div>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Route */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-tertiary">Route</label>
            <button
              onClick={() => setUseCustomRoute(u => !u)}
              className="text-[11px] font-semibold text-brand-700 dark:text-[#FF847C] hover:underline cursor-pointer"
            >
              {useCustomRoute ? 'Pick from list' : 'Custom route'}
            </button>
          </div>
          {useCustomRoute ? (
            <input
              value={customRoute}
              onChange={e => setCustomRoute(e.target.value)}
              placeholder="Enter route name..."
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-primary bg-surface-secondary dark:bg-gray-800 border border-card outline-none placeholder-tertiary focus:border-brand-300 dark:focus:border-brand-800 transition-colors"
            />
          ) : (
            <select
              value={routeName}
              onChange={e => setRouteName(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-primary bg-surface-secondary dark:bg-gray-800 border border-card outline-none focus:border-brand-300 dark:focus:border-brand-800 transition-colors cursor-pointer"
            >
              {LEAVENWORTH_ROUTES.map(r => (
                <option key={r.id} value={r.name}>{r.name} ({r.grade})</option>
              ))}
            </select>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-tertiary block mb-2">Send notes</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Describe the send, beta, conditions..."
            rows={3}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm text-primary bg-surface-secondary dark:bg-gray-800 border border-card outline-none placeholder-tertiary focus:border-brand-300 dark:focus:border-brand-800 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Photo */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-tertiary block mb-2">Photo (optional)</label>
          {imageDataUrl ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={imageDataUrl} alt="upload preview" className="w-full max-h-44 object-cover" />
              <button
                onClick={() => setImageDataUrl(undefined)}
                className="absolute top-2 right-2 h-7 w-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-medium text-secondary hover:text-primary transition-colors w-full border-2 border-dashed border-card hover:border-brand-200 dark:hover:border-brand-800 bg-surface-secondary dark:bg-gray-800 cursor-pointer"
            >
              <Image size={16} />
              <span>Attach a photo</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!comment.trim() || submitting}
          className={cn(
            'w-full rounded-xl py-3.5 text-sm font-bold transition-all cursor-pointer',
            comment.trim() && !submitting
              ? 'bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white shadow-sm'
              : 'bg-surface-secondary dark:bg-gray-800 text-tertiary cursor-not-allowed'
          )}
        >
          {submitting ? 'Posting…' : 'Post Send'}
        </motion.button>
      </div>
    </Modal>
  )
}
