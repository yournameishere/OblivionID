import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

function randomAddress() {
  return "0x" + randomBytes(20).toString("hex");
}

export async function POST() {
  const stealthAddress = randomAddress();
  const viewingKey = "vk-" + randomBytes(16).toString("hex");
  return NextResponse.json({ stealthAddress, viewingKey });
}



