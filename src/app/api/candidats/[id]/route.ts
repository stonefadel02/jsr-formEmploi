export const config = {
  runtime: 'nodejs',
};

import { NextRequest, NextResponse } from "next/server";
import { connectCandidatsDb } from "@/lib/mongodb";
import CandidatPromise from "../../../../models/Candidats";
import jwt from "jsonwebtoken";
import { ApiResponse, ICandidat } from "@/lib/types";
import mongoose from "mongoose";

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
    
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false, message: 'ID de candidat invalide.' }, { status: 400 });
    }

    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(params.id) }
      },
      {
        $lookup: {
          from: 'personalitytestresults', // Le nom de votre collection de résultats en minuscules
          localField: '_id',
          foreignField: 'candidateId',
          as: 'personalityTestResult' // Le nom du nouveau champ
        }
      },
      {
        $unwind: {
          path: '$personalityTestResult',
          preserveNullAndEmptyArrays: true // Important : garde le candidat même s'il n'a pas de résultat de test
        }
      },
      {
        $project: {
          password: 0
        }
      }
    ];

    const results = await Candidat.aggregate(pipeline);

    if (!results || results.length === 0) {
      return NextResponse.json({ success: false, message: "Candidat introuvable" }, { status: 404 });
    }

    const candidatData = results[0]; // Le premier (et unique) résultat est notre candidat complet
    

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