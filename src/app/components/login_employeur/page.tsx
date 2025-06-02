"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../navbar/page";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "candidat",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
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

      setSuccess("Connexion réussie !");
      localStorage.setItem("token", data.token);
      // Rediriger vers une page après connexion (exemple)
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    }
  };

  return (
    
     <><Navbar /><div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
      <div className="mt-32" >
        <div className="bg-white p-10 rounded-[15px] shadow-md w-full max-w-lg">
          <h2 className="text-[25px] font-bold  text-left text-black mb-6">
          Connexion Employeur
          </h2>
          {error && (
            <p className="text-red-600 text-center mb-4 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-600 text-center mb-4 bg-green-100 p-2 rounded">
              {success}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className="mt-1 block w-full px-4 py-3 border text-gray-700 border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                required />
            </div>
            <div className="">
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-[#C4C4C4] text-gray-700 rounded-[15px] placeholder-[#D9D9D9] focus:ring-purple-900 focus:border-purple-900"
                required />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7A20DA] cursor-pointer  text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
            >
              Continuez
            </button>

            <div className="flex items-center gap-5 justify-between ">
              <div className=" w-1/2 bg-[#C4C4C4] h-[2px]"></div>
              <p className="text-[#D9D9D9] font-bold">OU</p>
              <div className=" h-[2px] bg-[#C4C4C4] w-1/2"></div>
            </div>
          </form>
          <div className="mt-4 text-center">
            <button className="w-full bg-white border cursor-pointer border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
              <Image
                src="/Google.svg"
                alt="Google logo"
                width={24}
                height={24}
                className="h-5 w-5" />
              <span className="font-extrabold text-[18px]">Se connecter avec Google</span>
            </button>
          </div>
          <p className="mt-4 text-[15px] text-gray-600 font-sans text-left">
            Vos données seront traitées en conformité avec les{" "}
            <a href="#" className="text-[#7A20DA] underline">
              Politiques de confidentialité
            </a>{" "}
            et{" "}
            <a href="#" className="text-[#7A20DA] underline">
              {" "}
              les Conditions d’utilisation
            </a>
            .
          </p>
        </div>
        <p className="mt-10 text-[#616161] text-[16px] text-center">
          Pas de compte sur JSR ?{' '}
          <Link href="/components/register" className="text-[#7A20DA] hover:underline">
            Créez un compte
          </Link>
        </p>
      </div>
    </div></>
  );
}
