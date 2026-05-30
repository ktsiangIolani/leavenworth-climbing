import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mountain, Search, Map, List } from 'lucide-react'
import { LEAVENWORTH_ROUTES } from '../data/routes'
import { ClimbingRoute } from '../types'
import { useAppStore } from '../store/appStore'
import { RouteCard } from '../components/routes/RouteCard'
import { RouteMap } from '../components/routes/RouteMap'
import { RouteDetailModal } from '../components/routes/RouteDetailModal'
import { cn } from '../components/ui/cn'

type ViewMode = 'list' | 'map'

export function RoutesPage() {
  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<ClimbingRoute | null>(null)
  const [focusedRoute, setFocusedRoute] = useState<ClimbingRoute | null>(null)

  const { pendingMapRouteId, setPendingMapRoute } = useAppStore()
  useEffect(() => {
    if (!pendingMapRouteId) return
    const route = LEAVENWORTH_ROUTES.find(r => r.id === pendingMapRouteId)
    if (route) { setView('map'); setFocusedRoute(route) }
    setPendingMapRoute(null)
  }, [pendingMapRouteId, setPendingMapRoute])

  const filtered = useMemo(() => {
    if (!query) return LEAVENWORTH_ROUTES
    const q = query.toLowerCase()
    return LEAVENWORTH_ROUTES.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.grade.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-shrink-0 sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-card px-4 pt-[max(env(safe-area-inset-top),12px)] pb-3"
      >
        {/* Title row */}
        <div className="flex items-center gap-2 mb-3">
          <Mountain size={18} className="text-brand-700 dark:text-[#FF847C]" />
          <h1 className="text-lg font-black text-primary">Routes</h1>
          <span className="text-xs font-medium text-tertiary">
            {filtered.length}/{LEAVENWORTH_ROUTES.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search routes, areas, grades…"
            className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm text-primary bg-surface-secondary dark:bg-gray-800 border border-card outline-none placeholder-tertiary focus:border-brand-300 dark:focus:border-brand-800 transition-colors"
          />
        </div>

        {/* List / Map toggle */}
        <div className="flex rounded-2xl overflow-hidden border border-card bg-surface-secondary dark:bg-gray-800 p-1 gap-1">
          {(['list', 'map'] as ViewMode[]).map(v => (
            <motion.button
              key={v}
              whileTap={{ scale: 0.96 }}
              onClick={() => setView(v)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all cursor-pointer',
                view === v
                  ? 'bg-brand-700 dark:bg-brand-600 text-white shadow-sm'
                  : 'text-secondary hover:text-primary'
              )}
            >
              {v === 'list' ? <List size={15} /> : <Map size={15} />}
              {v === 'list' ? 'List' : 'Map'}
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1">
        {view === 'map' ? (
          <div style={{ height: 'calc(100vh - 16rem)' }}>
            <RouteMap routes={filtered} onRouteClick={setSelectedRoute} focusRoute={focusedRoute} />
          </div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pt-3 pb-4"
          >
            {filtered.length === 0 ? (
              <div className="col-span-2 py-16 text-center">
                <Mountain size={36} className="text-tertiary mx-auto mb-3" />
                <p className="text-sm font-semibold text-secondary">No routes found</p>
                <p className="text-xs text-tertiary mt-1">Try a different search term</p>
              </div>
            ) : (
              filtered.map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                >
                  <RouteCard
                    route={route}
                    onClick={() => setSelectedRoute(route)}
                    onMapOpen={r => { setFocusedRoute(r); setView('map') }}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      <RouteDetailModal route={selectedRoute} onClose={() => setSelectedRoute(null)} />
    </div>
  )
}
