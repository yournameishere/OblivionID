// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Groth16Verifier.sol";

/**
 * Adapter that implements IZkVerifier (bytes proof, uint256[] publicSignals)
 * by decoding proof bytes and calling the Groth16 verifier.
 * Proof format: 8 * 32 bytes = a[0], a[1], b[0][0], b[0][1], b[1][0], b[1][1], c[0], c[1]
 */
contract ZkVerifierAdapter {
    Groth16Verifier public immutable groth16;

    constructor(address _groth16) {
        groth16 = Groth16Verifier(_groth16);
    }

    function verifyProof(bytes calldata proof, uint256[] calldata publicSignals) external view returns (bool) {
        require(proof.length >= 256, "Invalid proof length");
        uint256[2] memory a;
        uint256[2][2] memory b;
        uint256[2] memory c;
        a[0] = _sliceBytes(proof, 0);
        a[1] = _sliceBytes(proof, 32);
        b[0][0] = _sliceBytes(proof, 64);
        b[0][1] = _sliceBytes(proof, 96);
        b[1][0] = _sliceBytes(proof, 128);
        b[1][1] = _sliceBytes(proof, 160);
        c[0] = _sliceBytes(proof, 192);
        c[1] = _sliceBytes(proof, 224);
        return groth16.verifyProof(a, b, c, publicSignals);
    }

    function _sliceBytes(bytes calldata data, uint256 offset) internal pure returns (uint256) {
        uint256 v;
        for (uint256 i = 0; i < 32 && offset + i < data.length; i++) {
            v = (v << 8) | uint8(data[offset + i]);
        }
        return v;
    }
}
