import "dotenv/config";
import hre from "hardhat";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";

async function deploy(
  name: string,
  args: unknown[],
  client: ReturnType<typeof createWalletClient>,
  publicClient: ReturnType<typeof createPublicClient>
) {
  const artifact = await hre.artifacts.readArtifact(name);
  const hash = await client.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode as `0x${string}`,
    args,
  });
  console.log(`${name} tx hash:`, hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) throw new Error(`No contract address for ${name}`);
  console.log(`${name} deployed to:`, receipt.contractAddress);
  return receipt.contractAddress;
}

async function main() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) throw new Error("PRIVATE_KEY missing");

  const account = privateKeyToAccount(pk as `0x${string}`);
  const rpc =
    process.env.AMOY_RPC_URL ||
    process.env.POLYGON_AMOY_RPC ||
    "https://polygon-amoy.g.alchemy.com/v2/demo";

  const client = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(rpc),
  });
  const publicClient = createPublicClient({ chain: polygonAmoy, transport: http(rpc) });

  console.log("Deployer:", account.address);
  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Balance (MATIC):", Number(balance) / 1e18);

  const verifierAddr = await deploy("MockVerifier", [true], client, publicClient);
  const passportAddr = await deploy(
    "OblivionPassport",
    [account.address, verifierAddr],
    client,
    publicClient
  );

  console.log("Deployment complete:", { verifierAddr, passportAddr });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

