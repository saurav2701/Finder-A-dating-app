import { auth } from "@/auth";
import Card from "@/components/card";
import Link from "next/link";
import { prisma } from "@finder/db";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400 text-xl">Please log in to continue</p>
        <Link href={"/login"}>
          <button className="ml-2.5 text-red-400 py-1 px-2 hover:text-pink-500 cursor-pointer font-bold">
            Login Now
          </button>
        </Link>
      </div>
    );
  }

  const profile_data = await prisma.profile.findUnique({
    where: { userId: session?.user?.id },
  });

  if (session && profile_data?.name && profile_data.birthdate)
    return (
      <div>
        <div className="mt-25 flex justify-center">
          <Card />
        </div>
      </div>
    );
  else if (session && !profile_data?.name && !profile_data?.birthdate)
    return (
      <div>
        Welcome, {session?.user?.name ?? session.user?.email} Please update your
        profile from profile section
        <Link href="/profile">
          <button className="text-lg font-bold bx-3 py-1 text-pink-300 cursor-pointer hover:text-pink-500 scale-y-110">
            Click here
          </button>
        </Link>
        <div className="mt-25 flex justify-center">
          <Card />
        </div>
      </div>
    );
  else
    return (
      <div>
        Please sign in to continue{" "}
        <Link href={"/login"}>
          <button className="px-2 py-2 bg-red-400 text-white rounded xl">
            Log in Now
          </button>
        </Link>
      </div>
    );
}
