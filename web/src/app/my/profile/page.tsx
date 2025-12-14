import ProfileForm from "@/components/profile-form";
import RequireWallet from "@/components/require-wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function MyProfilePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm text-cyan-300/80 uppercase tracking-wider mb-2">Profile Management</p>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Edit Your Profile</h1>
          <p className="text-lg text-slate-200/80 max-w-2xl">
            Update your personal information. This data is stored securely off-chain and used to prefill
            KYC forms. Your zkPassport remains completely separate on-chain.
          </p>
        </header>

        <section className="glass p-8 mb-6">
          <RequireWallet label="Connect your wallet to manage your profile">
            <ProfileForm />
          </RequireWallet>
        </section>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-slate-300/70">
              Your profile data is encrypted and stored off-chain. Only you can access it.
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">⚙️</div>
            <h3 className="font-semibold mb-2">Easy Updates</h3>
            <p className="text-sm text-slate-300/70">
              Update your information anytime. Changes are saved instantly.
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">KYC Ready</h3>
            <p className="text-sm text-slate-300/70">
              Your profile information will prefill KYC forms for faster verification.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
          <Link href="/kyc" className="btn-secondary">
            Continue to KYC →
          </Link>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}


