import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";

function randomAddress() {
  return "0x" + randomBytes(20).toString("hex");
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, RATE_LIMITS.stealth);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  const stealthAddress = randomAddress();
  const viewingKey = "vk-" + randomBytes(16).toString("hex");
  return NextResponse.json({ stealthAddress, viewingKey });
}



