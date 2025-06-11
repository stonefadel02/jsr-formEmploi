import { NextRequest, NextResponse } from 'next/server';
import EmployerModelPromise from '@/models/Employer';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Await les params car ils sont maintenant asynchrones dans Next.js 15+
    const params = await context.params;
    const employerId = params.id;
    
    const EmployerModel = await EmployerModelPromise;
    const deletedEmployer = await EmployerModel.findByIdAndDelete(employerId);

    if (!deletedEmployer) {
      return NextResponse.json({ error: 'Employeur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employeur supprimé avec succès' });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Erreur serveur', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}