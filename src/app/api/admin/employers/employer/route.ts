import { NextRequest, NextResponse } from 'next/server';
import EmployerModelPromise from '@/models/Employer'; 

export async function GET(req: NextRequest) {
  try {
    // ✅ Vérification du token (facultatif si la route est publique)
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    // if (decoded.role !== 'admin') { // Ou employeur, selon la logique métier
    //   return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    // }
    
    // ✅ Récupérer tous les employeurs
    const EmployeurModel = await EmployerModelPromise;
    const employeurs = await EmployeurModel.find();

    return NextResponse.json(employeurs);
  } catch (err: unknown) {
    let message = 'Une erreur inconnue est survenue';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { error: 'Erreur serveur', details: message },
      { status: 500 }
    );
  }
}
