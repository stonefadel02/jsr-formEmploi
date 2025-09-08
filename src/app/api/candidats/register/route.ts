import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import CandidatModelPromise from '@/models/Candidats';
import { sendVerificationEmail } from '@/lib/mailer';
// On n'a plus besoin du modèle d'abonnement ici

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password )  {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const CandidatModel = await CandidatModelPromise;

    const existingCandidat = await CandidatModel.findOne({ email: email.toLowerCase() });
 if (existingCandidat) {
      if (!existingCandidat.isEmailVerified) {
        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        existingCandidat.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        existingCandidat.emailVerificationExpires = new Date(Date.now() + 3600000); // 1 heure
        await existingCandidat.save();

        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(existingCandidat.email, existingCandidat.firstName || 'Candidat', verificationLink);
        
        return NextResponse.json(
          { message: 'Cet e-mail est déjà en attente. Nous venons de vous renvoyer un nouveau lien de validation.' },
          { status: 200 } // On utilise 200 OK
        );
      }
      return NextResponse.json({ message: 'Cet email est déjà utilisé et actif.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // On crée le candidat avec le statut inactif
    const candidat = await CandidatModel.create({
      email: email.toLowerCase(),
      password: passwordHash,
      firstName,
      lastName, 
      isActive: false, // 🛑 IMPORTANT : Le compte est inactif
       isEmailVerified: false,
    });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 2. Hacher le token avant de le sauvegarder (sécurité)
    candidat.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    
    // 3. Définir une date d'expiration (ex: 1 heure)
    candidat.emailVerificationExpires = new Date(Date.now() + 3600000); 
    await candidat.save();

    // 4. Construire le lien de vérification et envoyer l'e-mail
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(candidat.email, candidat.firstName || 'Candidat', verificationLink);

    // --- FIN DE L'INTÉGRATION ---

    // 5. Renvoyer un message approprié à l'utilisateur
    return NextResponse.json(
      { message: 'Inscription presque terminée ! Veuillez consulter votre boîte de réception ou vos spams pour valider votre e-mail.' },
      { status: 201 }
    );
  
  } catch (error) {
    console.error('Erreur inscription candidat :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}