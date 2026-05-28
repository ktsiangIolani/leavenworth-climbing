// Lightweight className merger (no clsx/tailwind-merge needed for this scope)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
