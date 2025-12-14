export const config = {
  passportAddress: process.env.NEXT_PUBLIC_PASSPORT_ADDRESS || "",
  verifierAddress: process.env.NEXT_PUBLIC_VERIFIER_ADDRESS || "",
  mongoUri: process.env.MONGODB_URI || "",
  alchemyRpc:
    process.env.NEXT_PUBLIC_ALCHEMY_RPC ||
    "https://polygon-amoy.g.alchemy.com/v2/demo",
};

