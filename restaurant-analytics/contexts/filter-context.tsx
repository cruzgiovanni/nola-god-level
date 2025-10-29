'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterContextType {
  startDate: string
  endDate: string
  storeId: string
  channelId: string
  setFilters: (filters: Partial<FilterState>) => void
  resetFilters: () => void
}

interface FilterState {
  startDate: string
  endDate: string
  storeId: string
  channelId: string
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const DEFAULT_FILTERS: FilterState = {
  startDate: '2025-05-01',
  endDate: '2025-10-31',
  storeId: '',
  channelId: '',
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFiltersState] = useState<FilterState>({
    startDate: searchParams.get('startDate') || DEFAULT_FILTERS.startDate,
    endDate: searchParams.get('endDate') || DEFAULT_FILTERS.endDate,
    storeId: searchParams.get('storeId') || DEFAULT_FILTERS.storeId,
    channelId: searchParams.get('channelId') || DEFAULT_FILTERS.channelId,
  })

  const setFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      const updatedFilters = { ...filters, ...newFilters }
      setFiltersState(updatedFilters)

      const params = new URLSearchParams()
      if (updatedFilters.startDate)
        params.set('startDate', updatedFilters.startDate)
      if (updatedFilters.endDate) params.set('endDate', updatedFilters.endDate)
      if (updatedFilters.storeId) params.set('storeId', updatedFilters.storeId)
      if (updatedFilters.channelId)
        params.set('channelId', updatedFilters.channelId)

      router.push(`?${params.toString()}`)
    },
    [filters, router]
  )

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS)
    router.push(window.location.pathname)
  }, [router])

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        setFilters,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
