"use client";

import { ICandidat } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Candidature() {

  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await fetch("/api/candidats/allCandidats"); // Remplace cette URL par celle de ton API
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        const data = await response.json();
        console.log(data.data.candidats); // Pour vérifier la structure des données

        setCandidatures(data.data.candidats); // Assurez-vous que data.candidats est un tableau
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, []);

  const router = useRouter();

  const viewProfile = (candidatId: string) => {
    router.push(`/employeur/candidats/${candidatId}`);
  };
  return (
    <>


      {/* Contenu principal */}

      <div className="max-w-7xl w-full">

        {/* Filtres */}
        <div className="rounded-[15px] bg-white p-10">
          <div className="flex items-center gap-4">
            <svg
              width="27"
              height="36"
              viewBox="0 0 37 46"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.7812 0H10.0539L5.97353 4.49434H0V43.125C0 44.7062 1.29375 46 2.875 46H33.7812C35.3625 46 36.6562 44.7062 36.6562 43.125V2.875C36.6562 1.29375 35.3625 0 33.7812 0ZM25.6055 15.9433V20.0675H18.4977L21.9664 12.5472C21.9672 12.5472 25.6055 12.5961 25.6055 15.9433ZM18.3281 17.7093L16.1625 12.9159H18.3281H20.4937L18.3281 17.7093ZM18.3281 4.5425C20.3112 4.5425 21.9183 6.14962 21.9183 8.13266C21.9183 10.1157 20.3112 11.7228 18.3281 11.7228C16.3451 11.7228 14.738 10.1157 14.738 8.13266C14.738 6.14962 16.3451 4.5425 18.3281 4.5425ZM11.0508 15.9433C11.0508 12.5954 14.6898 12.5472 14.6898 12.5472L18.1585 20.0675C18.1341 20.0675 11.0508 20.0675 11.0508 20.0675C11.0508 20.0675 11.0508 19.2913 11.0508 15.9433ZM14.4196 36.1179L10.2673 41.1635L9.27475 42.3696L8.15494 41.2807L5.77875 38.9699L4.77537 37.9946L5.72341 36.9653L6.62544 35.9864L7.62594 34.9003L8.68466 35.9303L8.93334 36.1718L11.1967 33.4212L12.1347 32.2812L13.2494 33.2494L14.2514 34.1198L15.3079 35.0376L14.4196 36.1179ZM14.4196 26.9826L10.2673 32.0282L9.27475 33.2343L8.15494 32.1454L5.77875 29.8339L4.77537 28.8585L5.72341 27.8293L6.62544 26.8503L7.62594 25.7643L8.68466 26.7943L8.93334 27.0358L11.1967 24.2851L12.1347 23.1452L13.2494 24.1133L14.2514 24.9837L15.3079 25.9016L14.4196 26.9826ZM30.8782 39.266H17.6453V37.8285H30.8782V39.266ZM30.8782 36.7447H17.6453V35.3072H30.8782V36.7447ZM30.8782 30.1307H17.6453V28.6932H30.8782V30.1307ZM30.8782 27.6093H17.6453V26.1718H30.8782V27.6093Z"
                fill="#7A20DA"
              />
              <path
                d="M9.05178 29.1551L7.68328 27.8239L6.78125 28.8029L9.15744 31.1144L13.3097 26.0687L12.3077 25.1983L9.05178 29.1551Z"
                fill="#7A20DA"
              />
              <path
                d="M9.05178 38.2906L7.68328 36.9595L6.78125 37.9384L9.15744 40.2499L13.3097 35.2043L12.3077 34.3339L9.05178 38.2906Z"
                fill="#7A20DA"
              />
              <path
                d="M13.8367 14.1304C13.1934 14.3338 12.4883 14.8147 12.4883 15.9438V18.6305H15.9124L13.8367 14.1304Z"
                fill="#7A20DA"
              />
              <path
                d="M24.1683 18.6298V15.9431C24.1683 14.8139 23.4632 14.3331 22.8199 14.1297L20.7441 18.6291L24.1683 18.6298Z"
                fill="#7A20DA"
              />
              <path
                d="M18.3265 10.2856C19.5154 10.2856 20.4791 9.32185 20.4791 8.13297C20.4791 6.94409 19.5154 5.98032 18.3265 5.98032C17.1376 5.98032 16.1738 6.94409 16.1738 8.13297C16.1738 9.32185 17.1376 10.2856 18.3265 10.2856Z"
                fill="#7A20DA"
              />
            </svg>

            <h1 className="text-2xl font-bold text-[#8929E0]">
              Gestion des Candidatures
            </h1>
          </div>
          <div className="border-[1px] my-4 border-[#8929E0]"></div>
          <div className="bg-white  rounded-[20px] py-2 px-6 shadow-md border-[1px] border-[#C4C4C4]  mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <h3 className="text-[#4E4E4E] font-semibold">Status</h3>
              <select
                defaultValue=""
                className="p-2 pr-6 border border-[#F1F1F1] text-[#4C4C4C] rounded-[15px] w-full sm:w-[300px]"
              >
                <option value="">Tous</option>
              </select>
              <h3 className="text-[#4E4E4E] font-semibold">Secteur</h3>
              <select className="p-2 border border-[#F1F1F1] text-[#4C4C4C] rounded-[15px] w-full sm:w-[300px]">
                <option value="">Tous</option>
              </select>
              <div className="flex items-center w-full sm:w-auto space-x-2">
                <input
                  type="text"
                  placeholder="Recherche par..."
                  className="p-2 border border-[#F1F1F1] rounded-[15px] w-full sm:w-[300px]"
                />
                <button className="">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 153 53"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="153" height="53" rx="5" fill="#7A20DA" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M81.0277 31.7095C82.6485 29.8944 83.4335 27.5903 83.2214 25.2712C83.0092 22.952 81.816 20.794 79.8871 19.2409C77.9582 17.6879 75.4402 16.8578 72.8509 16.9214C70.2617 16.985 67.7979 17.9374 65.9663 19.5828C64.1348 21.2283 63.0746 23.4416 63.0038 25.7677C62.933 28.0939 63.857 30.3559 65.5858 32.0888C67.3145 33.8217 69.7167 34.8936 72.2982 35.0842C74.8797 35.2748 77.4444 34.5696 79.4649 33.1135L89.1011 41.7694C89.203 41.8642 89.3249 41.9397 89.4596 41.9917C89.5944 42.0437 89.7393 42.0711 89.886 42.0723C90.0326 42.0734 90.178 42.0483 90.3138 41.9984C90.4495 41.9485 90.5728 41.8748 90.6765 41.7817C90.7802 41.6885 90.8622 41.5777 90.9178 41.4558C90.9733 41.3339 91.0012 41.2032 91 41.0715C90.9987 40.9397 90.9682 40.8095 90.9103 40.6885C90.8524 40.5674 90.7683 40.458 90.6628 40.3664L81.0277 31.7095ZM73.131 33.1304C71.5654 33.1304 70.035 32.7133 68.7333 31.9319C67.4316 31.1506 66.4171 30.04 65.818 28.7406C65.2189 27.4412 65.0621 26.0114 65.3676 24.632C65.673 23.2526 66.4269 21.9855 67.5339 20.991C68.6409 19.9965 70.0513 19.3193 71.5867 19.0449C73.1222 18.7705 74.7137 18.9113 76.1601 19.4496C77.6065 19.9878 78.8427 20.8992 79.7125 22.0686C80.5822 23.238 81.0465 24.6129 81.0465 26.0193C81.0456 27.905 80.2114 29.7133 78.7271 31.0467C77.2429 32.3801 75.23 33.1296 73.131 33.1304Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tableau */}
          {loading && <p className="text-center text-gray-500">Chargement...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && candidatures.length > 0 && (
            <div className="bg-white p-4 rounded-[20px] border-[1px] border-[#C4C4C4] shadow-md">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-6 px-6">Nom</th>
                    <th className="py-6 px-6">Secteur</th>
                    <th className="py-6 px-6">Date de soumission</th>
                    <th className="py-6 px-6">Statut</th>
                    <th className="py-6 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.map((candidature: ICandidat) => (
                    <tr key={candidature._id.toString()} className="border-b text-[#4C4C4C] border-gray-200 odd:bg-white even:bg-[#F6F6F6]">
                      <td className="py-6 px-6">A. {candidature.firstName}</td>
                      <td className="py-6 px-6">{candidature.alternanceSearch?.sector}</td>
                      <td className="py-6 px-6">{candidature.createdAt ? new Date(candidature.createdAt).toLocaleDateString() : "Date non disponible"}</td>
                      <td className="py-6 px-6">En cours</td>
                      <td className="py-6 px-6 flex space-x-2">
                        <button onClick={() => viewProfile(candidature._id.toString())} className="bg-[#7A20DA] flex font-bold text-white px-4 items-center gap-2 py-1 rounded-[5px]">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5C21.27 8.11 17 4.5 12 4.5zm0 12a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-7a2.5 2.5 0 1 0 .001 5.001A2.5 2.5 0 0 0 12 9.5z" />
                          </svg>
                          Voir
                        </button>
                        <button className="bg-[#FF0000] text-white flex font-bold px-4 items-center gap-2 py-1 rounded-[5px]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_63_3710)">
                              <path
                                d="M19.1667 2.5H14.7675L14.685 2.25418C14.2358 0.90582 12.9792 0 11.5583 0H8.44164C7.02082 0 5.76414 0.90582 5.31414 2.25418L5.2325 2.5H0.83332C0.3725 2.5 0 2.87332 0 3.33332C0 3.79332 0.3725 4.16664 0.83332 4.16664H5.83332H14.1666H19.1666C19.6275 4.16664 20 3.79332 20 3.33332C20 2.87332 19.6275 2.5 19.1667 2.5ZM7.02 2.5C7.30418 1.99168 7.84332 1.66668 8.44168 1.66668H11.5584C12.1567 1.66668 12.6967 1.99168 12.98 2.5H7.02Z"
                                fill="white"
                              />
                              <path
                                d="M17.4995 5H2.49945C2.26945 5 2.04945 5.095 1.89195 5.2625C1.73445 5.43082 1.65277 5.65582 1.66777 5.885L2.40363 17.65C2.48445 18.9683 3.58363 20 4.90363 20H15.0953C16.4153 20 17.5145 18.9683 17.5953 17.6508L18.3311 5.885C18.3461 5.65582 18.2645 5.43082 18.107 5.2625C17.9495 5.095 17.7295 5 17.4995 5ZM14.1661 16.6667H5.83281C5.37199 16.6667 4.99949 16.2934 4.99949 15.8334C4.99949 15.3734 5.37195 15 5.83281 15H14.1661C14.627 15 14.9995 15.3733 14.9995 15.8333C14.9995 16.2933 14.627 16.6667 14.1661 16.6667ZM14.1661 13.3333H5.83281C5.37199 13.3333 4.99949 12.96 4.99949 12.5C4.99949 12.04 5.37199 11.6667 5.83281 11.6667H14.1661C14.627 11.6667 14.9995 12.04 14.9995 12.5C14.9995 12.96 14.627 13.3333 14.1661 13.3333Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_63_3710">
                                <rect width="20" height="20" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}

          {!loading && candidatures.length === 0 && (
            <p className="text-center text-gray-500">Aucune candidature trouvée.</p>
          )}
          {!loading && candidatures.length > 0 && (
            <button className="bg-[#7A20DA] text-white py-2 px-10 mt-10 font-semibold rounded-[5px] " >Voir plus de candidatures</button>
          )}
        </div>
      </div>

    </>
  );
}
