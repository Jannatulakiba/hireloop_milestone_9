import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("hireloop");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { 
    enabled: true },
  user: {
    additionalFields: {
      role: {
        type: ["seeker", "recruiter", "admin"],
        required: true,
        defaultValue: "seeker",
        input: true, // client theke role pathano allow
      },
    },
  },
 
});