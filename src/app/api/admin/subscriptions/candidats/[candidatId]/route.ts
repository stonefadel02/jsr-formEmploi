import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import CandidatSubscriptionModelPromise from "@/models/CandidatSubscription";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ candidatId: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    // Attendre les params avant de les utiliser
    const { candidatId } = await params;
    const body = await req.json(); // Récupère l'action depuis le corps
    const action = body.action;

    const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;
    const now = new Date();
    const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    let subscription = await CandidatSubscriptionModel.findOne({ candidatId });

    if (action === "renew") {
      if (subscription) {
        subscription.startDate = now;
        subscription.endDate = endDate;
        subscription.isActive = true;
        subscription.isTrial = false; // Renouvellement = pas d'essai
        if (!subscription.plan) subscription.plan = "Gratuit";
      } else {
        subscription = new CandidatSubscriptionModel({
          candidatId,
          plan: "Gratuit",
          startDate: now,
          endDate,
          isActive: true,
          isTrial: false,
        });
      }
    } else if (action === "markAsPaid") {
      if (subscription) {
        subscription.isActive = true;
        subscription.isTrial = false; // Marquer comme payé = plus d'essai
        if (!subscription.endDate) {
          subscription.endDate = endDate; // Définir une date de fin si pas présente
        }
        subscription.plan = "Standard";
      } else {
        return NextResponse.json({ error: "Aucun abonnement trouvé pour ce candidat" }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
    }

    // Sauvegarde asynchrone avec gestion d'erreur
    await subscription.save().catch((err) => {
      throw new Error(`Erreur lors de la sauvegarde : ${err.message}`);
    });

    return NextResponse.json({
      message: "Abonnement renouvelé avec succès",
      subscription: {
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: subscription.isActive,
        isTrial: subscription.isTrial,
        plan: subscription.plan,
      },
    });
  } catch (err: any) {
    console.error("Erreur renouvellement:", err);
    return NextResponse.json(
      { error: "Erreur serveur", details: err.message },
      { status: 500 }
    );
  }
}