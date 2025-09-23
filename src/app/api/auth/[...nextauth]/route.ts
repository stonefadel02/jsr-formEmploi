// import NextAuth, { NextAuthOptions, Session } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// import CandidatModelPromise from "@/models/Candidats";
// import EmployeurModelPromise from "@/models/Employer";

// import { MyUser } from "@/lib/types";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       userType?: string; // Add userType property
//     };
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID ?? "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/auth/redirect",
//   },
//   callbacks: {
//     async signIn({ user, profile, account }) {
//       const email = user.email ?? "";
//       const userType = account?.state === "employeur" ? "employeur" : "candidat";
      
//       if (userType === "employeur") {
//         const EmployerModel = await EmployeurModelPromise;

//         const existing = await EmployerModel.findOne({ email });

//         if (!existing) {
//           // Récupérer le nom de l'entreprise depuis Google (ici on prend user.name)
//           const companyName = user.name ?? profile?.name ?? "Entreprise inconnue";

//           await EmployerModel.create({
//             companyName,
//             email,
//             authProvider: "google",
//           });
//         }
//       } else {
//         const CandidatModel = await CandidatModelPromise;
//         const existing = await CandidatModel.findOne({ email });

//         if (!existing) {
//           await CandidatModel.create({
//             email,
//             authProvider: "google",
//           });
//         }
//       }
//       const typedUser = user as MyUser;
//       typedUser.userType = userType;
//       return true;
//     }
//     ,
//     async jwt({ token, user }) {
//       if (user) {
//         const typedUser = user as MyUser; // <-- cast pour accéder à userType
//         token.email = typedUser.email;
//         token.name = typedUser.name;
//         token.userType = typedUser.userType;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         session.user.email = token.email as string;
//         session.user.name = token.name as string;
//         session.user.userType = token.userType as string; // OK ici
//       }
//       return session;
//     },

//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import type { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Importez vos fonctions de connexion aux bases de données
import { connectCandidatsDb, connectEmployersDb } from "@/lib/mongodb"; // Assurez-vous que le chemin est correct

// Importez les définitions de vos modèles
// Nous allons les importer de manière asynchrone pour qu'ils soient chargés après la connexion à la DB.
// Cela nécessite une petite modification dans la façon dont vous exportez vos modèles.
// Voir la section "Mise à jour des Modèles Mongoose" ci-dessous.
import getCandidatModel from "@/models/Candidats";
import getEmployeurModel from "@/models/Employer";

// Étendre l'interface Session de NextAuth pour inclure userType
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Ajouté pour correspondre à l'ID de votre DB
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userType?: "candidat" | "employeur"; // Type strict pour userType
    };
  }
  // Étendre l'interface User de NextAuth pour le callback jwt/session
  interface User {
    id: string;
    userType?: "candidat" | "employeur";
  }
}

// Étendre l'interface JWT pour inclure userType
declare module "next-auth/jwt" {
  interface JWT {
    userType?: "candidat" | "employeur";
    id?: string; // Ajouté pour correspondre à l'ID de votre DB
  }
}

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
    // La page /auth/redirect est une bonne idée pour demander le rôle si nécessaire,
    // ou pour une redirection intelligente après la connexion Google.
    signIn: "/auth/redirect",
  },
  callbacks: {
    async signIn({ user, profile, account }) {
      // Assurez-vous que user.email existe avant de continuer
      if (!user.email) {
        throw new Error("Email is required for sign in.");
      }

      const email = user.email.toLowerCase(); // Convertir en minuscule pour uniformité
      let userType: "candidat" | "employeur";


      if (account?.state === "employeur") {
        userType = "employeur";
      } else {
        userType = "candidat"; // Par défaut, ou si `account?.state` n'est pas "employeur"
      }


      if (userType === "employeur") {
        const employersDb = await connectEmployersDb();
        const EmployerModel = getEmployeurModel(employersDb); // Obtenez le modèle pour cette connexion

        let existingEmployeur = await EmployerModel.findOne({ email });

        if (!existingEmployeur) {
          // Créer un nouvel employeur
          const companyName = user.name ?? profile?.name ?? "Entreprise inconnue";
          existingEmployeur = await EmployerModel.create({
            companyName,
            email,
            authProvider: "google",
            isEmailVerified: true, // L'email est vérifié par Google
            image: user.image, // Enregistre l'image de profil Google
          });
        } else {
            // Mettre à jour les infos si l'employeur existe
            if (existingEmployeur.authProvider === 'email' && !existingEmployeur.isEmailVerified) {
                existingEmployeur.isEmailVerified = true; // Si l'email était non vérifié et qu'il se connecte via Google
            }
            if (!existingEmployeur.image && user.image) {
                existingEmployeur.image = user.image;
            }
            await existingEmployeur.save();
        }

        // Ajoutez l'ID et le userType à l'objet user de NextAuth
        user.id = existingEmployeur._id.toString();
        (user as any).userType = "employeur"; // Cast temporaire pour ajouter la propriété
      } else { // userType === "candidat"
        const candidatsDb = await connectCandidatsDb();
        const CandidatModel = getCandidatModel(candidatsDb); // Obtenez le modèle pour cette connexion

        let existingCandidat = await CandidatModel.findOne({ email });

        if (!existingCandidat) {
          // Créer un nouveau candidat
          existingCandidat = await CandidatModel.create({
            email,
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            authProvider: "google",
            isEmailVerified: true, // L'email est vérifié par Google
            isActive: true, // Active directement le compte pour les Google Sign-In
            image: user.image, // Enregistre l'image de profil Google
          });
        } else {
            // Mettre à jour les infos si le candidat existe
            if (existingCandidat.authProvider === 'email' && !existingCandidat.isEmailVerified) {
                existingCandidat.isEmailVerified = true;
            }
            if (!existingCandidat.isActive) {
                existingCandidat.isActive = true;
            }
            if (!existingCandidat.image && user.image) {
                existingCandidat.image = user.image;
            }
            await existingCandidat.save();
        }

        // Ajoutez l'ID et le userType à l'objet user de NextAuth
        user.id = existingCandidat._id.toString();
        (user as any).userType = "candidat"; // Cast temporaire pour ajouter la propriété
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // user contient maintenant l'ID de votre DB et le userType grâce au signIn callback
        token.id = user.id;
        token.userType = (user as any).userType; // Récupérer le userType de l'objet user
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image; // Mettre à jour l'image si elle est passée
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.userType = token.userType as "candidat" | "employeur";
        session.user.image = token.picture as string; // Assurez-vous d'avoir l'image
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };