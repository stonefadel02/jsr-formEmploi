"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";

export default function Candidature() {
  const [step, setStep] = useState(1); // Gérer les étapes (1, 2, 3, 4)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    emailpro: "",
    adresse: "",
    sector: "",
    location: "",
    level: "",
    contracttype: "",
    cvFile: null as File | null,
    videoFile: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 Mo

    // Vérifie la taille
    if (file.size > maxSize) {
      alert("Le fichier dépasse la taille maximale autorisée de 5 Mo.");
      return;
    }

    // Vérifie le type
    const allowedTypes = type === "cv"
      ? ["application/pdf"]
      : ["video/mp4", "video/quicktime", "video/x-matroska"];

    if (!allowedTypes.includes(file.type)) {
      alert(
        type === "cv"
          ? "Veuillez sélectionner un fichier PDF pour le CV."
          : "Veuillez sélectionner un fichier vidéo valide (mp4, mov, mkv)."
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [type === "cv" ? "cvFile" : "videoFile"]: file,
    }));
  };


  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1); // Passer à l'étape suivante
  };

  const handleBack = () => {
    setStep(step - 1); // Revenir à l'étape précédente
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    // Champs simples
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("emailpro", formData.emailpro); // correspondance avec ton API
    data.append("phone", formData.phone);

    // Exemple d’objet alternanceSearch (à adapter selon ton UI étape 2+)
    const alternanceSearch = {
      location: formData.location,
      contracttype: formData.contracttype,
      sector: formData.sector,
      level: formData.level,
    };
    data.append("alternanceSearch", JSON.stringify(alternanceSearch));

    // Fichiers
    if (formData.cvFile) {
      data.append("cv", formData.cvFile);
    }

    if (formData.videoFile) {
      data.append("video", formData.videoFile);
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage or another source
      const res = await fetch("/api/candidats/candidature", {
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        window.location.href = "/pages/profil_candidat"; // Redirection après succès
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur est survenue.");
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
        <div className="mt-32 w-full max-w-lg">
          <div className="bg-white p-10 rounded-[15px] shadow-md">
            {/* Titre et contenu de l'étape */}
            <form
              onSubmit={step === 4 ? handleSubmit : handleNext}
              className="flex flex-col gap-4"
            >
              {/* Étape 1 : Informations personnelles */}
              {step === 1 && (
                <>
                  <h2 className="text-[25px] font-bold text-left text-black mb-6">
                    Informations personnelles
                  </h2>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="lastName"
                    >
                      Nom <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nom"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="firstName"
                    >
                      Prénom <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Prénom"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="email"
                    >
                      Email <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="email"
                      name="emailpro"
                      id="email"
                      value={formData.emailpro}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="phone"
                    >
                      Téléphone <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0601234567"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="adresse"
                    >
                      Adresse <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      id="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Adresse"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                </>
              )}

              {/* Étape 2 : Recherche d’alternance */}
              {step === 2 && (
                <>
                  <h2 className="text-[25px] font-bold text-left text-black mb-6">
                    Recherche d’alternance
                  </h2>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="sector"
                    >
                      Secteur <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="sector"
                      id="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      placeholder="Ex: Informatique"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="contracttype"
                    >
                      Type de contrat <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="contracttype"
                      id="contracttype"
                      value={formData.contracttype}
                      onChange={handleChange}
                      placeholder="Ex: Alternance"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="location"
                    >
                      Localisation <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Paris"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-[18px]"
                      htmlFor="level"
                    >
                      Niveau d’étude <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="level"
                      id="level"
                      value={formData.level}
                      onChange={handleChange}
                      placeholder="Ex: Bac+3"
                      className="mt-2 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                </>
              )}

              {/* Étape 3 : Téléversement du CV */}
              {step === 3 && (
                <>
                  <h2 className="text-[25px] font-bold text-left text-black mb-6">
                    Téléversement du CV
                  </h2>
                  <p className="text-[#616161] text-[16px] mb-4">
                    Téléchargez votre CV pour permettre aux recruteurs de vous
                    trouver facilement.
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="cv"
                      className="flex gap-6 items-center justify-center w-full h-32 border-2 border-[#7A20DA] rounded-[15px]  text-center text-[#616161] hover:bg-gray-100 cursor-pointer"
                    >
                      <svg
                        width="63"
                        height="57"
                        viewBox="0 0 73 67"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M58.5445 16.6341C55.4148 11.0485 49.255 7.84469 42.6494 8.8995C40.0565 3.45643 34.6318 0 28.5317 0C19.8977 0 12.8728 7.0245 12.8728 15.6601C12.8728 16.0165 12.8868 16.3839 12.9188 16.7664C5.46688 18.4646 0 25.1928 0 32.9414C0 42.0982 7.44923 49.5463 16.606 49.5463H29.7317V46.8038H16.606C8.96117 46.8038 2.74398 40.5855 2.74398 32.9418C2.74398 26.1 7.85172 20.2072 14.6279 19.2375C14.9914 19.186 15.3181 18.9904 15.536 18.6941C15.7526 18.3994 15.8463 18.0289 15.7874 17.6674C15.6714 16.9241 15.6129 16.2691 15.6129 15.6613C15.6129 8.53722 21.4108 2.74203 28.5321 2.74203C33.8815 2.74203 38.5996 5.96657 40.557 10.9556C40.8029 11.5884 41.4748 11.9448 42.1411 11.791C48.1628 10.3982 53.8209 13.3069 56.4306 18.4931C56.6289 18.894 57.0174 19.1708 57.4616 19.2336C64.2417 20.199 69.3608 26.0922 69.3608 32.9407C69.3608 40.5843 63.1393 46.8027 55.4945 46.8027H38.0195V49.5451H55.4933C64.6512 49.5451 72.0993 42.097 72.0993 32.9403C72.0993 24.9722 66.3193 18.0844 58.5445 16.6341Z"
                          fill="#7A20DA"
                        />
                        <path
                          d="M42.3903 32.2545C42.9392 31.7068 42.9392 30.8211 42.3903 30.2734L34.5651 22.447C34.2915 22.1745 33.9351 22.0391 33.5759 22.0391L33.5509 22.0434C33.5439 22.0434 33.5369 22.0391 33.5299 22.0391C33.1664 22.0391 32.8077 22.18 32.5406 22.447L24.7155 30.2737C24.1678 30.8214 24.1678 31.7072 24.7155 32.2549C25.2632 32.8038 26.1489 32.8038 26.6966 32.2549L32.1272 26.824V64.7794C32.1272 65.5563 32.753 66.1836 33.5299 66.1836C34.3024 66.1836 34.9313 65.5563 34.9313 64.7794V26.7752L40.4095 32.2545C40.9553 32.8038 41.8426 32.8038 42.3903 32.2545Z"
                          fill="#7A20DA"
                        />
                      </svg>

                      <span className="text-[16px] w-64 text-left text-[#7A20DA] ">
                        Mettre mon CV en ligne ou déposer des fichiers
                      </span>
                      <input
                        type="file"
                        name="cv"
                        id="cv"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "cv")}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  <p className="text-[#616161] text-center text-[14px] mt-2">
                    Les types de fichiers pris en charge sont uniquement pdf
                    (Taille max. : 5 MB){" "}
                  </p>
                </>
              )}

              {/* Étape 4 : Téléversement de la vidéo */}
              {step === 4 && (
                <>
                  <h2 className="text-[25px] font-bold text-left text-black mb-6">
                    Vidéo de présentation
                  </h2>
                  <p className="text-[#616161] text-[16px] mb-4">
                    Téléchargez une vidéo dans laquelle vous vous présentez de
                    manière explicite.
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="video"
                      className="flex gap-6 items-center justify-center w-full h-32 border-2 border-[#7A20DA] rounded-[15px]  text-center text-[#616161] hover:bg-gray-100 cursor-pointer"
                    >
                      <svg
                        width="63"
                        height="57"
                        viewBox="0 0 73 67"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M63.4999 15.4H52.4999C50.6806 15.4 49.1999 13.9194 49.1999 12.1V6.6C49.1999 5.99285 48.7083 5.50004 48.1 5.50004C47.4917 5.50004 47 5.99285 47 6.6V12.1C47 15.1327 49.4673 17.6001 52.5001 17.6001H62.4001V60.5001C62.4001 62.3195 60.9195 63.8001 59.1001 63.8001H12.8999C11.0806 63.8001 9.59995 62.3195 9.59995 60.5001V5.50004C9.59995 3.68066 11.0806 2.20004 12.8999 2.20004H47.6446L58.3223 12.8777C58.7524 13.3079 59.4476 13.3079 59.8776 12.8777C60.3077 12.4477 60.3077 11.7524 59.8776 11.3224L48.8777 0.322266C48.6719 0.1155 48.3926 0 48.1 0H12.8999C9.8673 0 7.3999 2.46727 7.3999 5.50004V60.5001C7.3999 63.5327 9.8673 66 12.8999 66H59.0999C62.1326 66 64.6 63.5327 64.6 60.5V16.5C64.6 15.8929 64.1082 15.4 63.4999 15.4Z"
                          fill="#7A20DA"
                        />
                        <path
                          d="M41.4998 55.0003H48.0998C48.7082 55.0003 49.1998 54.5075 49.1998 53.9003V27.5003C49.1998 26.8932 48.7082 26.4004 48.0998 26.4004H23.8998C23.2915 26.4004 22.7998 26.8932 22.7998 27.5003V53.9003C22.7998 54.5075 23.2915 55.0003 23.8998 55.0003H37.0998C37.7081 55.0003 38.1997 54.5075 38.1997 53.9003C38.1997 53.2932 37.7081 52.8004 37.0998 52.8004H31.5997V41.8004H40.3998V53.9005C40.3998 54.5075 40.8915 55.0003 41.4998 55.0003ZM42.5998 28.6003H46.9998V33.0003H42.5998V28.6003ZM42.5998 35.2003H46.9998V39.6003H42.5998V35.2003ZM42.5998 41.8003H46.9998V46.2003H42.5998V41.8003ZM42.5998 48.4003H46.9998V52.8003H42.5998V48.4003ZM29.3998 52.8003H24.9998V48.4003H29.3998V52.8003ZM29.3998 46.2003H24.9998V41.8003H29.3998V46.2003ZM29.3998 39.6003H24.9998V35.2003H29.3998V39.6003ZM29.3998 33.0003H24.9998V28.6003H29.3998V33.0003ZM31.5998 39.6003V28.6003H40.3999V39.6003H31.5998Z"
                          fill="#7A20DA"
                        />
                      </svg>

                      <span className="text-[16px] w-64 text-left text-[#7A20DA]">
                        Déposez votre vidéo ou cliquez pour importer un fichier
                      </span>
                      <input
                        type="file"
                        name="video"
                        id="video"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, "video")}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  <p className="text-[#616161] text-center text-[14px] mt-2">
                    Les types de fichiers pris en charge sont uniquement
                    MP4/WebM (Taille max. : 1 MB)
                  </p>
                </>
              )}

              {/* Boutons de navigation */}
              <div className="flex gap-4 mt-4">
                {/* {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/2 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                  >
                    Retour
                  </button>
                )} */}
                <button
                  type="submit"
                  className={`${step === 1 && step > 1 ? "w-1/2" : "w-full"
                    } bg-[#7A20DA] text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200`}
                >
                  {step === 4 ? "Soumettre" : "Continuez"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
