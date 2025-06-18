import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import CandidatModelPromise from "@/models/Candidats";
import PersonalityTestResultModelPromise from "@/models/PersonalityTestResult";
import { authOptions } from "@/lib/auth";


export async function GET(req: NextRequest) {
  try {
    // Authentification
    const session = await getServerSession(authOptions);
    let email = "";

    if (session?.user?.email) {
      email = session.user.email;
    } else {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        email = decoded.email;
      } catch {
        return NextResponse.json({ error: "Token invalide" }, { status: 403 });
      }
    }

    // Recherche du candidat
    const CandidatModel = await CandidatModelPromise;
    const candidat = await CandidatModel.findOne({ email }).select("-password"); // Retire le password si présent

    if (!candidat) {
      return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
    }
    // Récupération du résultat du test de personnalité
    const PersonalityTestResultModel = await PersonalityTestResultModelPromise;
    const personalityTestResult = await PersonalityTestResultModel.findOne({ candidateId: candidat._id });
    

    return NextResponse.json({ candidat, personalityTestResult }, { status: 200 });
  } catch (err) {
    console.error("Erreur GET profile:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}