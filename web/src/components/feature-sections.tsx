const steps = [
  {
    title: "Off-chain KYC + AI",
    points: [
      "Face match, doc authenticity, deepfake + liveness",
      "Age / nationality rules, sanctions/PEP check",
      "Duplicate prevention via identity hash",
    ],
  },
  {
    title: "ZK Proof",
    points: [
      "Encode verified, adult, human, non-sanctioned, unique",
      "Outputs proof hash + public signals only",
      "No PII leaves the backend",
    ],
  },
  {
    title: "zkPassport (SBT)",
    points: [
      "Mint on Polygon Amoy as soulbound",
      "Stores only boolean flags + identity hash",
      "Transfer disabled; revoke supported",
    ],
  },
  {
    title: "Stealth Identity",
    points: [
      "ERC-5564-inspired stealth address",
      "Link passport to stealth wallet off-chain",
      "Dapps only see flags, never PII",
    ],
  },
];

export function FeatureSections() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {steps.map((step) => (
        <div key={step.title} className="card-3d p-5">
          <p className="text-cyan-300/80 text-xs uppercase tracking-[0.25em]">
            {step.title}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200/80">
            {step.points.map((p) => (
              <li key={p} className="flex gap-2 items-start">
                <span className="text-cyan-300">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}



