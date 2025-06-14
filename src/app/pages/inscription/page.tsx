"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

export default function HomeChoice() {
  const router = useRouter();

  const handleEmployerRegister = () => {
    router.push("/auth/employeur/register"); // Ajuste le chemin selon ta structure
  };

  const handleCandidateRegister = () => {
    router.push("/auth/candidats/register"); // Ajuste le chemin selon ta structure
  };

  return (
      <>
        <Navbar />
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[15px] shadow-md w-full max-w-md text-center">
        <h1 className="text-[25px] font-bold text-black mb-6">
          Choisissez votre profil
        </h1>
        <p className="text-[#616161] text-[16px] mb-8">
          Sélectionnez le type de compte que vous souhaitez créer.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleCandidateRegister}
            className="w-full bg-[#7A20DA] text-white py-3 px-4 cursor-pointer rounded-lg hover:bg-purple-700 transition duration-200 font-medium"
          >
            Inscription Candidat
          </button>
          <button
            onClick={handleEmployerRegister}
            className="w-full bg-[#501891] text-white py-3 px-4 cursor-pointer rounded-lg hover:bg-purple-900 transition duration-200 font-medium"
          >
            Inscription Employeur
          </button>
        </div>
      </div>
    </div>
      <Footer />
        </>
  );
}