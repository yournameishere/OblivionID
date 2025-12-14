import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";

export async function POST(req: Request) {
  const { address } = await req.json();
  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });

  const client = await getMongoClient();
  const col = client.db("oblivion").collection("profiles");
  const profile = await col.findOne(
    { address: address.toLowerCase() },
    { projection: { _id: 0 } }
  );

  return NextResponse.json({ profile });
}


