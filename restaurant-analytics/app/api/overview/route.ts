import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const storeId = searchParams.get('storeId')
    const channelId = searchParams.get('channelId')

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

    const [totalSales, salesData] = await Promise.all([
      prisma.sale.count({ where }),
      prisma.sale.aggregate({
        where,
        _sum: {
          totalAmount: true,
          totalDiscount: true,
          deliveryFee: true,
        },
        _avg: {
          totalAmount: true,
        },
      }),
    ])

    const completedSalesCount = await prisma.sale.count({
      where: {
        ...where,
        saleStatusDesc: 'COMPLETED',
      },
    })

    const cancelledSalesCount = await prisma.sale.count({
      where: {
        ...where,
        saleStatusDesc: 'CANCELLED',
      },
    })

    return NextResponse.json({
      totalSales,
      completedSales: completedSalesCount,
      cancelledSales: cancelledSalesCount,
      totalRevenue: salesData._sum.totalAmount || 0,
      totalDiscount: salesData._sum.totalDiscount || 0,
      totalDeliveryFee: salesData._sum.deliveryFee || 0,
      averageTicket: salesData._avg.totalAmount || 0,
    })
  } catch (error) {
    console.error('Error fetching overview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overview data' },
      { status: 500 }
    )
  }
}
