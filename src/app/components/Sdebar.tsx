'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#7A20DA] text-white rounded-md"
        onClick={toggleSidebar}
      >
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
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full shadow-md transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 md:w-[350px]`}
      >
        {/* Section supérieure avec le logo */}
      <div className="bg-[#58179E]/90">
          <div className="p-6 flex flex-col items-center  ">
          <Image
            src="/JSR-LOGO-2.png"
            alt="JSR FormEmploi Logo"
            width={400}
            height={400}
            className=" h-16 w-40 object-contain"
          />
        </div>
        <div className="border-[1px] mx-auto w-1/2 border-[#9C68D5] "></div>
      </div>
        {/* Section inférieure avec les liens */}
        <div className="h-full bg-[#58179E]">
          <nav className="pl-10 items-center mx-auto">
            <ul className="space-y-1 mx-auto pt-10 ">
              <li>
                <Link
                  href="/admin/gestion_statistique"
                  className="flex text-left items-center px-6 py-6  text-white text-[15px] font-medium hover:bg-[#A67BC1]/90 transition-colors duration-200"
                >
                  Statistiques Globales
                </Link>
              </li>
              <li>
                <Link
                  href="/candidatures"
                  className="flex text-left items-center  px-6 py-6 text-white text-[15px] font-medium hover:bg-[#A67BC1]/90 transition-colors duration-200"
                >
                  Gestion des Candidatures
                </Link>
              </li>
              <li>
                <Link
                  href="/employers"
                  className="flex text-left items-center  px-6 py-6 text-white text-[15px] font-medium hover:bg-[#A67BC1]/90 transition-colors duration-200"
                >
                  Gestions des Employeurs
                </Link>
              </li>
              <li>
                <Link
                  href="/subscriptions"
                  className="flex text-left items-center  px-6 py-6 text-white text-[15px] font-medium hover:bg-[#A67BC1]/90 transition-colors duration-200"
                >
                  Gestions des Abonnements
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay pour mobile lorsqu'on clique sur le menu */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}