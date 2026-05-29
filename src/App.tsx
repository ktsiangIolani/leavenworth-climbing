import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAppStore } from './store/appStore'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { SchedulePage } from './pages/SchedulePage'
import { RoutesPage } from './pages/RoutesPage'
import { NavTab } from './types'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
})

const PAGE_MAP: Record<NavTab, JSX.Element> = {
  home:     <HomePage />,
  schedule: <SchedulePage />,
  routes:   <RoutesPage />,
}

function AppContent() {
  const { activeTab, darkMode } = useAppStore()

  // Apply dark mode class on mount and whenever it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {PAGE_MAP[activeTab]}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
