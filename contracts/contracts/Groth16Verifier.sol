// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * Groth16 verifier for passport circuit.
 * Replace this file by running: npm run circuit:setup
 * That runs snarkjs and generates the real verifier with the circuit's verification key.
 */
contract Groth16Verifier {
    function verifyProof(
        uint256[2] calldata a,
        uint256[2][2] calldata b,
        uint256[2] calldata c,
        uint256[] calldata input
    ) external view returns (bool) {
        (a, b, c, input); // silence unused
        // Placeholder: returns false. Run `npm run circuit:setup` to generate real verifier.
        return false;
    }
}
