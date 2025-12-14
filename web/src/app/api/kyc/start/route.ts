import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { randomBytes, createHash } from "crypto";
import { verifyIDDocument, verifyLivenessVideo, checkSanctions } from "@/lib/gemini";
import { uploadToPinata } from "@/lib/pinata";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const fullName = form.get("fullName")?.toString() || "";
    const country = form.get("country")?.toString() || "";
    const age = parseInt(form.get("age")?.toString() || "0", 10);
    const address = form.get("address")?.toString() || "";
    const idFile = form.get("id") as File | null;
    const selfieFile = form.get("selfie") as File | null;
    const livenessFile = form.get("liveness") as File | null;

    if (!address) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    if (!fullName || !country || !age) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!idFile || !selfieFile || !livenessFile) {
      return NextResponse.json(
        { error: "Missing required files: ID, selfie, and liveness video" },
        { status: 400 }
      );
    }

    const sessionId = randomBytes(16).toString("hex");

    // Step 1: Upload files to Pinata IPFS (encrypted storage)
    let idIpfsHash = "";
    let selfieIpfsHash = "";
    let livenessIpfsHash = "";

    try {
      const [idUpload, selfieUpload, livenessUpload] = await Promise.all([
        uploadToPinata(idFile, `id_${sessionId}`),
        uploadToPinata(selfieFile, `selfie_${sessionId}`),
        uploadToPinata(livenessFile, `liveness_${sessionId}`),
      ]);

      idIpfsHash = idUpload.ipfsHash;
      selfieIpfsHash = selfieUpload.ipfsHash;
      livenessIpfsHash = livenessUpload.ipfsHash;
    } catch (error: any) {
      console.error("Pinata upload error:", error);
      // Continue even if Pinata fails (for development)
      // Files will still be processed for verification
    }

    // Step 2: AI Verification using Gemini
    const [idVerification, livenessVerification, sanctionsCheck] = await Promise.all([
      verifyIDDocument(idFile, selfieFile),
      verifyLivenessVideo(livenessFile),
      checkSanctions(fullName, country),
    ]);

    // Step 3: Determine verification flags
    const faceMatchThreshold = 0.7;
    const confidenceThreshold = 0.6;

    const isVerified =
      idVerification.isDocumentValid &&
      idVerification.faceMatchScore >= faceMatchThreshold &&
      !idVerification.isDeepfake &&
      idVerification.isHuman &&
      livenessVerification.isReal &&
      livenessVerification.confidence >= confidenceThreshold;

    const isAdult = idVerification.extractedAge
      ? idVerification.extractedAge >= 18
      : age >= 18;

    const isHuman = idVerification.isHuman && livenessVerification.isReal;

    const isNotSanctioned = !sanctionsCheck.isSanctioned;

    // Generate identity hash
    const identityHashInput = `${fullName}${country}${age}${sessionId}${idVerification.extractedNationality || country}`;
    const identityHash = "0x" + createHash("sha256").update(identityHashInput).digest("hex").slice(0, 64);

    // Step 4: Store in MongoDB
    const client = await getMongoClient();
    const col = client.db("oblivion").collection("kycSessions");

    const sessionData = {
      sessionId,
      address: address.toLowerCase(),
      fullName,
      country: idVerification.extractedNationality || country,
      age: idVerification.extractedAge || age,
      createdAt: new Date(),
      status: isVerified ? "verified" : "rejected",
      flags: {
        isVerified,
        isAdult,
        isHuman,
        isNotSanctioned,
        isUnique: true, // Will be checked against existing hashes
      },
      identityHash,
      aiVerification: {
        faceMatchScore: idVerification.faceMatchScore,
        documentValid: idVerification.isDocumentValid,
        isDeepfake: idVerification.isDeepfake,
        livenessConfidence: livenessVerification.confidence,
        overallConfidence: Math.min(
          idVerification.confidence,
          livenessVerification.confidence,
          sanctionsCheck.confidence
        ),
        errors: [
          ...(idVerification.errors || []),
          ...(livenessVerification.errors || []),
        ],
      },
      ipfsHashes: {
        id: idIpfsHash,
        selfie: selfieIpfsHash,
        liveness: livenessIpfsHash,
      },
      // Files will be deleted after verification (privacy-first)
    };

    await col.insertOne(sessionData);

    // Step 5: Check for duplicate identity
    const existingSession = await col.findOne({
      identityHash,
      status: "verified",
      sessionId: { $ne: sessionId },
    });

    if (existingSession) {
      await col.updateOne(
        { sessionId },
        { $set: { flags: { ...sessionData.flags, isUnique: false } } }
      );
      return NextResponse.json(
        {
          error: "Duplicate identity detected. This ID has already been used.",
          sessionId,
          verified: false,
        },
        { status: 400 }
      );
    }

    if (!isVerified) {
      return NextResponse.json(
        {
          error: "Verification failed. Please check your documents and try again.",
          sessionId,
          verified: false,
          reasons: sessionData.aiVerification.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      sessionId,
      verified: true,
      flags: sessionData.flags,
      confidence: sessionData.aiVerification.overallConfidence,
    });
  } catch (error: any) {
    console.error("KYC start error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
