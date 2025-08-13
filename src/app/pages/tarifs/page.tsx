"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Acceuil() {
    const { data: session } = useSession();
  const [loadingCandidat, setLoadingCandidat] = useState(false);
  const [loadingRecruteur, setLoadingRecruteur] = useState(false);

  const handleSubscribe = async (
    priceId: string,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId,
          customer_email: session?.user?.email, 
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Erreur de création de session.");
      }
      window.location.href = data.url;
    } catch (error) {
      console.error("Erreur lors de la redirection:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l py-10 from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mt-16 sm:mt-20">
          <div className="text-center sm:px-10 max-w-2xl mx-auto text-white mb-12">
            <h1 className="text-2xl mx-auto sm:text-4xl md:text-4xl font-bold mb-4">
              Recruteurs, Candidats, choisissez la formule qui vous correspond
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mx-auto max-w-2xl gap-6 mb-12">
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Payant - Candidat
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">10€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à sa candidature</li>
                <li>✔ CV et profil visible aux recruteurs</li>
                <li>✔ Support Standard</li>
                <li>✔ Accès aux ressources</li>
              </ul>
              <Link href="/auth/candidats/register">
                <button
                  className="bg-[#7A20DA] text-white px-6 py-3 mt-8 font-bold rounded-[10px] transition duration-200 cursor-pointer"
                  disabled={loadingCandidat}
                >
                  {loadingCandidat ? "Chargement..." : "Souscrire"}
                </button>
              </Link>

              <button
                onClick={() =>
                  handleSubscribe(
                    "price_1RdCHQQ8brLwKg0wxR3dMhW0",

                    setLoadingCandidat
                  )
                }
                className="bg-[#7A20DA] mx-2 text-white px-6 py-3 mt-8 font-bold rounded-[10px] transition duration-200 cursor-pointer"
                disabled={loadingCandidat}
              >
                {loadingCandidat ? "Chargement..." : "Renouveler"}
              </button>
            </div>
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Payant Recruteur
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">100€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à tous les profils</li>
                <li>✔ Accès complet aux candidatures</li>
                <li>✔ CV et profil mis en avant</li>
                <li>✔ Support premium</li>
                <li>✔ Accès complet aux ressources</li>
              </ul>
              <Link href="/auth/employeur/register">
                <button
                  className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px] transition duration-200 cursor-pointer"
                  disabled={loadingRecruteur}
                >
                  {loadingRecruteur ? "Chargement..." : "Souscrire"}
                </button>
              </Link>

              <button
                onClick={() =>
                  handleSubscribe(
                    "price_1RdCKOQ8brLwKg0wMoJeI40W",

                    setLoadingRecruteur
                  )
                }
                className="bg-[#7A20DA] mx-2 text-white px-6 py-3 font-bold rounded-[10px] transition duration-200 cursor-pointer"
                disabled={loadingRecruteur}
              >
                {loadingRecruteur ? "Chargement..." : "Renouveler"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
