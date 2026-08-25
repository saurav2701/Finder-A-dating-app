import { NextAuthConfig } from "next-auth"
import Github from "next-auth/providers/github"
import Credentials from 'next-auth/providers/credentials' 



export default{ 
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
            authorize: async () => null
            })
            ],
            pages: { 
                signIn: "/login",
            },

}satisfies NextAuthConfig