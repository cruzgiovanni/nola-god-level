'use client'

import { useEffect, useState } from 'react'
import { useFilters } from '@/contexts/filter-context'
import { getProductsData } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils-data'
import { TopProductsChart } from '@/components/top-products-chart'
import { Package, TrendingUp, DollarSign } from 'lucide-react'
import type { ProductPerformance } from '@/types/api'

export default function ProductsPage() {
  const { startDate, endDate, storeId, channelId } = useFilters()
  const [products, setProducts] = useState<ProductPerformance[]>([])
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
          limit: 20,
        }

        const data = await getProductsData(filters)
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products data:', error)
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

  const topProducts = products.slice(0, 10)
  const totalQuantity = products.reduce((sum, p) => sum + p.totalQuantity, 0)
  const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0)
  const avgRevenuePerProduct =
    products.length > 0 ? totalRevenue / products.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
        <p className="text-muted-foreground">
          Análise de performance e vendas por produto
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Com vendas no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unidades Vendidas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalQuantity)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total de itens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Médio/Produto
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgRevenuePerProduct)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Receita média</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopProductsChart data={topProducts} />

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Produtos por Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {product.productName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.categoryName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-medium">
                      {formatCurrency(product.totalRevenue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(product.totalQuantity)} un.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">#</th>
                  <th className="text-left p-3 font-medium">Produto</th>
                  <th className="text-left p-3 font-medium">Categoria</th>
                  <th className="text-right p-3 font-medium">Quantidade</th>
                  <th className="text-right p-3 font-medium">Receita</th>
                  <th className="text-right p-3 font-medium">Ticket Médio</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.productId}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="p-3 text-muted-foreground">{index + 1}</td>
                    <td className="p-3 font-medium">{product.productName}</td>
                    <td className="p-3 text-muted-foreground">
                      {product.categoryName}
                    </td>
                    <td className="p-3 text-right">
                      {formatNumber(product.totalQuantity)}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {formatCurrency(product.totalRevenue)}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {formatCurrency(
                        product.totalRevenue / product.totalQuantity
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
