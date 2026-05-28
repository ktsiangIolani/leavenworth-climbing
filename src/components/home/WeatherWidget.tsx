import { Wind, Droplets, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useWeather } from '../../hooks/useWeather'
import { Skeleton } from '../ui/Skeleton'

export function WeatherWidget() {
  const { data, isLoading, isError, refetch } = useWeather()

  if (isLoading) {
    return (
      <div className="mx-5 mb-5 bg-card border border-card rounded-3xl p-5 shadow-token-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>
        <div className="flex gap-3 pt-2 border-t border-card">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-6 w-8 rounded-lg" />
              <Skeleton className="h-3 w-6" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="mx-5 mb-5 bg-card border border-card rounded-3xl p-5 shadow-token-card">
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary">Weather unavailable</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const today = data.days[0]
  const forecast = data.days.slice(1, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-5 mb-5 bg-card border border-card rounded-3xl overflow-hidden shadow-token-card"
    >
      {/* Today's headline */}
      <div className="flex items-center justify-between p-5 pb-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{today.maxTemp}°</span>
            <span className="text-xl text-secondary font-light">{today.minTemp}°</span>
          </div>
          <p className="text-sm font-medium text-secondary mt-1">{today.description}</p>
          <p className="text-xs text-tertiary mt-0.5">Leavenworth, WA</p>
        </div>
        <div className="text-right">
          <div className="text-4xl mb-2">{today.icon}</div>
          <div className="flex items-center gap-2.5 justify-end">
            <div className="flex items-center gap-1 text-xs text-secondary font-medium">
              <Wind size={12} className="text-tertiary" />
              {today.windspeed}mph
            </div>
            <div className="flex items-center gap-1 text-xs text-secondary font-medium">
              <Droplets size={12} className="text-[#99B898]" />
              {today.precipProbability}%
            </div>
          </div>
        </div>
      </div>

      {/* 5-day forecast strip */}
      <div className="flex border-t border-card px-2 py-3">
        {forecast.map((day, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-1 flex-col items-center gap-1.5 py-1"
          >
            <span className="text-xs font-semibold text-tertiary uppercase tracking-wide">
              {format(day.date, 'EEE')}
            </span>
            <span className="text-xl leading-none">{day.icon}</span>
            <span className="text-sm font-semibold text-primary">{day.maxTemp}°</span>
            {day.precipProbability > 20 && (
              <span className="text-[10px] font-medium text-[#99B898]">{day.precipProbability}%</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
