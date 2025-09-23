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
import { Suspense } from "react"; // Assurez-vous d'importer Suspense

// Déplacez la logique de redirection dans un composant interne ou une fonction de rendu
// qui sera enveloppée par Suspense.
function AuthRedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams(); // <-- useSearchParams est ici
  const error = searchParams.get('error');

  useEffect(() => {
    if (status === "authenticated") {
      const userType = session.user.userType;
      if (userType === "employeur") {
        router.push("/employeur/candidats");
      } else if (userType === "candidat") {
        router.push("/candidat/profile");
      } else {
        router.push("/");
      }
    } else if (status === "unauthenticated") {
      if (error) {
        console.error("Erreur d'authentification:", error);
        router.push(`/auth/login?error=${error}`);
      } else {
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

  // Ne devrait pas être atteint longtemps, ou affiche un message de chargement générique.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6F6] text-[#7A20DA]">
      <PulseLoader color="#7A20DA" size={15} />
      <p className="mt-4 text-lg">Redirection en cours...</p>
    </div>
  );
}

// Le composant exporté par défaut qui enveloppe la logique dans Suspense
export default function AuthRedirectPageWrapper() {
  return (
    <Suspense fallback={
      // Ce fallback s'affiche TRES tôt, avant même que les hooks NextAuth.js ne soient prêts
      // C'est le fallback pour le rendu initial de useSearchParams
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F6F6F6] text-[#7A20DA]">
        <PulseLoader color="#7A20DA" size={15} />
        <p className="mt-4 text-lg">Initialisation de la redirection...</p>
      </div>
    }>
      <AuthRedirectContent />
    </Suspense>
  );
}