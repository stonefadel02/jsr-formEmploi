import { NextRequest, NextResponse } from "next/server";
import { connectCandidatsDb } from "@/lib/mongodb";
import CandidatSubscriptionModelPromise from "@/models/CandidatSubscription";
import SubscriptionModelPromise from "@/models/Subscription";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role?: string;
}

interface IActiveSubscription {
  type: "candidate" | "employer";
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isTrial: boolean;
  price?: number;
}

export async function GET(req: NextRequest): Promise<NextResponse<{ success: boolean; data: IActiveSubscription[] }>> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return NextResponse.json({ success: false, message: "Token expired" }, { status: 401 });
      }
      if (error instanceof JsonWebTokenError) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
      }
      throw error;
    }

    // Vérification du rôle (admin ou employeur)
    const Employer = await (await import("@/models/Employer")).default;
    const employer = await Employer.findById(decoded.id).select("role");
    if (!employer || (employer.role !== "employeur" && employer.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Employeur or admin access required" }, { status: 403 });
    }

    // Connexion aux bases de données
    await connectCandidatsDb();
    const CandidatSubscription = await CandidatSubscriptionModelPromise;
    const Subscription = await SubscriptionModelPromise;

    // Récupérer les abonnements actifs des candidats
    const activeCandidatSubscriptions = await CandidatSubscription.find({ isActive: true })
      .populate({
        path: "candidatId",
        select: "firstName lastName email",
      })
      .lean();

    // Récupérer les abonnements actifs des employeurs
    const activeEmployerSubscriptions = await Subscription.find({ isActive: true })
      .populate({
        path: "employerId",
        select: "companyName email",
      })
      .lean();

    // Combiner et formater les abonnements
    const activeSubscriptions: IActiveSubscription[] = [
      ...activeCandidatSubscriptions.map((sub) => ({
        type: "candidate" as const,
        firstName: (sub.candidatId as any)?.firstName || "N/A",
        lastName: (sub.candidatId as any)?.lastName || "N/A",
        email: (sub.candidatId as any)?.email || "N/A",
        plan: sub.plan,
        startDate: sub.startDate,
        endDate: sub.endDate ?? sub.startDate, // fallback to startDate if endDate is undefined
        isActive: sub.isActive,
        isTrial: sub.isTrial,
        price: sub.price ?? 0,
      })),
      ...activeEmployerSubscriptions.map((sub) => ({
        type: "employer" as const,
        companyName: (sub.employerId as any)?.companyName || "Inconnu",
        email: (sub.employerId as any)?.email || "N/A",
        plan: sub.plan,
        startDate: sub.startDate,
        endDate: sub.endDate ?? sub.startDate, // fallback to startDate if endDate is undefined
        isActive: sub.isActive,
        isTrial: sub.isTrial,
        price: sub.price ?? 0,
      })),
    ];

    return NextResponse.json({ success: true, data: activeSubscriptions }, { status: 200 });
  } catch (error) {
    console.error("Erreur récupération abonnements actifs :", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}