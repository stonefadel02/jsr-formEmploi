import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import EmployerModelPromise from '@/models/Employer'; 

export async function GET(req: NextRequest) {
  try {
    // ✅ Vérification du token (facultatif si la route est publique)
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    // if (decoded.role !== 'admin') { // Ou employeur, selon la logique métier
    //   return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    // }
    
    // ✅ Récupérer tous les employeurs
    const EmployeurModel = await EmployerModelPromise;
    const employeurs = await EmployeurModel.find();

    return NextResponse.json(employeurs);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Erreur serveur', details: err.message },
      { status: 500 }
    );
  }
}
