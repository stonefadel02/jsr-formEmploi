import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import CandidatModelPromise from "@/models/Candidats";
import { uploadToCloudinary } from '@/lib/cloudinary';

const allowedFields = [
  "firstName",
  "lastName",
  "phone",
  "formation", // Ajouté
  "alternanceSearch",
  "rgpdConsent" 
];

export async function PUT(req: NextRequest) {
  try {
    let email = "";

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
      email = decoded.email;
    } catch {
      return NextResponse.json({ error: "Token invalide" }, { status: 403 });
    }

    const formData = await req.formData();

    const CandidatModel = await CandidatModelPromise;
    const candidat = await CandidatModel.findOne({ email });

    if (!candidat) {
      return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
    }

    let cvUrl = candidat.cvUrl;
    const cvFile = formData.get('cv') as File | null;
    if (cvFile) {
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
      cvUrl = await uploadToCloudinary(cvBuffer, 'candidats/cvs');
    }

    let videoUrl = candidat.videoUrl;
    const videoFile = formData.get('video') as File | null;
    if (videoFile) {
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      videoUrl = await uploadToCloudinary(videoBuffer, 'candidats/videos');
    }

    let photoUrl = candidat.photoUrl;
    const photoFile = formData.get('photo') as File | null;
    if (photoFile) {
      const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      photoUrl = await uploadToCloudinary(photoBuffer, 'candidats/photos');
    }

    allowedFields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === "alternanceSearch") {
          try {
            const parsed = JSON.parse(value.toString());
            if (typeof parsed === "object") {
              candidat.alternanceSearch = {
                ...candidat.alternanceSearch,
                ...parsed,
              };
            }
          } catch {
            console.warn("alternanceSearch invalide, ignoré.");
          }
        } else if (field === "rgpdConsent") {
          // On s'assure de stocker un booléen
          (candidat as any)[field] = value === 'true';
        } else {
          (candidat as any)[field] = value.toString(); // Ajout de formation et date ici
        }
      }
    });

    candidat.cvUrl = cvUrl;
    candidat.videoUrl = videoUrl;
    candidat.photoUrl = photoUrl;

    await candidat.save();

    return NextResponse.json({ message: "Candidature mise à jour avec succès" });
  } catch (err) {
    console.error("Erreur PUT candidature:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}