import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_CANDIDATS_URI;
if (!uri) throw new Error("Please define MONGODB_CANDIDATS_URI in .env.local");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Étend proprement l’interface globale pour TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}


// En développement, conserve une instance globale
if (process.env.NODE_ENV !== "production") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // En production, pas besoin de variable globale
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
