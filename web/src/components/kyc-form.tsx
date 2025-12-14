"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "processing"; progress: string }
  | { state: "done"; sessionId: string; verified: boolean }
  | { state: "error"; message: string };

export default function KycForm() {
  const { address, isConnected } = useAccount();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [existingKyc, setExistingKyc] = useState<any>(null);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    country: "",
    age: "",
  });
  const [files, setFiles] = useState({
    id: null as File | null,
    selfie: null as File | null,
    liveness: null as File | null,
  });

  useEffect(() => {
    async function loadExistingKyc() {
      if (!address) {
        setLoadingKyc(false);
        return;
      }
      try {
        const res = await axios.post("/api/kyc/user", { address });
        if (res.data.latestVerified) {
          setExistingKyc(res.data.latestVerified);
          // Pre-fill form with existing data
          setForm({
            fullName: res.data.latestVerified.fullName || "",
            country: res.data.latestVerified.country || "",
            age: res.data.latestVerified.age?.toString() || "",
          });
        }
      } catch (e) {
        console.error("Failed to load existing KYC:", e);
      } finally {
        setLoadingKyc(false);
      }
    }
    loadExistingKyc();
  }, [address]);

  async function submit() {
    if (!isConnected || !address) {
      setStatus({ state: "error", message: "Please connect your wallet first" });
      return;
    }

    if (!form.fullName || !form.country || !form.age) {
      setStatus({ state: "error", message: "Please fill all fields" });
      return;
    }

    if (!files.id || !files.selfie || !files.liveness) {
      setStatus({ state: "error", message: "Please upload all required files (ID, selfie, and liveness video)" });
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const body = new FormData();
      body.append("fullName", form.fullName);
      body.append("country", form.country);
      body.append("age", form.age);
      body.append("address", address);
      body.append("id", files.id);
      body.append("selfie", files.selfie);
      body.append("liveness", files.liveness);

      setStatus({ state: "processing", progress: "Uploading files to IPFS..." });
      const res = await axios.post("/api/kyc/start", body, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setStatus({ state: "processing", progress: `Uploading... ${percent}%` });
          }
        },
      });

      if (res.data.verified) {
        setStatus({ state: "done", sessionId: res.data.sessionId, verified: true });
      } else {
        setStatus({
          state: "error",
          message: res.data.error || "Verification failed. Please check your documents and try again.",
        });
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || "Verification failed";
      setStatus({
        state: "error",
        message: errorMessage,
      });
    }
  }

  if (loadingKyc) {
    return (
      <div className="text-center py-8">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {existingKyc && existingKyc.status === "verified" && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-emerald-300">✓ Already Verified</p>
            <span className="text-xs text-emerald-300/80">KYC ID: {existingKyc.sessionId?.slice(0, 8)}...</span>
          </div>
          <p className="text-sm text-emerald-300/80 mb-3">
            You have already completed KYC verification. You can update your verification by submitting a new one below.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-emerald-300/70">Verified:</span>{" "}
              <span className="text-emerald-300">
                {new Date(existingKyc.createdAt).toLocaleDateString()}
              </span>
            </div>
            {existingKyc.aiVerification && (
              <div>
                <span className="text-emerald-300/70">Confidence:</span>{" "}
                <span className="text-emerald-300">
                  {Math.round((existingKyc.aiVerification.overallConfidence || 0) * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <input
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-3"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-3"
          placeholder="Country Code (e.g., IN)"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        <input
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-3"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-sm text-slate-200/70">ID Document</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) =>
              setFiles({ ...files, id: e.target.files?.[0] || null })
            }
          />
        </label>
        <label className="flex flex-col gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-sm text-slate-200/70">Selfie</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFiles({ ...files, selfie: e.target.files?.[0] || null })
            }
          />
        </label>
        <label className="flex flex-col gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
          <span className="text-sm text-slate-200/70">Liveness Video</span>
          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setFiles({ ...files, liveness: e.target.files?.[0] || null })
            }
          />
        </label>
      </div>
      <div className="flex gap-3 items-center flex-wrap">
        <button
          onClick={submit}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3"
          disabled={status.state === "submitting" || status.state === "processing" || !isConnected}
        >
          {status.state === "submitting"
            ? "Starting verification..."
            : status.state === "processing"
            ? status.progress
            : "Submit KYC"}
        </button>
        {status.state === "done" && status.verified && (
          <div className="flex-1">
            <p className="text-emerald-300 font-semibold">
              ✓ Verification successful! Session ID: {status.sessionId}
            </p>
            <p className="text-sm text-emerald-300/80 mt-1">
              You can now proceed to mint your zkPassport.
            </p>
          </div>
        )}
        {status.state === "error" && (
          <div className="flex-1 bg-rose-500/20 border border-rose-500/50 rounded-xl p-3">
            <p className="text-rose-300 font-semibold">Verification Failed</p>
            <p className="text-sm text-rose-300/80 mt-1">{status.message}</p>
          </div>
        )}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-xs text-slate-300/70">
          <span className="font-semibold text-slate-200">Note:</span> This is a mock flow for demonstration.
          Files are processed locally; we generate verification scores, sanction flags, liveness checks,
          and age validation. Temporary encrypted metadata is stored in MongoDB, and a session ID is
          returned for minting your zkPassport.
        </p>
      </div>
    </div>
  );
}



