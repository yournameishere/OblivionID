import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DashboardView from "@/components/dashboard-view";

export default function DemoPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <p className="text-sm text-cyan-300/80">Dapp Demo</p>
          <h1 className="text-3xl font-semibold gradient-text">Verifier View</h1>
          <p className="text-slate-200/70 max-w-2xl">
            Simulate how a dApp checks zkPassport flags (ownerOf + getAttributes). Use any tokenId to verify
            access without revealing PII.
          </p>
        </div>
        <ConnectButton />
      </header>
      <section className="max-w-5xl mx-auto mt-10 glass p-6">
        <DashboardView />
      </section>
      <div className="max-w-5xl mx-auto mt-6 flex justify-between text-sm text-slate-300">
        <Link href="/mint" className="btn-secondary">
          Mint
        </Link>
        <Link href="/" className="btn-secondary">
          Home
        </Link>
      </div>
    </main>
  );
}



