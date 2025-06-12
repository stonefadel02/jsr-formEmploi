"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-md py-1 px-4 sm:px-6 lg:px-20">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo et menu à gauche */}
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            {/* Logo */}
            <Link href="/pages/acceuil" className="text-[#501891] hover:text-gray-600 font-medium">
              <Image
                src="/JSR-Logo.png"
                alt="JSR FormEmploi Logo"
                width={156}
                height={82}
                className="h-[62px] w-[136px] object-contain sm:h-[70px] sm:w-[160px]"
              />
            </Link>
            {/* Menu pour desktop */}
            <div className="hidden md:flex space-x-4 sm:space-x-6 lg:space-x-8 items-center">
              <Link href="/pages/acceuil" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Je suis candidat
              </Link>
              <Link href="/pages/acceuil_recruteur" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Je suis recruteur
              </Link>
              <Link href="/pages/tarifs" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Nos Tarifs
              </Link>
              <Link href="/pages/contact" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Boutons à droite (masqués sur mobile, affichés sur desktop) */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            <Link
              href="/components/register"
              className="bg-[#501891] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-[12px] sm:text-[12px]"
            >
              Inscription
            </Link>
            <Link
              href="/components/login"
              className="text-[#501891] px-2 sm:px-4 py-1 sm:py-2 rounded-[5px] border border-[#501891] hover:bg-[#501891] hover:text-white transition duration-200 font-medium text-[12px] sm:text-[12px]"
            >
              Se connecter
            </Link>
          </div>

          {/* Menu hamburger pour mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu déroulant pour mobile */}
        {isOpen && (
          <div className="md:hidden mt-2">
            <div className="space-y-2 bg-white p-2 rounded-md shadow-lg">
              <Link href="/" className="block text-[#501891] hover:text-gray-600 py-1 font-medium text-sm">
                Offres d’emploi
              </Link>
              <Link href="/formations" className="block text-[#501891] hover:text-gray-600 py-1 font-medium text-sm">
                Accès recruteurs
              </Link>

              <Link href="/pages/acceuil" className="  text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Je suis candidat
              </Link>
              <Link href="/pages/acceuil_recruteur" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Je suis recruteur
              </Link>
              <Link href="/pages/tarifs" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Nos Tarifs
              </Link>
              <Link href="/pages/contact" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                Nous contacter
              </Link>
            </div>
            <div className="mt-2 space-y-2 bg-white p-2 rounded-md shadow-lg">
              <Link
                href="/components/register"
                className="block bg-[#501891] text-white px-2 py-1 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-sm text-center"
              >
                Inscription
              </Link>
              <Link
                href="/components/login"
                className="block text-[#501891] px-2 py-1 rounded-[5px] border border-[#501891] hover:bg-[#501891] hover:text-white transition duration-200 font-medium text-sm text-center"
              >
                Se connecter
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}