import { Heart, CheckCircle2, Layers, Star, MapPin, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ClimbingRoute } from '../../types'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { useAppStore } from '../../store/appStore'
import { cn } from '../ui/cn'

interface Props {
  route: ClimbingRoute | null
  onClose: () => void
}

const STYLE_BADGE: Record<string, 'green' | 'blue' | 'amber'> = {
  Sport: 'green', Trad: 'blue', Boulder: 'amber',
}

export function RouteDetailModal({ route, onClose }: Props) {
  const { interestedRoutes, completedRoutes, toggleInterestedRoute, toggleCompletedRoute, setActiveTab, setPendingMapRoute } = useAppStore()
  if (!route) return null

  function handleViewOnMap() {
    setPendingMapRoute(route!.id)
    setActiveTab('routes')
    onClose()
  }

  const interested = interestedRoutes.includes(route.id)
  const completed  = completedRoutes.includes(route.id)

  return (
    <Modal open={!!route} onClose={onClose} title={route.name}>
      <div className="px-6 py-5 space-y-5">

        {/* Grade + actions hero */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-primary">{route.grade}</span>
            <div className="space-y-1">
              <Badge variant={STYLE_BADGE[route.style] ?? 'gray'} size="md">{route.style}</Badge>
              <p className="text-xs text-secondary">{route.area}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => toggleInterestedRoute(route.id)}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all cursor-pointer',
                interested
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-500'
                  : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-red-500'
              )}
            >
              <Heart size={20} fill={interested ? 'currentColor' : 'none'} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => toggleCompletedRoute(route.id)}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all cursor-pointer',
                completed
                  ? 'bg-brand-50 dark:bg-[#FF847C]/12 border-brand-300 dark:border-[#FF847C]/35 text-brand-700 dark:text-[#FF847C]'
                  : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-brand-600'
              )}
            >
              <CheckCircle2 size={20} />
            </motion.button>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          {[...Array(4)].map((_, i) => (
            <Star key={i} size={20} className={i < route.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-700'} />
          ))}
          <span className="ml-1 text-sm font-semibold text-secondary">{route.stars}/4 stars</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { Icon: Layers,   label: 'Pitches',  value: `${route.pitches} pitch${route.pitches !== 1 ? 'es' : ''}` },
            { Icon: MapPin,   label: 'Height',   value: route.height },
            { Icon: MapPin,   label: 'Area',     value: route.area },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="bg-surface-secondary dark:bg-gray-800 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={13} className="text-tertiary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary">{label}</span>
              </div>
              <p className="text-sm font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>

        {/* Beta */}
        {route.notes && (
          <div className="bg-surface-secondary dark:bg-gray-800 rounded-2xl p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-tertiary mb-2">Beta & Notes</p>
            <p className="text-sm text-secondary leading-relaxed">{route.notes}</p>
          </div>
        )}

        {/* View on map */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleViewOnMap}
          className="flex items-center justify-between gap-3 w-full bg-surface-secondary dark:bg-gray-800 rounded-2xl p-4 border border-card hover:border-brand-200 dark:hover:border-brand-800 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-subtle flex-shrink-0">
              <MapPin size={16} className="text-brand-700 dark:text-[#FF847C]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-primary">View on map</p>
              <p className="text-xs text-tertiary">See location &amp; nearby routes</p>
            </div>
          </div>
          <MapPin size={14} className="text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
        </motion.button>

        {/* Mountain Project link */}
        {route.mpUrl && (
          <a
            href={route.mpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 bg-surface-secondary dark:bg-gray-800 rounded-2xl p-4 border border-card hover:border-brand-200 dark:hover:border-brand-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20 flex-shrink-0">
                <ExternalLink size={16} className="text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">View on Mountain Project</p>
                <p className="text-xs text-tertiary">Beta, conditions &amp; more</p>
              </div>
            </div>
            <ExternalLink size={14} className="text-tertiary group-hover:text-primary transition-colors flex-shrink-0" />
          </a>
        )}

        {/* Sent banner */}
        {completed && (
          <div className="flex items-center gap-3 bg-brand-50 dark:bg-[#FF847C]/12 rounded-2xl p-4 border border-brand-200 dark:border-[#FF847C]/20">
            <CheckCircle2 size={20} className="text-brand-700 dark:text-[#FF847C] flex-shrink-0" />
            <p className="text-sm font-semibold text-brand-700 dark:text-[#FF847C]">Sent! This route is in your tick list 🎉</p>
          </div>
        )}

        {/* Spacer for bottom sheet */}
        <div className="h-2" />
      </div>
    </Modal>
  )
}
