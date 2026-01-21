import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

// Make this route dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await getMongoClient();
    const col = client.db("oblivion").collection("auditLogs");
    const logs = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(50).toArray();
    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs", logs: [] }, { status: 500 });
  }
}



