import ProfileForm from "@/components/profile-form";
import RequireWallet from "@/components/require-wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function StartPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-sm text-cyan-300/80 uppercase tracking-wider mb-2">Onboarding</p>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Get Started</h1>
          <p className="text-lg text-slate-200/80 max-w-2xl">
            Welcome to OblivionID! Connect your wallet and complete your profile to begin your journey
            towards private, compliant identity verification.
          </p>
        </header>

        <div className="glass p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-bold text-xl">
              1
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
              <p className="text-slate-300/80">
                Fill in your personal information. This data is stored securely off-chain and will be used
                to prefill your KYC forms. Your profile helps personalize your dashboard experience.
              </p>
            </div>
          </div>

          <RequireWallet label="Connect your wallet to create your profile">
            <ProfileForm redirectTo="/dashboard" />
          </RequireWallet>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🔐</div>
            <h3 className="font-semibold mb-2">Secure Storage</h3>
            <p className="text-sm text-slate-300/70">
              Your profile data is encrypted and stored off-chain in MongoDB
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-2">Quick Setup</h3>
            <p className="text-sm text-slate-300/70">
              Complete your profile in minutes and start using OblivionID
            </p>
          </div>
          <div className="card-3d p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <p className="text-sm text-slate-300/70">
              After profile creation, proceed to KYC verification and mint your zkPassport
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-secondary">
            ← Back to Home
          </Link>
          <Link href="/kyc" className="btn-secondary">
            Skip to KYC →
          </Link>
        </div>
      </div>
    </main>
  );
}


