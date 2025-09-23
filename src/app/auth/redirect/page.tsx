// "use client";

// export const dynamic = "force-dynamic";

// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import { signIn } from "next-auth/react";

// export default function RedirectPage() {
//   return (
//     <Suspense fallback={<p>Chargement de la redirection...</p>}>
//       <RedirectContent />
//     </Suspense>
//   );
// }

// function RedirectContent() {
//   const searchParams = useSearchParams();
//   const userType = searchParams.get("userType");

//   if (userType) {
//     signIn("google", {
//       callbackUrl: `/${userType}/dashboard`, // Redirection après login
//       state: userType,
//     }).then(() => {
//       localStorage.setItem("userType", userType); // Sauvegarde après succès
//     }).catch((error) => {
//       console.error("Erreur lors de la connexion :", error);
//     });
//   }

//   return <p>Redirection vers Google...</p>;
// }

// src/app/auth/redirect/page.tsx
"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PulseLoader } from 'react-spinners'; // Exemple de loader, vous pouvez utiliser le vôtre

export default function AuthRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error'); // Pour capturer les erreurs de NextAuth.js

  useEffect(() => {
    if (status === "authenticated") {
      // L'utilisateur est connecté. Rediriger en fonction de son userType
      const userType = session.user.userType;
      if (userType === "employeur") {
        router.push("/employeur/candidats");
      } else if (userType === "candidat") {
        router.push("/candidat/profile");
      } else {
        // Cas par défaut ou gestion d'erreur si userType est inconnu
        router.push("/"); // Page d'accueil par exemple
      }
    } else if (status === "unauthenticated") {
      // L'utilisateur n'a pas pu se connecter (ex: erreur, annulation)
      if (error) {
        // Vous pouvez afficher un message d'erreur spécifique
        console.error("Erreur d'authentification:", error);
        router.push(`/auth/login?error=${error}`); // Rediriger vers la page de login avec l'erreur
      } else {
        // Pas d'erreur spécifique, juste déconnecté (ex: annulation)
        router.push("/auth/login");
      }
    }
  }, [status, session, router, error]);

  if (status === "loading") {
    // Affiche un loader pendant que la session est en cours de chargement
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6F6] text-[#7A20DA]">
        <PulseLoader color="#7A20DA" size={15} />
        <p className="mt-4 text-lg">Vérification de votre connexion...</p>
      </div>
    );
  }

  // Fallback si rien ne se passe (ne devrait pas être atteint longtemps)
  return null;
}