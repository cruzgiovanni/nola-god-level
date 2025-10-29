'use client'

import { useEffect, useState } from 'react'
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { KPICard } from '@/components/kpi-card'
import { RevenueChart } from '@/components/revenue-chart'
import { TopProductsChart } from '@/components/top-products-chart'
import { ChannelDistribution } from '@/components/channel-distribution'
import {
  getOverviewData,
  getTimeSeriesData,
  getProductsData,
  getChannelsData,
} from '@/lib/api'
import { useFilters } from '@/contexts/filter-context'
import type {
  OverviewData,
  TimeSeriesData,
  ProductPerformance,
  ChannelPerformance,
} from '@/types/api'

export default function DashboardPage() {
  const { startDate, endDate, storeId, channelId } = useFilters()
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [productsData, setProductsData] = useState<ProductPerformance[]>([])
  const [channelsData, setChannelsData] = useState<ChannelPerformance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const filters = {
          startDate,
          endDate,
          storeId,
          channelId,
        }

        const [overview, timeSeries, products, channels] = await Promise.all([
          getOverviewData(filters),
          getTimeSeriesData({ ...filters, groupBy: 'day' }),
          getProductsData({ ...filters, limit: 10 }),
          getChannelsData(filters),
        ])

        setOverviewData(overview)
        setTimeSeriesData(timeSeries)
        setProductsData(products)
        setChannelsData(channels)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, storeId, channelId])

  if (loading || !overviewData) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Visão geral do desempenho dos restaurantes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Faturamento Total"
          value={overviewData.totalRevenue}
          icon={DollarSign}
          format="currency"
        />
        <KPICard
          title="Total de Vendas"
          value={overviewData.totalSales}
          icon={ShoppingCart}
          format="number"
        />
        <KPICard
          title="Ticket Médio"
          value={overviewData.averageTicket}
          icon={TrendingUp}
          format="currency"
        />
        <KPICard
          title="Vendas Completas"
          value={overviewData.completedSales}
          icon={Users}
          format="number"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <RevenueChart data={timeSeriesData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopProductsChart data={productsData} />
        <ChannelDistribution data={channelsData} />
      </div>
    </div>
  )
}
