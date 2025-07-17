"use client";

import { IEmployer } from "@/lib/types";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Employeur() {
  const [employeurs, setEmployeurs] = useState<IEmployer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEmployeurs = async () => {
      try {
        const response = await fetch("/api/admin/employers/employer");
        if (!response.ok) throw new Error("Erreur lors du chargement des données");
        const data = await response.json();
        console.log(data); // Pour vérifier la structure des données
        setEmployeurs(data); // Assurez-vous que data contient un tableau d'employeurs
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur est survenue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeurs();
  }, []);

  const deleteEmployeurs = async (id: string) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`/api/admin/employers/employer/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      router.push("/admin/gestion_employeur");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = (employerId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir renouveler l'abonnement ?")) return;
    fetch(`/api/admin/subscriptions/${employerId}/renouveler`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "renew" }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors du renouvellement");
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          alert(`Erreur : ${data.error}`);
        } else {
          alert("Abonnement renouvelé avec succès !");
          setEmployeurs((prev) =>
            prev.map((employeur) =>
              employeur._id === employerId
                ? { ...employeur, subscription: { ...data.subscription, isTrial: false } }
                : employeur
            )
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors du renouvellement :", error);
        alert("Une erreur est survenue lors du renouvellement de l'abonnement.");
      });
  };

  const handleMarkAsPaid = (employerId: string) => {
    if (!confirm("Confirmez-vous l'activation de cet abonnement ?")) return;
    fetch(`/api/admin/subscriptions/${employerId}/renouveler`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "markAsPaid" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(`Erreur : ${data.error}`);
        } else {
          alert("Abonnement activé avec succès !");
          setEmployeurs((prev) =>
            prev.map((employeur) =>
              employeur._id === employerId
                ? { ...employeur, subscription: { ...data.subscription, isTrial: false } }
                : employeur
            )
          );
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'activation :", error);
        alert("Une erreur est survenue lors de l'activation de l'abonnement.");
      });
  };

  return (
    <>
      <div className="max-w-7xl w-full">
        <div className="rounded-[15px] bg-white p-10">
          <div className="flex items-center gap-4">
            <svg
              width="39"
              height="37"
              viewBox="0 0 44 43"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.5499 0H4.43931C2.09211 0 0.150391 1.92822 0.150391 4.27539V38.5146C0.150391 40.7446 1.9029 42.5963 4.08789 42.7809V42.799H8.17858V29.9503H17.8106V42.799H25.8388V4.27539C25.8388 1.92822 23.8971 0 21.5499 0ZM8.71469 19.9669H5.86292V17.1151H8.71469V19.9669ZM8.71469 14.2588H5.86292V11.4071H8.71469V14.2588ZM8.71469 8.55528H5.86292V5.69898H8.71469V8.55528ZM14.4227 19.9669H11.5709V17.1151H14.4227V19.9669ZM14.4227 14.2588H11.5709V11.4071H14.4227V14.2588ZM14.4227 8.55528H11.5709V5.69898H14.4227V8.55528ZM20.1307 19.9669H17.2745V17.1151H20.1307V19.9669ZM20.1307 14.2588H17.2745V11.4071H20.1307V14.2588ZM20.1307 8.55528H17.2745V5.69898H20.1307V8.55528Z"
                fill="#7A20DA"
              />
              <path
                d="M39.5756 17.115H27.5469V42.7989H39.5756C41.9228 42.7989 43.851 40.8616 43.851 38.5145V21.3994C43.851 19.0522 41.9228 17.115 39.5756 17.115ZM33.7955 30.9278H30.9438V28.0761H33.7955V30.9278ZM33.7955 25.2243H30.9438V22.368H33.7955V25.2243ZM39.5035 30.9278H36.6473V28.0761H39.5035V30.9278ZM39.5035 25.2243H36.6473V22.368H39.5035V25.2243Z"
                fill="#7A20DA"
              />
            </svg>

            <h1 className="text-2xl font-bold text-[#8929E0]">Gestion des Employeurs</h1>
          </div>
          <div className="border-[1px] my-4 border-[#8929E0]"></div>

          {loading && <p className="text-center text-gray-500">Chargement...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && employeurs.length > 0 && (
            <div className="bg-white p-4 rounded-[20px] border-[1px] border-[#C4C4C4] shadow-md">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-6 px-6">Entreprise</th>
                    <th className="py-6 px-6">Email</th>
                    <th className="py-6 px-6">Statut</th>
                    <th className="py-6 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeurs.map((employeur: IEmployer) => (
                    <tr
                      key={employeur._id.toString()}
                      className="border-b text-[#4C4C4C] border-gray-200 odd:bg-white even:bg-[#F6F6F6]"
                    >
                      <td className="py-6 px-6">{employeur.companyName}</td>
                      <td className="py-6 px-6">{employeur.email}</td>
                      <td className="py-6 px-6">
                        {employeur.subscription?.isActive && !employeur.subscription?.isTrial ? (
                          <div className="flex items-center gap-2 text-green-600">
                            <svg width="18" height="19" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {/* SVG existant pour "Actif" */}
                            </svg>
                            Actif
                          </div>
                        ) : employeur.subscription?.isTrial && employeur.subscription?.isActive ? (
                          <div className="flex items-center gap-2">
                            <svg width="25" height="27" viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {/* SVG existant pour "En essai" */}
                            </svg>
                            En essai
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-600">
                            <svg width="18" height="19" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {/* SVG existant pour "Expiré" */}
                            </svg>
                            Expiré
                          </div>
                        )}
                      </td>
                      <td className="py-6 px-6 flex space-x-2">
                        {employeur.subscription?.isTrial && employeur.subscription?.isActive && (
                          <button
                            onClick={() => handleMarkAsPaid(employeur._id.toString())}
                            className="bg-[#4DD5FF] flex items-center gap-1 text-white px-2 py-1 rounded-md"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {/* SVG existant pour "Activer" */}
                            </svg>
                            Activer
                          </button>
                        )}
                        {!employeur.subscription?.isActive && (
                          <button
                            onClick={() => handleRenew(employeur._id.toString())}
                            className="bg-[#2A9D8F] flex items-center gap-1 text-white px-2 py-1 rounded-md"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              {/* SVG existant pour "Renouveler" */}
                            </svg>
                            Renouveler
                          </button>
                        )}
                        <button
                          onClick={() => deleteEmployeurs(employeur._id.toString())}
                          className="bg-[#FF0000] text-white flex font-bold px-4 items-center gap-2 py-1 rounded-[5px]"
                        >
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

          {!loading && employeurs.length === 0 && (
            <p className="text-center text-gray-500 mt-4">Aucun employeur trouvé.</p>
          )}
        </div>
      </div>
    </>
  );
}