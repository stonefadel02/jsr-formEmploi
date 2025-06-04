import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatPromise from '../../../../models/Candidats';
import bcrypt from 'bcrypt';
import { ApiResponse } from '@/lib/types';

// Données fictives
const fakeCandidats = [
  {
    personalInfo: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '0601234567',
      password: 'password123',
    },
    alternanceSearch: {
      sector: 'Informatique',
      location: 'Paris',
      level: 'Bac+3',
      contracttype: 'Alternance',
    },
    status: 'Validé',
    createdAt: new Date('2025-05-01'),
  },
  {
    personalInfo: {
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      phone: '0609876543',
      password: 'password123',
    },
    alternanceSearch: {
      sector: 'Marketing',
      location: 'Lyon',
      level: 'Bac+5',
      contracttype: 'Alternance',
    },
    status: 'Validé',
    createdAt: new Date('2025-05-15'),
  },
  {
    personalInfo: {
      firstName: 'Ahmed',
      lastName: 'Benali',
      email: 'ahmed.benali@example.com',
      phone: '0605556666',
      password: 'password123',
    },
    alternanceSearch: {
      sector: 'Finance',
      location: 'Marseille',
      level: 'Bac+4',
      contracttype: 'Alternance',
    },
    status: 'En attente',
    createdAt: new Date('2025-06-01'),
  },
  {
    personalInfo: {
      firstName: 'Sophie',
      lastName: 'Leroy',
      email: 'sophie.leroy@example.com',
      phone: '0604445555',
      password: 'password123',
    },
    alternanceSearch: {
      sector: 'Informatique',
      location: 'Toulouse',
      level: 'Bac+3',
      contracttype: 'Alternance',
    },
    status: 'Validé',
    createdAt: new Date('2025-06-02'),
  },
  {
    personalInfo: {
      firstName: 'Thomas',
      lastName: 'Durand',
      email: 'thomas.durand@example.com',
      phone: '0603334444',
      password: 'password123',
    },
    alternanceSearch: {
      sector: 'Ressources Humaines',
      location: 'Paris',
      level: 'Bac+5',
      contracttype: 'Alternance',
    },
    status: 'Validé',
    createdAt: new Date('2025-06-03'),
  },
    {
    personalInfo: {
      firstName: 'Thomas',
      lastName: 'Durand',
      email: 'thogmas.durand@example.com',
      phone: '0603334444',
      password: 'password123',
    },
    alternanceSearch: {
      sector: 'Ressources Humaines',
      location: 'Paris',
      level: 'Bac+5',
      contracttype: 'Alternance',
    },
    status: 'Validé',
    createdAt: new Date('2025-06-03'),
  },
  {
    personalInfo: {
      firstName: 'Thkomas',
      lastName: 'Dukrand',
      email: 'thogkkkmas.durand@example.com',
      phone: '060k3334444',
      password: 'passkword123',
    },
    alternanceSearch: {
      sector: 'Ressources Humaines',
      location: 'Paris',
      level: 'Bac+5',
      contracttype: 'Remote',
    },
    status: 'Validé',
    createdAt: new Date('2025-06-03'),
  },
];

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<string>>> {
  try {
    await connectCandidatsDb();
    const Candidat = await CandidatPromise;

    // Vider la collection existante (optionnel)
    await Candidat.deleteMany({});

    // Hasher les mots de passe et insérer les données
    const candidatsWithHashedPasswords = await Promise.all(
      fakeCandidats.map(async (candidat) => {
        const passwordHash = await bcrypt.hash(candidat.personalInfo.password, 10);
        return {
          ...candidat,
          personalInfo: {
            ...candidat.personalInfo,
            password: passwordHash,
          },
        };
      })
    );

    await Candidat.insertMany(candidatsWithHashedPasswords);

    return NextResponse.json(
      { success: true, data: 'Données fictives insérées avec succès' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données fictives :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}