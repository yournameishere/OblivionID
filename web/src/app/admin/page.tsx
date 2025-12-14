import AdminPanel from "@/components/admin-panel";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import RequireWallet from "@/components/require-wallet";

export default function AdminPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <header className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <p className="text-sm text-cyan-300/80">Role-gated</p>
          <h1 className="text-3xl font-semibold gradient-text">Admin Panel</h1>
          <p className="text-slate-200/70 max-w-2xl">
            Revoke passports, update verifier, and view audit logs. Requires
            on-chain MINTER/REVOKER/ADMIN roles.
          </p>
        </div>
        <ConnectButton />
      </header>
      <section className="max-w-5xl mx-auto mt-10 glass p-6">
        <RequireWallet label="Connect with an admin/revoker wallet">
          <AdminPanel />
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


