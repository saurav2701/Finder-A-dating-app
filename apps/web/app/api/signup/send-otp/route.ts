// app/api/signup/send-otp/route.ts
import { prisma } from "@finder/db";
import { redis } from "@/lib/redis";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) return Response.json({ message: "Email required" }, { status: 400 });

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return Response.json({ message: "Email already registered" }, { status: 409 });
  }

  // Rate limit: one OTP request per email per 60 seconds
  const rateLimitKey = `otp:cooldown:${email}`;
  const alreadySent = await redis.get(rateLimitKey);
  if (alreadySent) {
    return Response.json({ message: "Please wait before requesting another code" }, { status: 429 });
  }

  const otp = generateOtp();
  const hashedOtp = hashOtp(otp);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({
    data: { identifier: email, token: hashedOtp, expires: new Date(Date.now() + 5 * 60 * 1000) },
  });

  // Set the cooldown key with a 60-second auto-expiry — no cleanup needed
  await redis.set(rateLimitKey, "1", { ex: 60 });

  await resend.emails.send({
    from: "Finder <onboarding@yourdomain.com>",
    to: "delivered@resend.dev",
    subject: "Your verification code",
    html: `<p>Your Finder verification code is:</p><h2>${otp}</h2><p>This code expires in 5 minutes.</p>`,
  });

  return Response.json({ message: "OTP sent" });
}