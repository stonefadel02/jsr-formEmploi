"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from 'next/link';

interface Props {
  role: "candidat" | "employeur" | "admin";
}

export default function LoginForm({ role }: Props) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Nouvel état pour le loader
  const router = useRouter();
         const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // Active le loader

    try {
      const endpoint =
        role === "candidat"
          ? "/api/candidats/login"
          : "/api/employeurs/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }
      console.log("Réponse API :", data, "Statut :", response.status);

      // Déterminer le rôle et la redirection
      let redirectPath = "";
      let internalRole = role; // Rôle par défaut basé sur la sélection

      // Si le rôle est "employeur" et l'email est "admin@example.com", traiter comme admin
      if (role === "employeur" && formData.email.toLowerCase() === "admin@example.com") {
        internalRole = "admin";
        redirectPath = "/admin/gestion_statistique";
      } else {
        redirectPath =
          role === "candidat" ? "/candidat/profile" : "/employeur/candidats";
      }

      setSuccess("Connexion réussie !");
      Cookies.set("token", data.token, {
        expires: 7, // jours
        secure: process.env.NODE_ENV === "production", // important en prod
        sameSite: "Lax",
      });

      // Optionnel : Stocker le rôle dans le token ou une variable d'état si nécessaire
      Cookies.set("role", internalRole, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      console.log("Redirection vers :", redirectPath);
      router.push(redirectPath);
      console.log("Redirigé");
    } catch (err: any) {
      // ✅ MODIFIÉ : On affiche le message d'erreur de l'API
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="text-red-500 bg-red-100 p-3 rounded text-center">
          <p>{error}</p>
          {/* ✅ NOUVEAU : On affiche un bouton si l'abonnement a expiré */}
          {(error.includes('expiré') || error.includes('actif')) && (
            <Link href="/pages/tarifs" className="block bg-[#7A20DA] text-white font-bold py-2 px-4 rounded-lg mt-3 hover:bg-purple-700">
                Renouveler mon abonnement
            </Link>
          )}
        </div>
      )}
      {success && <p className="text-green-500 bg-green-100 p-2 rounded">{success}</p>}

      <div>
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 border border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9]"
        />
      </div>

      

      <div className="relative">
                <label className="text-black mt-4 font-bold text-[18px]" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type={showPassword ? "text" : "password"} // Type dynamique
                  name="password"
                  placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
                  className="mt-2 block w-full px-4 py-3 border border-[#C4C4C4] text-gray-700 rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500"
                >
                  {/* Icône qui change en fonction de l'état */}
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-4.789 1.668l.708.708a6 6 0 0 1 4.08-1.588c4.274 0 7.17 4.305 7.17 4.305a11 11 0 0 1-2.14 2.872l.708.708z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.288l.822.822a2.5 2.5 0 0 1-2.829-2.829l-.823-.823a3.5 3.5 0 0 0 4.474 4.474z"/><path d="M2.06 2.06a1 1 0 0 0-1.414 1.414l1.473 1.473a11 11 0 0 0-1.805 2.51l-.004.004c-.989 1.564-1.313 3.328-.82 4.95.27.75.69 1.45.98 2.08.48 1.05.95 2.12 1.5 3.14l1.32.39a1 1 0 0 0 1.414-1.414l-1.32-.39c-.55-1.02-.97-2.09-1.45-3.14a10 10 0 0 1-.98-2.08c-.49-1.62-.16-3.38.82-4.95a11 11 0 0 1 1.805-2.51L.647 3.475z"/><path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
                  )}
                </button>
              </div>


      <button
        type="submit"
        className="w-full cursor-pointer bg-[#7A20DA] text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
        disabled={loading} // Désactive le bouton pendant le chargement
      >
        {loading ? (
          <div className="w-6 h-6 border-4 border-t-[#7A20DA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        ) : (
          "Continuez"
        )}
      </button>
    </form>
  );
}