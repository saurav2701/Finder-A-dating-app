"use client";

import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
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
              <button
                onClick={() => logout()}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 cursor-pointer active:scale-95 mr-2 text-sm"
              >
                Logout
              </button>
              <Link href={"/profile"}>
                <button className="bg-red-500 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-red-600 mr-2 active:scale-95 text-sm">
                  profile
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
