// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CandidatModelPromise from "@/models/Candidats";
import EmployeurModelPromise from "@/models/Employer";
import { MyUser } from "@/lib/types";

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
    signIn: "/auth/redirect",
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      const email = user.email ?? "";
      const userType = account?.state === "employeur" ? "employeur" : "candidat";

      if (userType === "employeur") {
        const EmployerModel = await EmployeurModelPromise;
        const existing = await EmployerModel.findOne({ email });
        if (!existing) {
          const companyName = user.name ?? profile?.name ?? "Entreprise inconnue";
          await EmployerModel.create({
            companyName,
            email,
            authProvider: "google",
          });
        }
      } else {
        const CandidatModel = await CandidatModelPromise;
        const existing = await CandidatModel.findOne({ email });
        if (!existing) {
          await CandidatModel.create({
            email,
            authProvider: "google",
          });
        }
      }

      const typedUser = user as MyUser;
      typedUser.userType = userType;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as MyUser;
        token.email = typedUser.email;
        token.name = typedUser.name;
        token.userType = typedUser.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.userType = token.userType as string;
      }
      return session;
    },
  },
};