// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';
// import { connectCandidatsDb } from '@/lib/mongodb';
// import CandidatModelPromise from '@/models/Candidats';
// import EmployerModelPromise from '@/models/Employer';

// export async function POST(req: NextRequest) {
//   try {
//     await connectCandidatsDb();
//     const { token } = await req.json();

//     if (!token) {
//       return NextResponse.json({ success: false, message: 'Token manquant.' }, { status: 400 });
//     }

//     // Hasher le token reçu pour le comparer à celui en BDD
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     const CandidatModel = await CandidatModelPromise;
//     const EmployerModel = await EmployerModelPromise;

//     let user: any = null;
//     let role: string = '';

//     // On cherche d'abord dans les candidats
//     user = await CandidatModel.findOne({
//       emailVerificationToken: hashedToken,
//       emailVerificationExpires: { $gt: Date.now() }, // Vérifie que le token n'est pas expiré
//     });
//     if(user) role = 'candidat';

//     // Si ce n'est pas un candidat, on cherche dans les employeurs
//     if (!user) {
//       user = await EmployerModel.findOne({
//         emailVerificationToken: hashedToken,
//         emailVerificationExpires: { $gt: Date.now() },
//       });
//       if(user) role = 'employeur';
//     }

//     if (!user) {
//       return NextResponse.json({ success: false, message: 'Le lien de vérification est invalide ou a expiré.' }, { status: 400 });
//     }

//     user.isEmailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     if (role === 'candidat') {
//       user.isActive = true; 
//       user.status = 'Validé'; // Assurez-vous que ce status correspond à votre logique
//     }


//     await user.save();
 

//     // On renvoie l'email et le rôle pour que le front-end puisse rediriger vers le paiement
//     const responseMessage = role === 'candidat' 
//       ? 'Email validé avec succès !' 
//       : 'Email validé avec succès ! Préparation du paiement...';
//     return NextResponse.json({ 
//       success: true, 
//       message: responseMessage,
//       email: user.email,
//       role: role
//     });

//   } catch (error) {
//     console.error('Erreur vérification email :', error);
//     return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; // 1. Importer JWT
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatModelPromise from '@/models/Candidats';
import EmployerModelPromise from '@/models/Employer';
// ... (imports restants identiques)

export async function POST(req: NextRequest) {
  try {
    await connectCandidatsDb();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token manquant.' }, { status: 400 });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const CandidatModel = await CandidatModelPromise;
    const EmployerModel = await EmployerModelPromise;

    let user: any = null;
    let role: string = '';

    user = await CandidatModel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });
    
    if(user) {
        role = 'candidat';
    } else {
      user = await EmployerModel.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
      });
      if(user) role = 'employeur';
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Lien invalide ou expiré.' }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    
    if (role === 'candidat') {
      user.isActive = true; 
      user.status = 'Validé';
    }
    
    await user.save();

    // CRÉATION DU TOKEN
    const sessionToken = jwt.sign(
      { id: user._id, email: user.email, role: role, isActive: user.isActive || false },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ 
      success: true, 
      token: sessionToken, // ✅ On renvoie AUSSI le token dans le JSON par sécurité
      role: role,
      email: user.email
    });

    // INSTALLATION DU COOKIE
    response.cookies.set("token", sessionToken, {
      httpOnly: false, // ✅ Mettre à false pour que js-cookie puisse éventuellement le lire
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}