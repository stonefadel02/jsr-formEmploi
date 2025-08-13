"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from 'js-cookie';

// L'enfant est 100% autonome et gère toute la logique
function SuccessContent() {
  const router = useRouter();
  // ✅ Le hook est appelé ici, à l'intérieur du composant qui en a besoin
  const searchParams = useSearchParams(); 
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("Vérification de votre paiement en cours...");

  useEffect(() => {
    if (sessionId) {
      console.log("Session ID trouvé, lancement de la vérification...");
      const verifySession = async () => {
        try {
          const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
          const data = await response.json();

          if (data.success && data.token) {
            setStatus("Paiement réussi ! Votre compte est activé. Redirection...");
            Cookies.set("token", data.token, { expires: 7, secure: process.env.NODE_ENV === "production", sameSite: "Lax" });
            
            const redirectPath = data.role === 'candidat' ? '/candidat/candidature' : '/employeur/candidats';
            setTimeout(() => router.push(redirectPath), 3000);
          } else {
            setStatus(data.message || "Paiement non complété ou une erreur est survenue.");
          }
        } catch (error) {
            setStatus("Une erreur de communication est survenue. Veuillez contacter le support.");
            console.error("Erreur Fetch:", error);
        }
      };
      verifySession();
    } else {
        setStatus("Aucun identifiant de session trouvé. Impossible de vérifier le paiement.");
    }
  }, [sessionId, router]);

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Résultat du Paiement</h1>
      <p>{status}</p>
    </div>
  );
}

// Le parent ne fait que mettre en place la structure et la frontière Suspense
export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p>Chargement...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}