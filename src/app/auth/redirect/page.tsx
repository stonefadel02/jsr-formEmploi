"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function RedirectPage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  useEffect(() => {
    if (userType) {
      signIn("google", {
        callbackUrl: `/${userType}/dashboard`, // Redirection après login
        state: userType
      });
      localStorage.setItem("userType", userType); // Sauvegarde temporaire
    }
  }, [userType]);

  return <p>Redirection vers Google...</p>;
}
