import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { polygonAmoy } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo";
const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL ||
  "https://polygon-amoy.g.alchemy.com/v2/demo";

export const wagmiConfig = getDefaultConfig({
  appName: "OblivionID",
  projectId,
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(rpcUrl),
  },
  ssr: true,
});

