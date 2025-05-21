"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

export default function DashboardFooter() {
  const { isConnected } = useWebSocket()
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="border-t border-green-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-3">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center mb-2 sm:mb-0">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 mr-2 text-green-500" />
              <span>Connected to IoT system</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 mr-2 text-red-500" />
              <span>Disconnected - Trying to reconnect...</span>
            </>
          )}
        </div>
        <div>Last updated: {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>
    </footer>
  )
}
