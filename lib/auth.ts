import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

const adminUsername = process.env.ADMIN_GITHUB_USERNAME

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      return !!user.name
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.isAdmin = token.isAdmin ?? false
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.name === adminUsername
      }
      return token
    }
  },
}