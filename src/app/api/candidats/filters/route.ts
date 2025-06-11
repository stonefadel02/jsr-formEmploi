import { NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatPromise from '../../../../models/Candidats';
import { ApiResponse } from '@/lib/types';

interface FilterOptions {
  sectors: string[];
  locations: string[];
  levels: string[];
  contractTypes: string[];
}

export async function GET(): Promise<NextResponse<ApiResponse<FilterOptions>>> {
  try {
    await connectCandidatsDb();
    const Candidat = await CandidatPromise;

    // Récupérer les valeurs uniques pour chaque champ
    const sectors = await Candidat.distinct('alternanceSearch.sector');
    const locations = await Candidat.distinct('alternanceSearch.location');
    const levels = await Candidat.distinct('alternanceSearch.level');
    const contractTypes = await Candidat.distinct('alternanceSearch.contracttype');

    return NextResponse.json({
      success: true,
      data: {
        sectors: sectors.filter(Boolean), // Filtrer les valeurs nulles ou vides
        locations: locations.filter(Boolean),
        levels: levels.filter(Boolean),
        contractTypes: contractTypes.filter(Boolean),
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur récupération filtres :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}