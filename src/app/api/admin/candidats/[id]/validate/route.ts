// app/api/admin/candidats/[id]/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import Candidat from '../../../../../../models/Candidats';
import { adminMiddleware } from '../../../middleware';
import { ApiResponse, ICandidat } from '@/lib/types';

export const PUT = adminMiddleware(async (req: NextRequest): Promise<NextResponse<ApiResponse<ICandidat>>> => {
  try {
    const id = req.nextUrl.pathname.split('/').reverse()[2];
    await connectCandidatsDb();
    const candidat = await Candidat.findById(id);
    if (!candidat) {
      return NextResponse.json({ success: false, message: 'Candidat non trouvé' }, { status: 404 });
    }

    candidat.status = 'Validé';
    await candidat.save();
    return NextResponse.json({ success: true, message: 'Candidat validé', data: candidat }, { status: 200 });
  } catch (error) {
    console.error('Erreur validation candidat :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
});