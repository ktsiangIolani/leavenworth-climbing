import { motion } from 'framer-motion'
import { Star, Heart, CheckCircle2, Clock, Layers, MapPin } from 'lucide-react'
import type { ClimbingRoute } from '../../types'
import { useAppStore } from '../../store/appStore'
import { Badge } from '../ui/Badge'
import { cn } from '../ui/cn'

const STYLE_BADGE: Record<string, 'green' | 'blue' | 'amber'> = {
  Sport: 'green', Trad: 'blue', Boulder: 'amber',
}

interface RouteCardProps {
  route: ClimbingRoute
  onClick?: () => void
  onMapOpen?: (route: ClimbingRoute) => void
}

export function RouteCard({ route, onClick, onMapOpen }: RouteCardProps) {
  const { interestedRoutes, completedRoutes, toggleInterestedRoute, toggleCompletedRoute } = useAppStore()
  const interested = interestedRoutes.includes(route.id)
  const completed  = completedRoutes.includes(route.id)

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={cn(
        'bg-card border border-card rounded-2xl p-5 shadow-token-card card-interactive',
        completed && 'opacity-75'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className={cn('font-bold text-base text-primary leading-snug', completed && 'line-through text-secondary')}>
            {route.name}
          </p>
          <p className="text-sm text-secondary mt-0.5">{route.area}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5">
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={e => { e.stopPropagation(); onMapOpen?.(route) }}
            aria-label="View on map"
            className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-brand-600 dark:hover:text-[#FF847C] hover:border-brand-200 dark:hover:border-brand-800/40"
          >
            <MapPin size={15} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={e => { e.stopPropagation(); toggleInterestedRoute(route.id) }}
            aria-label="Save route"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer',
              interested
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40 text-red-500'
                : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-red-500 hover:border-red-200 dark:hover:border-red-800/40'
            )}
          >
            <Heart size={15} fill={interested ? 'currentColor' : 'none'} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={e => { e.stopPropagation(); toggleCompletedRoute(route.id) }}
            aria-label="Mark sent"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer',
              completed
                ? 'bg-brand-50 dark:bg-[#FF847C]/12 border-brand-200 dark:border-[#FF847C]/20 text-brand-700 dark:text-[#FF847C]'
                : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-brand-600 dark:hover:text-[#FF847C]'
            )}
          >
            <CheckCircle2 size={15} />
          </motion.button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant={STYLE_BADGE[route.style] ?? 'gray'}>{route.grade}</Badge>
        <Badge variant={STYLE_BADGE[route.style] ?? 'gray'}>{route.style}</Badge>
        {route.pitches > 1 && (
          <Badge variant="gray"><Layers size={10} />{route.pitches} pitches</Badge>
        )}
      </div>

      {/* Stars + approach */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} className={i < route.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'} />
          ))}
          <span className="ml-1.5 text-xs font-medium text-secondary">{route.stars}.0</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-secondary">
          <Clock size={11} className="text-tertiary" />
          {route.approach} approach
        </div>
      </div>

      {/* Notes excerpt */}
      {route.notes && (
        <p className="mt-3 text-xs text-secondary leading-relaxed line-clamp-2 border-t border-card pt-3">
          {route.notes}
        </p>
      )}
    </motion.div>
  )
}
