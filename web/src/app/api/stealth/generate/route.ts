import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";
import { generateStealthMetaAddress, generateStealthAddress } from "@/lib/stealth";
import { auditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(req, RATE_LIMITS.stealth);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  const { stealthMetaAddress, spendingKey, viewingKey } = generateStealthMetaAddress();
  const { stealthAddress, ephemeralPubKey, viewTag } = generateStealthAddress(stealthMetaAddress);
  await auditLog("stealth_generate", { stealthMetaAddress: stealthMetaAddress.slice(0, 20) + "..." });
  return NextResponse.json({
    stealthMetaAddress,
    stealthAddress,
    spendingKey,
    viewingKey,
    ephemeralPubKey,
    viewTag,
  });
}



