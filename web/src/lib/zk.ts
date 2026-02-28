import { join } from "path";

export type PassportFlags = {
  isVerified: boolean;
  isAdult: boolean;
  isHuman: boolean;
  isNotSanctioned: boolean;
  isUnique: boolean;
};

/**
 * Generate real ZK proof when circuit artifacts exist.
 * Returns null if artifacts not found (use mock proof with MockVerifier).
 */
export async function generatePassportProof(
  flags: PassportFlags
): Promise<{ zkProof: string; publicSignals: number[] } | null> {
  const wasmPath =
    process.env.ZK_WASM_PATH ||
    join(process.cwd(), "..", "contracts", "circuits", "build", "passport_js", "passport.wasm");
  const zkeyPath =
    process.env.ZK_ZKEY_PATH ||
    join(process.cwd(), "..", "contracts", "circuits", "build", "passport_final.zkey");

  try {
    const { existsSync } = await import("fs");
    if (!existsSync(wasmPath) || !existsSync(zkeyPath)) return null;

    const snarkjs = await import("snarkjs");
    const input = {
      isVerified: flags.isVerified ? 1 : 0,
      isAdult: flags.isAdult ? 1 : 0,
      isHuman: flags.isHuman ? 1 : 0,
      isNotSanctioned: flags.isNotSanctioned ? 1 : 0,
      isUnique: flags.isUnique ? 1 : 0,
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasmPath, zkeyPath);

    // Serialize proof to bytes for ZkVerifierAdapter
    // Format: a[0], a[1], b[0][0], b[0][1], b[1][0], b[1][1], c[0], c[1] (each 32 bytes)
    const toHex = (n: bigint) => {
      const h = n.toString(16).padStart(64, "0");
      return h.length > 64 ? h.slice(-64) : h;
    };
    const parts = [
      proof.pi_a[0],
      proof.pi_a[1],
      proof.pi_b[0][1],
      proof.pi_b[0][0],
      proof.pi_b[1][1],
      proof.pi_b[1][0],
      proof.pi_c[0],
      proof.pi_c[1],
    ];
    const proofHex = parts.map((p) => toHex(BigInt(p.toString()))).join("");
    const zkProof = "0x" + proofHex;

    const publicSignalsNum = publicSignals.map((s: string) => Number(s));

    return { zkProof, publicSignals: publicSignalsNum };
  } catch {
    return null;
  }
}
