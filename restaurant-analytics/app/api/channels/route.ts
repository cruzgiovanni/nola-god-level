import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const storeId = searchParams.get('storeId')

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

    const channelPerformance = await prisma.sale.groupBy({
      by: ['channelId'],
      where,
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
        deliveryFee: true,
      },
      _avg: {
        totalAmount: true,
      },
    })

    const channelIds = channelPerformance.map((c) => c.channelId)

    const channels = await prisma.channel.findMany({
      where: {
        id: {
          in: channelIds,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
      },
    })

    const channelsMap = new Map(channels.map((c) => [c.id, c]))

    const result = channelPerformance.map((c) => {
      const channel = channelsMap.get(c.channelId)
      return {
        channelId: c.channelId,
        channelName: channel?.name || 'Unknown',
        channelType: channel?.type || 'P',
        totalSales: c._count.id,
        totalRevenue: c._sum.totalAmount || 0,
        totalDeliveryFee: c._sum.deliveryFee || 0,
        averageTicket: c._avg.totalAmount || 0,
      }
    })

    result.sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channels data' },
      { status: 500 }
    )
  }
}
