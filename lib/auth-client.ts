import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

// Single client instance — signOut/useSession must share this cache so the
// navbar updates immediately after signing out.
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

// Auth role — sign-up, session ar sidebar ei same type use hobe.
export type Role = "seeker" | "recruiter" | "admin";