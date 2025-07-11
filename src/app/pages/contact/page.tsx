'use client';

import { useState } from "react";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";

export default function AcceuilRecruteur() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/manjvgdd', { // Remplacez par votre ID Formspree
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Message envoyé avec succès !');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Réinitialiser
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Première section (existante) */}
      <div className="min-h-screen  relative flex items-center justify-center px-2 sm:px-4 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-l from-[#8E2DE2]/80 to-[#4B00C8]"></div>
        </div>
        <div className="max-w-6xl w-full  relative z-10 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 md:gap-10 lg:gap-40 items-center">
            <div className="text-white text-left">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-6xl font-bold mb-1 sm:mb-2 md:mb-4">
                Contact
              </h1>
              <p className="text-sm sm:text-sm md:text-base lg:text-[16px] py-1 sm:py-2 md:py-4 lg:py-6 mb-1 sm:mb-2 md:mb-4">
                Nous sommes toujours heureux de vous aider et de répondre à vos
                questions
              </p>
            </div>
            <Image
              src="/contact.png"
              alt="Contact Image"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Section formulaire de contact */}
      <div className="py-10 sm:py-16 md:py-20 bg-[#F6F6F6]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-10 rounded-[15px] shadow-md">
            <h2 className="text-[20px] sm:text-[25px] font-semibold text-left text-black mb-6">
              Nous contacter
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="mt-1 block w-full px-4 py-3 border border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-[#7A20DA] focus:border-[#7A20DA] text-gray-600"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="mt-1 block w-full px-4 py-3 border border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-[#7A20DA] focus:border-[#7A20DA] text-gray-600"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Objet du message"
                  className="mt-1 block w-full px-4 py-3 border border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-[#7A20DA] focus:border-[#7A20DA] text-gray-600"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message"
                  rows={4}
                  className="mt-1 block w-full px-4 py-3 border border-[#C4C4C4] rounded-[15px] placeholder-[#D9D9D9] focus:ring-[#7A20DA] focus:border-[#7A20DA] text-gray-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full font-extrabold cursor:pointer bg-[#7A20DA] text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-[#7A20DA] transition duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-t-[#7A20DA] border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Envoyer"
                )}
              </button>
            </form>
            
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}