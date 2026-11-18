import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixmateDB");

export const auth = betterAuth({
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
