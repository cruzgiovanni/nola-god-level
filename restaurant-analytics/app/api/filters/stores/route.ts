import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}
