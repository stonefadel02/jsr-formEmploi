"use client";

import Employeur from "@/app/components/employeur/page";
import Sidebar from "@/app/components/sidebar/page";
import Entete from "@/app/components/entete/page"; // Importer le composant Entete

export default function GestionEmployeur() {
  return (
    <>
      <div className="flex min-h-screen bg-[#F6F6F6] pb-20">
        {/* Sidebar */}
        <Sidebar />

        {/* Intégration de l'En-tête */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-[350px]">
          <div className="max-w-7xl w-full">
            <Entete />
            <Employeur />
          </div>
        </div>
      </div>
    </>
  );
}