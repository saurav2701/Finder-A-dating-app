import { auth } from "@/auth";
import { prisma } from "@finder/db";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user?.id)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-gray-400 text-sm">You need to be logged in</p>
        <Link href="/login">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm hover:bg-pink-600 active:scale-95 transition">
            Log in now
          </button>
        </Link>
      </div>
    );

  const matches = await prisma.match.findMany({
    where: {
      isActive: true,
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    },
    orderBy: { matchedAt: "desc" },
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Your matches
        {matches.length > 0 && (
          <span className="text-pink-400"> ({matches.length})</span>
        )}
      </h1>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 gap-2">
          <span className="text-4xl">💔</span>
          <p className="text-gray-400 text-sm">
            No matches yet — keep swiping!
          </p>
        </div>
      ) : (
        <div className="flex flex-col mt-6 gap-1">
          {matches.map((match) => {
            const other =
              match.userAId === session.user.id ? match.userB : match.userA;
            const photo = other.profile?.photos?.[0]?.url;
            const name = other.profile?.name || "Someone";

            return (
              <Link
                key={match.id}
                href={`/chat/${match.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pink-50 active:scale-[0.99] transition group"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={photo} alt={name} />
                  <AvatarFallback className="bg-pink-100 text-pink-500 font-semibold">
                    {name[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-pink-500 transition truncate">
                    {name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Matched{" "}
                    {new Date(match.matchedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-300 group-hover:text-pink-400 transition"
                >
                  <path
                    d="m9 18 6-6-6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
