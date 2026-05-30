import { motion } from 'framer-motion'
import { ChevronRight, Star } from 'lucide-react'
import { LEAVENWORTH_ROUTES } from '../../data/routes'
import { useAppStore } from '../../store/appStore'
import { Badge } from '../ui/Badge'

const FEATURED = LEAVENWORTH_ROUTES.filter(r => r.stars >= 4).slice(0, 5)

const STYLE_VARIANT: Record<string, 'green' | 'blue' | 'amber'> = {
  Sport: 'green', Trad: 'blue', Boulder: 'amber',
}

export function QuickRoutesWidget() {
  const { setActiveTab } = useAppStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 }}
      className="mb-5"
    >
      <div className="flex items-center justify-between px-5 mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-tertiary">Classic Routes</p>
        <button
          onClick={() => setActiveTab('routes')}
          className="flex items-center gap-0.5 text-sm font-semibold text-brand-600 dark:text-brand hover:opacity-75 transition-opacity cursor-pointer"
        >
          All <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-3 pl-5 overflow-x-auto no-scrollbar pb-1">
        {FEATURED.map((route, i) => (
          <motion.button
            key={route.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => setActiveTab('routes')}
            className="flex-shrink-0 w-52 bg-card border border-card rounded-2xl p-4 text-left shadow-token-card card-interactive"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge variant={STYLE_VARIANT[route.style] ?? 'gray'} size="sm">{route.grade}</Badge>
              <div className="flex items-center gap-0.5">
                {[...Array(route.stars)].map((_, s) => (
                  <Star key={s} size={10} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="font-bold text-sm text-primary leading-tight mb-1">{route.name}</p>
            <p className="text-xs text-secondary mb-2.5">{route.area}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-secondary bg-surface-secondary dark:bg-gray-800 rounded-lg px-2 py-1">
                {route.style}
              </span>
            </div>
          </motion.button>
        ))}
        {/* Spacer at end */}
        <div className="w-5 flex-shrink-0" />
      </div>
    </motion.div>
  )
}
