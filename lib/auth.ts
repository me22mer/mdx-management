import { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"

const adminUsername = process.env.ADMIN_GITHUB_USERNAME

// Extend the built-in types
interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAdmin: boolean;
  }
}

interface ExtendedJWT extends JWT {
  isAdmin?: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: User }) {
      return !!user.name // Allow sign-in only if user has a name
    },
    async session({ session, token }: { session: Session; token: ExtendedJWT }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? '',
          isAdmin: token.isAdmin ?? false,
        },
      } as ExtendedSession;
    },
    async jwt({ token, user }: { token: JWT; user: User | undefined }): Promise<ExtendedJWT> {
      if (user) {
        token.isAdmin = user.name === adminUsername;
      }
      return token as ExtendedJWT;
    }
  },
}