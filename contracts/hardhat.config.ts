import "dotenv/config";
import { defineConfig } from "hardhat/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const AMOY_RPC =
  process.env.AMOY_RPC_URL ||
  process.env.POLYGON_AMOY_RPC ||
  "https://rpc-amoy.polygon.technology/";

export default defineConfig({
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
    },
    polygonAmoy: {
      type: "http",
      url: AMOY_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
});
