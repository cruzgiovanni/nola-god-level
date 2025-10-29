import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  format?: 'currency' | 'number' | 'percentage'
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  format = 'number',
}: KPICardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(Number(val))
    }
    if (format === 'percentage') {
      return `${Number(val).toFixed(1)}%`
    }
    return new Intl.NumberFormat('pt-BR').format(Number(val))
  }

  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                'font-medium',
                isPositive && 'text-green-600',
                isNegative && 'text-red-600'
              )}
            >
              {isPositive && '+'}
              {change.toFixed(1)}%
            </span>{' '}
            vs período anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}
