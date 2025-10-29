'use client'

import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFilters } from '@/contexts/filter-context'

interface FilterOption {
  id: number
  name: string
}

export function Header() {
  const { startDate, endDate, storeId, channelId, setFilters } = useFilters()
  const [stores, setStores] = useState<FilterOption[]>([])
  const [channels, setChannels] = useState<FilterOption[]>([])

  useEffect(() => {
    fetch('/api/filters/stores')
      .then((res) => res.json())
      .then((data) => setStores(data.stores))

    fetch('/api/filters/channels')
      .then((res) => res.json())
      .then((data) => setChannels(data.channels))
  }, [])

  const handlePeriodChange = (value: string) => {
    const now = new Date()
    let startDate = ''
    let endDate = now.toISOString().split('T')[0]

    switch (value) {
      case 'today':
        startDate = endDate
        break
      case 'yesterday':
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        startDate = yesterday.toISOString().split('T')[0]
        endDate = startDate
        break
      case '7days':
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        startDate = sevenDaysAgo.toISOString().split('T')[0]
        break
      case '30days':
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        startDate = thirtyDaysAgo.toISOString().split('T')[0]
        break
      case '90days':
        const ninetyDaysAgo = new Date(now)
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
        startDate = ninetyDaysAgo.toISOString().split('T')[0]
        break
      case '6months':
        const sixMonthsAgo = new Date(now)
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        startDate = sixMonthsAgo.toISOString().split('T')[0]
        break
      default:
        startDate = '2025-05-01'
    }

    setFilters({ startDate, endDate })
  }

  const handleStoreChange = (value: string) => {
    setFilters({ storeId: value === 'all' ? undefined : value })
  }

  const handleChannelChange = (value: string) => {
    setFilters({ channelId: value === 'all' ? undefined : value })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros:</span>
        </div>

        <Select onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="yesterday">Ontem</SelectItem>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="90days">Últimos 90 dias</SelectItem>
            <SelectItem value="6months">Últimos 6 meses</SelectItem>
          </SelectContent>
        </Select>

        <Select value={storeId || 'all'} onValueChange={handleStoreChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas as lojas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as lojas</SelectItem>
            {stores &&
              stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select value={channelId || 'all'} onValueChange={handleChannelChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos os canais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os canais</SelectItem>
            {channels &&
              channels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id.toString()}>
                  {channel.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
