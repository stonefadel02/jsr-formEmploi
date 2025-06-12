"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/footer/page";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

type AlternanceSearch = {
  sector?: string;
  location?: string;
  level?: string;
  contracttype?: string;
};

type Candidate = {
  firstName?: string;
  lastName?: string;
  email?: string;
  videoUrl?: string;
  cvUrl?: string;
  skills?: string[];
  alternanceSearch?: AlternanceSearch;
};

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidat, setCandidat] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidat = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.log("Aucun token trouvé");
          setError("Aucun token trouvé. Veuillez vous connecter.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `/api/candidats/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Réponse API:", response.data);
        if (response.data.success && response.data.data) {
          setCandidat(response.data.data);
        } else {
          setError(response.data.message || "Candidat introuvable.");
        }
      } catch (error) {
        console.error("Erreur chargement profil :", error);
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidat();
    }
  }, [id]);

  // Fonction pour gérer les erreurs de chargement du CV
  const handleCvError = () => {
    setCvError("Erreur lors du chargement du CV");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <p className="text-[#4C4C4C]">Chargement...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !candidat) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <p className="text-[#4C4C4C]">{error || "Candidat introuvable."}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl w-full mt-10 sm:mt-20 md:mt-32 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-6 sm:gap-8 lg:gap-12">
            {/* Section gauche : Photo, CV et Vidéo */}
            <div className=" max-w-[400px] flex flex-col items-center bg-white rounded-[20px] p-10 space-y-6">
              {/* Photo de profil */}
              <div className="w-20 h-20 sm:w-28 sm:h-40 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/user.png"
                  alt="profil"
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </div>
              {/* Nom et prénom */}
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                {candidat.firstName} {candidat.lastName}
              </h2>
              
              {/* Vidéo */}
              <div className="w-full h-48 sm:h-64 rounded-[15px] relative overflow-hidden">
                {candidat.videoUrl ? (
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={candidat.videoUrl}
                  >
                    Votre navigateur ne prend pas en charge la vidéo.
                  </video>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[#616161]">
                    Aucune vidéo disponible
                  </div>
                )}
              </div>
            </div>

            {/* Section droite : Informations */}
            <div className="bg-white p-10 rounded-[15px] space-y-6">
              {/* Informations personnelles */}
              <div>
                <div className="space-y-1 pb-10">
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">Coordonnées</h3>
                    <p className="text-[#4C4C4C] py-2">
                      {candidat.alternanceSearch?.sector || "Non spécifié"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">Localisation</h3>
                    <p className="text-[#4C4C4C] py-2">
                      {candidat.alternanceSearch?.location || "Non spécifié"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">Niveau d`étude</h3>
                    <p className="text-[#4C4C4C] py-2">
                      {candidat.alternanceSearch?.level || "Non spécifié"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[18px]">Type de contrat</h3>
                    <p className="text-[#4C4C4C] py-2">
                      {candidat.alternanceSearch?.contracttype || "Non spécifié"}
                    </p>
                  </div>
                </div>

                {/* Section CV */}
                <div className="mb-8">
                  <h3 className="text-[#202020] text-[24px] sm:text-xl font-bold mb-4">
                    CV du Candidat
                  </h3>
                  {candidat.cvUrl ? (
                    <div className="w-full">
                      {cvError ? (
                        <div className="w-full h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
                          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-center">Erreur lors du chargement du CV</p>
                          <a
                            href={candidat.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-500 hover:text-blue-700 underline"
                          >
                            Télécharger le CV
                          </a>
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden shadow-sm">
                          <iframe
                            src={candidat.cvUrl}
                            className="w-full h-[600px]"
                            title="CV du candidat"
                            onError={handleCvError}
                          />
                          <div className="bg-gray-50 p-3 flex justify-between items-center border-t">
                            <span className="text-sm text-gray-600">CV du candidat</span>
                            <a
                              href={candidat.cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Télécharger
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
                      <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-center">Aucun CV disponible</p>
                    </div>
                  )}
                </div>

                {/* Compétences */}
                <h3 className="text-[#202020] text-[24px] sm:text-xl font-bold mb-2">
                  Compétences
                </h3>
                <div className="flex mt-8 flex-wrap gap-2 text-sm sm:text-base text-[#7A20DA]">
                  {candidat.skills && candidat.skills.length > 0 ? (
                    candidat.skills.map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">
                        {skill}
                      </span>
                    ))
                  ) : (
                    // Compétences par défaut si aucune n'est définie
                    <>
                      <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">HTML</span>
                      <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">CSS</span>
                      <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">React</span>
                      <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">SQL</span>
                      <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">UX</span>
                      <span className="px-2 py-1 bg-[#F4E9FF] font-bold rounded">JavaScript</span>
                    </>
                  )}
                </div>
              </div>

              {/* Expérience Professionnelle */}
              <div>
                <h3 className="text-[#202020] text-lg sm:text-xl font-semibold mb-2">
                  Expérience Professionnelle
                </h3>
          
              </div>

              {/* Informations de Contact */}
              <div className="py-6">
                <h3 className="text-[#202020] text-lg sm:text-xl font-bold mb-2">
                  Informations de Contact
                </h3>
                <div className="space-y-4 py-5">
                  <div className="flex items-center">
                    <strong className="text-gray-600 text-sm sm:text-base w-[120px]">
                      Email :
                    </strong>
                    <a
                      href={`mailto:${candidat.email}`}
                      className="text-[#008CFF] underline text-sm sm:text-base"
                    >
                      {candidat.email || "Non spécifié"}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <strong className="text-gray-600 text-sm sm:text-base w-[120px]">
                      Localisation :
                    </strong>
                    <p className="text-[#4C4C4C] py-2">
                      {candidat.alternanceSearch?.location || "Non spécifié"}
                    </p>
                  </div>
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