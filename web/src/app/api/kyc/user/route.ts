import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

/**
 * Get user's KYC status and history
 * Supports both GET (with address query param) and POST (with address in body)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const col = client.db("oblivion").collection("kycSessions");

    // Find the latest KYC session for this user
    const session = await col.findOne(
      { address: address.toLowerCase() },
      { sort: { createdAt: -1 }, projection: { _id: 0, proofSeed: 0 } }
    );

    return NextResponse.json({ session });
  } catch (error: any) {
    console.error("Get user KYC error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    const client = await getMongoClient();
    const col = client.db("oblivion").collection("kycSessions");

    // Find all KYC sessions for this user, sorted by date
    const sessions = await col
      .find(
        { address: address.toLowerCase() },
        { projection: { _id: 0, proofSeed: 0 } }
      )
      .sort({ createdAt: -1 })
      .toArray();

    // Get the latest verified session
    const latestVerified = sessions.find((s) => s.status === "verified");

    return NextResponse.json({
      sessions,
      latestVerified,
      hasKyc: sessions.length > 0,
      isVerified: !!latestVerified,
      kycId: latestVerified?.sessionId || null,
    });
  } catch (error: any) {
    console.error("Get user KYC error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

