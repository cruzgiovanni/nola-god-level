'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HeatmapData } from '@/types/api'

interface SalesHeatmapProps {
  data: HeatmapData[]
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function SalesHeatmap({ data }: SalesHeatmapProps) {
  const maxSales = Math.max(...data.map((d) => d.totalSales), 1)

  const getDataPoint = (day: number, hour: number) => {
    return data.find((d) => d.dayOfWeek === day && d.hour === hour)
  }

  const getColor = (sales: number) => {
    const intensity = sales / maxSales
    if (intensity === 0) return 'bg-muted'
    if (intensity < 0.2) return 'bg-blue-200'
    if (intensity < 0.4) return 'bg-blue-300'
    if (intensity < 0.6) return 'bg-blue-400'
    if (intensity < 0.8) return 'bg-blue-500'
    return 'bg-blue-600'
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Vendas por Horário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-1">
            <div className="w-12" />
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex-1 text-center text-xs text-muted-foreground"
              >
                {hour % 3 === 0 ? `${hour}h` : ''}
              </div>
            ))}
          </div>

          {DAYS.map((day, dayIndex) => (
            <div key={day} className="flex gap-1 items-center">
              <div className="w-12 text-xs text-muted-foreground">{day}</div>
              {HOURS.map((hour) => {
                const dataPoint = getDataPoint(dayIndex, hour)
                const sales = dataPoint?.totalSales || 0

                return (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={`flex-1 aspect-square rounded-sm ${getColor(
                      sales
                    )} transition-colors hover:ring-2 hover:ring-primary cursor-pointer group relative`}
                    title={`${day} ${hour}h: ${sales} vendas`}
                  >
                    <div className="absolute hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg z-10 -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="font-semibold">
                        {day} {hour}:00
                      </div>
                      <div>{sales} vendas</div>
                      {dataPoint && (
                        <div>
                          R${' '}
                          {dataPoint.totalRevenue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4 mt-4 text-xs text-muted-foreground">
          <span>Menos vendas</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-sm bg-muted" />
            <div className="w-4 h-4 rounded-sm bg-blue-200" />
            <div className="w-4 h-4 rounded-sm bg-blue-300" />
            <div className="w-4 h-4 rounded-sm bg-blue-400" />
            <div className="w-4 h-4 rounded-sm bg-blue-500" />
            <div className="w-4 h-4 rounded-sm bg-blue-600" />
          </div>
          <span>Mais vendas</span>
        </div>
      </CardContent>
    </Card>
  )
}
