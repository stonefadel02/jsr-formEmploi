// /app/api/employeurs/stats/route.ts

import { NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import SubscriptionModel from '@/models/Subscription';

export async function GET() {
  try {
    await connectEmployersDb();
    const SubscriptionModelResolved = await SubscriptionModel;
    const now = new Date();

    const totalActifs = await SubscriptionModelResolved.countDocuments({ isActive: true });
    const totalEssais = await SubscriptionModelResolved.countDocuments({
      isTrial: true,
      startDate: { $gte: new Date(now.setMonth(now.getMonth() - 2)) },
    });
    const expirés = await SubscriptionModelResolved.countDocuments({
      isActive: false,
      isTrial: false,
      // endDate: { $lt: new Date() },
    });

    const revenusAgg = await SubscriptionModelResolved.aggregate([
      {
        $match: {
          startDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' },
        },
      },
    ]);

    const revenusMensuels = revenusAgg[0]?.total || 0;

    return NextResponse.json({
      totalActifs,
      totalEssais,
      expirés,
      revenusMensuels,
    });
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { error: 'Erreur serveur', message },
      { status: 500 }
    );
  }
}
