"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { ICandidat } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"profile" | "tracking">("profile");
  const router = useRouter();
  const [profile, setProfile] = useState<ICandidat | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    personalInfo: false,
    alternanceSearch: false,
    cv: false,
    video: false,
  });
  const [formData, setFormData] = useState<Partial<ICandidat>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    personalInfo: false,
    alternanceSearch: false,
    cv: false,
    video: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInformations = async () => {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      try {
        const res = await fetch("/api/candidats/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.candidat) {
          setProfile(data.candidat);
          setFormData(data.candidat); // Initialiser formData avec les données actuelles
        } else {
          setError("Candidat introuvable");
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Erreur serveur");
      }
    };

    fetchInformations();
  }, []);

  const handleEdit = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("alternanceSearch[")) {
      const subField = name.match(/\[(.*?)\]/)?.[1]; // Extrait 'sector' ou 'location'
      if (subField) {
        setFormData((prev) => ({
          ...prev,
          alternanceSearch: {
            ...prev.alternanceSearch,
            [subField]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (section: string) => {
    setIsLoading((prev) => ({ ...prev, [section]: true }));
    setSuccessMessage(null);
    const token = Cookies.get("token");
    if (!token) {
      setError("Token manquant");
      setIsLoading((prev) => ({ ...prev, [section]: false }));
      return;
    }

    const formDataToSend = new FormData();
    if (section === "personalInfo" || section === "alternanceSearch") {
      allowedFields.forEach((field) => {
        if (formData[field]) {
          if (
            field === "alternanceSearch" &&
            typeof formData[field] === "object"
          ) {
            formDataToSend.append(field, JSON.stringify(formData[field]));
          } else {
            formDataToSend.append(field, formData[field] as string);
          }
        }
      });
    }
    if (section === "cv" && formData.cv) {
      formDataToSend.append("cv", formData.cv);
    }
    if (section === "video" && formData.video) {
      formDataToSend.append("video", formData.video);
    }

    try {
      const res = await fetch("/api/candidats/candidature", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      const data = await res.json();
      if (res.ok) {
        setProfile((prev) => ({ ...prev, ...formData } as ICandidat));
        setIsEditing((prev) => ({ ...prev, [section]: false }));
        setSuccessMessage(
          section === "cv"
            ? "Téléchargement du CV réussi !"
            : section === "video"
            ? "Téléchargement de la vidéo réussi !"
            : "Modification réussie !"
        );
        setError(null);
      } else {
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Erreur serveur");
    } finally {
      setIsLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleCancel = (section: string) => {
    setFormData(profile || {}); // Réinitialiser formData avec les données actuelles
    setIsEditing((prev) => ({ ...prev, [section]: false }));
    setSuccessMessage(null);
  };

  const handleDownload = (url: string | undefined, field: string) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const allowedFields = [
    "firstName",
    "lastName",
    "emailpro",
    "phone",
    "alternanceSearch",
  ];

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <p className="text-white">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-l from-[#7A20DA] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <p className="text-white">Chargement...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl py-10 sm:py-20  w-full mt-10 sm:mt-20">
          <div className="bg-white/15">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                className={`px-4 sm:px-10 py-2 sm:py-4 text-base sm:text-[20px] font-extrabold ${
                  activeTab === "profile"
                    ? "bg-white/15 text-white font-extrabold"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Mon profil
              </button>
              <button
                className={`px-4 sm:px-6 py-2 sm:py-2 font-extrabold text-base sm:text-[20px] ${
                  activeTab === "tracking"
                    ? "bg-white/15 text-white font-extrabold"
                    : "text-white"
                }`}
                onClick={() => setActiveTab("tracking")}
              >
                Suivi de l’état de la candidature
              </button>
            </div>

          <div className="bg-white rounded-[20px] shadow-lg p-4 sm:p-6 md:p-8 mt-2 sm:mt-0">
            {activeTab === "profile" ? (
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-[#7A20DA] text-white flex items-center justify-center rounded-full mr-4">
                    mD
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-[30px] font-bold">
                      Bonjour, {profile.firstName}
                    </h2>
                    <h2 className="text-lg sm:text-xl font-sans">
                      {profile.lastName}
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className=""></div>
            )}
          </div>

          {activeTab === "profile" && (
            <div className="bg-white rounded-[20px] shadow-lg p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="border border-[#C4C4C4] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg text-[#202020] font-medium">
                      Coordonnées
                    </h3>
                    {isEditing.personalInfo ? (
                      <div className="flex space-x-2">
                        <button
                          className="text-white bg-[#7A20DA] py-2 px-4 cursor-pointer text-sm rounded"
                          onClick={() => handleSubmit("personalInfo")}
                          disabled={isLoading.personalInfo}
                        >
                          {isLoading.personalInfo
                            ? "Chargement..."
                            : "Sauvegarder"}
                        </button>
                        <button
                          className="text-white bg-red-600 py-2 px-4 cursor-pointer text-sm rounded"
                          onClick={() => handleCancel("personalInfo")}
                          disabled={isLoading.personalInfo}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleEdit("personalInfo")}
                      >
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
                    )}
                  </div>
                  {isEditing.personalInfo && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        className="w-full border-gray-100 p-2 border rounded"
                        placeholder="Prénom"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        className="w-full border-gray-100 p-2 border rounded"
                        placeholder="Nom"
                      />
                      <input
                        type="email"
                        name="emailpro"
                        value={formData.emailpro || ""}
                        onChange={handleChange}
                        className="w-full p-2 border-gray-100 border rounded"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="w-full border-gray-100 p-2 border rounded"
                        placeholder="Téléphone"
                      />
                    </div>
                  )}
                  {!isEditing.personalInfo && (
                    <div>
                      <p className="text-gray-700">
                        {profile.firstName} {profile.lastName}
                      </p>
                      <p className="text-gray-700">{profile.emailpro}</p>
                      <p className="text-gray-700">{profile.phone}</p>
                    </div>
                  )}
                </div>
                <div className="border border-[#C4C4C4] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg text-[#202020] font-medium">
                      Lieu
                    </h3>
                    {isEditing.alternanceSearch ? (
                      <div className="flex space-x-2">
                        <button
                          className="text-white bg-[#7A20DA] py-2 px-4 cursor-pointer text-sm rounded"
                          onClick={() => handleSubmit("alternanceSearch")}
                          disabled={isLoading.alternanceSearch}
                        >
                          {isLoading.alternanceSearch
                            ? "Chargement..."
                            : "Sauvegarder"}
                        </button>
                        <button
                          className="text-white bg-red-600 py-2 px-4 cursor-pointer text-sm rounded"
                          onClick={() => handleCancel("alternanceSearch")}
                          disabled={isLoading.alternanceSearch}
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleEdit("alternanceSearch")}
                      >
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
                    )}
                  </div>
                  {isEditing.alternanceSearch && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="alternanceSearch[sector]"
                        value={formData.alternanceSearch?.sector || ""}
                        onChange={handleChange}
                        className="w-full border-gray-100 p-2 border rounded"
                        placeholder="Secteur"
                      />
                      <input
                        type="text"
                        name="alternanceSearch[location]"
                        value={formData.alternanceSearch?.location || ""}
                        onChange={handleChange}
                        className="w-full border-gray-100 p-2 border rounded"
                        placeholder="Localisation"
                      />
                    </div>
                  )}
                  {!isEditing.alternanceSearch && (
                    <div>
                      <p className="text-gray-700">
                        {profile.alternanceSearch?.sector}
                      </p>
                      <p className="text-gray-700">
                        {profile.alternanceSearch?.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-6 border border-[#C4C4C4] p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Mes documents
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                    <span>CV</span>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "cv")}
                        className="hidden"
                        id="cvUpload"
                        disabled={isLoading.cv}
                      />
                      <label
                        htmlFor="cvUpload"
                        className="bg-[#7A20DA] cursor-pointer border border-[#7A20DA] text-white px-4 sm:px-6 py-2 rounded-[5px]"
                      >
                        Télécharger
                      </label>
                      {isEditing.cv ? (
                        <>
                          <button
                            className="border-[#7A20DA] border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                            onClick={() => handleSubmit("cv")}
                            disabled={isLoading.cv}
                          >
                            {isLoading.cv ? "Chargement..." : "Sauvegarder"}
                          </button>
                          <button
                            className="border-[#7A20DA] border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                            onClick={() => handleCancel("cv")}
                            disabled={isLoading.cv}
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                          onClick={() => handleEdit("cv")}
                        >
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                    <span>Video</span>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, "video")}
                        className="hidden"
                        id="videoUpload"
                        disabled={isLoading.video}
                      />
                      <label
                        htmlFor="videoUpload"
                        className="bg-[#7A20DA] cursor-pointer border border-[#7A20DA] text-white px-4 sm:px-6 py-2 rounded-[5px]"
                      >
                        Télécharger
                      </label>
                      {isEditing.video ? (
                        <>
                          <button
                            className="border-[#7A20DA] border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                            onClick={() => handleSubmit("video")}
                            disabled={isLoading.video}
                          >
                            {isLoading.video ? "Chargement..." : "Sauvegarder"}
                          </button>
                          <button
                            className="border-[#7A20DA] border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                            onClick={() => handleCancel("video")}
                            disabled={isLoading.video}
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                          onClick={() => handleEdit("video")}
                        >
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {successMessage && (
                  <p className="text-green-600 mt-4">{successMessage}</p>
                )}
              </div>
            </div>
          )}
                    </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
