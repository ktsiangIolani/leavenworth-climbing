import { differenceInDays, differenceInHours } from 'date-fns'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

const TRIP_START = new Date('2026-06-02T15:02:00-10:00')
const TRIP_END   = new Date('2026-06-07T16:15:00-07:00')

export function CountdownBanner() {
  const now = new Date()
  const daysLeft   = differenceInDays(TRIP_START, now)
  const hoursLeft  = differenceInHours(TRIP_START, now)
  const inProgress = now >= TRIP_START && now <= TRIP_END
  const over       = now > TRIP_END

  let big: string
  let sub: string

  if (over) {
    big = 'Trip complete 🎉'
    sub = 'Jun 2–7, 2026 · Leavenworth, WA'
  } else if (inProgress) {
    const day = differenceInDays(now, TRIP_START) + 1
    const left = differenceInDays(TRIP_END, now)
    big = `Day ${day} of 6`
    sub = `${left} day${left !== 1 ? 's' : ''} remaining`
  } else if (daysLeft > 1) {
    big = `${daysLeft} days away`
    sub = 'Jun 2–7, 2026 · Leavenworth, WA'
  } else if (hoursLeft > 0) {
    big = `${hoursLeft}h to go`
    sub = "Start packing your rack!"
  } else {
    big = 'It\'s go time!'
    sub = 'Have an amazing trip 🏔️'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-5 mb-5 rounded-3xl overflow-hidden bg-brand-700 dark:bg-brand-800"
      style={{ boxShadow: '0 4px 20px rgba(21,128,61,0.25)' }}
    >
      {/* Subtle texture overlay */}
      <div
        className="relative p-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brand-100 text-sm font-medium mb-0.5">Leavenworth Climbing Trip</p>
            <p className="text-white text-2xl font-bold leading-tight">{big}</p>
            <p className="text-brand-200 text-sm mt-1">{sub}</p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <span className="text-3xl select-none">⛰️</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/10">
          <MapPin size={13} className="text-brand-200" />
          <span className="text-xs text-brand-200 font-medium">190 Dos Brothers Lane, Leavenworth, WA</span>
        </div>
      </div>
    </motion.div>
  )
}
