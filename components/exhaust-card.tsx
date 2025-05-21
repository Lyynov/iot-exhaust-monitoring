"use client"

import { Fan, Power } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import type { ExhaustUnit } from "./exhaust-grid"

interface ExhaustCardProps {
  exhaust: ExhaustUnit
  onToggle: () => void
}

export default function ExhaustCard({ exhaust, onToggle }: ExhaustCardProps) {
  return (
    <Card
      className={cn(
        "shadow-md rounded-2xl transition-all duration-300 border-2",
        exhaust.status
          ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950/30"
          : "border-gray-200 dark:border-gray-800",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Fan
              className={cn(
                "h-6 w-6 mr-2 transition-all",
                exhaust.status ? "text-green-600 dark:text-green-500 animate-spin" : "text-gray-400 dark:text-gray-600",
              )}
              style={{ animationDuration: "3s" }}
            />
            <h3 className="font-medium text-gray-900 dark:text-white">{exhaust.name}</h3>
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              exhaust.status
                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
            )}
          >
            {exhaust.status ? "ON" : "OFF"}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Power className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Control</span>
          </div>
          <Switch
            checked={exhaust.status}
            onCheckedChange={onToggle}
            className={exhaust.status ? "bg-green-600" : ""}
          />
        </div>
      </CardContent>
    </Card>
  )
}
