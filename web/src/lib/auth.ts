import { NextRequest } from "next/server";
import { getMongoClient } from "./db";

/**
 * Verify wallet signature for authentication
 * This is a simple implementation - in production, use proper signature verification
 */
export async function verifyWalletAuth(
  address: string,
  signature?: string
): Promise<boolean> {
  if (!address) return false;
  
  // In production, verify the signature against a message
  // For now, just check if address is valid format
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get or create user session
 */
export async function getUserSession(address: string) {
  if (!address) return null;

  const client = await getMongoClient();
  const col = client.db("oblivion").collection("sessions");

  const session = await col.findOne({
    address: address.toLowerCase(),
    expiresAt: { $gt: new Date() },
  });

  if (session) {
    return session;
  }

  // Create new session
  const newSession = {
    address: address.toLowerCase(),
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    lastActivity: new Date(),
  };

  await col.insertOne(newSession);
  return newSession;
}

/**
 * Middleware to require wallet authentication
 * Note: This reads the request body, so call it before reading body in route handler
 */
export async function requireAuth(req: NextRequest): Promise<{
  authenticated: boolean;
  address?: string;
  error?: string;
  body?: any;
}> {
  try {
    // Clone request to read body without consuming it
    const clonedReq = req.clone();
    const body = await clonedReq.json().catch(() => ({}));
    const address = body.address || req.headers.get("x-wallet-address");

    if (!address) {
      return {
        authenticated: false,
        error: "Wallet address required",
        body,
      };
    }

    const isValid = await verifyWalletAuth(address);
    if (!isValid) {
      return {
        authenticated: false,
        error: "Invalid wallet address",
        body,
      };
    }

    await getUserSession(address);

    return {
      authenticated: true,
      address: address.toLowerCase(),
      body,
    };
  } catch (error: any) {
    return {
      authenticated: false,
      error: error?.message || "Authentication failed",
    };
  }
}

