// import { NextResponse } from 'next/server';
// import SubscriptionModelPromise from '@/models/Subscription';
// import EmployerModelPromise from '@/models/Employer';
// import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription'; // Nouveau modèle
// import CandidatModelPromise from '@/models/Candidats'; // Nouveau modèle
// import { sendExpirationEmail } from '@/lib/mailer'; // Utilise ton mailer existant

// export async function GET() {
//   try {
//     const SubscriptionModel = await SubscriptionModelPromise;
//     const EmployerModel = await EmployerModelPromise;
//     const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;
//     const CandidatModel = await CandidatModelPromise;
//     const now = new Date();

//     // 🔁 Fin de la période d’essai après 1 mois pour les employeurs
//     const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//     const expiredEmployerTrials = await SubscriptionModel.find({
//       isTrial: true,
//       startDate: { $lte: oneMonthAgo },
//     });
//     for (const sub of expiredEmployerTrials) {
//       const employer = await EmployerModel.findById(sub.employerId);
//       if (employer) {
//         await SubscriptionModel.updateOne({ _id: sub._id }, { $set: { isTrial: false } });
//         await sendExpirationEmail(sub.email, employer.role, sub.endDate || now);
//       }
//     }

//     // 🔁 Fin de l'abonnement annuel pour les employeurs
//     const expiredEmployerSubscriptions = await SubscriptionModel.find({
//       isActive: true,
//       endDate: { $lte: now },
//     });
//     for (const sub of expiredEmployerSubscriptions) {
//       const employer = await EmployerModel.findById(sub.employerId);
//       if (employer) {
//         await SubscriptionModel.updateOne({ _id: sub._id }, { $set: { isActive: false } });
//         await sendExpirationEmail(sub.email, employer.role, sub.endDate || now);
//       }
//     }

//     // 🔁 Fin de la période d’essai après 1 mois pour les candidats
//     const expiredCandidatTrials = await CandidatSubscriptionModel.find({
//       isTrial: true,
//       startDate: { $lte: oneMonthAgo },
//     });
//     for (const sub of expiredCandidatTrials) {
//       const candidat = await CandidatModel.findById(sub.candidatId);
//       if (candidat) {
//         await CandidatSubscriptionModel.updateOne({ _id: sub._id }, { $set: { isTrial: false } });
//         await sendExpirationEmail(sub.email, candidat.role || 'candidat', sub.endDate || now);
//       }
//     }

//     // 🔁 Fin de l'abonnement annuel pour les candidats
//     const expiredCandidatSubscriptions = await CandidatSubscriptionModel.find({
//       isActive: true,
//       endDate: { $lte: now },
//     });
//     for (const sub of expiredCandidatSubscriptions) {
//       const candidat = await CandidatModel.findById(sub.candidatId);
//       if (candidat) {
//         await CandidatSubscriptionModel.updateOne({ _id: sub._id }, { $set: { isActive: false } });
//         await sendExpirationEmail(sub.email, candidat.role || 'candidat', sub.endDate || now);
//       }
//     }

//     return NextResponse.json({ message: 'Mise à jour des abonnements réussie' });
//   } catch (error: any) {
//     console.error('[CRON] Erreur:', error.message);
//     return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import SubscriptionModelPromise from '@/models/Subscription';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription';
import { sendExpirationEmail } from '@/lib/mailer';

export async function GET() {
  try {
    const SubscriptionModel = await SubscriptionModelPromise;
    const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;
    const now = new Date();

    // 🔁 Fin de la période d’essai après 1 mois pour les employeurs
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const expiredEmployerTrials = await SubscriptionModel.find({
      isTrial: true,
      startDate: { $lte: oneMonthAgo },
    }).populate('employerId'); // Pré-remplir employerId pour accéder à l'email
    for (const sub of expiredEmployerTrials) {
      const employer = sub.employerId as any; // Type assertion car populate retourne un objet mixte
      if (employer && employer.email) {
        await SubscriptionModel.updateOne({ _id: sub._id }, { $set: { isTrial: false } });
        await sendExpirationEmail(employer.email, employer.role, sub.endDate || now);
      } else {
        console.warn(`[CRON] Employeur non trouvé ou email manquant pour subscription ${sub._id}`);
      }
    }

    // 🔁 Fin de l'abonnement annuel pour les employeurs
    const expiredEmployerSubscriptions = await SubscriptionModel.find({
      isActive: true,
      endDate: { $lte: now },
    }).populate('employerId');
    for (const sub of expiredEmployerSubscriptions) {
      const employer = sub.employerId as any;
      if (employer && employer.email) {
        await SubscriptionModel.updateOne({ _id: sub._id }, { $set: { isActive: false } });
        await sendExpirationEmail(employer.email, employer.role, sub.endDate || now);
      } else {
        console.warn(`[CRON] Employeur non trouvé ou email manquant pour subscription ${sub._id}`);
      }
    }

    // 🔁 Fin de la période d’essai après 1 mois pour les candidats
    const expiredCandidatTrials = await CandidatSubscriptionModel.find({
      isTrial: true,
      startDate: { $lte: oneMonthAgo },
    }).populate('candidatId');
    for (const sub of expiredCandidatTrials) {
      const candidat = sub.candidatId as any;
      if (candidat && candidat.email) {
        await CandidatSubscriptionModel.updateOne({ _id: sub._id }, { $set: { isTrial: false } });
        await sendExpirationEmail(candidat.email, candidat.role || 'candidat', sub.endDate || now);
      } else {
        console.warn(`[CRON] Candidat non trouvé ou email manquant pour subscription ${sub._id}`);
      }
    }

    // 🔁 Fin de l'abonnement annuel pour les candidats
    const expiredCandidatSubscriptions = await CandidatSubscriptionModel.find({
      isActive: true,
      endDate: { $lte: now },
    }).populate('candidatId');
    for (const sub of expiredCandidatSubscriptions) {
      const candidat = sub.candidatId as any;
      if (candidat && candidat.email) {
        await CandidatSubscriptionModel.updateOne({ _id: sub._id }, { $set: { isActive: false } });
        await sendExpirationEmail(candidat.email, candidat.role || 'candidat', sub.endDate || now);
      } else {
        console.warn(`[CRON] Candidat non trouvé ou email manquant pour subscription ${sub._id}`);
      }
    }

    return NextResponse.json({ message: 'Mise à jour des abonnements réussie' });
  } catch (error: any) {
    console.error('[CRON] Erreur:', error.message);
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 });
  }
}