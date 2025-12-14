import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, fullName, email, country, phone, dateOfBirth, bio } = body || {};
    
    if (!address || !fullName || !email || !country) {
      return NextResponse.json({ error: "Missing required fields: address, fullName, email, and country are required" }, { status: 400 });
    }

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
    console.error("Error saving profile:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}


