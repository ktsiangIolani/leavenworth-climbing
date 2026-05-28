import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '../services/weatherService'

export function useWeather() {
  return useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    staleTime: 30 * 60 * 1000,   // 30 minutes
    gcTime: 60 * 60 * 1000,       // 1 hour
    retry: 1,
  })
}
