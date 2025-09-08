import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectEmployersDb } from '@/lib/mongodb';
import EmployerModelPromise from '@/models/Employer';
import SubscriptionModelPromise from '@/models/Subscription';
import mongoose from 'mongoose';

export async function PUT(req: NextRequest, { params }: { params: { employerId: string } }) {
  try {
    await connectEmployersDb();

    // Authentification de l'admin
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    
    const { employerId } = await params;
    const EmployerModel = await EmployerModelPromise;
    const SubscriptionModel = await SubscriptionModelPromise;

    const employer = await EmployerModel.findById(employerId);
    if (!employer) return NextResponse.json({ error: "Employeur non trouvé" }, { status: 404 });
    
    const now = new Date();
    const endDate = new Date();
    endDate.setFullYear(now.getFullYear() + 1);

    // Mettre à jour/créer l'abonnement dans sa collection séparée
    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
        { employerId: new mongoose.Types.ObjectId(employerId) },
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
    
    // Mettre à jour le statut et l'objet embarqué de l'employeur
    employer.isActive = true;
    employer.subscription = {
        plan: updatedSubscription.plan,
        isActive: updatedSubscription.isActive,
        startDate: updatedSubscription.startDate,
        endDate: updatedSubscription.endDate,
    };
    await employer.save();

    return NextResponse.json({ success: true, message: "Abonnement renouvelé avec succès.", data: updatedSubscription });

  } catch (err: any) {
    console.error("Erreur renouvellement employeur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}