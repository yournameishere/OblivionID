export const passportAbi = [
  {
    inputs: [
      { internalType: "address", name: "admin", type: "address" },
      { internalType: "address", name: "verifierAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      {
        components: [
          { internalType: "bool", name: "isVerified", type: "bool" },
          { internalType: "bool", name: "isAdult", type: "bool" },
          { internalType: "bool", name: "isHuman", type: "bool" },
          { internalType: "bool", name: "isNotSanctioned", type: "bool" },
          { internalType: "bool", name: "isUnique", type: "bool" },
          { internalType: "bytes32", name: "identityHash", type: "bytes32" },
        ],
        indexed: false,
        internalType: "struct OblivionPassport.Attributes",
        name: "attrs",
        type: "tuple",
      },
      { indexed: false, internalType: "string", name: "metadataURI", type: "string" },
    ],
    name: "PassportMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "by", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" },
    ],
    name: "PassportRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "by", type: "address" },
      { indexed: true, internalType: "address", name: "newVerifier", type: "address" },
    ],
    name: "VerifierUpdated",
    type: "event",
  },
  { inputs: [], name: "MINTER_ROLE", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "REVOKER_ROLE", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "DEFAULT_ADMIN_ROLE", outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getAttributes",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "isVerified", type: "bool" },
          { internalType: "bool", name: "isAdult", type: "bool" },
          { internalType: "bool", name: "isHuman", type: "bool" },
          { internalType: "bool", name: "isNotSanctioned", type: "bool" },
          { internalType: "bool", name: "isUnique", type: "bool" },
          { internalType: "bytes32", name: "identityHash", type: "bytes32" },
        ],
        internalType: "struct OblivionPassport.Attributes",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "isRevoked",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "verifier",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      {
        components: [
          { internalType: "bool", name: "isVerified", type: "bool" },
          { internalType: "bool", name: "isAdult", type: "bool" },
          { internalType: "bool", name: "isHuman", type: "bool" },
          { internalType: "bool", name: "isNotSanctioned", type: "bool" },
          { internalType: "bool", name: "isUnique", type: "bool" },
          { internalType: "bytes32", name: "identityHash", type: "bytes32" },
        ],
        internalType: "struct OblivionPassport.Attributes",
        name: "attrs",
        type: "tuple",
      },
      { internalType: "bytes", name: "zkProof", type: "bytes" },
      { internalType: "uint256[]", name: "publicSignals", type: "uint256[]" },
      { internalType: "string", name: "metadataURI", type: "string" },
    ],
    name: "mintPassport",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const mockVerifierAbi = [
  {
    inputs: [{ internalType: "bool", name: "_allow", type: "bool" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "allow",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "setAllow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "", type: "bytes" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
    ],
    name: "verifyProof",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];


