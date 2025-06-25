"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Acceuil() {
  const [loadingCandidat, setLoadingCandidat] = useState(false);
  const [loadingRecruteur, setLoadingRecruteur] = useState(false);

  const handleSubscribe = async (priceId: string, setLoading: (value: boolean) => void) => {
    setLoading(true);
    const stripe = await stripePromise;
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l py-10 from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mt-16 sm:mt-20">
          {/* Titre et description */}
          <div className="text-center sm:px-10 max-w-2xl mx-auto text-white mb-12">
            <h1 className="text-2xl mx-auto sm:text-4xl md:text-4xl font-bold mb-4">
              Recruteurs, Candidats, choisissez la formule qui vous correspond
            </h1>
          </div>

          {/* Grille des plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Plan Gratuit */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Gratuit
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">
                0€ / 1 mois de gratuité
              </p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à une sélection profils</li>
                <li>✔ CV et profil visible par les recruteurs</li>
                <li>✔ Support de base</li>
                <li>✔ Accès aux ressources</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px] transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>

            {/* Plan Payant - Candidats */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Payant - Candidats
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">10€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à sa candidature</li>
                <li>✔ CV et profil visible par les recruteurs</li>
                <li>✔ Support de base</li>
                <li>✔ Accès aux ressources</li>
              </ul>
              <button
                onClick={() => handleSubscribe("price_1RdCHQQ8brLwKg0wxR3dMhW0", setLoadingCandidat)} // Remplace par l'ID de prix réel (ex. price_1Jxxx)
                className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px] transition duration-200 cursor-pointer"
                disabled={loadingCandidat}
              >
                {loadingCandidat ? "Chargement..." : "Souscrire"}
              </button>
            </div>

            {/* Plan Payant Recruteur */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Payant Recruteur
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">100€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à tout les profils</li>
                <li>✔ CV et profil mis en avant</li>
                <li>✔ Support premium</li>
                <li>✔ Accès complet aux ressources</li>
                <li>✔ Accès complet aux candidatures</li>
              </ul>
              <button
                onClick={() => handleSubscribe("price_1RdCKOQ8brLwKg0wMoJeI40W", setLoadingRecruteur)} // Remplace par l'ID de prix réel (ex. price_1Kxxx)
                className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px] transition duration-200 cursor-pointer"
                disabled={loadingRecruteur}
              >
                {loadingRecruteur ? "Chargement..." : "Souscrire"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}