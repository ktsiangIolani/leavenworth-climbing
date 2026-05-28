import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface font-sans antialiased">
      {/* Scroll container with safe-area bottom padding for nav */}
      <main className="min-h-screen" style={{ paddingBottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
