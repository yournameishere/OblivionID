import { NextResponse } from "next/server";
import { AUTH_MESSAGE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ message: AUTH_MESSAGE });
}
