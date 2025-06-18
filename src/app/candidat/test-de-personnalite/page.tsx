
"use client";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PersonalityTest() {
  const router = useRouter(); // Pour la redirection vers le profil
  const questions = [
    {
      id: 1,
      text: "En groupe, tu es plutôt :",
      options: [
        { value: "Le Créatif", label: "Celui qui lance les idées et motive tout le monde" },
        { value: "Le Leader", label: "Celui qui structure, planifie et prend le lead" },
        { value: "L'Analytique", label: "Celui qui observe, analyse et résout les problèmes" },
        { value: "Le Bienveillant", label: "Celui qui rassure, soutient et écoute" },
        { value: "Le Discret", label: "Celui qui s’adapte à tout et reste discret" },
        { value: "Le Spontané", label: "Celui qui met l’ambiance et aime faire rire" },
      ],
    },
    {
      id: 2,
      text: "Face à un nouveau projet :",
      options: [
        { value: "Le Créatif", label: "Tu fonces avec créativité et enthousiasme" },
        { value: "Le Leader", label: "Tu établis une méthode claire avant d’agir" },
        { value: "L'Analytique", label: "Tu veux comprendre tous les détails d’abord" },
        { value: "Le Bienveillant", label: "Tu cherches à coopérer et à faire plaisir à tout le monde" },
        { value: "Le Discret", label: "Tu t’adaptes à ce qu’on attend de toi, sans stress" },
        { value: "Le Spontané", label: "Tu improvises et trouves des solutions sur le moment" },
      ],
    },
    {
      id: 3,
      text: "Ce que tu apprécies le plus dans un travail :",
      options: [
        { value: "Le Créatif", label: "La liberté de proposer des idées nouvelles" },
        { value: "Le Leader", label: "Un cadre clair avec des responsabilités" },
        { value: "L'Analytique", label: "La précision, les défis techniques" },
        { value: "Le Bienveillant", label: "L’ambiance bienveillante et la cohésion d’équipe" },
        { value: "Le Discret", label: "Pouvoir apprendre tranquillement sans pression" },
        { value: "Le Spontané", label: "La variété, les échanges, le fun" },
      ],
    },
    {
      id: 4,
      text: "Tes amis diraient que tu es :",
      options: [
        { value: "Le Créatif", label: "Créatif(ve) et plein(e) d’idées" },
        { value: "Le Leader", label: "Fiable et structuré(e)" },
        { value: "L'Analytique", label: "Posé(e) et intelligent(e)" },
        { value: "Le Bienveillant", label: "Attentionné(e) et sympa" },
        { value: "Le Discret", label: "Calme et adaptable" },
        { value: "Le Spontané", label: "Drôle et sociable" },
      ],
    },
    {
      id: 5,
      text: "Dans ton espace de travail idéal :",
      options: [
        { value: "Le Créatif", label: "Il y a des murs pour écrire tes idées" },
        { value: "Le Leader", label: "Tout est bien organisé et fonctionnel" },
        { value: "L'Analytique", label: "C’est calme, propice à la réflexion" },
        { value: "Le Bienveillant", label: "C’est accueillant, avec de bonnes relations" },
        { value: "Le Discret", label: "C’est simple et sans pression" },
        { value: "Le Spontané", label: "C’est vivant, dynamique, stimulant" },
      ],
    },
    {
      id: 6,
      text: "Tu te sens bien quand tu peux :",
      options: [
        { value: "Le Créatif", label: "Créer, proposer, exprimer" },
        { value: "Le Leader", label: "Gérer, diriger, organiser" },
        { value: "L'Analytique", label: "Comprendre, creuser, résoudre" },
        { value: "Le Bienveillant", label: "Aider, soutenir, collaborer" },
        { value: "Le Discret", label: "Observer, écouter, apprendre à ton rythme" },
        { value: "Le Spontané", label: "Improviser, rire, connecter avec les gens" },
      ],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [result, setResult] = useState<{ resultType: string; emoji: string; description: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setLoading(true);
      setError(null);

      try {
        // Préparer les réponses sous forme de tableau
        const answersArray = questions.map((_, index) => answers[index] || "");

        // Envoyer les réponses à l'API
        const response = await fetch("/api/candidats/personnality/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Inclut le cookie avec le token
          body: JSON.stringify({
            answers: answersArray,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de la soumission.");
        }

        // Stocker le résultat pour l'afficher dans le popup
        setResult(data.result);
        setShowPopup(true);
        console.log(answers, answersArray);
      } catch (err) {
        console.error("Erreur lors de la soumission :", err);
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
      
    }
    
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setResult(null);
  };

  const handleProfileAccess = () => {
    // Rediriger vers la page de profil
    router.push("/candidat/profile");
  };
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="bg-white rounded-[20px] mt-32 shadow-lg p-6 relative border border-[#7A20DA] border-t-0 border-l-0 border-b-0">
            <span className="absolute top-[-20px] right-[80px] bg-[#7A20DA] text-white px-5 py-4 rounded-full text-[19px] font-bold">
              0{currentQuestion + 1}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-10 text-center text-[#222] mb-6">
              Test de personnalité
            </h2>
            <div className="p-4">
              <p className="text-lg sm:text-xl font-semibold mb-4">
                {questions[currentQuestion].text}
              </p>
              {questions[currentQuestion].options.map((option) => (
                <label
                  key={option.value}
                  className={`block p-3 mb-2 text-[#4C4C4C] rounded-lg border border-gray-200 cursor-pointer ${
                    answers[currentQuestion] === option.value
                      ? "bg-purple-100 border-2 border-[#7A20DA]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={option.value}
                    checked={answers[currentQuestion] === option.value}
                    onChange={() => handleOptionChange(option.value)}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleBack}
                  className="w-full bg-white text-[#7A20DA] py-2 border cursor-pointer border-[#7A20DA] rounded-lg font-semibold transition duration-200 disabled:opacity-50"
                  disabled={currentQuestion === 0 || loading}
                >
                  Retour
                </button>
                <button
                  onClick={handleNext}
                  className="w-full bg-[#7A20DA] cursor-pointer text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 disabled:opacity-50"
                  disabled={!answers[currentQuestion] || loading}
                >
                  {loading
                    ? "Chargement..."
                    : currentQuestion === questions.length - 1
                    ? "Soumettre"
                    : "Suivant"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && result && (
        <div className="fixed inset-0 bg-[#383838]/80 flex items-center justify-center z-50">
          <div className="bg-white py-10 p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="text-left mb-4">
              <p className="text-xl font-bold text-left mb-4">
                {result.emoji} {result.resultType}
              </p>
              <p className="text-gray-600">{result.description}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleProfileAccess}
                className="bg-[#7A20DA] text-white font-bold py-2 w-full px-4 rounded-lg hover:bg-purple-700"
              >
                Accéder au profil
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
