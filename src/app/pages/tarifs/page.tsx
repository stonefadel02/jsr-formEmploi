"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function Acceuil() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l py-10 from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mt-10 sm:mt-20">
          {/* Titre et description */}
          <div className="text-center px-10 max-w-2xl mx-auto text-white mb-12">
            <h1 className="text-3xl mx-auto sm:text-4xl md:text-4xl font-bold mb-4">
              Recruteurs, Candidats, choisissez la formule qui vous correspond
            </h1>
          </div>

          {/* Grille des plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Plan Gratuit */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Gratuit
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">0€ / 1 mois de gratuité</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à une sélection profils</li>
                <li>✔ CV et profil visible par les recruteurs</li>
                <li>✔ Support de base</li>
                <li>✔ Accès aux ressources</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px]  transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>
            {/* Plan Gratuit */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Payant - Candidats
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">10€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à sa candidature</li>
                <li>✔ CV et profil visible par les recruteurs</li>
                <li>✔ Support de base</li>
                <li>✔ Accès aux ressources</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px]   transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>

            {/* Plan Payant */}
            <div className="bg-white backdrop-blur-md p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl text-[#7A20DA] font-bold mb-4">
                Plan Payant Recruteur
              </h2>
              <p className="text-xl text-[#252525] font-bold mb-4">100€ / an</p>
              <ul className="text-left text-[#616161] mb-6 space-y-2">
                <li>✔ Accès à tout les profils</li>
                <li>✔ CV et profil mis en avant</li>
                <li>✔ Support premium</li>
                <li>✔ Accès complet aux ressources</li>
                 <li>✔ Accès complet aux candidatures</li>
              </ul>
              <Link href="/components/register">
                <button className="bg-[#7A20DA] text-white px-6 py-3 font-bold rounded-[10px]   transition duration-200 cursor-pointer">
                  Essayer le plan
                </button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
 <div className="min-h-screen bg-[#F6F6F6] py-4 sm:py-6 md:py-10 lg:py-20 flex items-center justify-center px-2 sm:px-4 lg:px-8">
        <div className="max-w-4xl w-full mt-4 sm:mt-6 md:mt-12 lg:mt-20">
          <div className="bg-white rounded-[15px] border border-[#ECECEC] p-4 sm:p-6 md:p-8 lg:p-10 shadow-md">
            <h1 className="text-[#7A20DA] text-center font-bold text-lg sm:text-xl md:text-2xl lg:text-[28px] mb-2 sm:mb-4">
              Informations de Paiement
            </h1>
            <p className="text-[#4C4C4C] text-center text-sm sm:text-base md:text-lg lg:text-[18px] mb-4 sm:mb-6">
              Merci d’avoir choisi JSR ! En tant qu’employeur, vous bénéficiez de 2 mois d’accès gratuit. Après cette période, un paiement est requis pour continuer à utiliser nos services. Veuillez effectuer le virement bancaire avec les informations ci-dessous.
            </p>

            <div className="bg-gray-50 rounded-[15px] p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-[#501891] font-semibold text-base sm:text-lg md:text-xl mb-2">
                Instructions de paiement
              </h2>
              <ul className="text-[#616161] text-xs sm:text-sm md:text-base list-disc list-inside">
                <li>Veuillez effectuer un virement bancaire pour le montant dû après les 2 mois gratuits.</li>
                <li>Indiquez votre nom d’entreprise et l’EMAIL de votre compte JSR comme référence de paiement.</li>
                <li>Envoyez une preuve de paiement par email à support@jsr.com après le virement.</li>
                <li>Contactez-nous à support@jsr.com pour toute question ou assistance.</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-[15px] p-4 sm:p-6">
              <h2 className="text-[#501891] font-semibold text-base sm:text-lg md:text-xl mb-2">
                Coordonnées bancaires
              </h2>
              <div className="text-[#4C4C4C] text-xs sm:text-sm md:text-base">
                <p><strong>Titulaire du compte :</strong> MLLE SONIA JELLABI</p>
                <p><strong>Adresse :</strong> APPT D24 2EME BAT D2, GRANDE GALERIE DE FREJUS PLAGE, 186 RUE PRIOL ET LAPORTE, 83600 FREJUS</p>
                <p><strong>Domiciliation :</strong> SAINT RAPHAEL (03935), 78 BOULEVARD FELIX MARTIN, 83700 ST RAPHAEL</p>
                <p><strong>BIC :</strong> CRLYFRPP</p>
                <p><strong>IBAN :</strong> FR40 30002039350000059382 K25</p>
                <p><strong>RIB :</strong></p>
                <ul className="list-disc list-inside ml-4">
                  <li>Banque : 30002</li>
                  <li>Indicatif : 03935</li>
                  <li>N° Compte : 0000059382K</li>
                  <li>Clé RIB : 25</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <Footer />
    </>
  );
}
