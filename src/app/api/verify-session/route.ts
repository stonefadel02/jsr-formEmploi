import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import jwt from 'jsonwebtoken';
import { connectCandidatsDb ,connectEmployersDb} from '@/lib/mongodb'; // Assurez-vous que le chemin est bon
import CandidatModelPromise from '@/models/Candidats';
import EmployerModelPromise from '@/models/Employer';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription';
import SubscriptionModelPromise from '@/models/Subscription'; // Assurez-vous d'importer celui-ci
const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(req: NextRequest) {
  try {
    // ✅ 1. Toujours se connecter à la BDD au début
    await connectCandidatsDb(); 

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID manquant." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const userEmail = session.customer_details?.email;
      // ✅ 2. On lit le rôle depuis les métadonnées de Stripe, c'est la source de vérité
      const userRole = session.metadata?.user_role; 

      if (!userEmail || !userRole) {
        return NextResponse.json({ success: false, message: "Email ou rôle manquant dans la session Stripe." }, { status: 400 });
      }

      let user: any = null;
      const newEndDate = new Date();
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);

      // ✅ 3. On utilise le rôle pour interroger la bonne collection, sans ambiguïté
      if (userRole === 'candidat') {
        const CandidatModel = await CandidatModelPromise;
        const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;
        
        user = await CandidatModel.findOne({ email: userEmail });
        if (user) {
          user.isActive = true;
          user.status = 'Validé';
          await user.save();
          
          await CandidatSubscriptionModel.findOneAndUpdate(
            { candidatId: user._id },
            { $set: { isActive: true, endDate: newEndDate, plan: 'Payant Annuel', isTrial: false, startDate: new Date() }},
            { upsert: true }
          );
        }
      }else if (userRole === 'employeur') {
        // ✅ DÉBUT DE LA LOGIQUE CORRIGÉE POUR L'EMPLOYEUR
        await connectEmployersDb(); // On se connecte à la BDD des employeurs
        const EmployerModel = await EmployerModelPromise;
        const SubscriptionModel = await SubscriptionModelPromise;

        user = await EmployerModel.findOne({ email: userEmail });
        if (user) {
            user.isActive = true;
            // Assurez-vous que votre modèle Employer a bien un champ 'status'
            user.status = 'Validé'; 
            await user.save();

            // On met à jour la collection SÉPARÉE des abonnements pour l'employeur
            const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
              { employerId: user._id },
              { 
                $set: { 
                  isActive: true, 
                  endDate: newEndDate, 
                  plan: 'Payant Annuel', 
                  isTrial: false, 
                  startDate: new Date() 
                }
              },
              { upsert: true }
            );

                user.isActive = true;
          user.status = 'Validé';
          user.subscription = {
            plan: updatedSubscription?.plan,
            isActive: updatedSubscription?.isActive,
            startDate: updatedSubscription?.startDate,
            endDate: updatedSubscription?.endDate,
          };
          await user.save();
        }
        // ✅ FIN DE LA LOGIQUE CORRIGÉE
      }
      
      if (user) {
        const token = jwt.sign(
          { id: user._id, email: user.email, role: userRole, isActive: true },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

        return NextResponse.json({ 
          success: true, 
          message: "Paiement réussi, votre compte est maintenant actif.",
          token: token,
          role: userRole
        });
      } else {
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