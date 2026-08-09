"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, act } from "react";
import { Heart } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { X } from "lucide-react";

export default function Card() {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
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

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  const current = users[index];
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
        setMatchInfo(current.profile.name);
      }
    } catch (err) {
      console.log("Swipe failed", err);
    } finally {
      setIndex((prev) => prev + 1);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!current) {
    return (
      <div className="flex h-[500px] w-[400px] items-center justify-center rounded-lg bg-black p-8">
        <p className="text-white">No more profile to show</p>
      </div>
    );
  }

  return (
    <div className="flex h-[500px] w-[400px] flex-col rounded-lg bg-black p-8">
      {matchInfo && (
        <div className="mb-2 rounded-md bg-pink-600 p-2 text-center text-white">
          Its a match with {matchInfo} 🎉
        </div>
      )}
      <img
        src={
          current.profile.photos[0]?.url ??
          `https://placehold.co/600x400?text=${placeholder_text}`
        }
        alt="profile-photo"
        className="h-[300px] w-full rounded-lg object-cover mt-2"
      />

      <h1 className="text-2xl mt-2 text-white">{current.profile.name}</h1>

      {/* HIII */}

      <div className="mt-auto flex justify-end gap-4">
        <button
          onClick={() => handleSwipe("PASS")}
          className="cursor-pointer text-3xl transition hover:scale-130"
        >
          <X color="#b58cba" strokeWidth={2.25} />
        </button>

        <button
          onClick={() => {
            handleSwipe("LIKE");
          }}
          className="cursor-pointer text-3xl transition hover:scale-130"
        >
          <Heart color="#b58cba" strokeWidth={2.25} />
        </button>

        <button className="cursor-pointer text-3xl text-white transition hover:scale-130">
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}
