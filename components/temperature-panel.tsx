"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWebSocket } from "@/hooks/use-websocket"

export default function TemperaturePanel() {
  const { lastMessage } = useWebSocket()
  const [temperature, setTemperature] = useState(22.5)

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        if (data.temperature) {
          setTemperature(data.temperature)
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e)
      }
    }
  }, [lastMessage])

  // Determine temperature status and styling
  const isHot = temperature > 30
  const isWarm = temperature > 25 && temperature <= 30

  const getTemperatureColor = () => {
    if (isHot) return "text-red-500"
    if (isWarm) return "text-orange-500"
    return "text-green-500"
  }

  const getBackgroundColor = () => {
    if (isHot) return "bg-red-50 dark:bg-red-950/30"
    if (isWarm) return "bg-orange-50 dark:bg-orange-950/30"
    return "bg-green-50 dark:bg-green-950/30"
  }

  return (
    <Card className={cn("shadow-lg rounded-2xl transition-colors duration-300", getBackgroundColor())}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Thermometer className={cn("h-10 w-10 mr-4", getTemperatureColor())} />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Current Temperature</h2>
              <p className="text-gray-500 dark:text-gray-400">Real-time sensor reading</p>
            </div>
          </div>

          <div className={cn("text-5xl font-bold", getTemperatureColor())}>{temperature.toFixed(1)}°C</div>
        </div>
      </CardContent>
    </Card>
  )
}
