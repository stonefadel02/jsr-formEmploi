"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Props {
  role: "candidat" | "employeur" | "admin";
}

export default function LoginForm({ role }: Props) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Nouvel état pour le loader
  const router = useRouter();

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Email ou mot de passe incorrect.");
        console.log("Erreur lors de la connexion :", err.message);
      } else {
        console.log("Une erreur inconnue est survenue");
      }
    } finally {
      setLoading(false); // Désactive le loader, même en cas d'erreur
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500 bg-red-100 p-2 rounded">{error}</p>}
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

      <div>
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 border border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9]"
        />
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