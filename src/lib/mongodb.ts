import mongoose, { Connection, ConnectOptions } from 'mongoose';

// Types pour les options de connexion
interface MongooseCache {
  candidatsConnection?: Connection;
  employersConnection?: Connection;
}

// Étendre le type global pour inclure mongooseCache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Vérification des variables d'environnement
const MONGODB_CANDIDATS_URI: string = process.env.MONGODB_CANDIDATS_URI!;
const MONGODB_EMPLOYERS_URI: string = process.env.MONGODB_EMPLOYERS_URI!;

if (!MONGODB_CANDIDATS_URI || !MONGODB_EMPLOYERS_URI) {
  throw new Error('Please define MONGODB_CANDIDATS_URI and MONGODB_EMPLOYERS_URI in .env.local');
}

// Cache global pour les connexions
const cached: MongooseCache = global.mongooseCache || {};
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// Options de connexion communes
const connectionOptions: ConnectOptions = {
  // No longer need useNewUrlParser or useUnifiedTopology in Mongoose 6+
};

// Fonction pour connecter à la base candidats
async function connectCandidatsDb(): Promise<Connection> {
  if (cached.candidatsConnection) {
    return cached.candidatsConnection;
  }

  cached.candidatsConnection = await mongoose.createConnection(MONGODB_CANDIDATS_URI, connectionOptions);
  return cached.candidatsConnection;
}

// Fonction pour connecter à la base employeurs
async function connectEmployersDb(): Promise<Connection> {
  if (cached.employersConnection) {
    return cached.employersConnection;
  }

  const connection = mongoose.createConnection(MONGODB_EMPLOYERS_URI, connectionOptions);
await connection.asPromise(); // Attend que la connexion soit bien établie
cached.employersConnection = connection;
return connection;

}

export { connectCandidatsDb, connectEmployersDb };