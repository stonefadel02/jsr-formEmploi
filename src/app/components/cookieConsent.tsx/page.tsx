// app/components/CookieConsent.tsx
"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
    // Optionnel : limiter les fonctionnalités si refusé
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 right-10  border-1 border-white/30  bg-gradient-to-l from-[#8E2DE2]  to-[#4B00C8] text-white p-4  rounded-lg shadow-2xl  z-50 w-56 ">
      <p className="mb-2 text-center font-semibold text-md py-1 text-white">Accepter les cookies 🍪 ?</p>
      <div className="flex justify-center gap-4 ">
        <button
          onClick={handleAccept}
          className=" cursor-pointer border-white/40 rounded-[5px] border-1  text-white px-6 py-1   transition duration-200"
        >
          Oui
        </button>
        <button
          onClick={handleDecline}
          className="cursor-pointer bg-white  border-[#8E2DE2] text-[#8E2DE2] rounded-[5px] px-6 py-1 border-1  transition duration-200"
        >
          Non
        </button>
      </div>
    </div>
  );
}