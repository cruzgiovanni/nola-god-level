import {
  OverviewData,
  TimeSeriesData,
  ProductPerformance,
  ChannelPerformance,
  StorePerformance,
  FilterParams,
} from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

function buildQueryString(params: FilterParams): string {
  const searchParams = new URLSearchParams()

  if (params.startDate) searchParams.append('startDate', params.startDate)
  if (params.endDate) searchParams.append('endDate', params.endDate)
  if (params.storeId) searchParams.append('storeId', params.storeId)
  if (params.channelId) searchParams.append('channelId', params.channelId)

  return searchParams.toString()
}

export async function getOverviewData(
  params: FilterParams = {}
): Promise<OverviewData> {
  const queryString = buildQueryString(params)
  const res = await fetch(`${API_BASE_URL}/api/overview?${queryString}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch overview data')
  return res.json()
}

export async function getTimeSeriesData(
  params: FilterParams & { groupBy?: string } = {}
): Promise<TimeSeriesData[]> {
  const { groupBy = 'day', ...filterParams } = params
  const queryString = buildQueryString(filterParams)
  const res = await fetch(
    `${API_BASE_URL}/api/sales/timeseries?${queryString}&groupBy=${groupBy}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch time series data')
  return res.json()
}

export async function getProductsData(
  params: FilterParams & { limit?: number } = {}
): Promise<ProductPerformance[]> {
  const { limit = 10, ...filterParams } = params
  const queryString = buildQueryString(filterParams)
  const res = await fetch(
    `${API_BASE_URL}/api/products?${queryString}&limit=${limit}`,
    {
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch products data')
  return res.json()
}

export async function getChannelsData(
  params: FilterParams = {}
): Promise<ChannelPerformance[]> {
  const queryString = buildQueryString(params)
  const res = await fetch(`${API_BASE_URL}/api/channels?${queryString}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch channels data')
  return res.json()
}

export async function getStoresData(
  params: FilterParams = {}
): Promise<StorePerformance[]> {
  const queryString = buildQueryString(params)
  const res = await fetch(`${API_BASE_URL}/api/stores?${queryString}`, {
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch stores data')
  return res.json()
}
