"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function RequireWallet({
  children,
  label = "Connect wallet to continue",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const { address, isConnected } = useAccount();
  if (!isConnected || !address) {
    return (
      <div className="glass p-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-slate-300/80">
            Wallet connection gates mint/admin actions and binds your zkPassport to your address.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }
  return <>{children}</>;
}


