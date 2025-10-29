export interface OverviewData {
  totalSales: number
  completedSales: number
  cancelledSales: number
  totalRevenue: number
  totalDiscount: number
  totalDeliveryFee: number
  averageTicket: number
}

export interface ProductPerformance {
  productId: number
  productName: string
  categoryName: string
  totalQuantity: number
  totalRevenue: number
}

export interface StorePerformance {
  storeId: number
  storeName: string
  city: string | null
  state: string | null
  totalSales: number
  totalRevenue: number
  averageTicket: number
}

export interface ChannelPerformance {
  channelId: number
  channelName: string
  channelType: string
  totalSales: number
  totalRevenue: number
  totalDeliveryFee: number
  averageTicket: number
}

export interface TimeSeriesData {
  date: Date
  totalSales: number
  totalRevenue: number
  averageTicket: number
}

export interface Store {
  id: number
  name: string
  city: string | null
  state: string | null
}

export interface Channel {
  id: number
  name: string
  type: string
}

export interface FilterParams {
  startDate?: string
  endDate?: string
  storeId?: string
  channelId?: string
}

export interface HeatmapData {
  dayOfWeek: number
  hour: number
  totalSales: number
  totalRevenue: number
}
