#!/bin/bash
# Setup ZK circuit: compile, trusted setup, generate verifier
# Requires: circom (https://docs.circom.io/getting-started/installation), node, snarkjs

set -e
cd "$(dirname "$0")/.."
mkdir -p circuits/build

# 1. Compile circuit (requires circom 2)
if ! command -v circom &> /dev/null; then
  echo "circom not found. Install from: https://docs.circom.io/getting-started/installation"
  exit 1
fi
circom circuits/passport.circom --r1cs --wasm --sym -o circuits/build

# 2. Download Powers of Tau (use small one for dev - 12 = 2^12 constraints)
PTAU="circuits/build/pot12_final.ptau"
if [ ! -f "$PTAU" ]; then
  echo "Downloading Powers of Tau..."
  curl -L -o "$PTAU" "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau"
fi

# 3. Groth16 setup
npx snarkjs groth16 setup circuits/build/passport.r1cs "$PTAU" circuits/build/passport_0000.zkey
echo "random entropy" | npx snarkjs zkey contribute circuits/build/passport_0000.zkey circuits/build/passport_final.zkey --name="contrib1"

# 4. Export verifier
npx snarkjs zkey export solidityverifier circuits/build/passport_final.zkey contracts/contracts/Groth16Verifier.sol

# 5. Copy wasm for proof generation
cp circuits/build/passport_js/passport.wasm circuits/build/
cp circuits/build/passport_js/generate_witness.js circuits/build/ 2>/dev/null || true

echo "Done. Groth16Verifier.sol generated. Run: npm run deploy"
echo "For proof generation, use circuits/build/passport.wasm and circuits/build/passport_final.zkey"
