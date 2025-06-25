import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import SubscriptionModelPromise from "@/models/Subscription";

export async function PUT(
  req: NextRequest,
  { params }: { params: { employerId: string } }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { employerId } = params;
    const SubscriptionModel = await SubscriptionModelPromise;

    // ⏱️ Création ou mise à jour de l'abonnement
    const now = new Date();
    const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 an

    let subscription = await SubscriptionModel.findOne({ employerId });

    if (subscription) {
      // mise à jour de l'abonnement existant
      subscription.startDate = now;
      subscription.endDate = endDate;
      subscription.isActive = true;
    } else {
      // création d'un nouvel abonnement
      subscription = new SubscriptionModel({
        employerId,
        startDate: now,
        endDate,
        isActive: true,
      });
    }

    await subscription.save();

    return NextResponse.json({
      message: "Abonnement renouvelé avec succès",
      subscription: {
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: subscription.isActive,
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
