"use client";

import { useAccount } from "wagmi";
import axios from "axios";
import { useState } from "react";
import { useToast } from "./toast";
import LoadingSpinner from "./loading-spinner";

type Step = "idle" | "requesting" | "signing" | "minting" | "done" | "error";

export default function MintCard() {
  const { address, chainId } = useAccount();
  const toast = useToast();
  const [sessionId, setSessionId] = useState("");
  const [metadataURI, setMetadataURI] = useState("ipfs://mock-meta");
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [prepared, setPrepared] = useState<any | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function requestPayload() {
    if (!sessionId) {
      const errorMsg = "Enter proof handle from KYC step.";
      setErr(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (!address) {
      const errorMsg = "Please connect your wallet first.";
      setErr(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setErr(null);
    setStep("requesting");
    toast.info("Preparing your zkPassport payload...");
    try {
      const res = await axios.post("/api/proof/issue", { sessionId, address });
      setPrepared(res.data);
      setStep("signing");
      toast.success("Payload prepared! Ready to mint.");
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || e.message || "Failed to prepare mint";
      setErr(errorMsg);
      setStep("error");
      toast.error(errorMsg);
    }
  }

  async function mint() {
    if (!prepared || !address || !sessionId) return;
    try {
      setStep("minting");
      setErr(null);
      toast.info("Minting your zkPassport... This may take a moment.");
      
      // Use backend minting service (has MINTER_ROLE)
      const res = await axios.post("/api/mint", {
        sessionId,
        userAddress: address,
        metadataURI,
      });

      if (res.data.success) {
        setTxHash(res.data.txHash);
        setTokenId(res.data.tokenId);
        setStep("done");
        setErr(null);
        toast.success(`zkPassport minted successfully! Token ID: ${res.data.tokenId || 'Pending'}`);
      } else {
        throw new Error(res.data.error || "Minting failed");
      }
    } catch (e: any) {
      const errorMsg = e?.response?.data?.error || e?.message || "Mint failed";
      setErr(errorMsg);
      setStep("error");
      toast.error(errorMsg);
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
          className="btn-secondary disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 flex items-center gap-2"
          disabled={step === "requesting" || !sessionId}
        >
          {step === "requesting" && <LoadingSpinner size="sm" />}
          {step === "requesting" ? "Preparing..." : "Prepare Payload"}
        </button>
        <button
          onClick={mint}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 flex items-center gap-2"
          disabled={!prepared || step === "minting" || step === "done"}
        >
          {step === "minting" && <LoadingSpinner size="sm" className="border-white border-t-transparent" />}
          {step === "minting" ? "Minting..." : step === "done" ? "Minted! ✓" : "Mint zkPassport"}
        </button>
      </div>

      {step === "done" && txHash && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 animate-scale-in">
          <p className="text-emerald-300 font-semibold text-lg mb-3">✓ Passport Minted Successfully!</p>
          {tokenId && (
            <p className="text-sm text-emerald-300/80 mb-2">
              <span className="font-semibold">Token ID:</span> <span className="font-mono text-base">{tokenId}</span>
            </p>
          )}
          <p className="text-sm text-emerald-300/80 mb-2">
            <span className="font-semibold">Transaction Hash:</span>
          </p>
          <p className="font-mono text-xs break-all text-emerald-300/90 bg-black/20 p-2 rounded mb-3">
            {txHash}
          </p>
          <a
            href={`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 transition"
          >
            View on PolygonScan →
          </a>
          <p className="text-sm text-emerald-300/80 mt-3">
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



