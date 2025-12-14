import { ConnectButton } from "@rainbow-me/rainbowkit";
import DashboardView from "@/components/dashboard-view";
import Link from "next/link";
import RequireWallet from "@/components/require-wallet";
import ProfileView from "@/components/profile-view";
import KycStatus from "@/components/kyc-status";
import OnboardingSteps from "@/components/onboarding-steps";

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <p className="text-sm text-cyan-300/80 uppercase tracking-wider mb-2">Personal Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Welcome Back</h1>
          <p className="text-lg text-slate-200/80 max-w-2xl">
            Manage your profile, view your zkPassport status, and track your verification progress.
          </p>
        </header>

        {/* Step-by-Step Guide */}
        <section className="glass p-6 mb-6">
          <RequireWallet label="Connect your wallet to see your progress">
            <OnboardingSteps />
          </RequireWallet>
        </section>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Section */}
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Your Profile</h2>
              <Link href="/my/profile" className="btn-secondary text-sm px-4 py-2">
                Edit Profile
              </Link>
            </div>
            <RequireWallet label="Connect to view your profile">
              <ProfileView />
            </RequireWallet>
          </div>

          {/* KYC Status */}
          <div className="glass p-6">
            <h2 className="text-2xl font-semibold mb-4">KYC Verification</h2>
            <RequireWallet label="Connect to view KYC status">
              <KycStatus />
            </RequireWallet>
          </div>
        </div>

        {/* zkPassport Section */}
        <section className="glass p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">zkPassport Status</h2>
          <RequireWallet label="Connect to view your zkPassport">
            <DashboardView />
          </RequireWallet>
        </section>

        {/* Navigation Links */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/start" className="btn-secondary">
            Update Profile
          </Link>
          <Link href="/kyc" className="btn-secondary">
            Start KYC
          </Link>
          <Link href="/mint" className="btn-secondary">
            Mint Passport
          </Link>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}


