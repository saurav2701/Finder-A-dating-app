// apps/web/hooks/useSocket.ts
"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

export function useSocket() {
  const socketRef = useRef<Socket>()
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting")

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      withCredentials: true,
    })

    socketRef.current.on("connect", () => {
      console.log("✅ connected:", socketRef.current?.id)
      setStatus("connected")
    })

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ connect_error:", err.message)
      setStatus("error")
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  return { socket: socketRef, status }
}