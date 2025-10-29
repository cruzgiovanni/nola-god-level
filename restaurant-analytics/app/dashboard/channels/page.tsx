'use client'

import { useEffect, useState } from 'react'
import { useFilters } from '@/contexts/filter-context'
import { getChannelsData } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils-data'
import { ChannelDistribution } from '@/components/channel-distribution'
import { Radio, TrendingUp, DollarSign, Percent } from 'lucide-react'
import type { ChannelPerformance } from '@/types/api'

export default function ChannelsPage() {
  const { startDate, endDate, storeId, channelId } = useFilters()
  const [channels, setChannels] = useState<ChannelPerformance[]>([])
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

        const data = await getChannelsData(filters)
        setChannels(data)
      } catch (error) {
        console.error('Error fetching channels data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, storeId, channelId])

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  const totalSales = channels.reduce(
    (sum, c) => sum + Number(c.totalSales || 0),
    0
  )
  const totalRevenue = channels.reduce(
    (sum, c) => sum + Number(c.totalRevenue || 0),
    0
  )
  const totalDeliveryFee = channels.reduce(
    (sum, c) => sum + Number(c.totalDeliveryFee || 0),
    0
  )
  const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Canais</h2>
        <p className="text-muted-foreground">
          Análise de performance por canal de venda
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Canais
            </CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Canais ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Todos os canais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgTicket)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Média geral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Entrega
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalDeliveryFee)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total cobrado</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChannelDistribution data={channels} />

        <Card>
          <CardHeader>
            <CardTitle>Ranking de Canais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels
                .sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue))
                .map((channel, index) => {
                  const percentage =
                    (Number(channel.totalRevenue) / totalRevenue) * 100
                  return (
                    <div key={channel.channelId}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{index + 1}.</span>
                          <div>
                            <div className="font-medium">
                              {channel.channelName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {channel.channelType}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(Number(channel.totalRevenue))}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Canal</th>
                  <th className="text-left p-3 font-medium">Tipo</th>
                  <th className="text-right p-3 font-medium">Vendas</th>
                  <th className="text-right p-3 font-medium">Receita</th>
                  <th className="text-right p-3 font-medium">Ticket Médio</th>
                  <th className="text-right p-3 font-medium">Taxa Entrega</th>
                  <th className="text-right p-3 font-medium">% do Total</th>
                </tr>
              </thead>
              <tbody>
                {channels
                  .sort(
                    (a, b) => Number(b.totalRevenue) - Number(a.totalRevenue)
                  )
                  .map((channel) => {
                    const percentage =
                      (Number(channel.totalRevenue) / totalRevenue) * 100
                    return (
                      <tr
                        key={channel.channelId}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-3 font-medium">
                          {channel.channelName}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {channel.channelType}
                        </td>
                        <td className="p-3 text-right">
                          {formatNumber(Number(channel.totalSales))}
                        </td>
                        <td className="p-3 text-right font-medium">
                          {formatCurrency(Number(channel.totalRevenue))}
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(Number(channel.averageTicket))}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          {formatCurrency(Number(channel.totalDeliveryFee))}
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-medium">
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
