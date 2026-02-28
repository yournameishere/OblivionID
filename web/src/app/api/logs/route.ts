import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

// Make this route dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const rl = checkRateLimit(req, RATE_LIMITS.default);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  try {
    const client = await getMongoClient();
    const col = client.db("oblivion").collection("auditLogs");
    const logs = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(50).toArray();
    return NextResponse.json({ logs });
  } catch (error: any) {
    logger.error({ err: error }, "Failed to fetch logs");
    return NextResponse.json({ error: "Failed to fetch logs", logs: [] }, { status: 500 });
  }
}



