import Link from "next/link";

const faqs = [
  {
    q: "What goes on-chain?",
    a: "Only boolean flags, identity hash, and proof signals. No PII or images.",
  },
  {
    q: "Is the passport transferable?",
    a: "No. It is a soulbound token; transfers and approvals revert.",
  },
  {
    q: "How is KYC stored?",
    a: "Temporarily in Mongo (encrypted in real deployment). After mint, delete PII per policy.",
  },
  {
    q: "Can admins revoke?",
    a: "Yes, REVOKER_ROLE can revoke; events emitted for indexing.",
  },
  {
    q: "Does this include stealth addresses?",
    a: "A helper is provided; swap with full ERC-5564 for production.",
  },
  {
    q: "How to use in dApps?",
    a: "Check flags via contract calls and require zkPassport ownership; no KYC data needed.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cyan-300/80">Support</p>
            <h1 className="text-3xl font-semibold gradient-text">FAQ</h1>
          </div>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </header>
        <div className="grid gap-4">
          {faqs.map((f) => (
            <div key={f.q} className="card-3d p-4">
              <p className="font-semibold">{f.q}</p>
              <p className="text-slate-200/80 text-sm mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}



