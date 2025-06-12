"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function Paiement() {
  return (
    <>
      <Navbar />
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