import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }

    const storePerformance = await prisma.sale.groupBy({
      by: ['storeId'],
      where,
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
      },
      _avg: {
        totalAmount: true,
      },
    })

    const storeIds = storePerformance.map((s) => s.storeId)

    const stores = await prisma.store.findMany({
      where: {
        id: {
          in: storeIds,
        },
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
      },
    })

    const storesMap = new Map(stores.map((s) => [s.id, s]))

    const result = storePerformance.map((s) => {
      const store = storesMap.get(s.storeId)
      return {
        storeId: s.storeId,
        storeName: store?.name || 'Unknown',
        city: store?.city || null,
        state: store?.state || null,
        totalSales: s._count.id,
        totalRevenue: s._sum.totalAmount || 0,
        averageTicket: s._avg.totalAmount || 0,
      }
    })

    result.sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores data' },
      { status: 500 }
    )
  }
}
