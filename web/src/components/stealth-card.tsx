"use client";

import axios from "axios";
import { useState } from "react";

export default function StealthCard() {
  const [data, setData] = useState<{
    stealthMetaAddress?: string;
    stealthAddress?: string;
    spendingKey?: string;
    viewingKey?: string;
    ephemeralPubKey?: string;
    viewTag?: string;
  } | null>(null);
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
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm break-words space-y-2">
          <p className="font-semibold">Stealth Meta-Address (share this)</p>
          <p className="text-slate-200/80 text-xs">{data.stealthMetaAddress}</p>
          <p className="font-semibold mt-2">Stealth Address</p>
          <p className="text-slate-200/80">{data.stealthAddress}</p>
          <p className="font-semibold mt-2">Spending Key (keep secret)</p>
          <p className="text-slate-200/80 text-xs">{data.spendingKey}</p>
          <p className="font-semibold mt-2">Viewing Key</p>
          <p className="text-slate-200/80 text-xs">{data.viewingKey}</p>
        </div>
      )}
      {err && <p className="text-rose-300 text-sm">{err}</p>}
      <p className="text-xs text-slate-300/70">
        ERC-5564 stealth addresses (SECP256k1 with view tags). Store keys securely.
      </p>
    </div>
  );
}



