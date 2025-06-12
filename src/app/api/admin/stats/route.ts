// /app/api/employeurs/stats/route.ts

import { NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import { connectCandidatsDb } from '@/lib/mongodb';
import EmployerModelPromise from '@/models/Employer';
import CandidatModelPromise from '@/models/Candidats';

export async function GET() {
  try {
    await connectEmployersDb();
    const EmployerModel = await EmployerModelPromise;
    const employeurs = await EmployerModel.countDocuments({});
    await connectCandidatsDb();
    const CandidatModel = await CandidatModelPromise;
    const candidats = await CandidatModel.countDocuments({});


    return NextResponse.json({
        employeurs,
        candidats,
        }, {
        status: 200,
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
