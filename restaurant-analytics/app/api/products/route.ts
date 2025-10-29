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

    let whereClause = '1=1'
    const params: any[] = []

    if (startDate && endDate) {
      whereClause += ' AND s.created_at >= $1 AND s.created_at <= $2'
      params.push(new Date(startDate), new Date(endDate))
    }

    if (storeId) {
      whereClause += ` AND s.store_id = $${params.length + 1}`
      params.push(parseInt(storeId))
    }

    if (channelId) {
      whereClause += ` AND s.channel_id = $${params.length + 1}`
      params.push(parseInt(channelId))
    }

    const topProducts = await prisma.$queryRawUnsafe<
      Array<{
        product_id: number
        total_quantity: bigint
        total_revenue: number
      }>
    >(
      `
      SELECT 
        ps.product_id,
        SUM(ps.quantity)::bigint as total_quantity,
        SUM(ps.total_price)::numeric as total_revenue
      FROM product_sales ps
      JOIN sales s ON s.id = ps.sale_id
      WHERE ${whereClause}
      GROUP BY ps.product_id
      ORDER BY total_quantity DESC
      LIMIT $${params.length + 1}
    `,
      ...params,
      limit
    )

    const productIds = topProducts.map((p) => p.product_id)

    if (productIds.length === 0) {
      return NextResponse.json([])
    }

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
      const product = productsMap.get(p.product_id)
      return {
        productId: p.product_id,
        productName: product?.name || 'Unknown',
        categoryName: product?.category.name || 'Unknown',
        totalQuantity: Number(p.total_quantity),
        totalRevenue: Number(p.total_revenue),
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
