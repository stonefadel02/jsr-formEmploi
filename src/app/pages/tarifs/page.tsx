"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function Acceuil() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full mt-10 sm:mt-20">
          {/* Titre et description */}
          <div className="text-center text-white mb-12">
            <h1 className="text-3xl mx-auto  sm:text-5xl md:text-5xl font-bold mb-4">
              Émployeur, choisissez la formule qui vous correspond
            </h1>
          </div>

          {/* Grille des plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {/* Plan Gratuit */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">Plan Gratuit</h2>
              <p className="text-xl text-[#252525] font-bold mb-4">0€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à une sélection de jobs</li>
                <li>✔ CV et profil visible par les recruteurs</li>
                <li>✔ Support de base</li>
                <li>✔ Accès limité aux ressources</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px]  transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>
            {/* Plan Gratuit */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">Plan Gratuit</h2>
              <p className="text-xl text-[#252525] font-bold mb-4">0€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à une sélection de jobs</li>
                <li>✔ CV et profil visible par les recruteurs</li>
                <li>✔ Support de base</li>
                <li>✔ Accès limité aux ressources</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px]   transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>

            {/* Plan Payant */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">Plan Payant</h2>
              <p className="text-xl text-[#252525] font-bold mb-4">80€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à toutes les offres d’emploi</li>
                <li>✔ CV et profil mis en avant</li>
                <li>✔ Support premium</li>
                <li>✔ Accès complet aux ressources</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px]   transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
