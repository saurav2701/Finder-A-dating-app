import NextAuth from "next-auth";
import Github from "next-auth/providers/github"
import prisma from "./lib/prisma"
import bcrypt from 'bcrypt'
import Credentials from 'next-auth/providers/credentials' 
import { PrismaAdapter } from "@auth/prisma-adapter";


export const {auth, handlers, signIn, signOut} = NextAuth({ 
  adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
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
            authorize: async (credentials) => { 
              const email = credentials?.email as string | undefined 
              const password = credentials?.password as string | undefined 
              if (!email || !password) return null 

                const user = await prisma.user.findUnique({ where: { email } })
                if (!user || !user.passwordHash) return null
        
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
                  if (user){
                  token.id = user.id 
                  token.name = user.name
                }
                  return token
                },
                session({ session, token }) { 
                  if (session.user) {
                  session.user.id = token.id as string 
                  session.user.name = token.name as string 
                }
                  return session
                }
              }
    
    
})