import { FeatureSections } from "@/components/feature-sections";
import Link from "next/link";

const stack = [
  "Next.js 14 App Router + Tailwind",
  "Wagmi + RainbowKit + viem",
  "MongoDB (temp encrypted data)",
  "Polygon Amoy zkPassport SBT",
  "Mock ZK verifier (swap with Groth16/Plonk)",
  "Stealth helper (ERC-5564 inspired)",
];

export default function DocsPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-300/80">Architecture</p>
            <h1 className="text-3xl font-semibold gradient-text">Docs</h1>
          </div>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </header>
        <div className="card-3d p-5">
          <h2 className="text-xl font-semibold">Flow (per spec)</h2>
          <p className="text-slate-200/80 mt-2">
            KYC uploads → AI checks (face, doc, liveness, sanctions, age, nationality, duplicate) → extract
            boolean flags → generate ZK proof (hash + public signals only) → mint soulbound zkPassport on
            Polygon → link to stealth address. PII is discarded after mint.
          </p>
        </div>
        <FeatureSections />
        <div className="card-3d p-5">
          <h3 className="text-lg font-semibold">Stack</h3>
          <ul className="grid md:grid-cols-2 gap-2 mt-3 text-sm text-slate-200/80">
            {stack.map((s) => (
              <li key={s} className="flex gap-2 items-start">
                <span className="text-cyan-300">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-3d p-5 text-sm text-slate-200/80 space-y-2">
          <p className="font-semibold">Replace mocks to go production:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Wire real KYC/AI SDK and persist encrypted blobs until mint.</li>
            <li>Swap MockVerifier with real zkSNARK/zkSTARK verifier; feed real proof/public signals.</li>
            <li>Enable attestation storage (e.g., metadata IPFS) and indexer for logs.</li>
            <li>Harden stealth address flow with full ERC-5564 implementation.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}



