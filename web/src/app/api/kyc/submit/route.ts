import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
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

