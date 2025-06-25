"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      const checkSessionStatus = async () => {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();
        if (data.success) {
          setStatus("Paiement réussi !");
        } else {
          setStatus("Paiement non complété.");
        }
      };
      checkSessionStatus();
    }
  }, [sessionId]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Vérification du paiement</h1>
      {status ? <p>{status}</p> : <p>Chargement...</p>}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<p>Chargement de la page...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}