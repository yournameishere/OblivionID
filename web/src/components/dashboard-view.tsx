"use client";

import { useAccount, useReadContract } from "wagmi";
import { PASSPORT_ADDRESS } from "@/lib/contract";
import { passportAbi } from "@/lib/abi";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function DashboardView() {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState("");
  const [userKycSession, setUserKycSession] = useState<any>(null);
  const [loadingKyc, setLoadingKyc] = useState(true);

  // Auto-load token ID from user's KYC session
  useEffect(() => {
    async function fetchUserKyc() {
      if (!address) {
        setLoadingKyc(false);
        return;
      }
      setLoadingKyc(true);
      try {
        const res = await axios.get(`/api/kyc/user?address=${address}`);
        if (res.data?.session) {
          setUserKycSession(res.data.session);
          // If user has a verified session with token ID, auto-load it
          if (res.data.session.status === "verified" && res.data.session.tokenId) {
            setTokenId(res.data.session.tokenId.toString());
          }
        } else {
          setUserKycSession(null);
        }
      } catch (error) {
        console.error("Failed to fetch user KYC session:", error);
        setUserKycSession(null);
      } finally {
        setLoadingKyc(false);
      }
    }
    fetchUserKyc();
  }, [address]);

  const { data: attrs, error, isLoading } = useReadContract({
    address: PASSPORT_ADDRESS as `0x${string}`,
    abi: passportAbi,
    functionName: "getAttributes",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: !!tokenId && !!address },
  });

  const { data: owner } = useReadContract({
    address: PASSPORT_ADDRESS as `0x${string}`,
    abi: passportAbi,
    functionName: "ownerOf",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: !!tokenId && !!address },
  });

  const { data: isRevoked } = useReadContract({
    address: PASSPORT_ADDRESS as `0x${string}`,
    abi: passportAbi,
    functionName: "isRevoked",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: !!tokenId && !!address },
  });

  const flags =
    attrs as unknown as
      | [boolean, boolean, boolean, boolean, boolean, `0x${string}`]
      | undefined;

  const isOwner = owner && address ? String(owner).toLowerCase() === address.toLowerCase() : false;

  return (
    <div className="space-y-6">
      {loadingKyc ? (
        <div className="text-center py-8 text-slate-300">Loading your KYC status...</div>
      ) : userKycSession ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-lg mb-2">Your KYC Session</h3>
          <p className="text-sm text-slate-300/80">
            Status:{" "}
            <span
              className={`font-medium ${
                userKycSession.status === "verified" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {userKycSession.status.toUpperCase()}
            </span>
          </p>
          <p className="text-sm text-slate-300/80">Session ID: {userKycSession.sessionId}</p>
          {userKycSession.status === "verified" && userKycSession.tokenId && (
            <p className="text-sm text-slate-300/80 mt-2">
              Minted Passport Token ID: <span className="font-mono font-semibold">{userKycSession.tokenId}</span>
            </p>
          )}
          {userKycSession.status === "verified" && !userKycSession.tokenId && (
            <div className="mt-3">
              <Link href="/mint" className="btn-primary text-sm px-4 py-2">
                Mint Your zkPassport
              </Link>
            </div>
          )}
          {userKycSession.status !== "verified" && (
            <div className="mt-3">
              <Link href="/kyc" className="btn-secondary text-sm px-4 py-2">
                Retry KYC Verification
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <p className="text-sm text-slate-300/80">No active KYC session found for your wallet.</p>
          <div className="mt-3">
            <Link href="/kyc" className="btn-primary text-sm px-4 py-2">
              Start KYC Verification
            </Link>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Enter Token ID to View Passport
        </label>
        <div className="flex gap-3">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
            placeholder="Enter your zkPassport token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            type="number"
          />
          {!tokenId && (
            <Link href="/mint" className="btn-primary whitespace-nowrap">
              Mint Passport
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/20 border border-rose-500/50 rounded-xl p-4">
          <p className="text-rose-300 text-sm">
            Error: {error.message.includes("execution reverted") 
              ? "Token not found or invalid token ID" 
              : error.message}
          </p>
        </div>
      )}

      {isLoading && tokenId && (
        <div className="text-center py-8">
          <div className="text-slate-300">Loading passport data...</div>
        </div>
      )}

      {flags && tokenId && (
        <div className="space-y-4">
          {/* Status Card */}
          <div className={`card-3d p-6 ${isRevoked ? 'border-rose-500/50' : 'border-emerald-500/50'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Passport Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isRevoked
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {isRevoked ? "Revoked" : "Active"}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Token ID</p>
                <p className="font-mono font-semibold">{tokenId}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Owner</p>
                <p className="font-mono text-xs break-all">
                  {owner ? String(owner) : "—"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Your Wallet</p>
                <p className="font-mono text-xs break-all">
                  {address || "Not connected"}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Ownership Status</p>
                <p className={`font-semibold ${isOwner ? "text-emerald-300" : "text-rose-300"}`}>
                  {isOwner ? "✓ You own this passport" : "✗ Not your passport"}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Flags */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-3d p-6">
              <h3 className="text-lg font-semibold mb-4">Verification Flags</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <span>Verified</span>
                  </span>
                  <span className={`font-semibold ${flags[0] ? "text-emerald-300" : "text-rose-300"}`}>
                    {flags[0] ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🧑‍💻</span>
                    <span>Adult (≥18)</span>
                  </span>
                  <span className={`font-semibold ${flags[1] ? "text-emerald-300" : "text-rose-300"}`}>
                    {flags[1] ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <span>Human Verified</span>
                  </span>
                  <span className={`font-semibold ${flags[2] ? "text-emerald-300" : "text-rose-300"}`}>
                    {flags[2] ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    <span>Not Sanctioned</span>
                  </span>
                  <span className={`font-semibold ${flags[3] ? "text-emerald-300" : "text-rose-300"}`}>
                    {flags[3] ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">🔒</span>
                    <span>Unique Identity</span>
                  </span>
                  <span className={`font-semibold ${flags[4] ? "text-emerald-300" : "text-rose-300"}`}>
                    {flags[4] ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-3d p-6">
              <h3 className="text-lg font-semibold mb-4">Identity Commitment</h3>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="font-mono text-xs break-all text-slate-300">
                  {flags[5] ?? "—"}
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                This hash represents your unique identity commitment. It&apos;s used to verify your identity
                without revealing any personal information.
              </p>
            </div>
          </div>
        </div>
      )}

      {!tokenId && !error && (
        <div className="text-center py-12 card-3d p-8">
          <div className="text-5xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold mb-2">No Passport Loaded</h3>
          <p className="text-slate-300/70 mb-6">
            Enter a token ID above to view passport details, or mint a new zkPassport to get started.
          </p>
          <Link href="/mint" className="btn-primary">
            Mint zkPassport
          </Link>
        </div>
      )}
    </div>
  );
}



