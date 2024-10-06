import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

const requiredEnvVars = [
  "GITHUB_ID",
  "GITHUB_SECRET",
  "NEXTAUTH_SECRET",
  "ADMIN_GITHUB_ID",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is not set`);
  }
});

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account?.provider === "github") {
        token.isAdmin =
          account.providerAccountId === process.env.ADMIN_GITHUB_ID;
        token.name = user.name || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.isAdmin = (token.isAdmin as boolean) ?? false;
        session.user.name = (token.name as string) ?? null;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
