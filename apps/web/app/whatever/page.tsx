// apps/web/app/(wherever)/SocketTest.tsx
"use client";
import { useSocket } from "@/hooks/useSocket";

export default function SocketTest() {
  const { status } = useSocket();
  return (
    <div style={{ padding: 8, fontSize: 12 }}>Socket status: {status}</div>
  );
}
