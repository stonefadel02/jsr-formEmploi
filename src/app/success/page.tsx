"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from 'js-cookie';

// MODIFIÉ : Ce composant reçoit maintenant le sessionId en tant que "prop"
function SuccessContent({ sessionId }: { sessionId: string | null }) {
  const router = useRouter();
  const [status, setStatus] = useState("Vérification de votre paiement en cours...");

  useEffect(() => {
    // La logique est la même, mais elle dépend maintenant de la prop
    if (sessionId) {
      console.log("Session ID reçu, lancement de la vérification..."); // Pour le débogage
      const verifySession = async () => {
        try {
          const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
          const data = await response.json();

          if (data.success && data.token) {
            setStatus("Paiement réussi ! Votre compte est activé. Redirection...");
            Cookies.set("token", data.token, { expires: 7, secure: process.env.NODE_ENV === "production", sameSite: "Lax" });
            
            const redirectPath = data.role === 'candidat' ? '/candidat/profile' : '/employeur/candidats';
            setTimeout(() => router.push(redirectPath), 3000);
          } else {
            setStatus(data.message || "Paiement non complété ou une erreur est survenue.");
          }
        } catch (error) {
          setStatus("Une erreur de communication est survenue. Veuillez contacter le support.");
          console.error("Erreur Fetch:", error); // Pour le débogage
        }
      };
      verifySession();
    } else {
        setStatus("Aucun identifiant de session trouvé. Impossible de vérifier le paiement.");
    }
  }, [sessionId, router]); // Le useEffect dépend de la prop

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Résultat du Paiement</h1>
      <p>{status}</p>
    </div>
  );
}

// MODIFIÉ : Le composant parent lit l'URL et passe le sessionId
export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p>Chargement...</p>}>
        <SuccessContent sessionId={sessionId} />
      </Suspense>
    </div>
  );
}