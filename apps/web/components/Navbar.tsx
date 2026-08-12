"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const initial_letter = session?.user?.name?.[0] ?? "?";
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex justify-between">
        <div className="max-w-xl px-4 py-3 ">
          <Link href="/" className="text-red-400 font-bold text-xl">
            Finder ❤️
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex gap-2">
              <Link href={"/matches"}>
                <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 cursor-pointer active:scale-95 mr-2 ">
                  Your Matches
                </button>
              </Link>{" "}
              <Link href={"/profile"}>
                <button className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 active:scale-95">
                  {initial_letter}
                </button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </nav>
  );
}
