import NextAuth from "next-auth";
import Github from "next-auth/providers/github"
import prisma from "./lib/prisma"
import bcrypt from 'bcrypt'
import Credentials from 'next-auth/providers/credentials'



export const {auth, handlers, signIn, signOut} = NextAuth({
    providers: [
        Github({
          clientId: process.env.AUTH_GITHUB_ID!,
          clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),
        Credentials({
            credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' }
            },
            authorize: async ({ email, password }) => {
                const user = await prisma.user.findUnique({ where: { email } })
                if (!user) return null
        
                const isMatch = await bcrypt.compare(password, user.passwordHash)
                if (!isMatch) return null
        
                return { id: user.id, email: user.email }
              }
            })
            ],
            pages: {
                signIn: '/login'
              },
              callbacks: {
                jwt({ token, user }) {
                  if (user) token.id = user.id
                  return token
                },
                session({ session, token }) {
                  session.user.id = token.id
                  return session
                }
              }
    
    
})