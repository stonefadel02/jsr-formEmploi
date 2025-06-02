'use client';

import Navbar from "@/app/components/navbar/page";
import Footer from "@/app/components/footer/page";
import Image from "next/image";

export default function CandidateProfile() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full mt-10 sm:mt-20 md:mt-32 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6 sm:gap-8 lg:gap-12">
            {/* Section gauche : Photo et Vidéo */}
            <div className="h-1/2 max-w-[400px] flex flex-col items-center bg-white rounded-[20px] p-10 space-y-6">
              {/* Photo de profil */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/profile-placeholder.png" // Remplace par l'URL de la photo réelle
                  alt="Photo de profil"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Nom et prénom */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Coordonnées Informatique
              </h2>
              {/* Vidéo */}
              <div className="w-full h-48 sm:h-64 bg-gray-200 rounded-[15px] relative overflow-hidden">
                <Image
                  src="/video-placeholder.png" // Remplace par l'URL de la miniature vidéo
                  alt="Vidéo de présentation"
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Section droite : Informations */}
            <div className="bg-white p-10 rounded-[15px] space-y-6">
              {/* Compétences */}
              <div>
                <div className="space-y-1 pb-10">
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">Coordonnées</h3>
                    <p className="text-[#4C4C4C] py-2">Informatique</p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">Localisation</h3>
                    <p className="text-[#4C4C4C] py-2">Paris, France</p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">
                      Niveau d’étude
                    </h3>
                    <p className="text-[#4C4C4C] py-2">
                      Bac +5 (Master en Informatique)
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">
                      Type de contrat
                    </h3>
                    <p className="text-[#4C4C4C] py-2">Apprentissage</p>
                  </div>
                </div>
                <h3 className="text-[#202020] text-[24px] sm:text-xl font-bold mb-2">
                  Compétences
                </h3>
                <div className="flex mt-8 flex-wrap gap-2 text-sm sm:text-base text-[#7A20DA]">
                  <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                    HTML
                  </span>
                  <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                    CSS
                  </span>
                  <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                    React
                  </span>
                  <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                    SQL
                  </span>
                  <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                    UX
                  </span>
                  <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                    JavaScript
                  </span>
                </div>
              </div>
              {/* Expérience Professionnelle */}
              <div>
                <h3 className="text-[#202020] text-lg sm:text-xl font-semibold mb-2">
                  Expérience Professionnelle
                </h3>
                <h4 className="text-[#4E4E4E] mt-6 text-md font-semibold sm:text-base">
                  Stage - Développement front-end
                </h4>
                <p className="text-[#4C4C4C] py-4">
                  Juin 2024 - Août 2024 (3 mois)
                </p>
                <p className="text-[#4C4C4C]">
                  Participation au développement de l`interface utilisateur
                  d`une application web en React.
                </p>
                <div className="text-[#4C4C4C] pl-5">
                  <li>Implémentation de composants UI</li>
                  <li>Intégration d`APIs</li>
                  <li>Correction de bugs</li>
                </div>
              </div>
              {/* Informations de Contact */}
              <div className="py-6">
                <h3 className="text-[#202020] text-lg sm:text-xl font-bold mb-2">
                  Informations de Contact
                </h3>
                <div className="space-y-4 py-5">
                  <div className="flex items-center">
                    <strong className="text-gray-600 text-sm sm:text-base w-[120px]">
                      Email :
                    </strong>
                    <a
                      href="mailto:candidat@example.com"
                      className="text-[#008CFF] underline text-sm sm:text-base"
                    >
                      candidat@example.com
                    </a>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-600 text-sm sm:text-base w-[120px]">
                      Localisation :
                    </strong>
                    <button className="text-[#008CFF] underline text-sm sm:text-base">
                      Localiser
                    </button>
                  </div>
                </div>
              </div>
              {/* Bouton Télécharger CV */}
              <div className="text-left">
                <button className="w-full sm:w-auto bg-[#7A20DA] text-white py-2 px-10 mb-16 rounded-[5px] hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200">
                  Télécharger le CV (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}