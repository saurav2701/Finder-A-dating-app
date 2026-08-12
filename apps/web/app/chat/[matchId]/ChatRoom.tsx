"use client";
import { useEffect, useRef, useState } from "react";
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
  const bottomRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const initial = otherName?.[0]?.toUpperCase() ?? "?";

  return (
    <main className="flex flex-col h-screen max-w-xl mx-auto bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">
          {initial}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 leading-tight">
            {otherName}
          </h2>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "connected" ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            {status === "connected" ? "Active now" : "Connecting..."}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            Say hi to {otherName} 👋
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] ${
                  isMe ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <span
                  className={`px-4 py-2 rounded-2xl text-sm break-words ${
                    isMe
                      ? "bg-red-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </span>
                <span className="text-[11px] text-gray-400 mt-1 px-1">
                  {formatTime(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white"
      >
        <input
          name="chatInput"
          id="chatInput"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M22 2 11 13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2 15 22 11 13 2 9 22 2Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
    </main>
  );
}
