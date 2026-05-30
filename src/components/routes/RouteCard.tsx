import { motion } from 'framer-motion'
import { Star, Layers, MapPin } from 'lucide-react'
import type { ClimbingRoute } from '../../types'
import { Badge } from '../ui/Badge'

const STYLE_BADGE: Record<string, 'green' | 'blue' | 'amber'> = {
  Sport: 'green', Trad: 'blue', Boulder: 'amber',
}

interface RouteCardProps {
  route: ClimbingRoute
  onClick?: () => void
  onMapOpen?: (route: ClimbingRoute) => void
}

export function RouteCard({ route, onClick, onMapOpen }: RouteCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className="bg-card border border-card rounded-2xl p-5 shadow-token-card card-interactive"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base text-primary leading-snug">{route.name}</p>
          <p className="text-sm text-secondary mt-0.5">{route.area}</p>
        </div>

        {/* Map pin */}
        <motion.button
          whileTap={{ scale: 0.82 }}
          onClick={e => { e.stopPropagation(); onMapOpen?.(route) }}
          aria-label="View on map"
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all cursor-pointer bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-brand-600 dark:hover:text-[#FF847C] hover:border-brand-200 dark:hover:border-brand-800/40"
        >
          <MapPin size={15} />
        </motion.button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant={STYLE_BADGE[route.style] ?? 'gray'}>{route.grade}</Badge>
        <Badge variant={STYLE_BADGE[route.style] ?? 'gray'}>{route.style}</Badge>
        {route.pitches > 1 && (
          <Badge variant="gray"><Layers size={10} />{route.pitches} pitches</Badge>
        )}
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {[...Array(4)].map((_, i) => (
          <Star key={i} size={13} className={i < route.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'} />
        ))}
        <span className="ml-1.5 text-xs font-medium text-secondary">{route.stars}/4</span>
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
