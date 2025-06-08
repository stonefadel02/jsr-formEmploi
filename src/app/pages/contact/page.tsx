'use client';

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";

export default function AcceuilRecruteur() {
  return (
    <>
      <Navbar />
      {/* Première section (existante) */}
      <div className="min-h-screen py-10 sm:py-16 md:py-20 relative flex items-center justify-center px-2 sm:px-4 lg:px-8">
        {/* Conteneur principal avec l'image et la superposition */}
        <div className="absolute inset-0">
          {/* Superposition du gradient avec opacité réduite */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#8E2DE2]/80 to-[#4B00C8]"></div>
        </div>
        <div className="max-w-7xl w-full mt-6 sm:mt-12 md:mt-20 lg:mt-40 relative z-10 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-10 lg:gap-40 items-center">
            {/* Contenu texte centré */}
            <div className="text-white text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-7xl font-bold mb-1 sm:mb-2 md:mb-4">
                Contacts
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-[20px] py-1 sm:py-2 md:py-4 lg:py-6 mb-1 sm:mb-2 md:mb-4">
                Nous sommes toujours heureux de vous aider et de répondre à vos
                questions
              </p>
            </div>
            <Image
              src="/contact.png"
              alt="Contact Image"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Section : Demandeur d’emploi */}
      <div className="py-6 sm:py-10 md:py-16 lg:py-28 bg-[#F6F6F6]">
        <h2 className="text-[#7A20DA] text-center font-bold text-base sm:text-lg md:text-xl lg:text-[28px]">
          Demandeur d’emploi
        </h2>
        <div className="max-w-5xl mx-auto w-full mt-4 sm:mt-8 md:mt-12 lg:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-10 justify-center items-start">
            {/* Colonne 1 : 1 élément */}
            <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Carte 1 */}
              <div className="rounded-[15px] bg-white border h-auto border-[#ECECEC] p-2 sm:p-4 md:p-6 lg:py-12 lg:px-16 text-center">
                <div className="flex items-center">
                  <Image
                    src="/bloc.png"
                    alt="Person 1"
                    width={100}
                    height={100}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                  <h3 className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[20px] text-[#4C4C4C] font-semibold px-1 sm:px-2">
                    Inscription
                  </h3>
                </div>
                <p className="text-left font-extralight py-2 sm:py-4 md:py-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-6 sm:leading-8 md:leading-10">
                  Comment puis-je m’inscrire à JSR ? Comment puis-je supprimer
                  mon compte? Je ne me souviens pas de mon mot de passe !
                  Comment changer mon adresse e-mail ?
                </p>
                <p className="text-left text-[12px] sm:text-[13px] md:text-[14px] text-[#7A20DA]">
                  Voir plus
                </p>
              </div>
            </div>

            {/* Colonne 2 : 1 élément */}
            <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Carte 2 */}
              <div className="rounded-[15px] bg-white border h-auto border-[#ECECEC] p-2 sm:p-4 md:p-6 lg:py-12 lg:px-16 text-center">
                <div className="flex items-center">
                  <Image
                    src="/search.png"
                    alt="Person 1"
                    width={100}
                    height={100}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                  <h3 className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[20px] text-[#4C4C4C] font-semibold px-1 sm:px-2">
                    Recherche d’emploi
                  </h3>
                </div>
                <p className="text-left font-extralight py-2 sm:py-4 md:py-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-6 sm:leading-8 md:leading-10">
                  Comment postuler à un emploi sur JSR ? Comment créer mon CV
                  efficace? Quels sont les services gratuits pour la recherches
                  d’emploi sur JSR ?
                </p>
                <p className="text-left text-[12px] sm:text-[13px] md:text-[14px] text-[#7A20DA]">
                  Voir plus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section : Employeur */}
      <div className="py-6 sm:py-10 md:py-16 lg:py-2 bg-[#F6F6F6]">
        <h2 className="text-[#7A20DA] text-center font-bold text-base sm:text-lg md:text-xl lg:text-[28px]">
          Employeur
        </h2>
        <div className="max-w-5xl mx-auto w-full mt-4 sm:mt-8 md:mt-12 lg:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:gap-10 justify-center items-start">
            {/* Colonne 1 : 1 élément */}
            <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Carte 1 */}
              <div className="rounded-[15px] bg-white border h-auto border-[#ECECEC] p-2 sm:p-4 md:p-6 lg:py-12 lg:px-16 text-center">
                <div className="flex items-center">
                  <Image
                    src="/bloc.png"
                    alt="Person 1"
                    width={100}
                    height={100}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                  <h3 className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[20px] text-[#4C4C4C] font-semibold px-1 sm:px-2">
                    Détails du compte
                  </h3>
                </div>
                <p className="text-left font-extralight py-2 sm:py-4 md:py-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-6 sm:leading-8 md:leading-10">
                  Comment puis-je m’inscrire à JSR ? Comment puis-je supprimer
                  mon compte? Je ne me souviens pas de mon mot de passe !
                  Comment changer mon adresse e-mail ?
                </p>
                <p className="text-left text-[12px] sm:text-[13px] md:text-[14px] text-[#7A20DA]">
                  Voir plus
                </p>
              </div>
            </div>

            {/* Colonne 2 : 1 élément */}
            <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Carte 2 */}
              <div className="rounded-[15px] bg-white border h-auto border-[#ECECEC] p-2 sm:p-4 md:p-6 lg:py-12 lg:px-16 text-center mb-10 sm:mb-14 md:mb-20 lg:mb-28">
                <div className="flex items-center">
                  <Image
                    src="/search.png"
                    alt="Person 1"
                    width={100}
                    height={100}
                    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  />
                  <h3 className="text-center text-[12px] sm:text-[14px] md:text-[16px] lg:text-[20px] text-[#4C4C4C] font-semibold px-1 sm:px-2">
                    Abonnement
                  </h3>
                </div>
                <p className="text-left font-extralight py-2 sm:py-4 md:py-6 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-6 sm:leading-8 md:leading-10">
                  Comment postuler à un emploi sur JSR ? Comment créer mon CV
                  efficace? Quels sont les services gratuits pour la recherches
                  d’emploi sur JSR ?
                </p>
                <p className="text-left text-[12px] sm:text-[13px] md:text-[14px] text-[#7A20DA]">
                  Voir plus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}