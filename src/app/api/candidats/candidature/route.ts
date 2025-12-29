// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";
// import CandidatModelPromise from "@/models/Candidats";
// import { uploadToCloudinary } from '@/lib/cloudinary';

// const allowedFields = [
//   "firstName",
//   "lastName",
//   "phone",
//   "formation", // Ajouté
//   "alternanceSearch",
//   "rgpdConsent" 
// ];

// export async function PUT(req: NextRequest) {
//   try {
//     let email = "";

//     const token = req.cookies.get('token')?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Token manquant" }, { status: 401 });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
//       email = decoded.email;
//     } catch {
//       return NextResponse.json({ error: "Token invalide" }, { status: 403 });
//     }

//     const formData = await req.formData();

//     const CandidatModel = await CandidatModelPromise;
//     const candidat = await CandidatModel.findOne({ email });

//     if (!candidat) {
//       return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
//     }

//     let cvUrl = candidat.cvUrl;
//     const cvFile = formData.get('cv') as File | null;
//     if (cvFile) {
//       const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
//       cvUrl = await uploadToCloudinary(cvBuffer, 'candidats/cvs');
//     }

//     let videoUrl = candidat.videoUrl;
//     const videoFile = formData.get('video') as File | null;
//     if (videoFile) {
//       const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
//       videoUrl = await uploadToCloudinary(videoBuffer, 'candidats/videos');
//     }

//     let photoUrl = candidat.photoUrl;
//     const photoFile = formData.get('photo') as File | null;
//     if (photoFile) {
//       const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
//       photoUrl = await uploadToCloudinary(photoBuffer, 'candidats/photos');
//     }

//     allowedFields.forEach((field) => {
//       const value = formData.get(field);
//       if (value !== null) {
//         if (field === "alternanceSearch") {
//           try {
//             const parsed = JSON.parse(value.toString());
//             if (typeof parsed === "object") {
//               candidat.alternanceSearch = {
//                 ...candidat.alternanceSearch,
//                 ...parsed,
//               };
//             }
//           } catch {
//             console.warn("alternanceSearch invalide, ignoré.");
//           }
//         } else if (field === "rgpdConsent") {
//           // On s'assure de stocker un booléen
//           (candidat as any)[field] = value === 'true';
//         } else {
//           (candidat as any)[field] = value.toString(); // Ajout de formation et date ici
//         }
//       }
//     });

//     candidat.cvUrl = cvUrl;
//     candidat.videoUrl = videoUrl;
//     candidat.photoUrl = photoUrl;

//     await candidat.save();

//     return NextResponse.json({ message: "Candidature mise à jour avec succès" });
//   } catch (err) {
//     console.error("Erreur PUT candidature:", err);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }

// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";
// import CandidatModelPromise from "@/models/Candidats";

// const allowedFields = [
//   "firstName",
//   "lastName",
//   "phone",
//   "formation",
//   "alternanceSearch",
//   "rgpdConsent",
//   "cvUrl",
//   "videoUrl",
//   "photoUrl",
// ];

// export async function PUT(req: NextRequest) {
//   try {
//     let email = "";
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Token manquant" }, { status: 401 });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
//       email = decoded.email;
//     } catch {
//       return NextResponse.json({ error: "Token invalide" }, { status: 403 });
//     }

//     const formData = await req.formData();
    
  
//     for (const [key, value] of formData.entries()) {
//     }

//     const CandidatModel = await CandidatModelPromise;
//     const candidat = await CandidatModel.findOne({ email });

//     if (!candidat) {
//       return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
//     }

   

//     let hasChanges = false;

//     allowedFields.forEach((field) => {
//       const value = formData.get(field);
//       if (value !== null && value !== "") {
        
//         if (field === "alternanceSearch") {
//           try {
//             const parsed = JSON.parse(value.toString());
//             if (typeof parsed === "object") {
//               candidat.alternanceSearch = {
//                 ...candidat.alternanceSearch,
//                 ...parsed,
//               };
//               hasChanges = true;
//             }
//           } catch (error) {
//             console.warn("alternanceSearch invalide, ignoré:", error);
//           }
//         } else if (field === "rgpdConsent") {
//           candidat[field] = value === "true";
//           hasChanges = true;
//         } else {
//           const newValue = value.toString();
//           if (candidat[field] !== newValue) {
//             candidat[field] = newValue;
//             hasChanges = true;
//           }
//         }
//       }
//     });

//     if (!hasChanges) {
//       return NextResponse.json({ message: "Aucune modification détectée" });
//     }

   

//     await candidat.save();

//     // Retourner les données mises à jour pour vérification
//     return NextResponse.json({ 
//       message: "Candidature mise à jour avec succès",
//       updatedFields: {
//         cvUrl: candidat.cvUrl,
//         videoUrl: candidat.videoUrl,
//         photoUrl: candidat.photoUrl
//       }
//     });
//   } catch (err) {
//     console.error("Erreur PUT candidature:", err);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
// import jwt from "jsonwebtoken";
// import { NextRequest, NextResponse } from "next/server";
// import CandidatModelPromise from "@/models/Candidats";

// const allowedFields = [
//   "firstName",
//   "lastName",
//   "phone",
//   "formation",
//   "alternanceSearch",
//   "rgpdConsent",
//   "cvUrl",
//   "videoUrl",
//   "photoUrl",
// ];

// export async function PUT(req: NextRequest) {
//   try {
//     let email = "";
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Token manquant" }, { status: 401 });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
//       email = decoded.email;
//     } catch {
//       return NextResponse.json({ error: "Token invalide" }, { status: 403 });
//     }

//     const formData = await req.formData();
    
  
//     for (const [key, value] of formData.entries()) {
//     }

//     const CandidatModel = await CandidatModelPromise;
//     const candidat = await CandidatModel.findOne({ email });

//     if (!candidat) {
//       return NextResponse.json({ error: "Candidat introuvable" }, { status: 404 });
//     }

   

//     let hasChanges = false;

//     allowedFields.forEach((field) => {
//       const value = formData.get(field);
//       if (value !== null && value !== "") {
        
//         if (field === "alternanceSearch") {
//           try {
//             const parsed = JSON.parse(value.toString());
//             if (typeof parsed === "object") {
//               candidat.alternanceSearch = {
//                 ...candidat.alternanceSearch,
//                 ...parsed,
//               };
//               hasChanges = true;
//             }
//           } catch (error) {
//             console.warn("alternanceSearch invalide, ignoré:", error);
//           }
//         } else if (field === "rgpdConsent") {
//           candidat[field] = value === "true";
//           hasChanges = true;
//         } else {
//           const newValue = value.toString();
//           if (candidat[field] !== newValue) {
//             candidat[field] = newValue;
//             hasChanges = true;
//           }
//         }
//       }
//     });

//     if (!hasChanges) {
//       return NextResponse.json({ message: "Aucune modification détectée" });
//     }

   

//     await candidat.save();

//     // Retourner les données mises à jour pour vérification
//     return NextResponse.json({ 
//       message: "Candidature mise à jour avec succès",
//       updatedFields: {
//         cvUrl: candidat.cvUrl,
//         videoUrl: candidat.videoUrl,
//         photoUrl: candidat.photoUrl
//       }
//     });
//   } catch (err) {
//     console.error("Erreur PUT candidature:", err);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import CandidatModelPromise from "@/models/Candidats";

const allowedFields = [
  "firstName",
  "lastName",
  "phone",
  "formation",
  "alternanceSearch",
  "rgpdConsent",
  "cvUrl",
  "videoUrl",
  "photoUrl",
];

// Interface pour le payload JWT
interface JwtPayload {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

export async function PUT(req: NextRequest) {
  try {
    // ✅ 1. Récupérer le token depuis les cookies
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      console.log("❌ Token manquant dans les cookies");
      return NextResponse.json(
        { error: "Vous n'êtes pas connecté. Veuillez vous reconnecter." }, 
        { status: 401 }
      );
    }

    // ✅ 2. Vérifier et décoder le token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      console.log("✅ Token vérifié:", { email: decoded.email, role: decoded.role });
    } catch (error) {
      console.log("❌ Token invalide:", error);
      return NextResponse.json(
        { error: "Session expirée. Veuillez vous reconnecter." }, 
        { status: 403 }
      );
    }

    // ✅ 3. Vérifier que c'est bien un candidat
    if (decoded.role !== 'candidat') {
      return NextResponse.json(
        { error: "Accès non autorisé. Cette page est réservée aux candidats." }, 
        { status: 403 }
      );
    }

    // ✅ 4. Récupérer les données du formulaire
    const formData = await req.formData();
    
    console.log("📋 Données reçues:");
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, typeof value === 'string' ? value.substring(0, 50) : value);
    }

    // ✅ 5. Trouver le candidat dans la base de données
    const CandidatModel = await CandidatModelPromise;
    const candidat = await CandidatModel.findOne({ email: decoded.email });

    if (!candidat) {
      console.log("❌ Candidat introuvable pour l'email:", decoded.email);
      return NextResponse.json(
        { error: "Votre profil n'a pas été trouvé." }, 
        { status: 404 }
      );
    }

    console.log("✅ Candidat trouvé:", candidat.email);

    // ✅ 6. Mettre à jour les champs autorisés
    let hasChanges = false;

    allowedFields.forEach((field) => {
      const value = formData.get(field);
      
      if (value !== null && value !== "") {
        if (field === "alternanceSearch") {
          try {
            const parsed = JSON.parse(value.toString());
            if (typeof parsed === "object") {
              candidat.alternanceSearch = {
                ...candidat.alternanceSearch,
                ...parsed,
              };
              hasChanges = true;
              console.log("✅ alternanceSearch mis à jour");
            }
          } catch (error) {
            console.warn("⚠️ alternanceSearch invalide, ignoré:", error);
          }
        } else if (field === "rgpdConsent") {
          candidat[field] = value === "true";
          hasChanges = true;
          console.log("✅ rgpdConsent mis à jour");
        } else {
          const newValue = value.toString();
          if (candidat[field] !== newValue) {
            candidat[field] = newValue;
            hasChanges = true;
            console.log(`✅ ${field} mis à jour`);
          }
        }
      }
    });

    if (!hasChanges) {
      console.log("ℹ️ Aucune modification détectée");
      return NextResponse.json({ 
        message: "Aucune modification détectée",
        candidat: {
          cvUrl: candidat.cvUrl,
          videoUrl: candidat.videoUrl,
          photoUrl: candidat.photoUrl
        }
      });
    }

    // ✅ 7. Sauvegarder les modifications
    await candidat.save();
    console.log("✅ Candidature sauvegardée avec succès");

    // ✅ 8. Retourner la confirmation
    return NextResponse.json({ 
      success: true,
      message: "Candidature mise à jour avec succès",
      updatedFields: {
        cvUrl: candidat.cvUrl,
        videoUrl: candidat.videoUrl,
        photoUrl: candidat.photoUrl,
        firstName: candidat.firstName,
        lastName: candidat.lastName
      }
    });

  } catch (err) {
    console.error("❌ Erreur PUT candidature:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de votre candidature." }, 
      { status: 500 }
    );
  }
}