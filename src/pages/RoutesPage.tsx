import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Search, Map, List, SlidersHorizontal } from 'lucide-react'
import { LEAVENWORTH_ROUTES, ROUTE_AREAS } from '../data/routes'
import { ClimbingRoute, ClimbingStyle } from '../types'
import { RouteCard } from '../components/routes/RouteCard'
import { RouteMap } from '../components/routes/RouteMap'
import { RouteDetailModal } from '../components/routes/RouteDetailModal'
import { gradeToNumber } from '../utils/helpers'
import { cn } from '../components/ui/cn'

type ViewMode = 'list' | 'map'
type SortKey = 'stars' | 'grade' | 'name'

const STYLE_FILTERS: ClimbingStyle[] = ['Sport', 'Trad', 'Boulder']

export function RoutesPage() {
  const [view, setView] = useState<ViewMode>('list')
  const [query, setQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<ClimbingStyle | 'all'>('all')
  const [selectedArea, setSelectedArea] = useState<string | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('stars')
  const [selectedRoute, setSelectedRoute] = useState<ClimbingRoute | null>(null)
  const [focusedRoute, setFocusedRoute] = useState<ClimbingRoute | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return LEAVENWORTH_ROUTES
      .filter(r => {
        const matchQuery = !query ||
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.area.toLowerCase().includes(query.toLowerCase()) ||
          r.grade.toLowerCase().includes(query.toLowerCase())
        const matchStyle = selectedStyle === 'all' || r.style === selectedStyle
        const matchArea = selectedArea === 'all' || r.area === selectedArea
        return matchQuery && matchStyle && matchArea
      })
      .sort((a, b) => {
        if (sortKey === 'stars') return b.stars - a.stars
        if (sortKey === 'grade') return gradeToNumber(a.grade) - gradeToNumber(b.grade)
        return a.name.localeCompare(b.name)
      })
  }, [query, selectedStyle, selectedArea, sortKey])

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 sticky top-0 z-30 bg-surface/90 backdrop-blur-xl border-b border-card px-4 pt-[max(env(safe-area-inset-top),12px)] pb-0"
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Mountain size={18} className="text-brand-700 dark:text-[#FF847C]" />
            <h1 className="text-lg font-black text-primary">Routes</h1>
            <span className="text-xs font-medium text-tertiary">
              {filtered.length}/{LEAVENWORTH_ROUTES.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setShowFilters(s => !s)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all cursor-pointer',
                showFilters
                  ? 'bg-brand-50 dark:bg-brand-subtle border-brand-border text-brand-700 dark:text-[#FF847C]'
                  : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
              )}
            >
              <SlidersHorizontal size={12} />
              Filter
            </motion.button>
            <div className="flex rounded-xl overflow-hidden border border-card bg-surface-secondary dark:bg-gray-800">
              {(['list', 'map'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'flex items-center justify-center h-9 w-10 transition-all cursor-pointer',
                    view === v
                      ? 'bg-brand-700 dark:bg-brand-600 text-white'
                      : 'text-secondary hover:text-primary'
                  )}
                >
                  {v === 'list' ? <List size={13} /> : <Map size={13} />}
                </button>
              ))}
            </div>
          </div>
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

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="pb-3 space-y-3">
                {/* Style filter */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary w-10 flex-shrink-0">Style</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['all', ...STYLE_FILTERS] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedStyle(s)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer',
                          selectedStyle === s
                            ? 'bg-brand-700 dark:bg-brand-600 text-white border-brand-700 dark:border-brand-600'
                            : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
                        )}
                      >
                        {s === 'all' ? 'All' : s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area filter */}
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary w-10 flex-shrink-0 pt-1">Area</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {(['all', ...ROUTE_AREAS] as const).map(a => (
                      <button
                        key={a}
                        onClick={() => setSelectedArea(a)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer',
                          selectedArea === a
                            ? 'bg-brand-700 dark:bg-brand-600 text-white border-brand-700 dark:border-brand-600'
                            : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
                        )}
                      >
                        {a === 'all' ? 'All' : a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-tertiary w-10 flex-shrink-0">Sort</span>
                  <div className="flex gap-1.5">
                    {([['stars', '★ Stars'], ['grade', 'Grade'], ['name', 'A–Z']] as const).map(([k, l]) => (
                      <button
                        key={k}
                        onClick={() => setSortKey(k)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-semibold border transition-all cursor-pointer',
                          sortKey === k
                            ? 'bg-brand-700 dark:bg-brand-600 text-white border-brand-700 dark:border-brand-600'
                            : 'bg-surface-secondary dark:bg-gray-800 border-card text-secondary hover:text-primary'
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Content */}
      <div className="flex-1">
        {view === 'map' ? (
          <div style={{ height: 'calc(100vh - 12rem)' }}>
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
                <p className="text-sm font-semibold text-secondary">No routes match your filters</p>
                <p className="text-xs text-tertiary mt-1">Try adjusting the style or area filter</p>
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
