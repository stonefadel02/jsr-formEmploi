"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function AcceuilRecruteur() {
  return (
    <>
      <Navbar />
      {/* Première section (existante) */}
      <div className="sm:min-h-screen min-h-[600px] bg-[url('/background.png')] bg-cover bg-center bg-no-repeat relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl w-full mt-10 sm:mt-20 md:mt-40 relative z-10 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start">
            {/* Contenu texte et bouton (gauche) */}
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold mb-2 sm:mb-4">
                Trouvez des talents qualifiés en quelques clics.
              </h1>
              <p className="text-sm sm:text-base md:text-md ">
                Accédez à une base de candidats ciblés – 1 mois d’essai
                gratuit. 
              
              </p>
              <p className="py-4">
                  <strong>Pré-évaluation déjà disponible</strong> <br /> Chaque candidat proposé
                passe un test initial via notre application, qui permet de
                mieux cerner sa personnalité. <br /> 👉 Si vous souhaitez approfondir
                les résultats de ce test (lecture détaillée, analyse
                personnalisée, entretien complémentaire), merci de <a target="_blank" rel="noopener noreferrer" href="./contact" className="font-bold">nous
                contacter</a>  directement pour un devis.
              </p>
              <Link href={"/employeur/candidats"}>
                <button className="bg-white text-[#501891] text-[15px] px-4 sm:px-6 py-2 sm:py-3 rounded-[10px] font-medium hover:bg-gray-100 transition duration-200 cursor-pointer">
                  Consulter les candidats
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nouvelle section : Pourquoi choisir JSR */}
      <div className="py-10 sm:py-16 md:py-32 bg-white">
        <h2 className="text-[#7A20DA] text-center font-bold text-lg sm:text-xl md:text-[28px]">
          Pourquoi choisir JSR
        </h2>
        <div className="sm:max-w-4xl px-6 md:px-0 mx-auto w-full mt-6 sm:mt-12 md:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10 justify-center items-start">
            {/* Colonne 1 : 2 éléments */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {/* Carte 1 */}
              <div className="rounded-[25px] border h-auto sm:h-80 border-[#ECECEC] p-4 sm:p-6 md:p-10 text-center">
                <Image
                  src="/ico2.png"
                  alt="Person 1"
                  width={100}
                  height={100}
                  className="rounded-t-[25px] h-16 sm:h-20 w-auto mx-auto"
                />
                <div className="border-t-[2px] border-[#ECECEC] my-2 sm:my-4"></div>
                <h3 className="text-center py-4 sm:py-6 md:py-10 text-[14px] sm:text-[16px] md:text-[18px] text-[#4C4C4C] font-semibold text-lg px-2 sm:px-4">
                  Accès à des profils qualifiés
                </h3>
              </div>

              {/* Carte 2 */}
              <div className="rounded-[25px] border h-auto sm:h-80 border-[#ECECEC] p-4 sm:p-6 md:p-10 text-center">
                <Image
                  src="/ico4.png"
                  alt="Person 1"
                  width={200}
                  height={200}
                  className="rounded-t-[25px] h-16 sm:h-20 w-auto mx-auto"
                />
                <div className="border-t-[2px] border-[#ECECEC] my-2 sm:my-4"></div>
                <h3 className="text-center py-4 sm:py-6 md:py-10 text-[14px] sm:text-[16px] md:text-[18px] text-[#4C4C4C] font-semibold text-lg px-2 sm:px-4">
                  {`1 mois d'accès gratuit à l'inscription`}
                </h3>
              </div>
            </div>

            {/* Colonne 2 : 2 éléments */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              {/* Carte 3 */}
              <div className="rounded-[25px] border h-auto sm:h-80 border-[#ECECEC] p-4 sm:p-6 md:p-10 text-center">
                <Image
                  src="/ico3.png"
                  alt="Person 1"
                  width={200}
                  height={200}
                  className="rounded-t-[25px] h-16 sm:h-20 w-auto mx-auto"
                />
                <div className="border-t-[2px] border-[#ECECEC] my-2 sm:my-4"></div>
                <h3 className="text-center py-4 sm:py-6 md:py-10 text-[14px] sm:text-[16px] md:text-[18px] text-[#4C4C4C] font-semibold text-lg px-2 sm:px-4">
                  Gagnez du temps avec des outils de filtrage
                </h3>
              </div>

              {/* Carte 4 */}
              <div className="rounded-[25px] border h-auto sm:h-80 border-[#ECECEC] p-4 sm:p-6 md:p-10 text-center">
                <Image
                  src="/ico1.png"
                  alt="Person 1"
                  width={200}
                  height={200}
                  className="rounded-t-[25px] h-16 sm:h-20 w-auto mx-auto"
                />
                <div className="border-t-[2px] border-[#ECECEC] my-2 sm:my-4"></div>
                <h3 className="text-center py-4 sm:py-6 md:py-10 text-[14px] sm:text-[16px] md:text-[18px] text-[#4C4C4C] font-semibold text-lg px-2 sm:px-4">
                  Certifié
Bilan de compétences, Orientation & Central Test
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
