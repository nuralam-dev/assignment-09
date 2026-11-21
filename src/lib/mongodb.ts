import "server-only";

import { MongoClient } from "mongodb";

type MongoConnection = {
  client?: MongoClient;
  connecting?: Promise<MongoClient>;
};

// One pool per server process, including across development hot reloads.
const mongoGlobal = globalThis as typeof globalThis & {
  fixmateMongo?: MongoConnection;
};
const connection = (mongoGlobal.fixmateMongo ??= {});

export async function getMongoConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required on the server.");

  const client = (connection.client ??= new MongoClient(uri));

  // connect() reuses a healthy pool. Explicitly calling it also recovers a
  // topology closed by a failed initial connection before any adapter queries.
  // Concurrent callers share the attempt; a failed promise cannot poison later
  // requests. There is no retry loop and requests never close the shared client.
  connection.connecting ??= client.connect().finally(() => {
    connection.connecting = undefined;
  });
  await connection.connecting;

  return { client, db: client.db("fixmateDB") };
}
