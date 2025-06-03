import mongoose from 'mongoose';
import { connectEmployersDb, connectCandidatsDb } from '../src/lib/mongodb.js';
import employerSchema from '../src/models/Employer.js';
import candidatSchema from '../src/models/Candidate.js';

async function seed() {
  try {
    const employersDb = await connectEmployersDb();
    const candidatsDb = await connectCandidatsDb();

    const Employer = employersDb.model('Employer', employerSchema);
    const Candidat = candidatsDb.model('Candidat', candidatSchema);

    await Employer.create({
      companyName: 'Test Corp',
      email: 'test@corp.com',
      passwordHash: 'hashedPassword123',
    });

    await Candidat.create({
      personalInfo: {
        firstName: 'Alice',
        lastName: 'Doe',
        email: 'alice@example.com',
      },
      alternanceSearch: {
        sector: 'Marketing',
        location: 'Lyon',
        desiredPosition: 'Assistant Communication',
      },
      passwordHash: 'hashedPassword123',
      cvUrl: 'https://example.com/cv.pdf',
      videoUrl: 'https://example.com/video.mp4',
    });

    console.log('✅ Données insérées avec succès.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur pendant le seed :', err);
    process.exit(1);
  }
}

seed();
