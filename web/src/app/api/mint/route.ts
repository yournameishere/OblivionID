import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "@/lib/db";
import { createWalletClient, createPublicClient, http, decodeEventLog } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";
import { PASSPORT_ADDRESS, VERIFIER_ADDRESS } from "@/lib/contract";
import { passportAbi } from "@/lib/abi";

/**
 * Backend minting service
 * This service has MINTER_ROLE and mints passports on behalf of users
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, userAddress, metadataURI = "ipfs://mock-meta" } = body;

    if (!sessionId || !userAddress) {
      return NextResponse.json(
        { error: "sessionId and userAddress are required" },
        { status: 400 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
    }

    // Get session from database
    const client = await getMongoClient();
    const col = client.db("oblivion").collection("kycSessions");
    const session = await col.findOne({ sessionId });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "verified") {
      return NextResponse.json(
        { error: "Session not verified. Please complete KYC first." },
        { status: 400 }
      );
    }

    // Check if already minted
    if (session.mintedAt) {
      return NextResponse.json(
        { error: "Passport already minted for this session" },
        { status: 400 }
      );
    }

    // Get private key from environment
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "Server configuration error: PRIVATE_KEY not set" },
        { status: 500 }
      );
    }

    // Create wallet client with minter account
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const rpcUrl = process.env.POLYGON_AMOY_RPC || process.env.NEXT_PUBLIC_RPC_URL;

    if (!rpcUrl) {
      return NextResponse.json(
        { error: "Server configuration error: RPC URL not set" },
        { status: 500 }
      );
    }

    const walletClient = createWalletClient({
      account,
      chain: polygonAmoy,
      transport: http(rpcUrl),
    });

    const publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(rpcUrl),
    });

    // Prepare attributes
    const attrs = {
      isVerified: session.flags.isVerified,
      isAdult: session.flags.isAdult,
      isHuman: session.flags.isHuman,
      isNotSanctioned: session.flags.isNotSanctioned,
      isUnique: session.flags.isUnique,
      identityHash: session.identityHash as `0x${string}`,
    };

    // Prepare proof (mock for now)
    const zkProof = "0x" + "00".repeat(256); // 256 bytes
    const publicSignals = [
      session.flags.isVerified ? 1 : 0,
      session.flags.isAdult ? 1 : 0,
      session.flags.isHuman ? 1 : 0,
      session.flags.isNotSanctioned ? 1 : 0,
      session.flags.isUnique ? 1 : 0,
    ];

    // Mint passport
    try {
      const hash = await walletClient.writeContract({
        address: PASSPORT_ADDRESS as `0x${string}`,
        abi: passportAbi,
        functionName: "mintPassport",
        args: [userAddress as `0x${string}`, attrs, zkProof as `0x${string}`, publicSignals, metadataURI],
      });

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (!receipt.status || receipt.status === "reverted") {
        return NextResponse.json(
          { error: "Transaction reverted. Check contract permissions." },
          { status: 400 }
        );
      }

      // Extract token ID from transaction receipt events
      let tokenId: bigint | null = null;
      
      // Decode PassportMinted event from logs
      if (receipt.logs) {
        for (const log of receipt.logs) {
          try {
            // Try to decode PassportMinted event
            const decoded = decodeEventLog({
              abi: passportAbi,
              data: log.data,
              topics: log.topics,
            });
            
            if (decoded.eventName === "PassportMinted" && decoded.args) {
              const args = decoded.args as { tokenId?: bigint; to?: string; attrs?: any; metadataURI?: string };
              if (args.tokenId) {
                tokenId = args.tokenId;
                break;
              }
            }
          } catch (e) {
            // Not a PassportMinted event, continue
            continue;
          }
        }
      }

      // If we couldn't extract from events, query the contract for totalSupply
      // This gives us the latest token ID (since tokens are minted sequentially)
      if (!tokenId) {
        try {
          const totalSupply = await publicClient.readContract({
            address: PASSPORT_ADDRESS as `0x${string}`,
            abi: passportAbi,
            functionName: "totalSupply",
          });
          tokenId = totalSupply as bigint;
        } catch (e) {
          console.error("Failed to get token ID from contract:", e);
        }
      }

      // Update session with minting info including token ID
      await col.updateOne(
        { sessionId },
        {
          $set: {
            mintedAt: new Date(),
            mintedBy: userAddress.toLowerCase(),
            txHash: hash,
            blockNumber: receipt.blockNumber.toString(),
            tokenId: tokenId ? tokenId.toString() : null,
          },
        }
      );

      return NextResponse.json({
        success: true,
        txHash: hash,
        tokenId: tokenId ? tokenId.toString() : null,
        receipt,
        message: "Passport minted successfully",
      });
    } catch (error: any) {
      console.error("Minting error:", error);
      
      // Check for specific errors
      if (error?.message?.includes("AlreadyMinted")) {
        return NextResponse.json(
          { error: "This address has already minted a passport" },
          { status: 400 }
        );
      }
      
      if (error?.message?.includes("InvalidProof")) {
        return NextResponse.json(
          { error: "Proof verification failed" },
          { status: 400 }
        );
      }

      if (error?.message?.includes("AccessControl")) {
        return NextResponse.json(
          { error: "Server does not have MINTER_ROLE. Please grant MINTER_ROLE to the server address." },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { error: error?.message || "Minting failed" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

