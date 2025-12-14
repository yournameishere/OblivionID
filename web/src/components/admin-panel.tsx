"use client";

import { useState } from "react";
import { PASSPORT_ADDRESS } from "@/lib/contract";
import { passportAbi } from "@/lib/abi";
import { useAccount, useWriteContract } from "wagmi";

export default function AdminPanel() {
  const { address } = useAccount();
  const [tokenId, setTokenId] = useState("");
  const [reason, setReason] = useState("admin action");
  const [verifier, setVerifier] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();

  async function revoke() {
    setErr(null);
    setOk(null);
    try {
      await writeContractAsync({
        address: PASSPORT_ADDRESS as `0x${string}`,
        abi: passportAbi,
        functionName: "revoke",
        args: [BigInt(tokenId), reason],
      });
      setOk("Revoke tx submitted.");
    } catch (e: any) {
      setErr(e?.message || "Revoke failed");
    }
  }

  async function updateVerifier() {
    setErr(null);
    setOk(null);
    try {
      await writeContractAsync({
        address: PASSPORT_ADDRESS as `0x${string}`,
        abi: passportAbi,
        functionName: "setVerifier",
        args: [verifier],
      });
      setOk("Verifier update submitted.");
    } catch (e: any) {
      setErr(e?.message || "Update failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-sm text-slate-300/80">
          Connected: {address ?? "not connected"} (needs ADMIN/REVOKER roles)
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="font-semibold">Revoke passport</p>
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3"
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            onClick={revoke}
            className="btn-primary disabled:opacity-60"
            disabled={!tokenId}
          >
            Revoke
          </button>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Update verifier</p>
          <input
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-3"
            placeholder="Verifier address"
            value={verifier}
            onChange={(e) => setVerifier(e.target.value)}
          />
          <button
            onClick={updateVerifier}
            className="btn-secondary disabled:opacity-60"
            disabled={!verifier}
          >
            Update
          </button>
        </div>
      </div>
      {ok && <p className="text-emerald-300 text-sm">{ok}</p>}
      {err && <p className="text-rose-300 text-sm">{err}</p>}
      <p className="text-xs text-slate-300/70">
        On-chain guards: soulbound (no transfers), revoke emits event,
        single-mint per identity hash, verifier hook required.
      </p>
    </div>
  );
}



