import "server-only";

import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";
import { z } from "zod";

import { env } from "@/lib/env";

export const ANONYMOUS_SESSION_COOKIE = "amanklik_sid";
const sessionIdSchema = z.string().uuid();

export function getAnonymousSessionId(options: { create: false }): Promise<string | null>;
export function getAnonymousSessionId(options?: { create?: true }): Promise<string>;
export async function getAnonymousSessionId({ create = true } = {}): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(ANONYMOUS_SESSION_COOKIE)?.value;

  if (existing && sessionIdSchema.safeParse(existing).success) {
    return existing;
  }

  if (!create) return null;

  const sessionId = randomUUID();
  cookieStore.set(ANONYMOUS_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return sessionId;
}
