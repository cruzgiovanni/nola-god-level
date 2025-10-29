import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const storeId = searchParams.get('storeId')
    const channelId = searchParams.get('channelId')
    const limit = parseInt(searchParams.get('limit') || '10')

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

    const sales = await prisma.sale.findMany({
      where,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        store: {
          select: {
            name: true,
          },
        },
        channel: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}
