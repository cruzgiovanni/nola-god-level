import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate') || '2025-05-01'
    const endDate = searchParams.get('endDate') || '2025-10-31'
    const storeId = searchParams.get('storeId')
    const channelId = searchParams.get('channelId')

    console.log('Heatmap request:', { startDate, endDate, storeId, channelId })

    const whereConditions: string[] = []
    const params: (string | number)[] = []

    params.push(`${startDate} 00:00:00`)
    params.push(`${endDate} 23:59:59`)
    whereConditions.push(`s.created_at >= $1::timestamp`)
    whereConditions.push(`s.created_at <= $2::timestamp`)

    let paramIndex = 3

    if (storeId) {
      whereConditions.push(`s.store_id = $${paramIndex}::integer`)
      params.push(parseInt(storeId))
      paramIndex++
    }

    if (channelId) {
      whereConditions.push(`s.channel_id = $${paramIndex}::integer`)
      params.push(parseInt(channelId))
      paramIndex++
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`

    const query = `
      SELECT 
        EXTRACT(DOW FROM s.created_at)::integer as day_of_week,
        EXTRACT(HOUR FROM s.created_at)::integer as hour,
        COUNT(*)::integer as total_sales,
        COALESCE(SUM(s.total_amount), 0)::numeric as total_revenue
      FROM sales s
      ${whereClause}
      GROUP BY day_of_week, hour
      ORDER BY day_of_week, hour
    `

    console.log('Query:', query)
    console.log('Params:', params)

    const result = await prisma.$queryRawUnsafe<
      Array<{
        day_of_week: number
        hour: number
        total_sales: number
        total_revenue: number
      }>
    >(query, ...params)

    const heatmapData = result.map(
      (row: {
        day_of_week: number
        hour: number
        total_sales: number
        total_revenue: number
      }) => ({
        dayOfWeek: row.day_of_week,
        hour: row.hour,
        totalSales: row.total_sales,
        totalRevenue: Number(row.total_revenue),
      })
    )

    return NextResponse.json({ data: heatmapData })
  } catch (error) {
    console.error('Error fetching heatmap data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    )
  }
}
