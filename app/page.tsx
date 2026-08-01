import { auth } from "@/auth";
import Card from "@/components/card";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (session)
    return (
      <div>
        Welcome, {session?.user?.name ?? session.user?.email}
        <div className="mt-25 flex justify-center">
          <Card />{" "}
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
