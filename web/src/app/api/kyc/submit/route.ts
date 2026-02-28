import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { createHash } from "crypto";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";
import { auditLog } from "@/lib/audit";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, RATE_LIMITS.kyc);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  const body = await req.json();
  const { sessionId, age, nationality, sanctions, human, unique } = body;

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const client = await getMongoClient();
  const db = client.db("oblivionid");
  const sessions = db.collection("kyc_sessions");

  const session = await sessions.findOne({ sessionId });
  if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 });

  const identityHash = createHash("sha256")
    .update(sessionId + (nationality || "") + (age || ""))
    .digest("hex");

  await auditLog("kyc_submit", { sessionId, identityHash });

  await sessions.updateOne(
    { sessionId },
    {
      $set: {
        status: "verified",
        age,
        nationality,
        sanctions: !!sanctions,
        human: !!human,
        unique: !!unique,
        identityHash,
        verifiedAt: new Date(),
      },
    }
  );

  return NextResponse.json({
    sessionId,
    identityHash,
    attributes: {
      isVerified: true,
      isAdult: age >= 18,
      isHuman: !!human,
      isNotSanctioned: !sanctions,
      isUnique: !!unique,
    },
    proof: "0x",
    publicSignals: [],
  });
}

