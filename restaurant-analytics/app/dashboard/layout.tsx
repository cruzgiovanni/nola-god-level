import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { FilterProvider } from '@/contexts/filter-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FilterProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </FilterProvider>
  )
}
