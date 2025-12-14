"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!address) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post("/api/profile/me", { address });
        if (res.data?.profile) {
          setProfile(res.data.profile);
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-slate-300">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-300/70 mb-4">No profile found. Create one to get started!</p>
        <Link href="/start" className="btn-primary">
          Create Profile
        </Link>
      </div>
    );
  }

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

