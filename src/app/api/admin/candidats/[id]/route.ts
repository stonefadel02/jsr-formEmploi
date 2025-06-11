import { NextRequest, NextResponse } from 'next/server';
import CandidatModelPromise from '@/models/Candidats';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidatId = params.id; // ✅ OK maintenant
    const CandidatModel = await CandidatModelPromise;

    const deletedCandidat = await CandidatModel.findByIdAndDelete(candidatId);
    if (!deletedCandidat) {
      return NextResponse.json({ error: 'Candidat non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Candidat supprimé avec succès' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erreur serveur', details: err.message },
      { status: 500 }
    );
  }
}
