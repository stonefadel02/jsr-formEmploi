// app/api/admin/employers/route.js
import { connectEmployersDb } from '../../../../lib/mongodb';
import getEmployerModel from '../../../../models/Employer';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    console.log('Starting admin employers search...');

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get('keywords')?.toLowerCase() || '';
    const status = searchParams.get('status');
    const sector = searchParams.get('sector')?.toLowerCase();

    // Connecter à la base de données des employeurs
    await connectEmployersDb();

    // Récupérer le modèle Employer
    const Employer = await getEmployerModel();

    // Construire la requête de recherche
    let query = {};

    // Recherche par mots-clés (dans companyName, email, description)
    if (keywords) {
      query.$or = [
        { companyName: { $regex: keywords, $options: 'i' } },
        { email: { $regex: keywords, $options: 'i' } },
        { description: { $regex: keywords, $options: 'i' } },
      ];
    }

    // Filtrer par statut
    if (status) {
      query.status = status;
    }

    // Filtrer par secteur
    if (sector) {
      query.sector = { $regex: sector, $options: 'i' };
    }

    // Exécuter la requête (tri par date décroissante par défaut)
    const employers = await Employer.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    console.log('Admin employers search completed successfully');

    return NextResponse.json({ success: true, data: employers });
  } catch (error) {
    console.error('Admin employers search failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}