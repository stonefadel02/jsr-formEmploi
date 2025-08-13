"use client";

import { searchDepartment, searchCity } from "france-cities-js";
import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { Country, State } from "country-state-city";
import Cookies from "js-cookie";

export default function Candidature() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    formation: "",
    date: "",
    phone: "",
    adresse: "",
    sector: "",
    otherSector: "", // Champ pour "Autres"
    department: "",
    city: "",
     posteSouhaite: "", // NOUVEAU
    dateDebut: "",      // NOUVEAU
    dateFin: "",        // NOUVEAU
    rgpdConsent: false, // NOUVEAU
    level: "",
    contracttype: "",
    cvFile: null as File | null,
    videoFile: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [fileMessage, setFileMessage] = useState<string | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false); // Contrôle l'affichage de l'input "Autres"
const [submitError, setSubmitError] = useState<string | null>(null);
  const country = Country.getCountryByCode("FR");
  const departments = State.getStatesOfCountry(country?.isoCode ?? "FR").map(
    (state) => ({
      code: state.isoCode.split("-")[1],
      name: state.name,
    })
  );

  const listDepartements = searchDepartment
    .byName("", 200)
    .map((d) => ({
      code: d.code,
      name: d.name,
    }));
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (formData.department) {
      const cities = searchCity
        .byDepartmentCode(formData.department, 1000)
        .map((c) => c.name);
      console.log("Villes trouvées pour", formData.department, ":", cities);
      setCities(cities);
      setFormData((prev) => ({ ...prev, city: "" }));
    } else {
      setCities([]);
    }
  }, [formData.department]);

  

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "sector" && value === "Autres") {
      setShowOtherInput(true);
      setFormData((prev) => ({ ...prev, sector: "Autres", otherSector: "" }));
    } else if (name === "sector") {
      setShowOtherInput(false);
      setFormData((prev) => ({ ...prev, [name]: value, otherSector: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: isCheckbox ? checked : value,
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cv" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Le fichier dépasse la taille maximale autorisée de 5 Mo.");
      return;
    }

    const allowedTypes =
      type === "cv"
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

    if (type === "video") {
      setVideoUploading(true);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          [type === "cv" ? "cvFile" : "videoFile"]: file,
        }));
        setFileMessage(
          `${type === "cv" ? "CV" : "Vidéo"} sélectionné avec succès !`
        );
        setVideoUploading(false);
        setTimeout(() => setFileMessage(null), 3000);
      }, 1000);
    } else {
      setFormData((prev) => ({
        ...prev,
        [type === "cv" ? "cvFile" : "videoFile"]: file,
      }));
      setFileMessage(
        `${type === "cv" ? "CV" : "Vidéo"} sélectionné avec succès !`
      );
      setTimeout(() => setFileMessage(null), 3000);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.rgpdConsent) {
      const errorMessage = "Vous devez accepter les conditions pour soumettre votre candidature.";
      setSubmitError(errorMessage);
      alert(errorMessage);
      return;
    }
    if (!formData.cvFile || !formData.videoFile) {
      const errorMessage = "Veuillez télécharger votre CV et votre vidéo de présentation.";
      setSubmitError(errorMessage);
      alert(errorMessage);
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("formation", formData.formation);
    data.append("phone", formData.phone);
    data.append("rgpdConsent", String(formData.rgpdConsent)); // On envoie le consentement

    const sectorValue = formData.sector === "Autres" ? formData.otherSector : formData.sector;
    
    const alternanceSearch = {
      location: `${formData.department} - ${formData.city}`,
      contracttype: formData.contracttype,
      sector: sectorValue,
      level: formData.level,
      date: formData.date, // Date de naissance
      posteSouhaite: formData.posteSouhaite, // NOUVEAU
      dateDebut: formData.dateDebut,          // NOUVEAU
      dateFin: formData.dateFin,              // NOUVEAU
    };

    data.append("alternanceSearch", JSON.stringify(alternanceSearch));

    if (formData.cvFile) data.append("cv", formData.cvFile);
    if (formData.videoFile) data.append("video", formData.videoFile);

    try {
      const token = Cookies.get("token"); // Recommandé d'utiliser js-cookie
      const res = await fetch("/api/candidats/candidature", {
        method: "PUT",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        alert("Candidature soumise avec succès !");
        router.push("/candidat/test-de-personnalite");
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex justify-center p-2 sm:p-4">
        <div className="mt-32 sm:mt-16 md:mt-24 w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-[15px] shadow-md">
            <form
              onSubmit={step === 4 ? handleSubmit : handleNext}
              className="flex flex-col gap-2 sm:gap-3"
            >
              {step === 1 && (
                <>
                  <h2 className="text-[20px] sm:text-[17px] md:text-[20px] font-bold text-left text-black mb-2 sm:mb-4">
                    Informations personnelles
                  </h2>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
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
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
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
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                      htmlFor="date"
                    >
                      Date de naissance <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={formData.date}
                      onChange={handleChange}
                      placeholder="date"
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
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
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-[20px] sm:text-[17px] md:text-[20px] font-bold text-left text-black mb-2 sm:mb-4">
                    Recherche d’alternance
                  </h2>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                    >
                      Nom de votre école ou organisme de formation{" "}
                      <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="formation"
                      id="formation"
                      value={formData.formation}
                      onChange={handleChange}
                      placeholder="Entrez votre école ou organisme de formation ici"
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                      htmlFor="sector"
                    >
                      Secteur <span className="text-[#FF0000]"> *</span>
                    </label>
                    <select
                      name="sector"
                      id="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      required
                    >
                      <option value="">Sélectionnez un secteur</option>
                      <option value="Informatique et Technologies">
                        Informatique et Technologies
                      </option>
                      <option value="Santé et Social">Santé et Social</option>
                      <option value="Industrie et Construction">
                        Industrie et Construction
                      </option>
                      <option value="Commerce et Vente">Commerce et Vente</option>
                      <option value="Finance et Assurance">Finance et Assurance</option>
                      <option value="Éducation et Formation">
                        Éducation et Formation
                      </option>
                      <option value="Hôtellerie et Restauration">
                        Hôtellerie et Restauration
                      </option>
                      <option value="Marketing et Communication">
                        Marketing et Communication
                      </option>
                      <option value="Ressources Humaines et Administration">
                        Ressources Humaines et Administration
                      </option>
                      <option value="Arts, Culture et Médias">
                        Arts, Culture et Médias
                      </option>
                      <option value="Transport et Logistique">
                        Transport et Logistique
                      </option>
                      <option value="Environnement et Développement Durable">
                        Environnement et Développement Durable
                      </option>
                      <option value="Coiffure">Coiffure</option>
                      <option value="Petite enfance">Petite enfance</option>
                      <option value="Autres">Autres</option>
                    </select>
                    {showOtherInput && (
                      <input
                        type="text"
                        name="otherSector"
                        value={formData.otherSector}
                        onChange={handleChange}
                        placeholder="Précisez votre secteur"
                        className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                        required
                      />
                    )}
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                      htmlFor="contracttype"
                    >
                      Type de contrat <span className="text-[#FF0000]"> *</span>
                    </label>
                    <select
                      name="contracttype"
                      id="contracttype"
                      value={formData.contracttype}
                      onChange={handleChange}
                      required
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                    >
                      <option value="">Sélectionnez un type</option>
                      <option value="Alternance">Alternance</option>
                      <option value="Stage académique">Stage</option>
                    </select>
                  </div>

<div>
                    <label className="text-[#4C4C4C]" htmlFor="posteSouhaite">
                      Poste souhaité <span className="text-[#FF0000]"> *</span>
                    </label>
                    <input
                      type="text"
                      name="posteSouhaite"
                      id="posteSouhaite"
                      value={formData.posteSouhaite}
                      onChange={handleChange}
                      placeholder="Ex: Développeur Web, Community Manager"
                      className="mt-2 block w-full p-2 border rounded-[15px]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#4C4C4C]" htmlFor="dateDebut">
                        Début de l'alternance <span className="text-[#FF0000]"> *</span>
                      </label>
                      <input
                        type="date"
                        name="dateDebut"
                        id="dateDebut"
                        value={formData.dateDebut}
                        onChange={handleChange}
                        className="mt-2 block w-full p-2 border rounded-[15px]"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[#4C4C4C]" htmlFor="dateFin">
                        Fin de l'alternance <span className="text-[#FF0000]"> *</span>
                      </label>
                      <input
                        type="date"
                        name="dateFin"
                        id="dateFin"
                        value={formData.dateFin}
                        onChange={handleChange}
                        className="mt-2 block w-full p-2 border rounded-[15px]"
                        required
                      />
                    </div>
                  </div>



                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                      htmlFor="department"
                    >
                      Département <span className="text-[#FF0000]"> *</span>
                    </label>
                    <select
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                    >
                      <option value="">Sélectionnez un département</option>
                      {listDepartements.map((dept) => (
                        <option key={dept.code} value={dept.code}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                      htmlFor="city"
                    >
                      Ville <span className="text-[#FF0000]"> *</span>
                    </label>
                    <select
                      name="city"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                      disabled={!formData.department}
                    >
                      <option value="">Sélectionnez une ville</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="text-[#4C4C4C] text-sm sm:text-base md:text-[16px]"
                      htmlFor="level"
                    >
                      Niveau d’étude <span className="text-[#FF0000]"> *</span>
                    </label>
                    <select
                      name="level"
                      id="level"
                      value={formData.level}
                      onChange={handleChange}
                      required
                      className="mt-1 sm:mt-2 block mb-2 w-full px-3 sm:px-4 py-2 sm:py-2 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                    >
                      <option value="">Sélectionnez un niveau</option>
                      <option value="CAP">CAP</option>
                      <option value="BEP">BEP</option>
                      <option value="BAC PRO">BAC PRO</option>
                      <option value="Bac+1">Bac+1</option>
                      <option value="Bac+2">Bac+2</option>
                      <option value="Bac+3">Bac+3</option>
                      <option value="Bac+4">Bac+4</option>
                      <option value="Bac+5">Bac+5</option>
                      <option value="Master">Master</option>
                    </select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-[20px] sm:text-[17px] md:text-[20px] font-bold text-left text-black mb-2 sm:mb-4">
                    Téléversement du CV
                  </h2>
                  <p className="text-[#616161] text-xs sm:text-sm md:text-[16px] mb-2 sm:mb-4">
                    Téléchargez votre CV pour permettre aux recruteurs de vous
                    trouver facilement.
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="cv"
                      className="flex gap-4 sm:gap-6 items-center justify-center w-full h-24 sm:h-32 border-2 border-[#7A20DA] rounded-[15px] text-center text-[#616161] hover:bg-gray-100 cursor-pointer"
                    >
                      <svg
                        width="50"
                        height="45"
                        viewBox="0 0 73 67"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="sm:w-[63px] sm:h-[57px]"
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
                      <span className="text-sm sm:text-[16px] w-40 sm:w-64 text-left text-[#7A20DA]">
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


                  {fileMessage && (
                    <p className="text-green-600 text-center text-xs sm:text-sm mt-2">
                      {fileMessage}
                    </p>
                  )}
                  <p className="text-[#616161] text-center text-xs sm:text-[14px] mt-1 sm:mt-2">
                    Les types de fichiers pris en charge sont uniquement pdf
                    (Taille max. : 5 MB)
                  </p>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="text-[20px] sm:text-[17px] md:text-[20px] font-bold text-left text-black mb-2 sm:mb-4">
                    Vidéo de présentation
                  </h2>
                  <p className="text-[#616161] text-xs sm:text-sm md:text-[16px] mb-2 sm:mb-4">
                    Téléchargez une vidéo dans laquelle vous vous présentez de
                    manière explicite.
                  </p>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="video"
                      className="flex gap-4 sm:gap-6 items-center justify-center w-full h-24 sm:h-32 border-2 border-[#7A20DA] rounded-[15px] text-center text-[#616161] hover:bg-gray-100 cursor-pointer"
                    >
                      <svg
                        width="50"
                        height="45"
                        viewBox="0 0 73 67"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="sm:w-[63px] sm:h-[57px]"
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
                      <span className="text-sm sm:text-[16px] w-40 sm:w-64 text-left text-[#7A20DA]">
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
                        disabled={videoUploading}
                      />
                    </label>
                  </div>


                  <div className="mt-6 p-4 border-t border-gray-200">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        name="rgpdConsent"
                        checked={formData.rgpdConsent}
                        onChange={handleChange}
                        className="h-5 w-5 rounded mt-1 border-gray-300 text-purple-600 focus:ring-purple-500"
                        required
                      />
                      <span className="ml-3 text-sm text-gray-600">
                        J’autorise la consultation de mon profil par les employeurs inscrits à la plateforme. <span className="text-[#FF0000]">*</span>
                      </span>
                    </label>
                  </div>
                  {submitError && (
                    <p className="text-red-600 text-center text-sm mt-4">{submitError}</p>
                  )}

                  {videoUploading && (
                    <div className="flex justify-center mt-2">
                      <div className="w-6 h-6 border-4 border-t-[#7A20DA] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {fileMessage && (
                    <p className="text-green-600 text-center text-xs sm:text-sm mt-2">
                      {fileMessage}
                    </p>
                  )}
                  <p className="text-[#616161] text-center text-xs sm:text-[14px] mt-1 sm:mt-2">
                    Les types de fichiers pris en charge sont uniquement
                    MP4/WebM (Taille max. : 5 MB)
                  </p>
                </>
              )}

              <div className="flex gap-2 sm:gap-4 mt-2 sm:mt-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="w-full bg-gray-300 text-gray-700 font-medium py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                  >
                    Retour
                  </button>
                )}
                <button
                  type="submit"
                  className={`${
                    step === 1 || step === 4 ? "w-full" : "w-full"
                  } bg-[#7A20DA] text-white font-medium py-2 px-3 sm:px-4 rounded-lg cursor-pointer hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 disabled:opacity-50`}
                 disabled={loading || (step === 4 && (!formData.cvFile || !formData.videoFile))}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-t-[#7A20DA] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : step === 4 ? (
                    "Confirmer & Soumettre"
                  ) : (
                    "Continuez"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}