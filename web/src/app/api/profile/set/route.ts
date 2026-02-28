import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { checkRateLimit, RATE_LIMITS } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";
import { verifyWalletAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const rl = checkRateLimit(req, RATE_LIMITS.default);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetIn / 1000)) } }
    );
  }
  try {
    const body = await req.json();
    const { address, message, signature, fullName, email, country, phone, dateOfBirth, bio } = body || {};
    
    if (!address || !fullName || !email || !country) {
      return NextResponse.json({ error: "Missing required fields: address, fullName, email, and country are required" }, { status: 400 });
    }
    if (!message || !signature) {
      return NextResponse.json(
        { error: "Signature required. Sign the auth message and include message and signature." },
        { status: 401 }
      );
    }
    const valid = await verifyWalletAuth(address, message, signature);
    if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const client = await getMongoClient();
    const col = client.db("oblivion").collection("profiles");
    
    await col.updateOne(
      { address: address.toLowerCase() },
      {
        $set: {
          address: address.toLowerCase(),
          fullName,
          email,
          country: country.toUpperCase(),
          phone: phone || "",
          dateOfBirth: dateOfBirth || "",
          bio: bio || "",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, message: "Profile saved successfully" });
  } catch (error: any) {
    logger.error({ err: error }, "Error saving profile");
    return NextResponse.json(
      { error: error?.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}


