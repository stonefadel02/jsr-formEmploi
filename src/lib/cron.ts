// lib/cron.ts
import cron from 'node-cron';
import mongoose from 'mongoose';
import SubscriptionPromiseModel from '@/models/Subscription';
import { connectEmployersDb } from './mongodb';

async function checkExpiredTrials() {
  await connectEmployersDb()

  const SubscriptionModel = await SubscriptionPromiseModel

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  const expired = await SubscriptionModel.updateMany(
    {
      isActive: true,
      isTrial: true,
      createdAt: { $lte: twoMonthsAgo },
    },
    {
      $set: { isActive: false, isTrial: false },
    }
  );

  console.log(`[CRON] ${expired.modifiedCount} abonnements expirés mis à jour`);
}

// Lance la tâche tous les jours à 00:00
cron.schedule('0 0 * * *', () => {
  console.log('[CRON] Vérification des abonnements...');
  checkExpiredTrials();
});
