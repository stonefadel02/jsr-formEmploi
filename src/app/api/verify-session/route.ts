import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import jwt from 'jsonwebtoken';
import CandidatModelPromise from '@/models/Candidats';
import EmployerModelPromise from '@/models/Employer';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription';
import SubscriptionModelPromise from '@/models/Subscription';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID manquant." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const userEmail = session.customer_details?.email;
      if (!userEmail) {
        return NextResponse.json({ success: false, message: "Email non trouvé dans la session Stripe." }, { status: 400 });
      }

      const CandidatModel = await CandidatModelPromise;
      const EmployerModel = await EmployerModelPromise;
      const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;
      const SubscriptionModel = await SubscriptionModelPromise;
      
      let user: any = null;
      let role: string = '';

      // On calcule la nouvelle date de fin (1 an à partir d'aujourd'hui)
      const newEndDate = new Date();
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      // --- LOGIQUE UNIFIÉE POUR L'ACTIVATION ET LE RENOUVELLEMENT ---

      // On cherche d'abord si c'est un candidat
      const candidat = await CandidatModel.findOne({ email: userEmail });
      if (candidat) {
        user = candidat;
        role = 'candidat';
        
        // On active le compte du candidat
        user.status = 'Validé';
        user.isActive = true;
        await user.save();

        // On met à jour ou on crée son abonnement avec la nouvelle date de fin
        await CandidatSubscriptionModel.findOneAndUpdate(
          { candidatId: candidat._id },
          { 
            $set: {
              isActive: true,
              endDate: newEndDate,
              plan: 'Payant Annuel', // Mettez le nom de votre plan
              isTrial: false, // On s'assure que ce n'est plus un essai
              startDate: new Date(), // On met à jour la date de début au renouvellement
            }
          },
          { upsert: true } // "upsert: true" crée l'abonnement s'il n'existe pas, sinon il le met à jour.
        );
      } else {
        // Si ce n'est pas un candidat, on cherche un employeur
        const employer = await EmployerModel.findOne({ email: userEmail });
        if (employer) {
          user = employer;
          role = 'employeur';
          
          // On active le compte de l'employeur
          user.isActive = true;
          user.status = 'Validé';
          await user.save();

          // On met à jour ou on crée son abonnement
          await SubscriptionModel.findOneAndUpdate(
            { employerId: employer._id },
            { 
              $set: {
                isActive: true,
                endDate: newEndDate,

                plan: 'Payant Annuel',
                isTrial: false,
                startDate: new Date(),
              }
            },
            { upsert: true }
          );
        }
      }
      
      if (user && role) {
        const token = jwt.sign(
          { id: user._id, email: user.email, role: role, isActive: true },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return NextResponse.json({ 
          success: true, 
          message: "Paiement réussi, votre compte est maintenant actif.",
          token: token,
          role: role
        });
      } else {
        // Cette erreur ne devrait plus arriver si l'utilisateur s'est pré-inscrit
        return NextResponse.json({ success: false, message: "Utilisateur introuvable pour activer l'abonnement." }, { status: 404 });
      }

    } else {
      return NextResponse.json({ success: false, message: "Paiement non complété" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}