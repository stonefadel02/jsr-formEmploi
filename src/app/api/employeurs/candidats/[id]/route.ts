import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import CandidatModelPromise from '@/models/Candidats';

export async function GET(req: NextRequest) {
  try {
    // ✅ Extraire l'ID depuis l'URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    // ✅ Vérifier le token dans les cookies
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== 'employeur') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    }

    // ✅ Récupérer le candidat
    const CandidatModel = await CandidatModelPromise;
    const candidat = await CandidatModel.findById(id);

    if (!candidat) {
      return NextResponse.json({ error: 'Candidat introuvable' }, { status: 404 });
    }

    return NextResponse.json(candidat);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Une erreur inconnue est survenue';
    return NextResponse.json({ error: 'Erreur serveur', details: message }, { status: 500 });
  }
}
