import { Suspense } from "react"
import DashboardHeader from "@/components/dashboard-header"
import TemperaturePanel from "@/components/temperature-panel"
import ExhaustGrid from "@/components/exhaust-grid"
import DashboardFooter from "@/components/dashboard-footer"
import TemperatureChart from "@/components/temperature-chart"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <Suspense fallback={<Skeleton className="h-[120px] w-full rounded-2xl" />}>
          <TemperaturePanel />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-2xl" />}>
          <ExhaustGrid />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-2xl" />}>
          <TemperatureChart />
        </Suspense>
      </main>
      <DashboardFooter />
    </div>
  )
}
