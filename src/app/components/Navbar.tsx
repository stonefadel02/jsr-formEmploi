"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import jwt from "jsonwebtoken";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCandidat, setIsCandidat] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    interface JwtPayload {
      role?: string;
      [key: string]: unknown;
    }
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded: any = jwt.decode(token) as JwtPayload | null;
        if (decoded?.role === 'candidat') {
          setIsCandidat(true);
        }
      } catch (err) {
        console.error("Erreur décodage JWT :", err);
      }
    } else {
      setIsLoggedIn(false);
      setIsCandidat(false);
    }
  }, []);




  const handleLogout = () => {
    // 1. Supprimer les données locales si tu en stockes
    Cookies.remove('userType');
    Cookies.remove('token');// ou tout autre clé que tu utilises

    // 2. Déconnexion via NextAuth
    signOut({ callbackUrl: '/auth/login' }); // redirige vers la page d'accueil
  };

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
            {!isLoggedIn ? (
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

                <Link target="_blank" rel="noopener noreferrer" href="https://www.jsr-formemploi.com/%C3%A0-propos" className="text-[#501891] hover:text-gray-600 font-medium text-[14px] sm:text-[15px] ">
                  Nous contacter
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4 sm:space-x-6 lg:space-x-8 items-center">

              </div>
            )
            }
          </div>

          {/* Boutons à droite (masqués sur mobile, affichés sur desktop) */}
          {!isLoggedIn ? (
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <Link
                href="/pages/inscription"
                className="bg-[#501891] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-[12px] sm:text-[12px]"
              >
                Inscription
              </Link>
              <Link
                href="/auth/login"
                className="text-[#501891] px-2 sm:px-4 py-1 sm:py-2 rounded-[5px] border border-[#501891] hover:bg-[#501891] hover:text-white transition duration-200 font-medium text-[12px] sm:text-[12px]"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {isCandidat && (
                <Link href="/candidat/profile" className="text-[#501891] hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A9.006 9.006 0 0112 15c2.25 0 4.293.832 5.879 2.204M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              )}
              <Link onClick={handleLogout}
                href="/auth/login"
                className="bg-[#501891] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-[12px] sm:text-[12px]"
              >
                Déconnexion
              </Link>
            </div>
          )}

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
            {!isLoggedIn ? (
              <div className="space-y-2  p-2 ">


                <Link href="/pages/acceuil" className="  block text-[#501891] hover:text-gray-600 font-medium  sm:text-[15px] ">
                  Je suis candidat
                </Link>
                <Link href="/pages/acceuil_recruteur" className="block text-[#501891] hover:text-gray-600 font-medium  sm:text-[15px] ">
                  Je suis recruteur
                </Link>
                <Link href="/pages/tarifs" className="block text-[#501891] hover:text-gray-600 font-medium  sm:text-[15px] ">
                  Nos Tarifs
                </Link>
                <Link target="_blank" rel="noopener noreferrer" href="https://www.jsr-formemploi.com/%C3%A0-propos" className="block text-[#501891] hover:text-gray-600 font-medium  sm:text-[15px] ">
                  Nous contacter
                </Link>
              </div>
            ) : (<div className="hidden md:flex space-x-4 sm:space-x-6 lg:space-x-8 items-center">

            </div>)}
            {!isLoggedIn ? (
              <div className="mt-2 space-x-4 flex bg-white p-2 rounded-md shadow-lg">
                <Link
                  href="/pages/inscription"
                  className="block bg-[#501891] text-white px-2 py-1 border-1 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-sm text-center"
                >
                  Inscription
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-[#501891] px-2 py-1 rounded-[5px] border border-[#501891] hover:bg-[#501891] hover:text-white transition duration-200 font-medium text-sm text-center"
                >
                  Se connecter
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 p-2 items-center space-x-2 sm:space-x-3 lg:space-x-4">
                {isCandidat && (
                  <Link href="/candidat/profile" className="block text-[#501891] hover:text-gray-600 font-medium sm:text-[15px] flex items-center gap-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A9.006 9.006 0 0112 15c2.25 0 4.293.832 5.879 2.204M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Mon Profil
                  </Link>
                )}
                <Link onClick={handleLogout}
                  href="/auth/login"
                  className="bg-[#501891] text-white px-2 sm:px-4 py-1 sm:py-2 rounded-[5px] hover:bg-white hover:text-[#501891] hover:border border-[#501891] transition duration-200 font-medium text-[12px] sm:text-[12px]"
                >
                  Déconnexion
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}