// app/api/admin/candidats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import Candidat from '../../../../../models/Candidats'; 
import { adminMiddleware } from '../../middleware';
import { ApiResponse, ICandidat } from '@/lib/types';

export const GET = adminMiddleware(async (req: NextRequest): Promise<NextResponse<ApiResponse<ICandidat[]>>> => {
  try {
    await connectCandidatsDb();
    const candidats = await Candidat.find().select('-password');
    return NextResponse.json({ success: true, data: candidats }, { status: 200 });
  } catch (error) {
    console.error('Erreur récupération candidats :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
});