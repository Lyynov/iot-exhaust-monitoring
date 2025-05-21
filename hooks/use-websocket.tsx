"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface UseWebSocketReturn {
  lastMessage: WebSocketEventMap["message"] | null
  sendMessage: (message: string) => void
  isConnected: boolean
}

// This is a mock implementation since we can't connect to real hardware
export function useWebSocket(): UseWebSocketReturn {
  const [lastMessage, setLastMessage] = useState<WebSocketEventMap["message"] | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const mockWsRef = useRef<any>(null)

  // Mock WebSocket implementation
  useEffect(() => {
    // Simulate connection delay
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true)

      // Send initial data
      const initialData = {
        temperature: 23.5,
        exhausts: [
          { id: 1, name: "Exhaust 1", status: false },
          { id: 2, name: "Exhaust 2", status: true },
          { id: 3, name: "Exhaust 3", status: false },
          { id: 4, name: "Exhaust 4", status: false },
        ],
      }

      const messageEvent = new MessageEvent("message", {
        data: JSON.stringify(initialData),
      })

      setLastMessage(messageEvent)

      // Set up interval to simulate data updates
      const dataInterval = setInterval(() => {
        // Random temperature fluctuation
        const temperature = 22 + Math.random() * 4

        // Occasionally change exhaust status randomly
        const exhausts = Array(4)
          .fill(0)
          .map((_, i) => ({
            id: i + 1,
            name: `Exhaust ${i + 1}`,
            status: Math.random() > 0.8 ? Math.random() > 0.5 : mockWsRef.current?.exhausts?.[i]?.status || false,
          }))

        const data = { temperature, exhausts }
        mockWsRef.current = data

        const messageEvent = new MessageEvent("message", {
          data: JSON.stringify(data),
        })

        setLastMessage(messageEvent)
      }, 5000)

      return () => {
        clearInterval(dataInterval)
        setIsConnected(false)
      }
    }, 1500)

    return () => {
      clearTimeout(connectionTimeout)
    }
  }, [])

  const sendMessage = useCallback(
    (message: string) => {
      if (!isConnected) return

      try {
        const command = JSON.parse(message)

        if (command.command === "toggle_exhaust") {
          // Update our mock state
          const { exhaust_id, status } = command

          if (mockWsRef.current && mockWsRef.current.exhausts) {
            const updatedExhausts = mockWsRef.current.exhausts.map((exhaust: any) =>
              exhaust.id === exhaust_id ? { ...exhaust, status } : exhaust,
            )

            mockWsRef.current = {
              ...mockWsRef.current,
              exhausts: updatedExhausts,
            }

            // Send back updated state
            setTimeout(() => {
              const messageEvent = new MessageEvent("message", {
                data: JSON.stringify(mockWsRef.current),
              })

              setLastMessage(messageEvent)
            }, 300)
          }
        }
      } catch (e) {
        console.error("Failed to parse command:", e)
      }
    },
    [isConnected],
  )

  return { lastMessage, sendMessage, isConnected }
}
