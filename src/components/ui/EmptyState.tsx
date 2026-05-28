import type { ReactNode } from 'react'

export function EmptyState({
  icon, title, description, action,
}: {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="mb-5 text-gray-300 dark:text-gray-600">{icon}</div>
      <p className="text-base font-semibold text-primary">{title}</p>
      {description && (
        <p className="mt-1.5 text-sm text-secondary max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
