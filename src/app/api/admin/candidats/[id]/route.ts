export const config = {
  runtime: 'nodejs',
};

import { NextRequest, NextResponse } from 'next/server';
import CandidatModelPromise from '@/models/Candidats';

// Solution 1: Utiliser le type correct pour Next.js 14+
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Await les params car ils sont maintenant asynchrones dans Next.js 15+
    const params = await context.params;
    const candidatId = params.id;
    
    const CandidatModel = await CandidatModelPromise;
    const deletedCandidat = await CandidatModel.findByIdAndDelete(candidatId);

    if (!deletedCandidat) {
      return NextResponse.json({ error: 'Candidat non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Candidat supprimé avec succès' });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Erreur serveur', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}