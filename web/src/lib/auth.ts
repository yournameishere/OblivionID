import { NextRequest } from "next/server";
import { verifyMessage } from "viem";
import { getMongoClient } from "./db";

/** Message that clients must sign for authentication */
export const AUTH_MESSAGE = "Sign in to OblivionID";

/**
 * Verify wallet signature for authentication (EIP-191 personal sign)
 */
export async function verifyWalletAuth(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  if (!address || !message || !signature) return false;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
  try {
    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });
    return valid;
  } catch {
    return false;
  }
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
 * Middleware to require wallet authentication with signature verification
 * Expects body: { address, message, signature, ...rest }
 * Note: This reads the request body, so call it before reading body in route handler
 */
export async function requireAuth(req: NextRequest): Promise<{
  authenticated: boolean;
  address?: string;
  error?: string;
  body?: any;
}> {
  try {
    const clonedReq = req.clone();
    const body = await clonedReq.json().catch(() => ({}));
    const address = body.address || req.headers.get("x-wallet-address");
    const message = body.message;
    const signature = body.signature;

    if (!address) {
      return {
        authenticated: false,
        error: "Wallet address required",
        body,
      };
    }

    // Require signature verification for authenticated routes
    if (!message || !signature) {
      return {
        authenticated: false,
        error: "Signature required. Sign the auth message with your wallet.",
        body,
      };
    }

    const isValid = await verifyWalletAuth(address, message, signature);
    if (!isValid) {
      return {
        authenticated: false,
        error: "Invalid signature",
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
