'use client';

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { ICandidat } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"profile" | "tracking">("profile");
  // const [candidatures, setCandidatures] = useState([]);
  const router = useRouter()
  interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }

  const [profile, setProfile] = useState<ICandidat | null>(null);

  // useEffect(() => {
  //   const fetchCandidatures = async () => {
  //     try {
  //       const res = await fetch("/api/candidatures");
  //       const data = await res.json();
  //       setCandidatures(data);
  //     } catch (err) {
  //       console.error("Erreur lors du chargement :", err);
  //     }
  //   };

  //   fetchCandidatures();
  // }, []);

  useEffect(() => {
    const fetchInformations = async () => {
      const token = Cookies.get('token');
      if (!token) {
        router.push("/auth/login")
        return;
      }
      try {
        const res = await fetch('/api/candidats/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        const data = await res.json();
        setProfile(data.candidat);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      }
    };

    fetchInformations();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl py-10 sm:py-20 w-full mt-10 sm:mt-20">
          {/* Tabs (au-dessus de la première section blanche) */}
          <div className="bg-white/15">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                className={`px-4 sm:px-10 py-2 sm:py-4 text-base sm:text-[20px] font-extrabold ${activeTab === "profile"
                    ? "bg-white/15 text-white font-extrabold"
                    : "text-white"
                  }`}
                onClick={() => setActiveTab("profile")}
              >
                Mon profil
              </button>
              <button
                className={`px-4 sm:px-6 py-2 sm:py-2 font-extrabold text-base sm:text-[20px] ${activeTab === "tracking"
                    ? "bg-white/15 text-white font-extrabold"
                    : "text-white"
                  }`}
                onClick={() => setActiveTab("tracking")}
              >
                Suivi de l’état de la candidature
              </button>
            </div>
          </div>

          {/* Première section : Photo, nom, icône */}
          <div className="bg-white rounded-[20px] shadow-lg p-4 sm:p-6 md:p-8 mt-2 sm:mt-0">
            {activeTab === "profile" ? (
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#7A20DA] text-white flex items-center justify-center rounded-full mr-4">
                    mD
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-[30px] font-bold">Bonjour, {profile?.firstName}</h2>
                    <h2 className="text-lg sm:text-xl font-sans">Villescres</h2>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 mt-2 sm:mt-0">
                  <svg
                    width="25"
                    height="25"
                    className="sm:w-[35px] sm:h-[35px]"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_63_2714)">
                      <path
                        d="M46.5905 7.44979L40.5438 1.35719C40.1132 0.924994 39.6011 0.582506 39.0373 0.349543C38.4734 0.11658 37.8689 -0.00221968 37.2589 2.47574e-06C36.6489 -0.0023045 36.0446 0.116393 35.4809 0.349223C34.9172 0.582053 34.4052 0.924387 33.9747 1.35641L4.29448 31.0296C4.14808 31.1767 4.04322 31.3599 3.99055 31.5606L0.0923061 46.5402C0.0474052 46.7126 0.0426373 46.8931 0.078334 47.0676C0.114031 47.2422 0.18925 47.4062 0.298235 47.5472C0.40722 47.6882 0.547051 47.8023 0.707009 47.8808C0.866967 47.9593 1.04279 48.0001 1.22096 48C1.32281 48.0003 1.42424 47.9869 1.52256 47.9603L16.4113 43.9712C16.6093 43.9184 16.7899 43.8141 16.9344 43.6688L46.5874 14.0166C47.4558 13.1447 47.9437 11.9645 47.9445 10.734C47.9452 9.50343 47.4587 8.32266 46.5913 7.44979H46.5905ZM30.0594 8.56369L33.89 12.3943L10.597 35.6873L6.76401 31.8544L30.0594 8.56369ZM5.60114 44.4523L3.57001 42.4212L5.73095 34.1187L13.8539 42.2409L5.60114 44.4523ZM16.1058 41.1962L12.2456 37.336L35.5387 14.043L39.3988 17.9031L16.1058 41.1962ZM44.9348 12.3671L41.0483 16.2537L31.7096 6.91421L35.6203 3.00432C35.8345 2.78991 36.089 2.62004 36.3691 2.5045C36.6493 2.38896 36.9496 2.33006 37.2526 2.33117C37.5555 2.32967 37.8558 2.38818 38.1359 2.50331C38.4161 2.61845 38.6707 2.78794 38.885 3.00199L44.9325 9.09459C45.364 9.52973 45.606 10.1177 45.606 10.7304C45.606 11.3432 45.364 11.9312 44.9325 12.3663L44.9348 12.3671Z"
                        fill="#0C2C67"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_63_2714">
                        <rect width="48" height="48" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="space-y-6">
                  {/* Candidature 1 */}
                  <div className="bg-white border border-[#7A20DA] rounded-[10px] p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Data Analyste</h3>
                      <p className="text-gray-700">Optimus Private</p>
                      <p className="text-gray-700">Paris, 75001B</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">02/05/2025</span>
                      <div className="flex space-x-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="6" fill="#7A20DA" />
                          <path d="M12 8V12L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#7A20DA" strokeWidth="2" />
                          <path d="M12 4V8" stroke="#7A20DA" strokeWidth="2" />
                        </svg>
                      </div>
                      <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[5px]">
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Candidature 2 */}
                  <div className="bg-white border border-[#7A20DA] rounded-[10px] p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Chef projet Data Analyste</h3>
                      <p className="text-gray-700">Random SA</p>
                      <p className="text-gray-700">Caen, xxxxxx</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">02/05/2025</span>
                      <div className="flex space-x-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="6" fill="#7A20DA" />
                          <path d="M12 8V12L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="#00CC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[5px]">
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Candidature 3 */}
                  <div className="bg-white border border-[#7A20DA] rounded-[10px] p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Chef projet Data Analyste</h3>
                      <p className="text-gray-700">Random SA</p>
                      <p className="text-gray-700">Caen, xxxxxx</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">02/05/2025</span>
                      <div className="flex space-x-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="6" fill="#7A20DA" />
                          <path d="M12 8V12L14 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6L18 18" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" />
                          <path d="M18 6L6 18" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <button className="bg-[#7A20DA] text-white px-4 py-2 rounded-[5px]">
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Bouton Voir toutes mes candidatures */}
                  <button className="w-full bg-[#7A20DA] text-white px-4 py-2 rounded-[5px]">
                    Voir toutes mes candidatures
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Deuxième section : Coordonnées, Lieu, Documents */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-[20px] shadow-lg p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
              {/* Coordonnées et Lieu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="border border-[#C4C4C4] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg text-[#202020] font-medium">Coordonnées</h3>
                    <button className="text-gray-500 hover:text-gray-700">
                      <svg
                        width="20"
                        height="20"
                        className="sm:w-[30px] sm:h-[30px]"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_63_2714)">
                          <path
                            d="M46.5905 7.44979L40.5438 1.35719C40.1132 0.924994 39.6011 0.582506 39.0373 0.349543C38.4734 0.11658 37.8689 -0.00221968 37.2589 2.47574e-06C36.6489 -0.0023045 36.0446 0.116393 35.4809 0.349223C34.9172 0.582053 34.4052 0.924387 33.9747 1.35641L4.29448 31.0296C4.14808 31.1767 4.04322 31.3599 3.99055 31.5606L0.0923061 46.5402C0.0474052 46.7126 0.0426373 46.8931 0.078334 47.0676C0.114031 47.2422 0.18925 47.4062 0.298235 47.5472C0.40722 47.6882 0.547051 47.8023 0.707009 47.8808C0.866967 47.9593 1.04279 48.0001 1.22096 48C1.32281 48.0003 1.42424 47.9869 1.52256 47.9603L16.4113 43.9712C16.6093 43.9184 16.7899 43.8141 16.9344 43.6688L46.5874 14.0166C47.4558 13.1447 47.9437 11.9645 47.9445 10.734C47.9452 9.50343 47.4587 8.32266 46.5913 7.44979H46.5905ZM30.0594 8.56369L33.89 12.3943L10.597 35.6873L6.76401 31.8544L30.0594 8.56369ZM5.60114 44.4523L3.57001 42.4212L5.73095 34.1187L13.8539 42.2409L5.60114 44.4523ZM16.1058 41.1962L12.2456 37.336L35.5387 14.043L39.3988 17.9031L16.1058 41.1962ZM44.9348 12.3671L41.0483 16.2537L31.7096 6.91421L35.6203 3.00432C35.8345 2.78991 36.089 2.62004 36.3691 2.5045C36.6493 2.38896 36.9496 2.33006 37.2526 2.33117C37.5555 2.32967 37.8558 2.38818 38.1359 2.50331C38.4161 2.61845 38.6707 2.78794 38.885 3.00199L44.9325 9.09459C45.364 9.52973 45.606 10.1177 45.606 10.7304C45.606 11.3432 45.364 11.9312 44.9325 12.3663L44.9348 12.3671Z"
                            fill="#0C2C67"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_63_2714">
                            <rect width="48" height="48" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-700">{profile?.firstName} {profile?.lastName}</p>
                    <p className="text-gray-700">{profile?.email}</p>
                    <p className="text-gray-700">{profile?.phone}</p>
                  </div>
                </div>
                <div className="border border-[#C4C4C4] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg text-[#202020] font-medium">Lieu</h3>
                    <button className="text-gray-500 hover:text-gray-700">
                      <svg
                        width="20"
                        height="20"
                        className="sm:w-[30px] sm:h-[30px]"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_63_2714)">
                          <path
                            d="M46.5905 7.44979L40.5438 1.35719C40.1132 0.924994 39.6011 0.582506 39.0373 0.349543C38.4734 0.11658 37.8689 -0.00221968 37.2589 2.47574e-06C36.6489 -0.0023045 36.0446 0.116393 35.4809 0.349223C34.9172 0.582053 34.4052 0.924387 33.9747 1.35641L4.29448 31.0296C4.14808 31.1767 4.04322 31.3599 3.99055 31.5606L0.0923061 46.5402C0.0474052 46.7126 0.0426373 46.8931 0.078334 47.0676C0.114031 47.2422 0.18925 47.4062 0.298235 47.5472C0.40722 47.6882 0.547051 47.8023 0.707009 47.8808C0.866967 47.9593 1.04279 48.0001 1.22096 48C1.32281 48.0003 1.42424 47.9869 1.52256 47.9603L16.4113 43.9712C16.6093 43.9184 16.7899 43.8141 16.9344 43.6688L46.5874 14.0166C47.4558 13.1447 47.9437 11.9645 47.9445 10.734C47.9452 9.50343 47.4587 8.32266 46.5913 7.44979H46.5905ZM30.0594 8.56369L33.89 12.3943L10.597 35.6873L6.76401 31.8544L30.0594 8.56369ZM5.60114 44.4523L3.57001 42.4212L5.73095 34.1187L13.8539 42.2409L5.60114 44.4523ZM16.1058 41.1962L12.2456 37.336L35.5387 14.043L39.3988 17.9031L16.1058 41.1962ZM44.9348 12.3671L41.0483 16.2537L31.7096 6.91421L35.6203 3.00432C35.8345 2.78991 36.089 2.62004 36.3691 2.5045C36.6493 2.38896 36.9496 2.33006 37.2526 2.33117C37.5555 2.32967 37.8558 2.38818 38.1359 2.50331C38.4161 2.61845 38.6707 2.78794 38.885 3.00199L44.9325 9.09459C45.364 9.52973 45.606 10.1177 45.606 10.7304C45.606 11.3432 45.364 11.9312 44.9325 12.3663L44.9348 12.3671Z"
                            fill="#0C2C67"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_63_2714">
                            <rect width="48" height="48" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-700">{profile?.alternanceSearch?.sector}</p>
                    <p className="text-gray-700">{profile?.alternanceSearch?.location}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mt-4 sm:mt-6 border border-[#C4C4C4] p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Mes documents</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                    <span>CV</span>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button className="bg-[#7A20DA] cursor-pointer border border-[#7A20DA] text-white px-4 sm:px-6 py-2 rounded-[5px]">
                        Télécharger
                      </button>
                      <button className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]">
                        Modifier
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                    <span>Lettre de motivation</span>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button className="bg-[#7A20DA] border cursor-pointer border-[#7A20DA] text-white px-4 sm:px-6 py-2 rounded-[5px]">
                        Télécharger
                      </button>
                      <button className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]">
                        Modifier
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                    <span>Pièces jointes</span>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <button className="bg-[#7A20DA] cursor-pointer border border-[#7A20DA] text-white px-4 sm:px-6 py-2 rounded-[5px]">
                        Télécharger
                      </button>
                      <button className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]">
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-[#7A20DA] font-bold text-white px-4 py-2 rounded-[5px] mt-4 sm:mt-6">
                  Ajouter un document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}