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
      // S'assurer que l'URL du CV est bien présente
      cvUrl: candidat.cvUrl || candidat.cv?.url || null,
      // S'assurer que l'URL de la vidéo est bien présente
      videoUrl: candidat.videoUrl || candidat.video?.url || null,
      // Informations personnelles
      firstName: candidat.firstName || candidat.personalInfo?.firstName || "Non spécifié",
      lastName: candidat.lastName || candidat.personalInfo?.lastName || "Non spécifié",
      email: candidat.email || candidat.personalInfo?.email || "Non spécifié",
      // Compétences
      skills: candidat.skills || [],
      // Expérience
      experience: candidat.experience || [],
      // Recherche d'alternance
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