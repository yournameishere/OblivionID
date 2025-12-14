import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI not set; API routes will fail until configured.");
}

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

export async function getMongoClient() {
  if (globalForMongo.mongoClient) return globalForMongo.mongoClient;
  if (!uri) throw new Error("MONGODB_URI missing");
  const client = new MongoClient(uri);
  await client.connect();
  globalForMongo.mongoClient = client;
  return client;
}

