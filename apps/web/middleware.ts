import NextAuth from "next-auth"
import { NextResponse } from "next/server" 
import authConfig from "./app/auth.config"

const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isProtectedRoute = ["/", "/matches", "/chat", "/profile"].some((path) =>
    path === "/" ? req.nextUrl.pathname === "/" : req.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }
})

export const config = {
  matcher: ["/", "/matches/:path*", "/chat/:path*", "/profile/:path*"],
}