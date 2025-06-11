"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import dynamic from 'next/dynamic';

function AfterPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userType = session.user.userType;
      if (userType === "employeur") {
        router.push("/employeur/dashboard");
      } else {
        router.push("/candidat/dashboard");
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Vérification de l`authentification...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Non authentifié, redirection...</div>;
  }

  return <div>Connexion réussie. Redirection en cours...</div>;
}

// Désactiver le SSR pour ce composant
const AfterPage = dynamic(() => Promise.resolve(AfterPageContent), {
  ssr: false,
  loading: () => <div>Chargement...</div>
});

export default AfterPage;