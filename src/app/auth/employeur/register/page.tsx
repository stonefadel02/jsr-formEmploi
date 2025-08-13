"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success] = useState("");
  const [loading, setLoading] = useState(false); // Nouvel état pour le loader
     const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Dans votre composant d'inscription Candidat
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/employeurs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
    }

    window.location.href = "https://buy.stripe.com/eVq3cwfwDeyqaYM8wx73G01";

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="mt-32">
          <div className="bg-white sm:p-10 p-6 rounded-[15px] shadow-md w-full max-w-2xl">
            <h2 className="md:text-[25px] te font-bold text-left text-black mb-6">
              Inscription Employeur
            </h2>
            {error && (
              <p className="text-red-600 text-center mb-4 bg-red-100 p-2 rounded">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-600 text-center mb-4 bg-green-100 p-2 rounded">
                {success}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="text-black mt-4 font-light sm:text-[18px]"
                  htmlFor=""
                >
                  Nom de l’entreprise
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder=""
                  className="mt-1 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                  required
                />
              </div>
              <div>
                <label
                  className="text-black mt-4 font-light sm:text-[18px]"
                  htmlFor=""
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="mt-1 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                  required
                />
              </div>
         <div className="relative">
                <label className="text-black mt-4 font-bold text-[18px]" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"} // Type dynamique
                  name="password"
                  placeholder="5 caracteres minimum"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-2 block w-full px-4 py-3 border border-[#C4C4C4] text-gray-700 rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500"
                >
                  {/* Icône qui change en fonction de l'état */}
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-4.789 1.668l.708.708a6 6 0 0 1 4.08-1.588c4.274 0 7.17 4.305 7.17 4.305a11 11 0 0 1-2.14 2.872l.708.708z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288l.822.822a2.5 2.5 0 0 1-2.829-2.829l-.823-.823a3.5 3.5 0 0 0 4.474 4.474z"/><path d="M2.06 2.06a1 1 0 0 0-1.414 1.414l1.473 1.473a11 11 0 0 0-1.805 2.51l-.004.004c-.989 1.564-1.313 3.328-.82 4.95.27.75.69 1.45.98 2.08.48 1.05.95 2.12 1.5 3.14l1.32.39a1 1 0 0 0 1.414-1.414l-1.32-.39c-.55-1.02-.97-2.09-1.45-3.14a10 10 0 0 1-.98-2.08c-.49-1.62-.16-3.38.82-4.95a11 11 0 0 1 1.805-2.51L.647 3.475z"/><path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
                  )}
                </button>
              </div>


              {/* Nouvelle section : Bannière de notification */}
              <div className="flex">
                <div className="bg-[#7A20DA] w-4 border-[#7A20DA] rounded-l-[15px] border-[1px]"></div>
                <div className="bg-[#F4E9FF] py-4 px-5 sm:py-8 sm:px-20 rounded-r-[15px] flex items-center justify-start">
                  <p className="text-sm text-[#7A20DA] sm:text-base">
                    🎁 Un abonnement sera requis accéder aux
                    candidatures.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#7A20DA] cursor-pointer text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 disabled:opacity-50"
                disabled={loading} // Désactive le bouton pendant le chargement
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-t-[#7A20DA]  rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Créer un compte"
                )}
              </button>

              <div className="flex items-center gap-5 justify-between">
                <div className="w-1/2 bg-[#C4C4C4] h-[2px]"></div>
                <p className="text-[#D9D9D9] font-bold">OU</p>
                <div className="h-[2px] bg-[#C4C4C4] w-1/2"></div>
              </div>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => router.push("/auth/redirect?userType=employeur")}
                className="w-full bg-white border cursor-pointer border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Image
                  src="/Google.svg"
                  alt="Google logo"
                  width={24}
                  height={24}
                  className="h-5 w-5"
                />
                <span className="font-extrabold sm:text-[18px]">
                  Se connecter avec Google
                </span>
              </button>
            </div>
            <p className="mt-4 text-[15px] text-gray-600 font-sans text-left">
              Vos données seront traitées en conformité avec les{" "}
             <Link
                href="/politique-de-confidentialite"
                className="text-[#7A20DA] underline"
              >
                Politiques de confidentialité
              </Link>{" "}
              et{" "}
              <Link
                href="/conditions-generales-utilisation"
                className="text-[#7A20DA] underline"
              >
                Conditions d’utilisation
              </Link>
              .
            </p>
          </div>
          <p className="mt-10 text-[#616161] text-[16px] text-center">
            Déjà un compte sur JSR ?{" "}
            <Link href="/auth/login" className="text-[#7A20DA] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}