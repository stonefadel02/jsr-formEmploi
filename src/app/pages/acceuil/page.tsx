"use client";

import Footer from "@/app/components/footer/page";
import Navbar from "@/app/components/navbar/page";
import Image from "next/image";
import Link from "next/link";

export default function Acceuil() {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mt-40 mb-32 ">
          <div className="grid grid-cols-1  md:grid-cols-2 gap-8 items-center">
            {/* Contenu texte et bouton (gauche) */}
            <div className="text-white">
              <h1 className="text-4xl md:text-7xl font-bold mb-4">
                Rejoignez les talents de demain avec JSR.
              </h1>
              <p className="text-base md:text-lg py-6 mb-6">
                Depuis 1994, nous connectons les talents aux meilleures
                opportunités professionnelles.
              </p>
              <Link href={"/components/register"}>
              <button className="bg-white text-[#501891] px-6 py-3 rounded-[10px] font-medium hover:bg-gray-100 transition duration-200 cursor-pointer">
                Candidater maintenant
              </button>
              </Link>
            </div>

            {/* Images (droite) - Trois colonnes avec disposition 75/25, 25/75, 75% centré */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-[600px]">
              {/* Colonne 1 : 75% / 25% */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full flex-grow-[2] overflow-hidden rounded-[50px]">
                  <Image
                    src="/3.png"
                    alt="Person 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full flex-grow overflow-hidden rounded-[50px]">
                  <Image
                    src="/5.png"
                    alt="Person 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Colonne 2 : 25% / 75% */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full flex-grow overflow-hidden rounded-[50px]">
                  <Image
                    src="/1.png"
                    alt="Person 3"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-full flex-grow-[2] overflow-hidden rounded-[50px]">
                  <Image
                    src="/2.png"
                    alt="Person 4"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Colonne 3 : image centrée verticalement */}
              <div className="flex items-center justify-center h-full">
                <div className="relative w-full h-[75%] overflow-hidden rounded-[50px]">
                  <Image
                    src="/4.png"
                    alt="Person 5"
                    fill
                    className="object-cover"
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
