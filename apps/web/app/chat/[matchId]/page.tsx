import { auth } from "@/auth";
import { prisma } from "@finder/db";
import ChatRoom from "./ChatRoom";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const session = await auth();
  if (!session?.user?.id) return <div>Please log in</div>;

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    },
  });

  if (!match) return <div>Match not found</div>;

  const messages = await prisma.message.findMany({
    where: { matchId: match.id },
    orderBy: { createdAt: "asc" },
  });

  const other = match.userAId === session.user.id ? match.userB : match.userA;

  return (
    <ChatRoom
      matchId={match.id}
      currentUserId={session.user.id}
      otherName={other.profile?.name || other.name || "Match"}
      initialMessages={messages}
    />
  );
}
