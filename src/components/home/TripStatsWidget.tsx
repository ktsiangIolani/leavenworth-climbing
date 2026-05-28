import { motion } from 'framer-motion'

const STATS = [
  { emoji: '📅', value: '6 days',     label: 'Jun 2–7, 2026' },
  { emoji: '🧗', value: '14 routes',  label: 'to explore'    },
  { emoji: '👥', value: '6 climbers', label: 'on the trip'   },
  { emoji: '📍', value: 'Leavenworth',label: 'Washington'    },
]

export function TripStatsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mx-5 mb-5"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-tertiary mb-3">Trip Overview</p>
      <div className="grid grid-cols-2 gap-3">
        {STATS.map(({ emoji, value, label }) => (
          <div
            key={value}
            className="bg-card border border-card rounded-2xl p-4 shadow-token-card"
          >
            <span className="text-2xl leading-none block mb-2">{emoji}</span>
            <p className="text-base font-bold text-primary leading-tight">{value}</p>
            <p className="text-xs text-secondary mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
