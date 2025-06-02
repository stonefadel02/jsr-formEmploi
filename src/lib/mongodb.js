// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_CANDIDATS_URI = process.env.MONGODB_CANDIDATS_URI;
const MONGODB_EMPLOYERS_URI = process.env.MONGODB_EMPLOYERS_URI;

if (!MONGODB_CANDIDATS_URI || !MONGODB_EMPLOYERS_URI) {
  throw new Error('Please define MONGODB_CANDIDATES_URI and MONGODB_EMPLOYERS_URI in .env.local');
}

let cached = global.mongoose || { candidatsConn: null, employersConn: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectCandidatsDb() {
  if (cached.candidatsConn) {
    return cached.candidatsConn;
  }

  const opts = { bufferCommands: false };
  cached.candidatsConn = await mongoose.createConnection(MONGODB_CANDIDATS_URI, opts);
  return cached.candidatsConn;
}

async function connectEmployersDb() {
  if (cached.employersConn) {
    return cached.employersConn;
  }

  const opts = { bufferCommands: false };
  cached.employersConn = await mongoose.createConnection(MONGODB_EMPLOYERS_URI, opts);
  return cached.employersConn;
}

export { connectCandidatsDb, connectEmployersDb };