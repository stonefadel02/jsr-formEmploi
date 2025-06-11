export const config = {
  runtime: 'nodejs',
};

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
      console.log("Token invalide ou expiré :", error);
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
    
    // Récupérer toutes les données du candidat sauf le mot de passe
    const candidat = await Candidat.findById(params.id).select(
      "-personalInfo.password -password"
    );

    if (!candidat) {
      return NextResponse.json(
        { success: false, message: "Candidat not found" },
        { status: 404 }
      );
    }

    // S'assurer que toutes les données nécessaires sont incluses
    const candidatData = {
      ...candidat.toObject(),
      cvUrl: candidat.cvUrl || undefined,
      videoUrl: candidat.videoUrl || undefined,
      firstName: candidat.firstName || "Non spécifié",
      lastName: candidat.lastName || "Non spécifié",
      email: candidat.email || "Non spécifié",
      skills: candidat.skills || [],
      experience: candidat.experience || [],
      alternanceSearch: candidat.alternanceSearch || {
        sector: "Non spécifié",
        location: "Non spécifié",
        level: "Non spécifié",
        contracttype: "Non spécifié"
      }
    };

    return NextResponse.json(
      { success: true, data: candidatData }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur récupération candidat :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}