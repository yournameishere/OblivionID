import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const rl = checkRateLimit(req, RATE_LIMITS.default);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const client = await getMongoClient();
  const col = client.db("oblivion").collection("kycSessions");
  const session = await col.findOne(
    { sessionId },
    { projection: { _id: 0, proofSeed: 0 } }
  );

  if (!session) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  return NextResponse.json({ session });
}



