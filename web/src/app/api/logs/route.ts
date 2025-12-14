import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

export async function GET() {
  const client = await getMongoClient();
  const col = client.db("oblivion").collection("auditLogs");
  const logs = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(50).toArray();
  return NextResponse.json({ logs });
}



