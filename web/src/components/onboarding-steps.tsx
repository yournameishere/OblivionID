"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface StepStatus {
  profile: boolean;
  kyc: boolean;
  mint: boolean;
}

export default function OnboardingSteps() {
  const { address } = useAccount();
  const [stepStatus, setStepStatus] = useState<StepStatus>({
    profile: false,
    kyc: false,
    mint: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!address) {
        setLoading(false);
        return;
      }
      try {
        // Check profile
        const profileRes = await axios.post("/api/profile/me", { address }).catch(() => ({ data: { profile: null } }));
        const hasProfile = !!profileRes.data?.profile?.fullName;

        // Check KYC
        const kycRes = await axios.post("/api/kyc/user", { address }).catch(() => ({ data: { isVerified: false } }));
        const hasKyc = kycRes.data?.isVerified || false;

        // Check if minted (would need to check on-chain or store in DB)
        // For now, we'll check if they have a verified KYC
        setStepStatus({
          profile: hasProfile,
          kyc: hasKyc,
          mint: false, // Will be updated when we add mint tracking
        });
      } catch (e) {
        console.error("Failed to load step status:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [address]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="text-slate-300">Loading progress...</div>
      </div>
    );
  }

  const steps = [
    {
      number: 1,
      title: "Complete Your Profile",
      description: "Add your personal information",
      completed: stepStatus.profile,
      link: "/start",
      icon: "👤",
    },
    {
      number: 2,
      title: "Verify Your Identity (KYC)",
      description: "Upload ID, selfie, and liveness video",
      completed: stepStatus.kyc,
      link: "/kyc",
      icon: "✅",
    },
    {
      number: 3,
      title: "Mint Your zkPassport",
      description: "Create your on-chain passport NFT",
      completed: stepStatus.mint,
      link: "/mint",
      icon: "🎫",
    },
  ];

  const currentStep = steps.findIndex((s) => !s.completed);
  const nextStep = currentStep >= 0 ? steps[currentStep] : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Get Your zkPassport</h3>
        {nextStep && (
          <Link href={nextStep.link} className="btn-primary text-sm px-4 py-2">
            {nextStep.completed ? "Continue" : `Start Step ${nextStep.number}`}
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={step.number}
            className={`relative p-4 rounded-xl border transition-all ${
              step.completed
                ? "bg-emerald-500/10 border-emerald-500/30"
                : idx === currentStep
                ? "bg-cyan-500/10 border-cyan-500/30"
                : "bg-white/5 border-white/10"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  step.completed
                    ? "bg-emerald-500/20 text-emerald-300"
                    : idx === currentStep
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "bg-white/10 text-slate-400"
                }`}
              >
                {step.completed ? "✓" : step.number}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{step.title}</h4>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <p className="text-sm text-slate-300/70 mb-2">{step.description}</p>
                {idx === currentStep && !step.completed && (
                  <Link href={step.link} className="text-sm text-cyan-300 hover:text-cyan-200">
                    Start this step →
                  </Link>
                )}
                {step.completed && (
                  <p className="text-xs text-emerald-300/80">✓ Completed</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {stepStatus.profile && stepStatus.kyc && !stepStatus.mint && (
        <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-xl p-4 mt-4">
          <p className="font-semibold mb-1">🎉 Almost There!</p>
          <p className="text-sm text-slate-300/80 mb-3">
            Your profile and KYC are complete. Mint your zkPassport to finish setup.
          </p>
          <Link href="/mint" className="btn-primary text-sm px-6 py-2">
            Mint zkPassport Now
          </Link>
        </div>
      )}
    </div>
  );
}

