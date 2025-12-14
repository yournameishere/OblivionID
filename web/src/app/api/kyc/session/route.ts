import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("id");
  if (!sessionId) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const client = await getMongoClient();
  const db = client.db("oblivionid");
  const sessions = db.collection("kyc_sessions");
  const session = await sessions.findOne({ sessionId });
  if (!session) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(session);
}

