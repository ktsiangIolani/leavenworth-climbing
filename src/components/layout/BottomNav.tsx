import { motion } from 'framer-motion'
import { Home, Calendar, Mountain } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import type { NavTab } from '../../types'

const TABS: Array<{ tab: NavTab; label: string; Icon: typeof Home }> = [
  { tab: 'home',     label: 'Home',     Icon: Home },
  { tab: 'routes',   label: 'Routes',   Icon: Mountain },
  { tab: 'schedule', label: 'Schedule', Icon: Calendar },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-xl"
      style={{ boxShadow: 'var(--shadow-nav)', borderTop: '1px solid var(--card-border)' }}
    >
      <div
        className="flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {TABS.map(({ tab, label, Icon }) => {
          const active = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className="group relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 cursor-pointer select-none"
            >
              {/* Active indicator pill */}
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute top-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-brand-600 dark:bg-[#FF847C]"
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                />
              )}

              <motion.div whileTap={{ scale: 0.84 }} className="flex flex-col items-center gap-1">
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active
                    ? 'text-brand-700 dark:text-[#FF847C]'
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors'}
                />
                <span
                  className={
                    active
                      ? 'text-[11px] font-semibold text-brand-700 dark:text-[#FF847C]'
                      : 'text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors'
                  }
                >
                  {label}
                </span>
              </motion.div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
