"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Vérification de votre e-mail en cours...');

  // useEffect(() => {
  //   if (token) {
  //     const verifyToken = async () => {
  //       try {
  //         // --- Étape 1 : Valider le token ---
  //         const verifyResponse = await fetch('/api/auth/verify-email', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ token }),
  //         });

  //         const verifyData = await verifyResponse.json();

  //         if (!verifyResponse.ok) {
  //           throw new Error(verifyData.message || "Le lien de vérification est invalide ou a expiré.");
  //         }

  //         setMessage('Email validé ! Préparation du paiement...');

  //         // --- Étape 2 : Créer la session de paiement ---
  //         const { email, role } = verifyData;

  //         if (!role) {
  //           throw new Error("Impossible de déterminer le rôle de l'utilisateur.");
  //         }

  //         // On choisit le bon Price ID en fonction du rôle
  //         const priceId = role === 'candidat'
  //           ? process.env.NEXT_PUBLIC_STRIPE_CANDIDATE_PRICE_ID
  //           : process.env.NEXT_PUBLIC_STRIPE_EMPLOYER_PRICE_ID;

  //         if (!priceId) {
  //           throw new Error("ID de produit non configuré.");
  //         }

  //         const checkoutResponse = await fetch('/api/create-checkout-session', {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({
  //             priceId: priceId,
  //             customer_email: email,
  //             role: role
  //           }),
  //         });

  //         const checkoutData = await checkoutResponse.json();

  //         if (!checkoutResponse.ok || !checkoutData.url) {
  //           throw new Error(checkoutData.error || "Erreur lors de la création de la session de paiement.");
  //         }

  //         // --- Étape 3 : Rediriger vers Stripe ---
  //         window.location.href = checkoutData.url;

  //       } catch (error: any) {
  //         setMessage(error.message);
  //       }
  //     };

  //     verifyToken();
  //   } else {
  //     setMessage("Aucun token de vérification fourni.");
  //   }
  // }, [token, router]);


  // ... (imports restants identiques)

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          // --- Étape 1 : Valider le token (Backend) ---
          const verifyResponse = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(verifyData.message || "Le lien de vérification est invalide.");
          }

          const { email, role } = verifyData;

          // --- Étape 2 : Logique de redirection différenciée ---
          
          if (role === 'candidat') {
            // SI C'EST UN CANDIDAT : On l'envoie direct au profil
            setMessage('Compte validé ! Redirection vers votre profil...');
            
            // Petit délai pour que l'utilisateur lise le message
            setTimeout(() => {
              router.push('/auth/candidat/candidature');
            }, 1500);

          } else if (role === 'employeur') {
            // SI C'EST UN EMPLOYEUR : On continue vers Stripe
            setMessage('Email validé ! Préparation du paiement...');

            const priceId = process.env.NEXT_PUBLIC_STRIPE_EMPLOYER_PRICE_ID;

            const checkoutResponse = await fetch('/api/create-checkout-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                priceId: priceId,
                customer_email: email,
                role: role
              }),
            });

            const checkoutData = await checkoutResponse.json();

            if (!checkoutResponse.ok || !checkoutData.url) {
              throw new Error(checkoutData.error || "Erreur lors de la création du paiement.");
            }

            window.location.href = checkoutData.url;
          }

        } catch (error: any) {
          setMessage(error.message);
        }
      };

      verifyToken();
    }
  }, [token, router]);

  return (
    <div className="text-center bg-white p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Finalisation de votre inscription</h1>
      <p className="text-gray-600">{message}</p>
      {/* On peut ajouter un spinner ici */}
      <div className="w-12 h-12 border-4 border-t-purple-600 border-transparent rounded-full animate-spin mx-auto mt-6"></div>
    </div>
  );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Suspense fallback={<div className="text-center">Chargement...</div>}>
                <VerifyEmailContent />
            </Suspense>
        </div>
    )
}