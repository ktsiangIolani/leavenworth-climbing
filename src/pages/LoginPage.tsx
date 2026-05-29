import { motion } from 'framer-motion'
import { Mountain } from 'lucide-react'
import { PARTICIPANTS } from '../data/participants'
import { useAppStore } from '../store/appStore'
import { cn } from '../components/ui/cn'

export function LoginPage() {
  const setCurrentUser = useAppStore(s => s.setCurrentUser)

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-brand-700 dark:bg-brand-600 flex items-center justify-center shadow-lg">
            <Mountain size={32} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-primary mb-1">Leavenworth Climbing</h1>
          <p className="text-sm text-secondary">Who are you?</p>
        </div>

        {/* Participant pills */}
        <div className="flex flex-col gap-3">
          {PARTICIPANTS.map((p, i) => (
            <motion.button
              key={p.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentUser(p.name)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 bg-card border border-card shadow-token-card hover:border-brand-300 dark:hover:border-brand-800 transition-all cursor-pointer group"
            >
              <div className={cn(
                'h-11 w-11 flex-shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm',
                p.avatarColor
              )}>
                {p.initials}
              </div>
              <span className="text-base font-semibold text-primary group-hover:text-brand-700 dark:group-hover:text-[#FF847C] transition-colors">
                {p.name}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
