export function getDateRange(period: string): {
  startDate: string
  endDate: string
} {
  const now = new Date()
  const endDate = now.toISOString()
  let startDate: Date

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      break
    case 'yesterday':
      startDate = new Date(now.setDate(now.getDate() - 1))
      startDate.setHours(0, 0, 0, 0)
      break
    case '7days':
      startDate = new Date(now.setDate(now.getDate() - 7))
      break
    case '30days':
      startDate = new Date(now.setDate(now.getDate() - 30))
      break
    case '90days':
      startDate = new Date(now.setDate(now.getDate() - 90))
      break
    case '6months':
      startDate = new Date(now.setMonth(now.getMonth() - 6))
      break
    default:
      startDate = new Date(now.setDate(now.getDate() - 30))
  }

  return {
    startDate: startDate.toISOString(),
    endDate,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
