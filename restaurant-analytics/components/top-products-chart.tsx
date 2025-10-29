'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ProductPerformance } from '@/types/api'

interface TopProductsChartProps {
  data: ProductPerformance[]
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  const formattedData = data.slice(0, 10).map((item) => ({
    name:
      item.productName.length > 20
        ? item.productName.substring(0, 20) + '...'
        : item.productName,
    quantity: item.totalQuantity,
    revenue: Number(item.totalRevenue),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Produtos Mais Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" style={{ fontSize: '12px' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              style={{ fontSize: '11px' }}
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('pt-BR').format(value)
              }
            />
            <Bar
              dataKey="quantity"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
