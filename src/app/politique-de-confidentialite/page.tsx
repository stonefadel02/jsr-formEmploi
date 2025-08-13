import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PolitiqueDeConfidentialite() {
  return (
    <>
      <Navbar />
      <main className="bg-white mt-15 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : 12 août 2025
          </p>

          <p className="mb-4">
            Bienvenue sur JSR-Alternance ( La protection de vos données personnelles est notre priorité. Cette Politique de Confidentialité a pour but de vous informer sur la manière dont nous collectons, utilisons, partageons et protégeons vos informations.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Données que nous collectons</h2>
          <p className="mb-4">Nous collectons différentes informations en fonction de votre rôle sur la Plateforme :</p>
          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">a) Pour les Candidats :</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>Informations d`inscription :</strong> Nom, prénom, adresse e-mail, mot de passe (chiffré).</li>
            <li><strong>Informations de profil :</strong> Compétences, formation, expériences, et toute autre information que vous choisissez de partager.</li>
            <li><strong>Documents et médias :</strong> Votre CV et votre vidéo de présentation.</li>
            <li><strong>Résultats du test de personnalité :</strong> Vos réponses au test et le profil de personnalité qui en résulte.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">b) Pour les Employeurs :</h3>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li><strong>Informations d`inscription :</strong> Nom de l`entreprise, adresse e-mail du contact, mot de passe (chiffré).</li>
            <li><strong>Offres d`alternance :</strong> Le contenu des offres que vous publiez.</li>
            <li><strong>Données d`abonnement :</strong> Informations de paiement (gérées par notre prestataire sécurisé).</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Comment nous utilisons vos données</h2>
          <p className="mb-4">Vos données sont utilisées pour fournir notre service, gérer votre compte, personnaliser votre expérience, communiquer avec vous, améliorer la Plateforme et assurer sa sécurité.</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Partage de vos données</h2>
          <p className="mb-4">Nous ne vendons jamais vos données. Les informations de profil d`un candidat sont partagées avec les employeurs. Nous utilisons des prestataires de services pour l`hébergement (Hetzner), le stockage de fichiers (Cloudinary) et le traitement des paiements.</p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Vos droits</h2>
          <p className="mb-4">Vous disposez d`un droit d`accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits depuis votre espace profil ou en nous contactant.</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Contact</h2>
          <p className="mb-4">Pour toute question, veuillez nous contacter à l`adresse : <a href="mailto:[confidentialite@jsr-alternance.fr]" className="text-purple-600 hover:underline">[contact@jsr-formemploi.com]</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}