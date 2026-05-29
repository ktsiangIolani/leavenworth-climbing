import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  fullscreen?: boolean
}

export function Modal({ open, onClose, title, children, fullscreen = false }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            className={cn(
              'relative overflow-y-auto bg-card border border-card',
              fullscreen
                ? 'w-full h-full rounded-none'
                : 'w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] shadow-modal'
            )}
          >
            {/* Drag handle */}
            {!fullscreen && (
              <div className="flex justify-center pt-3.5 pb-1">
                <div className="h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-card">
                <h2 className="text-base font-bold text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-secondary hover:text-primary hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Close for fullscreen */}
            {fullscreen && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-14 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// Local cn for this file only (avoids circular import)
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
