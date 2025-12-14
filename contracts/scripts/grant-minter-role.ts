import "dotenv/config";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";
import hre from "hardhat";

/**
 * Grant MINTER_ROLE to a specific address
 * Usage: npx hardhat run scripts/grant-minter-role.ts --network polygonAmoy
 * 
 * Set MINTER_ADDRESS environment variable to the address that should receive MINTER_ROLE
 */
async function main() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");

  const minterAddress = process.env.MINTER_ADDRESS;
  if (!minterAddress) {
    throw new Error("MINTER_ADDRESS environment variable not set. Set it to the address that should receive MINTER_ROLE");
  }

  const passportAddress = process.env.PASSPORT_ADDRESS || "0x1d930379145bd62523504e2a3fd25ddeb7639d9f";
  const rpc = process.env.AMOY_RPC_URL || process.env.POLYGON_AMOY_RPC || "https://polygon-amoy.g.alchemy.com/v2/demo";

  const account = privateKeyToAccount(pk as `0x${string}`);
  const client = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(rpc),
  });
  const publicClient = createPublicClient({ chain: polygonAmoy, transport: http(rpc) });

  console.log("Admin (granting role):", account.address);
  console.log("Minter address (receiving role):", minterAddress);
  console.log("Passport contract:", passportAddress);

  const artifact = await hre.artifacts.readArtifact("OblivionPassport");
  const MINTER_ROLE = "0x" + require("crypto")
    .createHash("sha256")
    .update("MINTER_ROLE")
    .digest("hex")
    .slice(0, 64);

  console.log("MINTER_ROLE:", MINTER_ROLE);

  try {
    const hash = await client.writeContract({
      address: passportAddress as `0x${string}`,
      abi: artifact.abi,
      functionName: "grantRole",
      args: [MINTER_ROLE as `0x${string}`, minterAddress as `0x${string}`],
    });

    console.log("Transaction hash:", hash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    console.log("✅ MINTER_ROLE granted successfully!");
  } catch (error: any) {
    console.error("Error granting role:", error);
    if (error?.message?.includes("AccessControl")) {
      console.error("Make sure the account has DEFAULT_ADMIN_ROLE");
    }
    throw error;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

