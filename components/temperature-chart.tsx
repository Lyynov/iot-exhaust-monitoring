"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { useWebSocket } from "@/hooks/use-websocket"

type TemperatureReading = {
  time: string
  value: number
}

export default function TemperatureChart() {
  const { lastMessage } = useWebSocket()
  const [data, setData] = useState<TemperatureReading[]>([])

  useEffect(() => {
    // Initialize with some sample data
    const initialData: TemperatureReading[] = []
    const now = new Date()

    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000)
      initialData.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: 22 + Math.random() * 3,
      })
    }

    setData(initialData)
  }, [])

  useEffect(() => {
    if (lastMessage) {
      try {
        const parsedData = JSON.parse(lastMessage.data)
        if (parsedData.temperature) {
          const now = new Date()
          const newReading = {
            time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            value: parsedData.temperature,
          }

          setData((prevData) => {
            const newData = [...prevData, newReading]
            // Keep only the last 30 readings
            if (newData.length > 30) {
              return newData.slice(newData.length - 30)
            }
            return newData
          })
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e)
      }
    }
  }, [lastMessage])

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-green-600 dark:text-green-500" />
          <CardTitle>Temperature Trend</CardTitle>
        </div>
        <CardDescription>Last 30 minutes of temperature readings</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fill: "#6b7280" }} tickLine={{ stroke: "#6b7280" }} />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickLine={{ stroke: "#6b7280" }}
                domain={["dataMin - 1", "dataMax + 1"]}
                label={{ value: "°C", angle: -90, position: "insideLeft", fill: "#6b7280" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value.toFixed(1)}°C`, "Temperature"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10b981", stroke: "#10b981" }}
                activeDot={{ r: 5, fill: "#10b981", stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
