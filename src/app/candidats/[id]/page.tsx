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
  const [downloadError, setDownloadError] = useState<string | null>(null);

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

        const response = await axios.get(`/api/candidats/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  // Fonction pour gérer le téléchargement du CV
  const handleDownloadCv = async () => {
    if (!candidat?.cvUrl) {
      setDownloadError("Aucun CV disponible pour téléchargement.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.get(candidat.cvUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // Important pour télécharger un fichier binaire
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CV_${candidat.firstName}_${candidat.lastName}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadError(null);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
      setDownloadError("Erreur lors du téléchargement du CV. Veuillez vérifier l'URL ou contactez le support.");
    }
  };

  // Fonction pour gérer les erreurs d'affichage du CV
  const handleCvError = () => {
    setError("Erreur lors du chargement du CV dans l'iframe.");
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
            <div className="max-w-[400px] flex flex-col items-center bg-white rounded-[20px] p-4 sm:p-6 md:p-10 space-y-4">
              {/* Photo de profil */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/user.png"
                  alt="profil"
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </div>
              {/* Nom et prénom */}
              <h2 className="text-lg sm:text-xl text-left font-semibold text-gray-800">
                {candidat.lastName}
              </h2>
              <h2 className="text-lg sm:text-xl text-left text-gray-700">
                {candidat.firstName}
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
            <div className="bg-white p-4 sm:p-6 md:p-10 rounded-[15px] space-y-6">
              {/* Informations personnelles */}
              <div>
                <div className="space-y-2 sm:space-y-4 pb-6 sm:pb-10">
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[16px] sm:text-[18px]">Coordonnées</h3>
                    <p className="text-[#4C4C4C] py-1 sm:py-2">
                      {candidat.alternanceSearch?.sector || "Non spécifié"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[16px] sm:text-[18px]">Localisation</h3>
                    <p className="text-[#4C4C4C] py-1 sm:py-2">
                      {candidat.alternanceSearch?.location || "Non spécifié"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[16px] sm:text-[18px]">Niveau d`étude</h3>
                    <p className="text-[#4C4C4C] py-1 sm:py-2">
                      {candidat.alternanceSearch?.level || "Non spécifié"}
                    </p>
                  </div>
                  <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
                    <h3 className="text-[#4E4E4E] text-[16px] sm:text-[18px]">Type de contrat</h3>
                    <p className="text-[#4C4C4C] py-1 sm:py-2">
                      {candidat.alternanceSearch?.contracttype || "Non spécifié"}
                    </p>
                  </div>
                </div>

                {/* Section CV */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-[#202020] text-[20px] sm:text-[24px] font-bold mb-2">
                    Compétences
                  </h3>
                  {candidat.cvUrl ? (
                    <>
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                          candidat.cvUrl
                        )}&embedded=true`}
                        className="w-full h-[400px] sm:h-[600px]"
                        title="CV du candidat"
                        onError={handleCvError}
                      />
                      <div className="bg-gray-50 p-2 sm:p-3 flex justify-between items-center border-t mt-2">
                        <span className="text-sm text-gray-600">CV du candidat</span>
                        <button
                          onClick={handleDownloadCv}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Télécharger
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-[#616161]">Aucun CV disponible</p>
                  )}
                  {downloadError && <p className="text-red-500 text-sm mt-2">{downloadError}</p>}
                </div>
              </div>

              {/* Informations de Contact */}
              <div className="py-4 sm:py-6">
                <h3 className="text-[#202020] text-[18px] sm:text-[20px] font-bold mb-2">
                  Informations de Contact
                </h3>
                <div className="space-y-2 sm:space-y-4 py-2 sm:py-5">
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
                    <p className="text-[#4C4C4C] py-1 sm:py-2">
                      {candidat.alternanceSearch?.location || "Non spécifié"}
                    </p>
                  </div>
                </div>
              </div>
              <a
              onClick={handleDownloadCv}
                 
                 href=""
                  rel="noopener noreferrer"
                  className="bg-[#7A20DA] text-white px-8 py-2 rounded-[5px] hover:bg-[#6A1AB8] transition duration-200 inline-block text-center w-full sm:w-auto"
                >
                  Télécharger le CV (PDF)
                </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}