import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Authentication check (this also reads the body)
    const auth = await requireAuth(req);
    if (!auth.authenticated || !auth.address) {
      return NextResponse.json(
        { error: auth.error || "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId } = auth.body || {};

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const col = client.db("oblivion").collection("kycSessions");
    const session = await col.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "verified") {
      return NextResponse.json(
        { error: "Session not verified. Please complete KYC first." },
        { status: 400 }
      );
    }

    // Verify the session belongs to the authenticated user (optional check)
    // In production, you might want to link sessions to wallet addresses

    // Generate proof data for smart contract
    // Note: In production, this should use a real ZK circuit
    // For now, we return the attributes that will be verified by the mock verifier
    const zkProof = "0x" + "00".repeat(256); // Mock proof (256 bytes)
    const publicSignals = [
      session.flags.isVerified ? 1 : 0,
      session.flags.isAdult ? 1 : 0,
      session.flags.isHuman ? 1 : 0,
      session.flags.isNotSanctioned ? 1 : 0,
      session.flags.isUnique ? 1 : 0,
    ];

    const attrs = {
      isVerified: session.flags.isVerified,
      isAdult: session.flags.isAdult,
      isHuman: session.flags.isHuman,
      isNotSanctioned: session.flags.isNotSanctioned,
      isUnique: session.flags.isUnique,
      identityHash: session.identityHash,
    };

    // Mark session as used for minting
    await col.updateOne(
      { sessionId },
      {
        $set: {
          mintedAt: new Date(),
          mintedBy: auth.address,
        },
      }
    );

    return NextResponse.json({ attrs, zkProof, publicSignals });
  } catch (error: any) {
    console.error("Proof issue error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}



