import { auth } from "@/auth";
import { prisma } from "@finder/db";
import Link from "next/link";

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Please log in</div>;

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
    <div style={{ padding: 24 }}>
      <h1>Your matches</h1>
      {matches.length === 0 && <p>No matches yet.</p>}
      <ul>
        {matches.map((match) => {
          const other =
            match.userAId === session.user.id ? match.userB : match.userA;
          return (
            <li key={match.id}>
              <Link href={`/chat/${match.id}`}>
                {other.profile?.name || other.name || other.email}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
