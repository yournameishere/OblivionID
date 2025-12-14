import MintCard from "@/components/mint-card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import RequireWallet from "@/components/require-wallet";

export default function MintPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm text-cyan-300/80 uppercase tracking-wider mb-2">Step 2 · On-chain</p>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Mint zkPassport
          </h1>
          <p className="text-lg text-slate-200/80 max-w-2xl">
            Use your proof handle from KYC verification to mint your soulbound zkPassport NFT on Polygon.
            This passport is non-transferable and tied to your wallet address.
          </p>
        </header>

        <div className="glass p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Minting Process</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">🔑</div>
                <p className="text-sm font-medium mb-1">Enter Proof Handle</p>
                <p className="text-xs text-slate-400">From KYC verification</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">📝</div>
                <p className="text-sm font-medium mb-1">Prepare Payload</p>
                <p className="text-xs text-slate-400">Generate ZK proof data</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl mb-2">🎫</div>
                <p className="text-sm font-medium mb-1">Mint Passport</p>
                <p className="text-xs text-slate-400">On-chain transaction</p>
              </div>
            </div>
          </div>

          <RequireWallet label="Connect your wallet to mint your zkPassport">
            <MintCard />
          </RequireWallet>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-semibold mb-2">Soulbound NFT</h3>
            <p className="text-sm text-slate-300/70">
              Your zkPassport is a non-transferable NFT tied to your wallet address.
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="font-semibold mb-2">Zero-Knowledge</h3>
            <p className="text-sm text-slate-300/70">
              Only verification flags are stored on-chain. No personal data is exposed.
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-semibold mb-2">Polygon Network</h3>
            <p className="text-sm text-slate-300/70">
              Minted on Polygon Amoy testnet. Fast and low-cost transactions.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/kyc" className="btn-secondary">
            ← Back to KYC
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            View Dashboard →
          </Link>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}


