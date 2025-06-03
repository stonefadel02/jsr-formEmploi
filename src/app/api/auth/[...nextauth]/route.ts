///home/devgbss/IPCM/jsr-formEmploi/src/app/api/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongo";
import { connectCandidatsDb } from '@/lib/mongodb';
import Candidate from "@/models/Candidate";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // tu peux aussi utiliser "database" si tu préfères stocker les sessions dans Mongo
  },
  pages: {
    signIn: "/components/register", // optionnel : ta propre page de login
  },
  callbacks: {
    async signIn({ user }) {
      await connectCandidatsDb();
      const existing = await Candidate.findOne({ email: user.email });

      if (!existing) {
        await Candidate.create({
          email: user.email,
          authProvider: 'google',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
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
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },


};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Requis avec app router (si tu utilises `/app` au lieu de `/pages`)
