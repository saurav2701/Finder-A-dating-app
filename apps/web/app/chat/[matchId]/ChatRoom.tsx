"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
};

export default function ChatRoom({
  matchId,
  currentUserId,
  otherName,
  initialMessages,
}: {
  matchId: string;
  currentUserId: string;
  otherName: string;
  initialMessages: Message[];
}) {
  const { socket, status } = useSocket();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!socket.current) return;
    const handler = (msg: Message) => {
      if (msg.senderId !== currentUserId) setMessages((prev) => [...prev, msg]);
    };
    socket.current.on("new_message", handler);
    return () => {
      socket.current?.off("new_message", handler);
    };
  }, [socket, currentUserId]);

  function sendMessage() {
    if (!input.trim() || !socket.current) return;
    socket.current.emit("send_message", { matchId, content: input });
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        content: input,
        senderId: currentUserId,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput("");
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>{otherName}</h2>
      <p>status: {status}</p>

      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            {m.senderId === currentUserId ? "me: " : "them: "}
            {m.content}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          name="chatInput"
          id="chatInput"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}
