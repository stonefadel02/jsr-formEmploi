// /app/api/quiz/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import PersonalityTestResultModelPromise from '@/models/PersonalityTestResult';
import { connectCandidatsDb } from '@/lib/mongodb';
import { profileDescriptions } from '@/data/personalityMapping';

export async function POST(req: NextRequest) {
  try {
    await connectCandidatsDb();

    // Authentification
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    if (decoded.role !== 'candidat') {
      return NextResponse.json({ message: 'Accès refusé.' }, { status: 403 });
    }

    // Récupération des réponses
    const body = await req.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length !== 6) {
      return NextResponse.json({ message: 'Réponses invalides.' }, { status: 400 });
    }

    // Calcul du profil dominant
    const profileCount: Record<string, number> = {};
    for (const answer of answers) {
      profileCount[answer] = (profileCount[answer] || 0) + 1;
    }

    const sortedProfiles = Object.entries(profileCount).sort((a, b) => b[1] - a[1]);
    const [dominantProfile] = sortedProfiles[0] as [keyof typeof profileDescriptions, number];

    const summary = profileDescriptions[dominantProfile];

    if (!summary) {
      return NextResponse.json({ message: 'Profil non reconnu.' }, { status: 400 });
    }

    // Sauvegarde
    const PersonalityTestResultModel = await PersonalityTestResultModelPromise;

    await PersonalityTestResultModel.create({
      candidateId: decoded.id,
      answers,
      resultType: dominantProfile,
      summary,
    });

    return NextResponse.json({
      message: 'Résultat enregistré.',
      result: {
        resultType: dominantProfile,
        emoji: summary.emoji,
        description: summary.description,
      },
    }, { status: 201 });
  } catch (err) {
    console.error('Erreur API test personnalité :', err);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}
