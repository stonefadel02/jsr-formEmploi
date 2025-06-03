// app/api/admin/subscriptions/route.js
import { connectEmployersDb } from '../../../../lib/mongodb';
import getSubscriptionModel from '../../../../models/Subscription';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log('Starting admin subscriptions search...');

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get('keywords')?.toLowerCase() || '';
    const status = searchParams.get('status'); // On considérera isActive comme le "statut"
    const sector = searchParams.get('sector')?.toLowerCase();

    // Connecter à la base de données des employeurs
    await connectEmployersDb();

    // Récupérer les modèles
    const Subscription = await getSubscriptionModel();

    // Construire la requête de recherche pour les abonnements
    let subscriptionQuery = {};

    // Filtrer par statut (isActive)
    if (status) {
      subscriptionQuery.isActive = status === 'Actif' ? true : false;
    }

    // Rechercher les abonnements
    let subscriptions = await Subscription.find(subscriptionQuery)
      .populate('employerId') // Récupérer les détails de l'employeur associé
      .sort({ createdAt: -1 })
      .limit(50);

    // Filtrer par mots-clés et secteur (en utilisant les données de l'employeur associé)
    if (keywords || sector) {
      subscriptions = subscriptions.filter(sub => {
        const employer = sub.employerId;
        let matchesKeywords = true;
        let matchesSector = true;

        // Recherche par mots-clés dans les champs de l'employeur
        if (keywords) {
          matchesKeywords = (
            employer.companyName.toLowerCase().includes(keywords) ||
            employer.email.toLowerCase().includes(keywords) ||
            (employer.description && employer.description.toLowerCase().includes(keywords))
          );
        }

        // Filtrer par secteur
        if (sector) {
          matchesSector = employer.sector && employer.sector.toLowerCase().includes(sector);
        }

        return matchesKeywords && matchesSector;
      });
    }

    console.log('Admin subscriptions search completed successfully');

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error('Admin subscriptions search failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}