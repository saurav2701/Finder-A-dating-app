import { prisma } from "@finder/db";
import bcrypt from "bcrypt";
import crypto from "crypto";

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: Request) {
  const { email, otp, password } = await req.json();
  if (!email || !otp || !password) {
    return Response.json({ message: "Missing fields" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findFirst({
    where: { identifier: email },
  });

  if (!record) {
    return Response.json({ message: "No code found — request a new one" }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token: record.token } });
    return Response.json({ message: "Code expired — request a new one" }, { status: 400 });
  }

  const hashedInput = hashOtp(otp);
  if (hashedInput !== record.token) {
    return Response.json({ message: "Invalid code" }, { status: 400 });
  }

  // Success — clean up the token, create the actual account
  await prisma.verificationToken.delete({ where: { token: record.token } });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, emailVerified: new Date() },
  });

  return Response.json({ message: "Account created", userId: user.id });
}