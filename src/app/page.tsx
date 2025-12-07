"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen   bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl min-h-screen w-full mt-40 mb-32 ">
          <div className="grid grid-cols-1  md:grid-cols-2 gap-8 items-center">
            {/* Contenu texte et bouton (gauche) */}
            <div className="text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
                Ici, ce sont les entreprises qui viennent à vous !
              </h1>
              <p className="text-base md:text-lg py-4 mb-2">
                Nous connectons les talents aux meilleures opportunités
                professionnelles.
              </p>
              <p className="py-1">
                👉 Vidéo de présentation, montrez qui vous êtes.
              </p>
              <p className="py-1">
                👉 Test de personnalité, révélez vos forces.
              </p>
              <p className="py-1">👉 CV, complétez votre profil.</p>
              <p className="py-2 font-bold">Les recruteurs font le reste !</p>
              <p className="text-base md:text-lg mb-6">
                JSR est CERTIFIÉ bilan de compétences et d'orientation avec
                double expertise Central Test
              </p>
              <div className="flex space-x-4">
                <Link href={"/candidat/candidature"}>
                  <button className="bg-white text-[#501891] px-18 py-3 rounded-[10px] font-medium hover:bg-gray-100 transition duration-200 cursor-pointer">
                    Candidater
                  </button>
                </Link>
              </div>
            </div>

            {/* Images (droite) - Trois colonnes avec disposition 75/25, 25/75, 75% centré */}
            <div className="grid grid-cols-1 sm:mt-0 mt-10  md:grid-cols-3 gap-1 md:gap-6 h-[600px]">
              {/* Colonne 1 : 75% / 25% */}
              <div className="flex sm:flex-col sm:gap-4">
                <div className="relative w-full flex-grow-[2] overflow-hidden rounded-[50px]">
                  <Image
                    src="/3.png"
                    alt="Person 1"
                    fill
                    className="sm:object-cover object-contain"
                  />
                </div>
                <div className="relative sm:w-full w-[90%] flex-grow overflow-hidden rounded-[50px]">
                  <Image
                    src="/5.png"
                    alt="Person 2"
                    fill
                    className="sm:object-cover object-contain"
                  />
                </div>
              </div>

              {/* Colonne 2 : 25% / 75% */}
              <div className="flex sm:flex-col gap-4">
                <div className="relative w-full flex-grow overflow-hidden rounded-[50px]">
                  <Image
                    src="/1.png"
                    alt="Person 3"
                    fill
                    className="sm:object-cover object-contain"
                  />
                </div>
                <div className="relative w-full flex-grow-[2] overflow-hidden rounded-[50px]">
                  <Image
                    src="/2.png"
                    alt="Person 4"
                    fill
                    className="sm:object-cover object-contain"
                  />
                </div>
              </div>

              {/* Colonne 3 : image centrée verticalement */}
              <div className="flex items-center justify-center h-full">
                <div className="relative w-full sm:h-[75%] h-[100%] overflow-hidden rounded-[50px]">
                  <Image
                    src="/4.png"
                    alt="Person 5"
                    fill
                    className="sm:object-cover  object-contain "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}









