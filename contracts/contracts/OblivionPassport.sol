// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IZkVerifier {
    function verifyProof(bytes calldata proof, uint256[] calldata publicInputs) external view returns (bool);
}

/**
 * @title OblivionPassport
 * @notice Soulbound zkPassport storing boolean verification flags and an identity commitment hash.
 *         Minting is permissioned to MINTER_ROLE and requires a verifier attestation to succeed.
 */
contract OblivionPassport is ERC721URIStorage, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REVOKER_ROLE = keccak256("REVOKER_ROLE");

    struct Attributes {
        bool isVerified;
        bool isAdult;
        bool isHuman;
        bool isNotSanctioned;
        bool isUnique;
        bytes32 identityHash;
    }

    IZkVerifier public verifier;
    uint256 private _tokenIdTracker;
    mapping(address => bool) public hasMinted;
    mapping(uint256 => Attributes) private _attributes;
    mapping(uint256 => bool) public revoked;
    mapping(bytes32 => bool) public identityHashUsed;

    error Soulbound();
    error AlreadyMinted();
    error InvalidProof();
    error Revoked();

    event PassportMinted(address indexed to, uint256 indexed tokenId, Attributes attrs, string metadataURI);
    event PassportRevoked(address indexed by, uint256 indexed tokenId, string reason);
    event VerifierUpdated(address indexed by, address indexed newVerifier);

    constructor(address admin, address verifierAddress) ERC721("Oblivion zkPassport", "OBLIVION-SBT") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(REVOKER_ROLE, admin);
        verifier = IZkVerifier(verifierAddress);
    }

    function setVerifier(address verifierAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        verifier = IZkVerifier(verifierAddress);
        emit VerifierUpdated(msg.sender, verifierAddress);
    }

    function mintPassport(
        address to,
        Attributes calldata attrs,
        bytes calldata zkProof,
        uint256[] calldata publicSignals,
        string calldata metadataURI
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        if (hasMinted[to]) revert AlreadyMinted();
        if (identityHashUsed[attrs.identityHash]) revert AlreadyMinted();
        if (address(verifier) == address(0) || !verifier.verifyProof(zkProof, publicSignals)) revert InvalidProof();

        _tokenIdTracker += 1;
        uint256 tokenId = _tokenIdTracker;
        hasMinted[to] = true;
        identityHashUsed[attrs.identityHash] = true;
        _attributes[tokenId] = attrs;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit PassportMinted(to, tokenId, attrs, metadataURI);
        return tokenId;
    }

    function revoke(uint256 tokenId, string calldata reason) external onlyRole(REVOKER_ROLE) {
        if (_ownerOf(tokenId) == address(0)) revert InvalidProof();
        revoked[tokenId] = true;
        emit PassportRevoked(msg.sender, tokenId, reason);
    }

    function getAttributes(uint256 tokenId) external view returns (Attributes memory) {
        if (revoked[tokenId]) revert Revoked();
        return _attributes[tokenId];
    }

    function isRevoked(uint256 tokenId) external view returns (bool) {
        return revoked[tokenId];
    }

    /**
     * @notice Check if an address has already minted a passport
     */
    function hasAddressMinted(address user) external view returns (bool) {
        return hasMinted[user];
    }

    /**
     * @notice Get the total number of passports minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdTracker;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // --- Soulbound guards ---

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }

    function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
        revert Soulbound();
    }
}

