"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RedirectPage() {
  return (
    <Suspense fallback={<p>Chargement de la redirection...</p>}>
      <RedirectContent />
    </Suspense>
  );
}

function RedirectContent() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  if (userType) {
    signIn("google", {
      callbackUrl: `/${userType}/dashboard`, // Redirection après login
      state: userType,
    }).then(() => {
      localStorage.setItem("userType", userType); // Sauvegarde après succès
    }).catch((error) => {
      console.error("Erreur lors de la connexion :", error);
    });
  }

  return <p>Redirection vers Google...</p>;
}