import Link from "next/link";
import KycForm from "@/components/kyc-form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import RequireWallet from "@/components/require-wallet";
import KycStatus from "@/components/kyc-status";

export default function KycPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm text-cyan-300/80 uppercase tracking-wider mb-2">Step 2 · Off-chain KYC</p>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">KYC Verification</h1>
          <p className="text-lg text-slate-200/80 max-w-2xl">
            Complete your identity verification by uploading your ID, selfie, and liveness video.
            Our AI will verify authenticity, check for deepfakes, and validate your documents.
          </p>
        </header>

        {/* Show existing KYC status if verified */}
        <div className="glass p-6 mb-6">
          <RequireWallet label="Connect your wallet to view KYC status">
            <KycStatus />
          </RequireWallet>
        </div>

        <div className="glass p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Verification Process</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">📄</div>
                <p className="text-sm font-medium">Upload ID</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">📸</div>
                <p className="text-sm font-medium">Take Selfie</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">🎥</div>
                <p className="text-sm font-medium">Liveness Video</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm font-medium">Get Verified</p>
              </div>
            </div>
          </div>

          <RequireWallet label="Connect your wallet to start KYC verification">
            <KycForm />
          </RequireWallet>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-slate-300/70">
              All documents are encrypted and stored temporarily. They&apos;re deleted after verification.
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI Powered</h3>
            <p className="text-sm text-slate-300/70">
              Advanced AI checks for document authenticity, deepfake detection, and liveness verification.
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Fast Processing</h3>
            <p className="text-sm text-slate-300/70">
              Verification typically completes within minutes. You&apos;ll receive a proof handle for minting.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/start" className="btn-secondary">
            ← Complete Profile
          </Link>
          <Link href="/mint" className="btn-secondary">
            Go to Mint →
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}



