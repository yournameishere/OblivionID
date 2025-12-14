"use client";

import { useAccount } from "wagmi";
import axios from "axios";
import { useState } from "react";

type Step = "idle" | "requesting" | "signing" | "minting" | "done" | "error";

export default function MintCard() {
  const { address, chainId } = useAccount();
  const [sessionId, setSessionId] = useState("");
  const [metadataURI, setMetadataURI] = useState("ipfs://mock-meta");
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [prepared, setPrepared] = useState<any | null>(null);

  const [txHash, setTxHash] = useState<string | null>(null);

  async function requestPayload() {
    if (!sessionId) {
      setErr("Enter proof handle from KYC step.");
      return;
    }
    if (!address) {
      setErr("Please connect your wallet first.");
      return;
    }
    setErr(null);
    setStep("requesting");
    try {
      const res = await axios.post("/api/proof/issue", { sessionId, address });
      setPrepared(res.data);
      setStep("signing");
    } catch (e: any) {
      setErr(e?.response?.data?.error || e.message || "Failed to prepare mint");
      setStep("error");
    }
  }

  async function mint() {
    if (!prepared || !address || !sessionId) return;
    try {
      setStep("minting");
      
      // Use backend minting service (has MINTER_ROLE)
      const res = await axios.post("/api/mint", {
        sessionId,
        userAddress: address,
        metadataURI,
      });

      if (res.data.success) {
        setTxHash(res.data.txHash);
        setStep("done");
        setErr(null);
      } else {
        throw new Error(res.data.error || "Minting failed");
      }
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Mint failed");
      setStep("error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Proof Handle (Session ID) <span className="text-rose-400">*</span>
        </label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
          placeholder="Enter the session ID from KYC verification"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-2">
          This is the session ID you received after completing KYC verification.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Metadata URI (Optional)
        </label>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
          placeholder="ipfs://... or https://..."
          value={metadataURI}
          onChange={(e) => setMetadataURI(e.target.value)}
        />
        <p className="text-xs text-slate-400 mt-2">
          Optional IPFS or HTTPS URI for passport metadata.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-sm text-slate-300 mb-2">
          <span className="font-semibold">Connected Wallet:</span> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
        </p>
        <p className="text-sm text-slate-300">
          <span className="font-semibold">Network:</span> Polygon Amoy (Chain ID: {chainId ?? "N/A"})
        </p>
      </div>

      <div className="flex gap-3 flex-wrap items-center pt-4">
        <button
          onClick={requestPayload}
          className="btn-secondary disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3"
          disabled={step === "requesting" || !sessionId}
        >
          {step === "requesting" ? "Preparing..." : "Prepare Payload"}
        </button>
        <button
          onClick={mint}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3"
          disabled={!prepared || step === "minting" || step === "done"}
        >
          {step === "minting" ? "Minting..." : step === "done" ? "Minted!" : "Mint zkPassport"}
        </button>
      </div>

      {step === "done" && txHash && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4">
          <p className="text-emerald-300 font-semibold">✓ Passport Minted Successfully!</p>
          <p className="text-sm text-emerald-300/80 mt-2">
            Transaction Hash: <span className="font-mono text-xs">{txHash}</span>
          </p>
          <p className="text-sm text-emerald-300/80 mt-2">
            Your zkPassport has been minted. Check your dashboard to view it.
          </p>
        </div>
      )}

      {err && (
        <div className="bg-rose-500/20 border border-rose-500/50 rounded-xl p-4">
          <p className="text-rose-300 font-semibold">Error</p>
          <p className="text-sm text-rose-300/80 mt-1">{err}</p>
        </div>
      )}

      {prepared && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="font-semibold mb-3">Prepared Payload</h4>
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-slate-400 mb-1">Attributes:</p>
              <pre className="bg-black/30 p-2 rounded text-slate-300 overflow-x-auto">
                {JSON.stringify(prepared.attrs, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Public Signals:</p>
              <pre className="bg-black/30 p-2 rounded text-slate-300 overflow-x-auto">
                {JSON.stringify(prepared.publicSignals, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



