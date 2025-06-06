import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import CandidatModelPromise from "@/models/Candidats";

export async function GET(req: NextRequest) {
  try {
    // Authentification
    const session = await getServerSession(authOptions);
    let email = "";

    if (session?.user?.email) {
      email = session.user.email;
    } else {
      const authHeader = req.headers.get("authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return NextResponse.json({ error: "Token manquant" }, { status: 401 });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        email = decoded.email;
      } catch (err) {
        return NextResponse.json({ error: "Token invalide" }, { status: 403 });
      }
    }

    // Recherche du candidat
    const CandidatModel = await CandidatModelPromise;
    const candidat = await CandidatModel.findOne({ email }).select("-password"); // Retire le password si présent

    if (!candidat) {
      return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
    }

    return NextResponse.json({ candidat });
  } catch (err) {
    console.error("Erreur GET profile:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}