// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CandidatModelPromise from "@/models/Candidats";

import { ICandidat } from "@/lib/types";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/components/register",
  },
  callbacks: {
    async signIn({ user }) {
      const CandidateModel = await CandidatModelPromise;

      const existing = await CandidateModel.findOne({ email: user.email });

      if (!existing) {
        const newCandidate: Partial<ICandidat> = {
          email: user.email || '',
          authProvider: 'google',
        };

        await CandidateModel.create(newCandidate);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
