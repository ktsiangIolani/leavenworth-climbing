import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// zustand persist middleware serializes to localStorage under 'leavenworth-app-state'
import { NavTab } from '../types'

interface AppStore {
  // Navigation
  activeTab: NavTab
  setActiveTab: (tab: NavTab) => void

  // Dark mode
  darkMode: boolean
  toggleDarkMode: () => void

  // Completed schedule events
  completedEvents: string[]
  toggleEventComplete: (eventId: string) => void

  // Route toggles
  interestedRoutes: string[]
  completedRoutes: string[]
  toggleInterestedRoute: (routeId: string) => void
  toggleCompletedRoute: (routeId: string) => void

  // Refresh trigger
  scheduleRefreshCount: number
  triggerScheduleRefresh: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      darkMode: false,
      toggleDarkMode: () =>
        set(s => {
          const next = !s.darkMode
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: next }
        }),

      completedEvents: [],
      toggleEventComplete: (eventId) =>
        set(s => ({
          completedEvents: s.completedEvents.includes(eventId)
            ? s.completedEvents.filter(id => id !== eventId)
            : [...s.completedEvents, eventId],
        })),

      interestedRoutes: [],
      completedRoutes: [],
      toggleInterestedRoute: (routeId) =>
        set(s => ({
          interestedRoutes: s.interestedRoutes.includes(routeId)
            ? s.interestedRoutes.filter(id => id !== routeId)
            : [...s.interestedRoutes, routeId],
        })),
      toggleCompletedRoute: (routeId) =>
        set(s => ({
          completedRoutes: s.completedRoutes.includes(routeId)
            ? s.completedRoutes.filter(id => id !== routeId)
            : [...s.completedRoutes, routeId],
        })),

      scheduleRefreshCount: 0,
      triggerScheduleRefresh: () =>
        set(s => ({ scheduleRefreshCount: s.scheduleRefreshCount + 1 })),
    }),
    {
      name: 'leavenworth-app-state',
      partialize: (s) => ({
        darkMode: s.darkMode,
        completedEvents: s.completedEvents,
        interestedRoutes: s.interestedRoutes,
        completedRoutes: s.completedRoutes,
      }),
    }
  )
)
