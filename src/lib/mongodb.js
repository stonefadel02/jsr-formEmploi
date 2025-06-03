import mongoose from 'mongoose';

const MONGODB_CANDIDATS_URI = process.env.MONGODB_CANDIDATS_URI;
const MONGODB_EMPLOYERS_URI = process.env.MONGODB_EMPLOYERS_URI;

if (!MONGODB_CANDIDATS_URI || !MONGODB_EMPLOYERS_URI) {
  throw new Error('Please define MONGODB_CANDIDATS_URI and MONGODB_EMPLOYERS_URI in .env.local');
}

let cached = global.mongooseCache || { candidatsPromise: null, employersPromise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function connectCandidatsDb() {
  if (cached.candidatsPromise) {
    return cached.candidatsPromise;
  }
  cached.candidatsPromise = mongoose.connect(MONGODB_CANDIDATS_URI);
  return cached.candidatsPromise;
}

async function connectEmployersDb() {
  if (cached.employersPromise) {
    return cached.employersPromise;
  }
  cached.employersPromise = mongoose.connect(MONGODB_EMPLOYERS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return cached.employersPromise;
}

export { connectCandidatsDb, connectEmployersDb };
