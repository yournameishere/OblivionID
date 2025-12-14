import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

export async function GET(req: Request) {
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



