import "dotenv/config";
import hre from "hardhat";

async function main() {
  const passportAddress = process.env.PASSPORT_ADDRESS || "0x3780f8b9f618e8e7fd0be2e209617e583f0e325c";
  const verifierAddress = process.env.VERIFIER_ADDRESS || "0xd749736bb339b44639bcaef09ac2248dee0b7a39";
  const adminAddress = process.env.DEPLOYER_ADDRESS || "0x10ac9924a78051BdD770978740C5084205cdB628";

  console.log("Verifying contracts on PolygonScan...");

  try {
    await hre.run("verify:verify", {
      address: verifierAddress,
      constructorArguments: [true],
      contract: "contracts/MockVerifier.sol:MockVerifier",
    });
    console.log("MockVerifier verified");
  } catch (e: any) {
    if (e.message?.includes("Already Verified")) {
      console.log("MockVerifier already verified");
    } else {
      console.error("MockVerifier verification failed:", e.message);
    }
  }

  try {
    await hre.run("verify:verify", {
      address: passportAddress,
      constructorArguments: [adminAddress, verifierAddress],
      contract: "contracts/OblivionPassport.sol:OblivionPassport",
    });
    console.log("OblivionPassport verified");
  } catch (e: any) {
    if (e.message?.includes("Already Verified")) {
      console.log("OblivionPassport already verified");
    } else {
      console.error("OblivionPassport verification failed:", e.message);
    }
  }

  console.log("Verification complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
