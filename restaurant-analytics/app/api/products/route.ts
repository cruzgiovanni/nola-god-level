import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const storeId = searchParams.get('storeId')
    const channelId = searchParams.get('channelId')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}

    if (startDate && endDate) {
      where.sale = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }
    }

    if (storeId) {
      where.sale = {
        ...where.sale,
        storeId: parseInt(storeId),
      }
    }

    if (channelId) {
      where.sale = {
        ...where.sale,
        channelId: parseInt(channelId),
      }
    }

    const topProducts = await prisma.productSale.groupBy({
      by: ['productId'],
      where,
      _sum: {
        quantity: true,
        totalPrice: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    })

    const productIds = topProducts.map((p) => p.productId)

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    })

    const productsMap = new Map(products.map((p) => [p.id, p]))

    const result = topProducts.map((p) => {
      const product = productsMap.get(p.productId)
      return {
        productId: p.productId,
        productName: product?.name || 'Unknown',
        categoryName: product?.category.name || 'Unknown',
        totalQuantity: p._sum.quantity || 0,
        totalRevenue: p._sum.totalPrice || 0,
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products data' },
      { status: 500 }
    )
  }
}
