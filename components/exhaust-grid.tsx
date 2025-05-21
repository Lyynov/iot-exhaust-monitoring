"use client"

import { useEffect, useState } from "react"
import { Grid } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import ExhaustCard from "./exhaust-card"
import { useWebSocket } from "@/hooks/use-websocket"

export type ExhaustUnit = {
  id: number
  name: string
  status: boolean
}

export default function ExhaustGrid() {
  const { lastMessage, sendMessage } = useWebSocket()
  const [exhausts, setExhausts] = useState<ExhaustUnit[]>([
    { id: 1, name: "Exhaust 1", status: false },
    { id: 2, name: "Exhaust 2", status: false },
    { id: 3, name: "Exhaust 3", status: false },
    { id: 4, name: "Exhaust 4", status: false },
  ])

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        if (data.exhausts) {
          setExhausts(data.exhausts)
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e)
      }
    }
  }, [lastMessage])

  const toggleExhaust = (id: number) => {
    const updatedExhausts = exhausts.map((exhaust) =>
      exhaust.id === id ? { ...exhaust, status: !exhaust.status } : exhaust,
    )

    setExhausts(updatedExhausts)

    // Send command to server
    sendMessage(
      JSON.stringify({
        command: "toggle_exhaust",
        exhaust_id: id,
        status: updatedExhausts.find((e) => e.id === id)?.status,
      }),
    )
  }

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Grid className="h-6 w-6 mr-2 text-green-600 dark:text-green-500" />
          <CardTitle>Exhaust Control</CardTitle>
        </div>
        <CardDescription>Monitor and control all exhaust units</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exhausts.map((exhaust) => (
            <ExhaustCard key={exhaust.id} exhaust={exhaust} onToggle={() => toggleExhaust(exhaust.id)} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
