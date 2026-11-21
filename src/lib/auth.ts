import "server-only";

import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import type { Db, MongoClient } from "mongodb";
import { getMongoConnection } from "@/lib/mongodb";

function createAuth(db: Db, client: MongoClient) {
  return betterAuth({
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: ["customer", "technician", "admin"],
          input: false,
          defaultValue: "customer",
        },
      },
    },
    database: mongodbAdapter(db, {
      client,
    }),
  });
}

export type Auth = ReturnType<typeof createAuth>;
let auth: Auth | undefined;

export async function getAuth() {
  // Do not start BetterAuth's index/session queries on an unconnected topology.
  const { db, client } = await getMongoConnection();
  auth ??= createAuth(db, client);
  return auth;
}
