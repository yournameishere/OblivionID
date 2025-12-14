/* Global providers: wagmi + RainbowKit + React Query */
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { polygonAmoy } from "viem/chains";
import React from "react";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "example-project-id";

const wagmiConfig = getDefaultConfig({
  appName: "OblivionID",
  projectId,
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ||
        "https://polygon-amoy.g.alchemy.com/v2/demo"
    ),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#6ee7ff",
            accentColorForeground: "#0b1220",
            borderRadius: "large",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

