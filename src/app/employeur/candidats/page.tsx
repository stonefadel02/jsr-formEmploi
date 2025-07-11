"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { ICandidat } from "@/lib/types";

// Interface pour les données des candidats
interface ApiResponse {
  success: boolean;
  data: {
    candidats: ICandidat[];
    total: number;
  };
  message?: string;
}

// Interface pour les options des filtres
interface FilterOptions {
  sectors: string[];
  locations: string[];
  levels: string[];
  contractTypes: string[];
  formations: string[];
}

interface FilterApiResponse {
  success: boolean;
  data: FilterOptions;
  message?: string;
}

export default function ProfileEmployeur() {
  const router = useRouter();
  const [candidats, setCandidats] = useState<ICandidat[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour les options des filtres
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sectors: [],
    locations: [],
    levels: [],
    contractTypes: [],
    formations: [],
  });

  // États pour les filtres et la pagination
  const [filters, setFilters] = useState({
    keyword: "",
    sector: "",
    date: "",
    formation: "",
    location: "",
    level: "",
    contracttype: "",
    sortBy: "date" as "date" | "relevance" | "location",
    page: 1,
    limit: 10,
  });

  // Récupérer les options des filtres
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get<FilterApiResponse>("/api/candidats/filters");
      if (response.data.success) {
        setFilterOptions(response.data.data);
      } else {
        console.error("Erreur récupération options filtres:", response.data.message);
      }
    } catch (err) {
      console.error("Erreur fetchFilterOptions:", err);
    }
  };

  // Récupérer les candidats via l'API
  const fetchCandidats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await axios.get<ApiResponse>("/api/candidats/allCandidats", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          keyword: filters.keyword || undefined,
          sector: filters.sector || undefined,
          location: filters.location || undefined,
          level: filters.level || undefined,
          date: filters.date || undefined,
          formation: filters.formation || undefined,

          contracttype: filters.contracttype || undefined,
          sortBy: filters.sortBy,
          page: filters.page,
          limit: filters.limit,
        },
      });

      if (response.data.success) {
        setCandidats(response.data.data.candidats);
        setTotal(response.data.data.total);
      } else {
        setError(response.data.message || "Erreur lors de la récupération des candidats.");
      }
    } catch (err) {
      setError("Erreur serveur. Veuillez réessayer plus tard.");
      console.error("Erreur fetchCandidats:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  // Appeler les APIs au chargement
  useEffect(() => {
    fetchFilterOptions();
    fetchCandidats();
  }, [fetchCandidats]);

  // Gérer les changements des filtres
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Réinitialiser la page lors d'un changement de filtre
    }));
  };

  // Gérer le changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(total / filters.limit)) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // Gérer le passage à la page suivante
  const handleNextPage = () => {
    const nextPage = filters.page + 1;
    if (nextPage <= Math.ceil(total / filters.limit)) {
      handlePageChange(nextPage);
    }
  };

  // Gérer le passage à la page précédente
  const handlePrevPage = () => {
    const prevPage = filters.page - 1;
    if (prevPage > 0) {
      handlePageChange(prevPage);
    }
  };

  // Anonymiser le nom
  const anonymizeName = (firstName: string) => {
    return `C-${firstName.charAt(0)}--------`;
  };

  // Formater la date
  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Rediriger vers le profil du candidat
  const viewProfile = (candidatId: string) => {
    router.push(`/candidats/${candidatId}`);
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-red-500">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex mt-10 items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-7xl">
          {/* Section de recherche */}
          <div className="bg-white rounded-[20px] mt-10 border border-[#C4C4C4] shadow-md p-6 mb-6">
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Recherche par mots-clés..................."
              className="w-full border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A20DA]"
            />
          </div>

          {/* Filtres et Tri */}
          <div className="bg-white rounded-[20px] border border-[#C4C4C4] shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <select
                name="sector"
                value={filters.sector}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A20DA]"
              >
                <option value="">Secteur</option>
                {filterOptions.sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A20DA]"
              >
                <option value="">Localisation</option>
                {filterOptions.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <select
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A20DA]"
              >
                <option value="">Niveau d`étude</option>
                {filterOptions.levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <select
                name="contracttype"
                value={filters.contracttype}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A20DA]"
              >
                <option value="">Type de contrat</option>
                {filterOptions.contractTypes.map((contractType) => (
                  <option key={contractType} value={contractType}>
                    {contractType}
                  </option>
                ))}
              </select>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-[5px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7A20DA]"
              >
                <option value="date">Trier par ecole</option>
              
              </select>
            </div>
          </div>

          {/* Table des candidats */}
          <div className="bg-white rounded-[20px] px-10 border border-[#C4C4C4] shadow-md overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-6 text-sm font-semibold text-left text-[#202020]">
                    Nom (anonymisé)
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">
                    Secteur
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">
                    Localisation
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">
                    Niveau d`étude
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">
                    Date de naissance
                  </th>
                    <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">
                    Formation
                  </th>
                    <th className="px-6 py-3 text-sm font-semibold text-start text-[#202020]">
                    Date de soumission
                  </th>
                  <th className="px-6 py-3 text-sm font-semibold text-end text-[#202020]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[#4C4C4C]">
                      Chargement...
                    </td>
                  </tr>
                ) : candidats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[#4C4C4C]">
                      Aucun candidat trouvé.
                    </td>
                  </tr>
                ) : (
                  candidats.map((candidat) => (
                    <tr
                      key={candidat._id.toString()}
                      className="border-t border-[#C4C4C4]"
                    >
                      <td className="px-6 py-4 text-[#4C4C4C]">
                        {anonymizeName(candidat.firstName ?? "Candidat")}
                      </td>
                      <td className="px-6 text-start py-4 text-[#4C4C4C]">
                        {candidat?.alternanceSearch?.sector || "N/A"}
                      </td>
                      <td className="px-6 text-start py-4 text-[#4C4C4C]">
                        {candidat?.alternanceSearch?.location || "N/A"}
                      </td>
                      <td className="px-6 text-start py-4 text-[#4C4C4C]">
                        {candidat?.alternanceSearch?.level || "N/A"}
                      </td>
                      <td className="px-6 text-start py-4 text-[#4C4C4C]">
                        {formatDate(candidat?.alternanceSearch?.date ?? new Date())}
                      </td>
                       <td className="px-6 text-start py-4 text-[#4C4C4C]">
                        {candidat?.formation ?? "N/A"}
                      </td>
                      <td className="px-6 text-start py-4 text-[#4C4C4C]">
                        {formatDate(candidat.createdAt ?? new Date())}
                      </td>
                      <td className="px-6 text-end py-4">
                        <button
                          onClick={() => viewProfile(candidat._id.toString())}
                          className="bg-[#7A20DA] text-white px-4 py-2 rounded-[5px] cursor-pointer hover:bg-[#6A1AB8] transition duration-200"
                        >
                          Voir le profil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={filters.page === 1}
              className="px-3 py-1 text-sm font-medium rounded transition duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <nav className="flex space-x-2">
              {Array.from(
                { length: Math.ceil(total / filters.limit) },
                (_, i) => i + 1
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm font-medium rounded transition duration-200 ${
                    filters.page === pageNum
                      ? "text-white bg-[#7A20DA] hover:bg-[#6A1AB8]"
                      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </nav>
            <button
              onClick={handleNextPage}
              disabled={filters.page === Math.ceil(total / filters.limit)}
              className="px-3 py-1 text-sm font-medium rounded transition duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}