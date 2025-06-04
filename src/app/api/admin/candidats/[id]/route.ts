// app/api/admin/candidats/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import Candidat from '../../../../../models/Candidats';
import { adminMiddleware } from '../../middleware';
import { ApiResponse } from '@/lib/types';

export const DELETE = adminMiddleware(async (req: NextRequest): Promise<NextResponse<ApiResponse<void>>> => {
  try {
    const id = req.nextUrl.pathname.split('/').reverse()[1];
    await connectCandidatsDb();
    const candidat = await Candidat.findByIdAndDelete(id);
    if (!candidat) {
      return NextResponse.json({ success: false, message: 'Candidat non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Candidat supprimé' }, { status: 200 });
  } catch (error) {
    console.error('Erreur suppression candidat :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
});