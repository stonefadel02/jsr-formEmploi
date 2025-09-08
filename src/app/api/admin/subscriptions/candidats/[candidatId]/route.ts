import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatModelPromise from '@/models/Candidats';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest, { params }: { params: { candidatId: string } }) {
  try {
    await connectCandidatsDb(); // Toujours se connecter au début

    // Authentification de l'admin
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    
    const { candidatId } = await params;
    const CandidatModel = await CandidatModelPromise;
    const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;

    // On s'assure que le candidat existe
    const candidat = await CandidatModel.findById(candidatId);
    if (!candidat) return NextResponse.json({ error: "Candidat non trouvé" }, { status: 404 });
    
    const now = new Date();
    const endDate = new Date();
    endDate.setFullYear(now.getFullYear() + 1);

    // Mettre à jour/créer l'abonnement
    const updatedSubscription = await CandidatSubscriptionModel.findOneAndUpdate(
        { candidatId: new mongoose.Types.ObjectId(candidatId) },
        { 
            $set: { 
                isActive: true, 
                isTrial: false,
                plan: 'Payant Annuel',
                startDate: now,
                endDate: endDate 
            } 
        },
        { upsert: true, new: true }
    );
    
    // Mettre à jour le statut du candidat
    candidat.isActive = true;
    candidat.subscription = updatedSubscription._id;
    await candidat.save();

    return NextResponse.json({ success: true, message: "Abonnement renouvelé avec succès.", data: updatedSubscription });

  } catch (err: any) {
    console.error("Erreur renouvellement candidat:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}