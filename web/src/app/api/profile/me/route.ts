import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";
import { verifyWalletAuth, AUTH_MESSAGE } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const rl = checkRateLimit(req, RATE_LIMITS.default);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  const { address, message, signature } = await req.json();
  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });
  if (!message || !signature) {
    return NextResponse.json(
      { error: "Signature required. Sign the auth message and include message and signature." },
      { status: 401 }
    );
  }
  const valid = await verifyWalletAuth(address, message, signature);
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const client = await getMongoClient();
  const col = client.db("oblivion").collection("profiles");
  const profile = await col.findOne(
    { address: address.toLowerCase() },
    { projection: { _id: 0 } }
  );

  return NextResponse.json({ profile });
}


