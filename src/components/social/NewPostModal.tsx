import { useState, useRef } from 'react'
import { Image, X, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Modal } from '../ui/Modal'
import { useSocialFeed } from '../../hooks/useSocialFeed'
import { useAppStore } from '../../store/appStore'
import { LEAVENWORTH_ROUTES } from '../../data/routes'
import { cn } from '../ui/cn'

interface NewPostModalProps {
  open: boolean
  onClose: () => void
}

export function NewPostModal({ open, onClose }: NewPostModalProps) {
  const { addPost } = useSocialFeed()
  const currentUser = useAppStore(s => s.currentUser) ?? ''
  const fileRef = useRef<HTMLInputElement>(null)

  const DIFFICULTY_GRADES = [
    '5.6','5.7','5.8','5.9',
    '5.10a','5.10b','5.10c','5.10d',
    '5.11a','5.11b','5.11c','5.11d',
    '5.12a','5.12b','5.12c','5.12d','5.12+',
  ]

  const [routeName, setRouteName] = useState(LEAVENWORTH_ROUTES[0].name)
  const [customRoute, setCustomRoute] = useState('')
  const [useCustomRoute, setUseCustomRoute] = useState(false)
  const [difficulty, setDifficulty] = useState('')
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
    const resolvedName = useCustomRoute ? customRoute || routeName : routeName
    const resolvedGrade = LEAVENWORTH_ROUTES.find(r => r.name === resolvedName)?.grade ?? ''
    await addPost({
      authorName: currentUser,
      routeName: resolvedName,
      grade: resolvedGrade,
      difficulty,
      comment: comment.trim(),
      imageDataUrl,
    })
    setComment('')
    setImageDataUrl(undefined)
    setCustomRoute('')
    setUseCustomRoute(false)
    setDifficulty('')
    setSubmitting(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Log a Send">
      <div className="px-5 pb-6 pt-3 space-y-5">

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

        {/* Difficulty */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-tertiary">Felt Difficulty</label>
            {difficulty && (
              <button onClick={() => setDifficulty('')} className="text-[11px] font-semibold text-tertiary hover:text-primary cursor-pointer">Clear</button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DIFFICULTY_GRADES.map(g => (
              <button
                key={g}
                onClick={() => setDifficulty(d => d === g ? '' : g)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all border cursor-pointer',
                  difficulty === g
                    ? 'bg-brand-700 dark:bg-brand-600 border-brand-700 dark:border-brand-600 text-white'
                    : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary hover:border-brand-300 dark:hover:border-brand-800'
                )}
              >
                {g}
              </button>
            ))}
          </div>
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
            'w-full rounded-2xl py-4 text-base font-bold transition-all cursor-pointer',
            comment.trim() && !submitting
              ? 'bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white shadow-md'
              : 'bg-surface-secondary dark:bg-gray-800 text-tertiary cursor-not-allowed'
          )}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Posting…
            </span>
          ) : 'Post Send'}
        </motion.button>
      </div>
    </Modal>
  )
}
