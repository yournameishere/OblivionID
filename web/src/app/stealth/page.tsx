import StealthCard from "@/components/stealth-card";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import RequireWallet from "@/components/require-wallet";

export default function StealthPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <p className="text-sm text-cyan-300/80">Step 3 · Stealth</p>
          <h1 className="text-3xl font-semibold gradient-text">Stealth Identity</h1>
          <p className="text-slate-200/70 max-w-2xl">
            Generate a stealth address + viewing key. Use it to unlink activity from the main wallet while
            relying on your zkPassport flags.
          </p>
        </div>
        <ConnectButton />
      </header>
      <section className="max-w-5xl mx-auto mt-10 glass p-6">
        <RequireWallet label="Connect to bind stealth address">
          <StealthCard />
        </RequireWallet>
      </section>
      <div className="max-w-5xl mx-auto mt-6 flex justify-between text-sm text-slate-300">
        <Link href="/dashboard" className="btn-secondary">
          Dashboard
        </Link>
        <Link href="/" className="btn-secondary">
          Home
        </Link>
      </div>
    </main>
  );
}


