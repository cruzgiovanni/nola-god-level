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

export default async function DashboardPage() {
  const filters = {
    startDate: '2025-05-01',
    endDate: '2025-10-31',
  }

  const [overviewData, timeSeriesData, productsData, channelsData] =
    await Promise.all([
      getOverviewData(filters),
      getTimeSeriesData({ ...filters, groupBy: 'day' }),
      getProductsData({ ...filters, limit: 10 }),
      getChannelsData(filters),
    ])

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
