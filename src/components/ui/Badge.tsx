import { cn } from './cn'
import type { ReactNode } from 'react'

type BadgeVariant = 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'gray' | 'orange'
type BadgeSize = 'sm' | 'md'

const VARIANTS: Record<BadgeVariant, string> = {
  green:  'bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-subtle dark:text-[#FF847C] dark:ring-[#FF847C]/20',
  blue:   'bg-[#FECEAB]/40 text-[#8B5E3C] ring-1 ring-[#FECEAB]/60 dark:bg-[#FECEAB]/12 dark:text-[#FECEAB] dark:ring-[#FECEAB]/25',
  amber:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-800/50',
  red:    'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-800/50',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:ring-purple-800/50',
  orange: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-800/50',
  gray:   'bg-[#F6EDE4] text-[#5E6E72] ring-1 ring-[#EDE0D6] dark:bg-[#354449]/50 dark:text-[#A4B8BC] dark:ring-[#354449]',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

export function Badge({ children, variant = 'gray', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1 text-sm',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
