import { NextRequest, NextResponse } from "next/server";
import { connectCandidatsDb } from "@/lib/mongodb";
import CandidatPromise from "../../../../models/Candidats";
import jwt from "jsonwebtoken";
import { ApiResponse, ICandidat } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<ICandidat>>> {
  try {
    // Vérifier le token de l'employeur (authentification)
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    } 

    let decoded: { id: string; email: string; role?: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role?: string;
      };
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur est un employeur (si tu as un champ role dans ton token)
    if (decoded.role !== "employeur") {
      return NextResponse.json(
        { success: false, message: "Access denied. Employeur role required." },
        { status: 403 }
      );
    }

    await connectCandidatsDb();
    const Candidat = await CandidatPromise;

    const candidat = await Candidat.findById(params.id).select(
      "-personalInfo.password"
    );
    if (!candidat) {
      return NextResponse.json(
        { success: false, message: "Candidat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: candidat }, { status: 200 });
  } catch (error) {
    console.error("Erreur récupération candidat :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}