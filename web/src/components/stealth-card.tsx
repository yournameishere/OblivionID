"use client";

import axios from "axios";
import { useState } from "react";

export default function StealthCard() {
  const [data, setData] = useState<{ stealthAddress: string; viewingKey: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function generate() {
    try {
      setErr(null);
      const res = await axios.post("/api/stealth/generate");
      setData(res.data);
    } catch (e: any) {
      setErr(e?.message || "Failed to generate stealth address");
    }
  }

  return (
    <div className="space-y-3">
      <button onClick={generate} className="btn-primary">
        Generate Stealth Address
      </button>
      {data && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm break-words">
          <p className="font-semibold">Stealth Address</p>
          <p className="text-slate-200/80">{data.stealthAddress}</p>
          <p className="font-semibold mt-2">Viewing Key</p>
          <p className="text-slate-200/80">{data.viewingKey}</p>
        </div>
      )}
      {err && <p className="text-rose-300 text-sm">{err}</p>}
      <p className="text-xs text-slate-300/70">
        Mock ERC-5564 helper: generates random stealth address + viewing key. Swap in a real stealth wallet
        generator to go live.
      </p>
    </div>
  );
}



