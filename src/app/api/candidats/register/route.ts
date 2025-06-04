import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatPromise from '../../../../models/Candidats';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse, IPersonalInfo, IAlternanceSearch } from '@/lib/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface RegisterResponse {
  message: string;
  token: string;
  candidat: {
    email: string;
    _id: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
  try {
    // Récupérer les données de la requête multipart/form-data
    const formData = await req.formData();

    // Extraire les champs texte
    const fields: Record<string, string> = {};
    const files: Record<string, File> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value;
      } else {
        files[key] = value;
      }
    }

    // Log pour déboguer
    console.log('Champs reçus:', fields);
    console.log('Fichiers reçus:', files);

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      sector,
      location,
      level,
      contracttype,
    } = fields;

    // Log spécifique pour email et password
    console.log('Email reçu:', email);
    console.log('Password reçu:', password);

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants.' }, { status: 400 });
    }

    await connectCandidatsDb();
    const Candidat = await CandidatPromise;

    // Vérifier si l'email existe déjà
    const existing = await Candidat.findOne({ 'personalInfo.email': email });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Gérer l'upload du CV
    let cvUrl = '';
    const cvFile = files['cv'];
    if (cvFile) {
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
      cvUrl = await uploadToCloudinary(cvBuffer, 'candidats/cvs');
    }

    // Gérer l'upload de la vidéo
    let videoUrl = '';
    const videoFile = files['video'];
    if (videoFile) {
      const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
      videoUrl = await uploadToCloudinary(videoBuffer, 'candidats/videos');
    }

    // Créer le candidat
    const personalInfo: IPersonalInfo = {
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      phone: phone || '',
      password: passwordHash,
    };

    const alternanceSearch: IAlternanceSearch = {
      sector: sector || '',
      location: location || '',
      level: level || '',
      contracttype: contracttype || '',
    };

    const candidat = await Candidat.create({
      personalInfo,
      alternanceSearch,
      cvUrl,
      videoUrl,
      status: 'En attente',
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: candidat._id, email: candidat.personalInfo.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Candidat inscrit avec succès');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Candidat inscrit avec succès',
        token,
        candidat: {
          email: candidat.personalInfo.email,
          _id: candidat._id.toString(),
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser par défaut pour gérer multipart/form-data
  },
};