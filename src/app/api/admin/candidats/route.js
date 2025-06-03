// app/api/admin/candidats/route.js
import { connectCandidatsDb } from '../../../../lib/mongodb';
import getCandidatsModel from '../../../../models/Candidats';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log('Starting admin candidats search...');

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get('keywords')?.toLowerCase() || '';
    const status = searchParams.get('status');
    const sector = searchParams.get('sector')?.toLowerCase();

    // Connecter à la base de données des candidats
    await connectCandidatsDb();

    // Récupérer le modèle Candidats (résoudre la promesse)
    console.log('Loading Candidats model...');
    const Candidats = await getCandidatsModel();
    console.log('Candidats model loaded successfully');

    // Construire la requête de recherche
    let query = {};

    // Recherche par mots-clés (dans personalInfo et alternanceSearch)
    if (keywords) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: keywords, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: keywords, $options: 'i' } },
        { 'personalInfo.email': { $regex: keywords, $options: 'i' } },
        { 'alternanceSearch.desiredPosition': { $regex: keywords, $options: 'i' } },
      ];
    }

    // Filtrer par statut
    if (status) {
      query.status = status;
    }

    // Filtrer par secteur
    if (sector) {
      query['alternanceSearch.sector'] = { $regex: sector, $options: 'i' };
    }

    // Exécuter la requête (tri par date décroissante par défaut)
    console.log('Executing query:', query);
    const candidats = await Candidats.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('Admin candidats search completed successfully');

    return NextResponse.json({ success: true, data: candidats });
  } catch (error) {
    console.error('Admin candidats search failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}