"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AfterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const userType = session.user?.userType;

      if (userType === "employeur") {
        router.push("/employeur/dashboard");
      } else {
        router.push("/candidat/dashboard");
      }
    }
  }, [status, session]);

  return <p>Connexion réussie. Redirection en cours...</p>;
}
