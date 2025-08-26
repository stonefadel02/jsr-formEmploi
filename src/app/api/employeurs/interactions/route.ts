import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectCandidatsDb, connectEmployersDb } from '@/lib/mongodb';
import EmployerModelPromise from '@/models/Employer';
import EmployerCandidateInteractionModelPromise from '@/models/EmployerCandidateInteraction';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectEmployersDb();
    const EmployerModel = await EmployerModelPromise;
    
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: string };
    if (decoded.role !== 'employeur' && decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Accès refusé.' }, { status: 403 });
    }
    const employerId = decoded.id;

    // 2. Récupération des données de la requête
    const { candidateId, status } = await req.json();
    const validStatuses = ['favorited', 'shortlisted', 'rejected'];
    if (!candidateId || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: 'ID du candidat et statut valides requis.' }, { status: 400 });
    }

    // 3. Connexion à la BDD des candidats pour enregistrer l'interaction
    await connectCandidatsDb();
    const EmployerCandidateInteractionModel = await EmployerCandidateInteractionModelPromise;
    
    // 4. Met à jour ou crée l'interaction
    await EmployerCandidateInteractionModel.findOneAndUpdate(
      { employerId: new mongoose.Types.ObjectId(employerId), candidateId: new mongoose.Types.ObjectId(candidateId) },
      { $set: { status } },
      { upsert: true } // Crée le document s'il n'existe pas, sinon le met à jour
    );

    return NextResponse.json({ success: true, message: `Statut du candidat mis à jour à : ${status}.` });

  } catch (error) {
    console.error("Erreur mise à jour statut candidat:", error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}