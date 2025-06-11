import { NextRequest, NextResponse } from 'next/server';
import EmployerModelPromise from '@/models/Employer';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employerId = params.id; // ✅ OK maintenant
    const EmployerModel = await EmployerModelPromise;

    const deletedEmployer = await EmployerModel.findByIdAndDelete(employerId);
    if (!deletedEmployer) {
      return NextResponse.json({ error: 'Employeur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employeur supprimé avec succès' });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erreur serveur', details: err.message },
      { status: 500 }
    );
  }
}
