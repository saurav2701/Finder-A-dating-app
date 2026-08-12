"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Card() {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const res = await fetch("/api/showUsers");
        if (!res.ok) throw new Error("failed to load users");
        const data = await res.json();

        if (!cancelled) setUsers(data.users);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const current = users[index];

  useEffect(() => {
    if (!loading && !current) {
      setShowEmptyState(false);
      const timer = setTimeout(() => setShowEmptyState(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [current, loading]);

  const placeholder_text = current?.profile?.name?.[0] ?? "?";

  const handleSwipe = async (action: "LIKE" | "PASS") => {
    if (!current) return;

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: current.id, action }),
      });

      const data = await res.json();
      if (res.ok && data.match) {
        setMatchInfo({
          name: current.profile.name,
          photo: current.profile.photos?.[0]?.url,
        });
        return; // don't advance yet — wait for the modal to be dismissed
      }
    } catch (err) {
      console.log("Swipe failed", err);
    }

    setIndex((prev) => prev + 1);
  };

  function dismissMatch() {
    setMatchInfo(null);
    setIndex((prev) => prev + 1);
  }

  if (loading) return <Skeleton className="h-[500px] w-[400px] rounded-lg" />;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!current && !matchInfo) {
    if (!showEmptyState) {
      return <Skeleton className="h-[500px] w-[400px] rounded-lg" />;
    }
    return (
      <div className="flex h-[500px] w-[400px] items-center justify-center rounded-lg bg-black p-8">
        <p className="text-white">No more profile to show</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-[500px] w-[400px] flex-col rounded-lg bg-black p-8">
      {matchInfo && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/90 p-8 text-center">
          {matchInfo.photo && (
            <img
              src={matchInfo.photo}
              alt={matchInfo.name}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-pink-500"
            />
          )}
          <h2 className="text-2xl font-bold text-white">
            It's a match with {matchInfo.name}! 🎉
          </h2>
          <p className="text-sm text-gray-300">
            You can now message each other
          </p>
          <button
            onClick={dismissMatch}
            className="mt-2 cursor-pointer rounded-full bg-pink-600 px-6 py-2 text-white hover:bg-pink-700 active:scale-95 transition"
          >
            Keep swiping
          </button>
        </div>
      )}

      {current && (
        <>
          <img
            src={
              current.profile.photos[0]?.url ??
              `https://placehold.co/600x400?text=${placeholder_text}`
            }
            alt="profile-photo"
            className="h-[300px] w-full rounded-lg object-cover mt-2"
          />

          <h1 className="text-2xl mt-2 text-white">{current.profile.name}</h1>

          <div className="mt-auto flex justify-end gap-4">
            <button
              onClick={() => handleSwipe("PASS")}
              className="cursor-pointer text-3xl transition hover:scale-130"
            >
              <X color="#b58cba" strokeWidth={2.25} />
            </button>

            <button
              onClick={() => handleSwipe("LIKE")}
              className="cursor-pointer text-3xl transition hover:scale-130"
            >
              <Heart color="#b58cba" strokeWidth={2.25} />
            </button>

            <button className="cursor-pointer text-3xl text-white transition hover:scale-130">
              <ArrowRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
