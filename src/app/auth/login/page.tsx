"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { signIn } from "next-auth/react";
import LoginForm from "@/app/components/LoginForm"; // importe le nouveau composant

export default function Login() {
  const roles = ["Je suis candidat", "Je suis employeur"];
  const [selected, setSelected] = useState("Je suis candidat");
  const [loading, setLoading] = useState(false); // Nouvel état pour le loader

  // Convertit le label en valeur utilisable
  const role = selected === "Je suis candidat" ? "candidat" : "employeur";

  // Gérer la connexion avec Google
  const handleGoogleSignIn = async () => {
    setLoading(true); // Active le loader
    try {
      await signIn("google", { callbackUrl: "/profile" }); // Redirige vers le profil après connexion
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
    } finally {
      setLoading(false); // Désactive le loader, même en cas d'erreur
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="mt-32 w-full max-w-lg">
          <div className="bg-white p-10 rounded-[15px] shadow-md">
            <h2 className="text-[25px] font-bold text-left text-black mb-6">
              Connexion
            </h2>

            {/* Boutons pour choisir le rôle */}
            <div className="flex justify-between mb-6">
              {roles.map((roleText) => (
                <button
                  key={roleText}
                  onClick={() => setSelected(roleText)}
                  className={`rounded-[15px] font-semibold px-11 py-3 transition ${
                    selected === roleText
                      ? "bg-[#7A20DA] text-white"
                      : "border border-[#7A20DA] text-[#7A20DA]"
                  }`}
                >
                  {roleText}
                </button>
              ))}
            </div>

            {/* Formulaire dynamique */}
            <LoginForm role={role} />

            {/* Séparateur */}
            <div className="my-6 flex items-center gap-5 justify-between">
              <div className="w-1/2 bg-[#C4C4C4] h-[2px]" />
              <p className="text-[#D9D9D9] font-bold">OU</p>
              <div className="w-1/2 bg-[#C4C4C4] h-[2px]" />
            </div>

            {/* Bouton Google avec loader */}
            <div className="text-center">
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center gap-4 hover:bg-gray-50 disabled:opacity-50"
                disabled={loading} // Désactive le bouton pendant le chargement
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-t-[#7A20DA] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Image src="/Google.svg" alt="Google" width={24} height={24} />
                    <span className="font-extrabold text-[18px]">
                      Se connecter avec Google
                    </span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-[15px] text-gray-600 font-sans text-left">
              Vos données seront traitées selon les{" "}
              <a href="#" className="text-[#7A20DA] underline">
                Politiques de confidentialité
              </a>{" "}
              et{" "}
              <a href="#" className="text-[#7A20DA] underline">
                Conditions d’utilisation
              </a>
              .
            </p>
          </div>

          <p className="mt-4 text-[#616161] text-[16px] text-center">
            Pas de compte sur JSR ?{" "}
            <Link
              href="/auth/candidats/register"
              className="text-[#7A20DA] hover:underline"
            >
              Créez un compte
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}