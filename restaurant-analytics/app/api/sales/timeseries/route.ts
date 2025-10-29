import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const storeId = searchParams.get('storeId')
    const channelId = searchParams.get('channelId')
    const groupBy = searchParams.get('groupBy') || 'day'

    const where: any = {}

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    if (storeId) {
      where.storeId = parseInt(storeId)
    }

    if (channelId) {
      where.channelId = parseInt(channelId)
    }

    let dateFormat = 'DATE(created_at)'

    if (groupBy === 'hour') {
      dateFormat = "DATE_TRUNC('hour', created_at)"
    } else if (groupBy === 'week') {
      dateFormat = "DATE_TRUNC('week', created_at)"
    } else if (groupBy === 'month') {
      dateFormat = "DATE_TRUNC('month', created_at)"
    }

    const sales = await prisma.$queryRawUnsafe<
      Array<{
        date: Date
        total_sales: bigint
        total_revenue: number
        avg_ticket: number
      }>
    >(`
      SELECT 
        ${dateFormat} as date,
        COUNT(*)::bigint as total_sales,
        SUM(total_amount)::numeric as total_revenue,
        AVG(total_amount)::numeric as avg_ticket
      FROM sales
      WHERE 1=1
        ${
          startDate && endDate
            ? `AND created_at >= '${startDate}' AND created_at <= '${endDate}'`
            : ''
        }
        ${storeId ? `AND store_id = ${storeId}` : ''}
        ${channelId ? `AND channel_id = ${channelId}` : ''}
      GROUP BY date
      ORDER BY date ASC
    `)

    const result = sales.map((s) => ({
      date: s.date,
      totalSales: Number(s.total_sales),
      totalRevenue: Number(s.total_revenue),
      averageTicket: Number(s.avg_ticket),
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching time series:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time series data' },
      { status: 500 }
    )
  }
}
