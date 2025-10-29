'use client'

import { useEffect, useState } from 'react'
import { useFilters } from '@/contexts/filter-context'
import { getSalesData } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils-data'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Sale {
  id: number
  createdAt: string
  totalAmount: number
  saleStatusDesc: string
  store: { name: string }
  channel: { name: string }
  deliveryFee: number
  totalDiscount: number
}

export default function SalesPage() {
  const { startDate, endDate, storeId, channelId } = useFilters()
  const [sales, setSales] = useState<Sale[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  })
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
          page: pagination.page,
          limit: 50,
        }

        const data = await getSalesData(filters)
        setSales(data.sales)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching sales data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, storeId, channelId, pagination.page])

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Vendas</h2>
        <p className="text-muted-foreground">
          Histórico detalhado de todas as vendas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {pagination.total.toLocaleString('pt-BR')} vendas encontradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Data/Hora</th>
                  <th className="text-left p-3 font-medium">Loja</th>
                  <th className="text-left p-3 font-medium">Canal</th>
                  <th className="text-right p-3 font-medium">Valor</th>
                  <th className="text-right p-3 font-medium">Desconto</th>
                  <th className="text-right p-3 font-medium">Taxa Entrega</th>
                  <th className="text-center p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      {formatDate(new Date(sale.createdAt))}
                    </td>
                    <td className="p-3">{sale.store.name}</td>
                    <td className="p-3">{sale.channel.name}</td>
                    <td className="p-3 text-right font-medium">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="p-3 text-right text-red-600">
                      {sale.totalDiscount > 0
                        ? `-${formatCurrency(sale.totalDiscount)}`
                        : '-'}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {sale.deliveryFee > 0
                        ? formatCurrency(sale.deliveryFee)
                        : '-'}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          sale.saleStatusDesc === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sale.saleStatusDesc === 'Completed'
                          ? 'Completa'
                          : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages} (
              {pagination.total.toLocaleString('pt-BR')} registros)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
