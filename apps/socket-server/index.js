import { prisma } from "@finder/db"
import { Server } from "socket.io"
import { createServer } from "http"
import { getToken } from "next-auth/jwt"

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: { origin: process.env.APP_URL, credentials: true }
})

io.use(async (socket, next) => {
  const cookie = socket.handshake.headers.cookie
  const token = await getToken({
    req: { headers: { cookie } },
    secret: process.env.AUTH_SECRET,
  })
  if (!token?.id) return next(new Error("Unauthorized"))
  socket.data.userId = token.id
  next()
})

io.on("connection", (socket) => {
  console.log("connected:", socket.data.userId)
  socket.join(socket.data.userId)

  socket.on("send_message", async ({ matchId, content }) => {
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        isActive: true,
        OR: [{ userAId: socket.data.userId }, { userBId: socket.data.userId }],
      },
    })
    if (!match) return socket.emit("error", "Not authorized for this match")

    const message = await prisma.message.create({
      data: { matchId, senderId: socket.data.userId, content, status: "SENT" },
    })

    const recipientId = match.userAId === socket.data.userId ? match.userBId : match.userAId
    io.to(recipientId).emit("new_message", message)
    io.to(socket.data.userId).emit("new_message", message)
  })

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.data.userId)
  })
})

httpServer.listen(process.env.PORT || 4000, () => {
  console.log(`socket server running on port ${process.env.PORT || 4000}`)
})