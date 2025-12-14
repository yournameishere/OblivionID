"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface KycStatus {
  hasKyc: boolean;
  isVerified: boolean;
  kycId: string | null;
  latestVerified: any;
}

export default function KycStatus() {
  const { address } = useAccount();
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!address) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post("/api/kyc/user", { address });
        setKycStatus(res.data);
      } catch (e) {
        console.error("Failed to load KYC status:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [address]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-slate-300">Loading KYC status...</div>
      </div>
    );
  }

  if (!kycStatus) {
    return null;
  }

  if (!kycStatus.hasKyc) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-slate-300 mb-2">No KYC verification found</p>
        <Link href="/kyc" className="btn-primary text-sm px-4 py-2 inline-block">
          Start KYC Verification
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">KYC Status</h3>
        {kycStatus.isVerified ? (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-300">
            ✓ Verified
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-300">
            Pending
          </span>
        )}
      </div>
      
      {kycStatus.kycId && (
        <div className="mb-3">
          <p className="text-sm text-slate-400 mb-1">KYC ID</p>
          <p className="font-mono text-sm text-slate-200 break-all">{kycStatus.kycId}</p>
        </div>
      )}

      {kycStatus.latestVerified && (
        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="text-slate-200 capitalize">{kycStatus.latestVerified.status}</span>
          </div>
          {kycStatus.latestVerified.createdAt && (
            <div className="flex justify-between">
              <span className="text-slate-400">Verified:</span>
              <span className="text-slate-200">
                {new Date(kycStatus.latestVerified.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
          {kycStatus.latestVerified.aiVerification && (
            <div className="flex justify-between">
              <span className="text-slate-400">Confidence:</span>
              <span className="text-slate-200">
                {Math.round((kycStatus.latestVerified.aiVerification.overallConfidence || 0) * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {kycStatus.isVerified ? (
          <>
            <Link href="/mint" className="btn-primary text-sm px-4 py-2 flex-1 text-center">
              Mint Passport
            </Link>
            <Link href="/kyc" className="btn-secondary text-sm px-4 py-2">
              Update KYC
            </Link>
          </>
        ) : (
          <Link href="/kyc" className="btn-primary text-sm px-4 py-2 flex-1 text-center">
            Complete KYC
          </Link>
        )}
      </div>
    </div>
  );
}

