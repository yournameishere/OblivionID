"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Profile = {
  fullName: string;
  email: string;
  country: string;
  phone?: string;
  dateOfBirth?: string;
  bio: string;
};

export default function ProfileForm({ redirectTo }: { redirectTo?: string }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
    country: "",
    phone: "",
    dateOfBirth: "",
    bio: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    async function load() {
      if (!address) {
        setIsLoadingProfile(false);
        return;
      }
      try {
        const res = await axios.post("/api/profile/me", { address });
        if (res.data?.profile) {
          setProfile({
            fullName: res.data.profile.fullName || "",
            email: res.data.profile.email || "",
            country: res.data.profile.country || "",
            phone: res.data.profile.phone || "",
            dateOfBirth: res.data.profile.dateOfBirth || "",
            bio: res.data.profile.bio || "",
          });
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setIsLoadingProfile(false);
      }
    }
    load();
  }, [address]);

  async function submit() {
    if (!isConnected || !address) {
      setMessage({ type: "error", text: "Please connect your wallet first." });
      return;
    }

    if (!profile.fullName || !profile.email || !profile.country) {
      setMessage({ type: "error", text: "Please fill in all required fields (Name, Email, Country)." });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      await axios.post("/api/profile/set", { address, ...profile });
      setMessage({ type: "success", text: "Profile saved successfully!" });
      
      // Redirect after a short delay
      setTimeout(() => {
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push("/dashboard");
        }
      }, 1500);
    } catch (e: any) {
      setMessage({
        type: "error",
        text: e?.response?.data?.error || e?.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-300">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <p className="text-sm text-slate-300/70">
          Complete your profile to get started. This information is stored securely off-chain.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
            placeholder="Enter your full name"
            value={profile.fullName}
            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
            placeholder="your.email@example.com"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Country <span className="text-rose-400">*</span>
          </label>
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
            placeholder="e.g., IN, US, UK"
            value={profile.country}
            onChange={(e) => setProfile({ ...profile, country: e.target.value.toUpperCase() })}
            maxLength={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
            placeholder="+1234567890"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
          value={profile.dateOfBirth}
          onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Bio / Additional Notes
        </label>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition resize-none"
          placeholder="Tell us about yourself or add any additional information..."
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === "success"
              ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
              : "bg-rose-500/20 border border-rose-500/50 text-rose-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={submit}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed px-8 py-3"
          disabled={loading}
        >
          {loading ? "Saving..." : redirectTo ? "Save & Continue" : "Save Profile"}
        </button>
        {!redirectTo && (
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-secondary px-6 py-3"
          >
            Skip to Dashboard
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-xs text-slate-300/70">
          <span className="font-semibold text-slate-200">Privacy Note:</span> Your profile is stored off-chain in MongoDB
          and keyed by your wallet address. This information is used to prefill KYC forms and personalize your
          dashboard. Your zkPassport remains completely separate and only stores verification flags on-chain.
        </p>
      </div>
    </div>
  );
}


