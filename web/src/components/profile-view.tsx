"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuthPayload } from "@/lib/useAuthPayload";

type Profile = {
  fullName: string;
  email: string;
  country: string;
  phone?: string;
  dateOfBirth?: string;
  bio: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProfileView() {
  const { address } = useAccount();
  const { getAuthPayload } = useAuthPayload();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  async function loadProfile(payload: { address: string; message: string; signature: string }) {
    try {
      const res = await axios.post("/api/profile/me", payload);
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
      setNeedsSignIn(false);
    } catch (e) {
      if ((e as any)?.response?.status === 401) setNeedsSignIn(true);
      else console.error("Failed to load profile:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    async function tryLoad() {
      try {
        const res = await axios.post("/api/profile/me", { address });
        if (res.data?.profile) setProfile(res.data.profile);
        setNeedsSignIn(false);
      } catch (e: any) {
        if (e?.response?.status === 401) setNeedsSignIn(true);
        else console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    tryLoad();
  }, [address]);

  async function handleSignIn() {
    const payload = await getAuthPayload();
    if (payload) {
      setLoading(true);
      await loadProfile(payload);
    }
  }

  if (loading && !needsSignIn) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-300">Loading profile...</div>
      </div>
    );
  }

  if (address && needsSignIn) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-300/70 mb-4">Sign in with your wallet to view your profile.</p>
        <button onClick={handleSignIn} className="btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-300/70 mb-4">No profile found. Create one to get started!</p>
        <Link href="/start" className="btn-primary">
          Create Profile
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400 mb-1">Full Name</p>
          <p className="font-semibold text-lg">{profile.fullName || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Email</p>
          <p className="font-semibold text-lg">{profile.email || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Country</p>
          <p className="font-semibold text-lg">{profile.country || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 mb-1">Phone</p>
          <p className="font-semibold text-lg">{profile.phone || "—"}</p>
        </div>
        {profile.dateOfBirth && (
          <div>
            <p className="text-sm text-slate-400 mb-1">Date of Birth</p>
            <p className="font-semibold text-lg">
              {new Date(profile.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-slate-400 mb-1">Wallet Address</p>
          <p className="font-mono text-sm text-slate-300 break-all">
            {address || "Not connected"}
          </p>
        </div>
      </div>
      {profile.bio && (
        <div>
          <p className="text-sm text-slate-400 mb-1">Bio</p>
          <p className="text-slate-200">{profile.bio}</p>
        </div>
      )}
      {(profile.createdAt || profile.updatedAt) && (
        <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
          {profile.createdAt && (
            <p>Created: {new Date(profile.createdAt).toLocaleString()}</p>
          )}
          {profile.updatedAt && (
            <p>Last updated: {new Date(profile.updatedAt).toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
}

