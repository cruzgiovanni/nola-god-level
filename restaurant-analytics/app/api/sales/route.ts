import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate') || '2025-05-01'
    const endDate = searchParams.get('endDate') || '2025-10-31'
    const storeId = searchParams.get('storeId')
    const channelId = searchParams.get('channelId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

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

    const countQuery = `
      SELECT COUNT(*) as total
      FROM sales s
      ${whereClause}
    `

    const salesQuery = `
      SELECT 
        s.id,
        s.created_at,
        s.total_amount,
        s.sale_status_desc,
        s.delivery_fee,
        s.total_discount,
        st.name as store_name,
        ch.name as channel_name
      FROM sales s
      JOIN stores st ON st.id = s.store_id
      JOIN channels ch ON ch.id = s.channel_id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    params.push(limit)
    params.push(skip)

    const [countResult, salesResult] = await Promise.all([
      prisma.$queryRawUnsafe<[{ total: bigint }]>(
        countQuery,
        ...params.slice(0, paramIndex - 1)
      ),
      prisma.$queryRawUnsafe<
        Array<{
          id: number
          created_at: Date
          total_amount: number
          sale_status_desc: string
          delivery_fee: number
          total_discount: number
          store_name: string
          channel_name: string
        }>
      >(salesQuery, ...params),
    ])

    const total = Number(countResult[0].total)
    const sales = salesResult.map((sale) => ({
      id: sale.id,
      createdAt: sale.created_at,
      totalAmount: Number(sale.total_amount),
      saleStatusDesc: sale.sale_status_desc,
      deliveryFee: Number(sale.delivery_fee),
      totalDiscount: Number(sale.total_discount),
      store: { name: sale.store_name },
      channel: { name: sale.channel_name },
    }))

    return NextResponse.json({
      sales,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching sales:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}
