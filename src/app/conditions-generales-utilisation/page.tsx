import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ConditionsGeneralesUtilisation() {
  return (
    <>
      <Navbar />
      <main className="bg-white mt-15 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Conditions Générales d`Utilisation
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Dernière mise à jour : 12 août 2025
          </p>

          <p className="mb-4">
            Les présentes Conditions Générales d`Utilisation régissent l`accès et l`utilisation de la plateforme JSR-Alternance. En créant un compte, vous  acceptez sans réserve les présentes CGU.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Objet du service</h2>
          <p className="mb-4">JSR-Alternance est une plateforme en ligne dont l`objectif est de faciliter la mise en relation entre des personnes à la recherche d`un contrat d`alternance  et des entreprises proposant de tels contrats .</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Inscription et Accès</h2>
          <p className="mb-4">L`Utilisateur s`engage à fournir des informations exactes lors de son inscription et est seul responsable de la confidentialité de son mot de passe.</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Obligations des Utilisateurs</h2>
          <p className="mb-4">L`Utilisateur s`engage à ne pas publier de contenu illégal, discriminatoire ou faux. Les Employeurs s`engagent à publier des offres d`alternance réelles et sérieuses.</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Responsabilité</h2>
          <p className="mb-4">JSR-Alternance est un intermédiaire technique et ne garantit pas qu`un Candidat trouvera une alternance ou qu`un Employeur trouvera un candidat. Nous ne sommes pas responsables du contenu publié par les Utilisateurs.</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Droit applicable</h2>
          <p className="mb-4">Les présentes CGU sont soumises au droit béninois. En cas de litige, les tribunaux de Cotonou seront seuls compétents.</p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">6. Contact</h2>
          <p className="mb-4">Pour toute question, veuillez nous contacter à l`adresse : <a href="mailto:[contact@jsr-alternance.fr]" className="text-purple-600 hover:underline">[contact@jsr-alternance.fr]</a>.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}