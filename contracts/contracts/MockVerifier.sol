// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockVerifier {
    bool public allow;

    constructor(bool _allow) {
        allow = _allow;
    }

    function setAllow(bool value) external {
        allow = value;
    }

    function verifyProof(bytes calldata, uint256[] calldata) external view returns (bool) {
        return allow;
    }
}



