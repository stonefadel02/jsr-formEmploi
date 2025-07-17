import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import SubscriptionModelPromise from "@/models/Subscription";
import EmployerModelPromise from "@/models/Employer";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ employerId: string }> }
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

    // Attendre les params avant de les utiliser
    const { employerId } = await params;
    const body = await req.json();
    const action = body.action;

    const SubscriptionModel = await SubscriptionModelPromise;
    const EmployerModel = await EmployerModelPromise;
    
    const now = new Date();
    const endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 an

    // Vérifier que l'employeur existe
    const employer = await EmployerModel.findById(employerId);
    if (!employer) {
      return NextResponse.json({ error: "Employeur non trouvé" }, { status: 404 });
    }

    let subscription = await SubscriptionModel.findOne({ employerId });

    if (action === "renew") {
      if (subscription) {
        subscription.startDate = now;
        subscription.endDate = endDate;
        subscription.isActive = true;
        subscription.isTrial = false;
        subscription.plan = subscription.plan || "Gratuit";
      } else {
        subscription = new SubscriptionModel({
          employerId,
          plan: "Gratuit",
          startDate: now,
          endDate,
          isActive: true,
          isTrial: false,
        });
      }
      
      // Mettre à jour l'objet subscription de l'employeur
      employer.subscription = {
        plan: "Gratuit",
        startDate: now,
        endDate: endDate,
        isActive: true,
      };
      
    } else if (action === "markAsPaid") {
      if (subscription) {
        subscription.isActive = true;
        subscription.isTrial = false;
        subscription.plan = "Standard";
        if (!subscription.endDate) {
          subscription.endDate = endDate;
        }
      } else {
        return NextResponse.json({ error: "Aucun abonnement trouvé pour cet employeur" }, { status: 404 });
      }
      
      // Mettre à jour l'objet subscription de l'employeur
      employer.subscription = {
        plan: "Standard",
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: true,
      };
      
    } else {
      return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
    }

    // Sauvegarder les deux modèles
    await Promise.all([
      subscription.save(),
      employer.save()
    ]);

    return NextResponse.json({
      message: `${action === "renew" ? "Abonnement renouvelé" : "Abonnement activé"} avec succès`,
      subscription: {
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: subscription.isActive,
        isTrial: subscription.isTrial,
        plan: subscription.plan,
      },
      employer: {
        subscription: employer.subscription,
        status: employer.status,
      }
    });
  } catch (err: any) {
    console.error("Erreur renouvellement:", err);
    return NextResponse.json(
      { error: "Erreur serveur", details: err.message },
      { status: 500 }
    );
  }
}