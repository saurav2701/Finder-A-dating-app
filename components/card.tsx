"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Card() {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  if (!current) {
    return (
      <div className="flex h-[500px] w-[400px] items-center justify-center rounded-lg bg-black p-8">
        <p className="text-white">No more profile to show</p>
      </div>
    );
  }

  return (
    <div className="flex h-[500px] w-[400px] flex-col rounded-lg bg-black p-8">
      <h1 className="text-2xl text-white">{current.profile.name}</h1>
      <img
        src={current.profile.photos[0].url}
        alt="profile-photo"
        className="h-[300px] w-full rounded-lg object-cover mt-2"
      />

      <div className="mt-auto flex justify-end gap-4">
        <button className="cursor-pointer text-3xl transition hover:scale-110">
          ❤️
        </button>
        <button
          onClick={handleNext}
          className="cursor-pointer text-3xl text-white transition hover:scale-110"
        >
          Next
        </button>
      </div>
    </div>
  );
}
