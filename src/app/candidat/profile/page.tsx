"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { ICandidat } from "@/lib/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
export interface Personnality {
  resultType?: string; // Added resultType to the summary type
  summary?: {
    emoji?: string;
    description?: string;
  };
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"profile" | "tracking">("profile");
  const router = useRouter();
  const [profile, setProfile] = useState<ICandidat | null>(null);
  const [personality, setPersonality] = useState<Personnality>({
    resultType: "",
    summary: {
      emoji: "",
      description: "",
    },
  });
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    personalInfo: false,
    alternanceSearch: false,
    cv: false,
    video: false,
    photo: false,
  });
  const [formData, setFormData] = useState<Partial<ICandidat>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({
    personalInfo: false,
    alternanceSearch: false,
    cv: false,
    video: false,
    downloadCv: false,
    downloadVideo: false,
    uploadCv: false, // Nouvel état pour le loader du téléversement CV
    uploadVideo: false, // Nouvel état pour le loader du téléversement vidéo
    photo: false,
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
          if (data.personalityTestResult) {
            setPersonality(data.personalityTestResult);
          }
          setFormData(data.candidat);
        } else {
          setError("Candidat introuvable");
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Erreur serveur");
      }
    };

    fetchInformations();
  }, [router]);

  const handleEdit = (section: string) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("alternanceSearch[")) {
      const subField = name.match(/\[(.*?)\]/)?.[1];
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

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading((prev) => ({
        ...prev,
        [`upload${field.charAt(0).toUpperCase() + field.slice(1)}`]: true,
      }));
      try {
        setFormData((prev) => ({ ...prev, [field]: file }));
        // Simuler un délai de traitement (remplace par une logique réelle si nécessaire)
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 seconde de délai
        setSuccessMessage(
          `${field === "cv" ? "CV" : "Vidéo"} sélectionné avec succès !`
        );
      } catch (err) {
        console.error(`Erreur lors de la sélection du ${field}:`, err);
        setError(`Erreur lors de la sélection du ${field}.`);
      } finally {
        setIsLoading((prev) => ({
          ...prev,
          [`upload${field.charAt(0).toUpperCase() + field.slice(1)}`]: false,
        }));
      }
    }
  };

  const handleSubmit = async (section: string, file?: File) => {
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
        if (formData[field as keyof ICandidat]) {
          if (
            field === "alternanceSearch" &&
            typeof formData[field as keyof ICandidat] === "object"
          ) {
            formDataToSend.append(
              field,
              JSON.stringify(formData[field as keyof ICandidat])
            );
          } else {
            formDataToSend.append(
              field,
              formData[field as keyof ICandidat] as string
            );
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
    if (section === "photo" && file) {
      formDataToSend.append("photo", file);
      alert(
        "Photo mise à jour, veuillez recharger la page pour voir les changements."
      );
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
            : section === "photo"
            ? "Téléchargement de la photo réussi !"
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
    setFormData(profile || {});
    setIsEditing((prev) => ({ ...prev, [section]: false }));
    setSuccessMessage(null);
  };

  const allowedFields: (keyof ICandidat)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "location",
    "alternanceSearch",
  ];

  const handleDownloadCv = async () => {
    if (!profile?.cvUrl) {
      alert("Aucun CV disponible.");
      return;
    }

    setIsLoading((prev) => ({ ...prev, downloadCv: true }));
    try {
      const token = Cookies.get("token");
      const response = await axios.get(profile.cvUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `CV_${profile.firstName}_${profile.lastName}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement du CV :", error);
      alert("Erreur lors du téléchargement du CV.");
    } finally {
      setIsLoading((prev) => ({ ...prev, downloadCv: false }));
    }
  };

  const handleDownloadVideo = async () => {
    if (!profile?.videoUrl) {
      alert("Aucune vidéo disponible.");
      return;
    }

    setIsLoading((prev) => ({ ...prev, downloadVideo: true }));
    try {
      const token = Cookies.get("token");
      const response = await axios.get(profile.videoUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Video_${profile.firstName}_${profile.lastName}.mp4`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement de la vidéo :", error);
      alert("Erreur lors du téléchargement de la vidéo.");
    } finally {
      setIsLoading((prev) => ({ ...prev, downloadVideo: false }));
    }
  };

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

  console.log("profile", profile, "token", Cookies.get("token"));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-l from-[#8E2DE2] to-[#4B00C8] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-7xl py-10 sm:py-20 w-full mt-10 sm:mt-20">
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
            </div>

            <div className="bg-white rounded-[20px] shadow-lg p-4 sm:p-6 md:p-8 mt-2 sm:mt-0">
              {activeTab === "profile" ? (
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative w-12 sm:w-16 h-12 sm:h-16 bg-[#7A20DA] text-white flex items-center justify-center rounded-full mr-4 cursor-pointer group">
                      {/* Image de profil ou placeholder */}
                      <img
                        src={profile.photoUrl || "/avatar.png"}
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                      />

                      {/* Input file masqué avec une icône cliquable */}
                      <label
                        htmlFor="photoUpload"
                        className="absolute bottom-0 right-0 bg-white text-[#7A20DA] rounded-full p-1 cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleSubmit("photo", file);
                          }
                        }}
                        className="hidden"
                        id="photoUpload"
                        disabled={isLoading?.photo}
                      />
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
                <div className="">les details</div>
              )}
            </div>

            <div className="bg-white rounded-[20px] shadow-lg p-6 sm:p-6 md:p-8 mt-4 sm:mt-10">
              {activeTab === "profile" ? (
                <div className="flex  flex-row items-center ">
                  <div className="flex justify-between space-x-4 sm:space-x-[850px] items-center">
                    <div>
                      <h2 className="text-[17px]   sm:text-[27px] font-bold">
                        {personality.summary?.emoji}{" "}
                        {personality.resultType || "Profil de personnalité"}
                      </h2>
                      <h2 className="text-[14px] sm:ml-2 text-[#4C4C4C] sm:text-lg font-sans">
                        {personality.summary?.description ||
                          "Description du profil de personnalité"}
                      </h2>
                    </div>
                    <svg
                      width="50"
                      height="50"
                      viewBox="0 0 50 50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_1070_451)">
                        <path
                          d="M24.9688 14.0996L17.0762 18.4726V27.2185L24.9688 31.5913L32.8613 27.2185V18.4726L24.9688 14.0996Z"
                          fill="#7899D8"
                        />
                        <path
                          d="M17.0762 27.2183L24.9647 31.5889V22.8453L17.0762 18.4746V27.2183Z"
                          fill="#7899D8"
                        />
                        <path
                          d="M17.0723 18.4726L24.9648 22.8455L32.8574 18.4726L24.9648 14.0996L17.0723 18.4726Z"
                          fill="white"
                        />
                        <path
                          d="M31.6999 36.3868C36.5783 33.9318 39.9256 28.8805 39.9256 23.0467C39.9256 14.8631 33.3395 8.21783 25.1786 8.12213C16.8963 8.02496 10.0742 14.7639 10.0742 23.0468C10.0742 28.8806 13.4216 33.9319 18.2999 36.3869"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.2988 40.5177V42.3232C18.2988 46.0234 21.2985 49.0231 24.9988 49.0231C28.6991 49.0231 31.6988 46.0234 31.6988 42.3231V40.5176"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M25 4.11885V0.976562"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.6165 9.6624L9.39453 7.44043"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.07197 23.0469H2.92969"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M11.6165 36.4307L9.39453 38.6526"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M38.3828 9.6624L40.6048 7.44043"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M43.9277 23.0469H47.07"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M38.3828 36.4307L40.6048 38.6526"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M32.8091 40.4612H17.2145C16.1047 40.4612 15.2051 39.5616 15.2051 38.4519C15.2051 37.3421 16.1047 36.4424 17.2145 36.4424H32.809C33.9188 36.4424 34.8185 37.342 34.8185 38.4519C34.8185 39.5616 33.9188 40.4612 32.8091 40.4612Z"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24.9688 14.0996L17.0762 18.4726V27.2185L24.9688 31.5913L32.8613 27.2185V18.4726L24.9688 14.0996Z"
                          stroke="#0C2C67"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1070_451">
                          <rect width="50" height="50" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="">les details</div>
              )}
            </div>

            {activeTab === "profile" && (
              <div className="bg-white rounded-[20px] shadow-lg p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="border border-[#C4C4C4] p-4 rounded-lg">
                    <div className="flex sm:space-x-0 space-x-20 items-center justify-between mb-2">
                      <h3 className="text-base sm:text-lg text-[#202020] font-medium">
                        Coordonnées
                      </h3>
                      {isEditing.personalInfo ? (
                        <div className="sm:flex sm:space-x-2 sm:space-y-0 space-y-2">
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
                            className="text-white bg-red-600 py-2 sm:px-4 px-8 cursor-pointer text-sm rounded"
                            onClick={() => handleCancel("personalInfo")}
                            disabled={isLoading.personalInfo}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          className="text-gray-500 cursor-pointer hover:text-gray-700"
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
                          name="email"
                          value={formData.email || ""}
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
                    {!isEditing.personalInfo && (
                      <div>
                        <p className="text-gray-700">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-gray-700">{profile.email}</p>
                        <p className="text-gray-700">{profile.phone}</p>
                        <p className="text-gray-700">
                          {profile.alternanceSearch?.location}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="border border-[#C4C4C4] p-4 rounded-lg">
                    <div className="flex sm:space-x-0 space-x-20 items-center justify-between mb-2">
                      <h3 className="text-base sm:text-lg text-[#202020] font-medium">
                        Recherche d`alternance
                      </h3>
                      {isEditing.alternanceSearch ? (
                        <div className="sm:flex sm:space-x-2 sm:space-y-0 space-y-2">
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
                            className="text-white bg-red-600 py-2 sm:px-4 px-8 cursor-pointer text-sm rounded"
                            onClick={() => handleCancel("alternanceSearch")}
                            disabled={isLoading.alternanceSearch}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          className="text-gray-500 cursor-pointer hover:text-gray-700"
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
                          name="alternanceSearch[level]"
                          value={formData.alternanceSearch?.level || ""}
                          onChange={handleChange}
                          className="w-full border-gray-100 p-2 border rounded"
                          placeholder="Niveau"
                        />
                        <input
                          type="text"
                          name="alternanceSearch[contracttype]"
                          value={formData.alternanceSearch?.contracttype || ""}
                          onChange={handleChange}
                          className="w-full border-gray-100 p-2 border rounded"
                          placeholder="Type de contrat"
                        />
                      </div>
                    )}
                    {!isEditing.alternanceSearch && (
                      <div>
                        <p className="text-gray-700">
                          {profile.alternanceSearch?.sector}
                        </p>
                        <p className="text-gray-700">
                          {profile.alternanceSearch?.level}
                        </p>
                        <p className="text-gray-700">
                          {profile.alternanceSearch?.contracttype}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border border-[#C4C4C4] p-4 rounded-lg  sm:h-auto">
                    <div className="w-full   rounded-[15px] relative overflow-hidden">
                      {profile.videoUrl ? (
                        <video
                          controls
                          className="w-full h-auto max-h-full object-contain rotate-0" // Ajustement pour paysage
                          style={{ aspectRatio: "16 / 9" }} // Ratio 16:9 pour paysage
                          src={profile.videoUrl}
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

                  <div className="border border-[#C4C4C4] p-4 rounded-lg h-[400px] sm:h-[600px]">
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(
                        profile.cvUrl || ""
                      )}&embedded=true`}
                      className="w-full h-full"
                      title="CV du candidat"
                    />
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 border border-[#C4C4C4] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Mes documents</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                      <span>CV</span>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        {!isEditing.cv && profile.cvUrl && (
                          <button
                            onClick={handleDownloadCv}
                            className="bg-[#7A20DA] text-white cursor-pointer px-4 sm:px-6 py-2 rounded-[5px] hover:bg-purple-700 transition duration-200 flex items-center"
                            disabled={isLoading.downloadCv}
                          >
                            {isLoading.downloadCv ? (
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : null}
                            Télécharger
                          </button>
                        )}
                        {!isEditing.cv && (
                          <button
                            className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                            onClick={() => handleEdit("cv")}
                          >
                            Modifier
                          </button>
                        )}
                        {isEditing.cv && (
                          <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => handleFileChange(e, "cv")}
                              className="hidden"
                              id="cvUpload"
                              disabled={isLoading.cv || isLoading.uploadCv}
                            />
                            <label
                              htmlFor="cvUpload"
                              className="bg-[#7A20DA] cursor-pointer text-white px-4 sm:px-6 py-2 rounded-[5px] hover:bg-purple-700 transition duration-200 flex items-center"
                            >
                              {isLoading.uploadCv ? (
                                <>
                                  <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Chargement...
                                </>
                              ) : (
                                "Télécharger nouveau CV"
                              )}
                            </label>
                            <button
                              className="border-[#7A20DA] border cursor-pointer bg-white text-[#7A20DA] px-4 sm:px-8 py-2 mr-2  rounded-[5px]"
                              onClick={() => handleSubmit("cv")}
                              disabled={isLoading.cv || !formData.cv}
                            >
                              {isLoading.cv ? "Chargement..." : "Sauvegarder"}
                            </button>
                            <button
                              className="border-[#7A20DA] border cursor-pointer bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                              onClick={() => handleCancel("cv")}
                              disabled={isLoading.cv}
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg">
                      <span>Video</span>
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        {!isEditing.video && profile.videoUrl && (
                          <button
                            onClick={handleDownloadVideo}
                            className="bg-[#7A20DA] text-white cursor-pointer px-4 sm:px-6 py-2 rounded-[5px] hover:bg-purple-700 transition duration-200 flex items-center"
                            disabled={isLoading.downloadVideo}
                          >
                            {isLoading.downloadVideo ? (
                              <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : null}
                            Télécharger
                          </button>
                        )}
                        {!isEditing.video && (
                          <button
                            className="border-[#7A20DA] cursor-pointer border bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                            onClick={() => handleEdit("video")}
                          >
                            Modifier
                          </button>
                        )}
                        {isEditing.video && (
                          <div className="sm:flex space-y-2 sm:space-y-0 sm:space-x-2">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleFileChange(e, "video")}
                              className="hidden"
                              id="videoUpload"
                              disabled={
                                isLoading.video || isLoading.uploadVideo
                              }
                            />
                            <label
                              htmlFor="videoUpload"
                              className="bg-[#7A20DA] cursor-pointer text-white px-4 sm:px-6 py-2 rounded-[5px] hover:bg-purple-700 transition duration-200 flex items-center"
                            >
                              {isLoading.uploadVideo ? (
                                <>
                                  <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Chargement...
                                </>
                              ) : (
                                "Télécharger nouvelle vidéo"
                              )}
                            </label>
                            <button
                              className="border-[#7A20DA] border cursor-pointer bg-white text-[#7A20DA]  px-4 sm:px-8 py-2 mr-2 rounded-[5px]"
                              onClick={() => handleSubmit("video")}
                              disabled={isLoading.video || !formData.video}
                            >
                              {isLoading.video
                                ? "Chargement..."
                                : "Sauvegarder"}
                            </button>
                            <button
                              className="border-[#7A20DA] border cursor-pointer bg-white text-[#7A20DA] px-6 sm:px-8 py-2 rounded-[5px]"
                              onClick={() => handleCancel("video")}
                              disabled={isLoading.video}
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {successMessage && (
                    <p className="text-green-600 mt-4">{successMessage}</p>
                  )}
                  {error && <p className="text-red-500 mt-2">{error}</p>}
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
