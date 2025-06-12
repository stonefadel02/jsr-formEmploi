'use client';

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
          <div className="flex items-center space-x-8">
            {/* Logo */}
              <Link href="/pages/acceuil" className="text-[#501891] hover:text-gray-600 font-medium">
              <Image
              src="/JSR-Logo.png"
              alt="JSR FormEmploi Logo"
              width={156}
              height={82}
              className="h-[82px] w-[156px] object-contain"
            />
              </Link>
            {/* Menu pour desktop */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/pages/acceuil" className="text-[#501891] hover:text-gray-600 font-medium">
                Je suis candidat
              </Link>
              <Link href="/pages/acceuil_recruteur" className="text-[#501891] hover:text-gray-600 font-medium">
                Je suis recruteur
              </Link>
              <Link href="/pages/tarifs" className="text-[#501891] hover:text-gray-600 font-medium">
                Nos Tarifs
              </Link>
                <Link href="/pages/contact" className="text-[#501891] hover:text-gray-600 font-medium">
                Nous contacter22
              </Link>
            </div>
          </div>

          {/* Boutons à droite (masqués sur mobile, affichés sur desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/components/register"
              className="bg-[#501891] text-white px-4 py-2 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium"
            >
              Inscription
            </Link>
            <Link
              href="/components/login"
              className="text-[#501891] px-4 py-2 rounded-[5px] border border-[#501891] hover:bg-[#501891] hover:text-white transition duration-200 font-medium"
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
          <div className="md:hidden mt-4">
            <div className="space-y-4">
              <Link href="/" className="block text-[#501891] hover:text-gray-600 py-2 font-medium">
                Offres d’emploi
              </Link>
              <Link href="/formations" className="block text-[#501891] hover:text-gray-600 py-2 font-medium">
                Accès recruteurs
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                href="/components/register"
                className="block bg-[#501891] text-white px-4 py-2 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-center"
              >
                Inscription
              </Link>
              <Link
                href="/components/login"
                className="block text-[#501891] px-4 py-2 rounded-[5px] border border-[#501891] hover:bg-[#501891] hover:text-white transition duration-200 font-medium text-center"
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