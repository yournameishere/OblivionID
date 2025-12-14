# 🛡️ OblivionID — Private KYC + Zero-Knowledge Identity Passport

<div align="center">
  <img src="web/public/bannerimage.png" alt="OblivionID Banner" width="100%"/>
</div>

<br/>

![OblivionID](https://img.shields.io/badge/OblivionID-zkPassport-6ee7ff?style=for-the-badge)
![Polygon](https://img.shields.io/badge/Polygon-Amoy-8247E5?style=for-the-badge&logo=polygon)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)

**OblivionID** is a privacy-preserving identity verification system that allows users to prove compliance (verified, adult, human, non-sanctioned, unique) **without revealing any personal information**. Built on Polygon Amoy testnet with zero-knowledge proofs, AI-powered verification, and soulbound NFTs.

demo video - https://youtu.be/VsNA4scZrKY
live url - https://oblivion-id.vercel.app/

## ✨ What It Does

OblivionID enables users to:
- ✅ **Prove identity attributes** without revealing personal data
- ✅ **Complete KYC verification** using AI (Gemini) for document validation
- ✅ **Mint a soulbound zkPassport NFT** that stores only verification flags
- ✅ **Maintain complete privacy** while proving compliance to dApps
- ✅ **Use stealth addresses** for unlinkable identity

### Key Features

- 🔐 **Zero-Knowledge Proofs**: Prove attributes without revealing data
- 🤖 **AI-Powered Verification**: Gemini AI for face matching, deepfake detection, and document validation
- 🎫 **Soulbound NFTs**: Non-transferable passports tied to wallet addresses
- 📦 **IPFS Storage**: Documents stored temporarily on Pinata IPFS
- 🔒 **Privacy-First**: All personal data deleted after verification
- 🌐 **Polygon Integration**: Fast and low-cost transactions on Polygon Amoy

## 🏗️ Architecture

### Three-Layer System

1. **Off-Chain KYC Layer**
   - Document upload (ID, selfie, liveness video)
   - AI verification using Gemini
   - Temporary encrypted storage in MongoDB
   - IPFS storage via Pinata

2. **Zero-Knowledge Proof Layer**
   - Generates ZK proof from verification results
   - Only flags and commitments go on-chain
   - No personal information exposed

3. **On-Chain Passport Layer**
   - Soulbound NFT on Polygon Amoy
   - Stores boolean flags (isVerified, isAdult, isHuman, etc.)
   - Identity hash commitment
   - Revocable by admin

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Polygon Amoy testnet MATIC
- Gemini API key
- Pinata account (for IPFS)
- WalletConnect Project ID

### 1. Clone and Install

```bash
git clone <repository-url>
cd civiloin

# Install frontend dependencies
cd web
npm install

# Install contract dependencies
cd ../contracts
npm install
```

### 2. Environment Setup

Create `web/.env.local`:

```env
# Wallet Configuration
PRIVATE_KEY=0x3f8061a5857a392ac24993936b0109b0c2b1952ed1428d50aa0e9a23a167959e
NEXT_PUBLIC_WC_PROJECT_ID=e51345186e30467e1a8774ac90ecbcd0

# Blockchain Configuration
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/Db6C4RgfEaaDVcHvPllsg
NEXT_PUBLIC_PASSPORT_ADDRESS=0x3780f8b9f618e8e7fd0be2e209617e583f0e325c
NEXT_PUBLIC_VERIFIER_ADDRESS=0xd749736bb339b44639bcaef09ac2248dee0b7a39

# Database
MONGODB_URI=mongodb://localhost:27017/oblivion
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/oblivion

# AI Services
GEMINI_API_KEY=AIzaSyA3WErm2S4GmIfH0242diwEYwY7fDJGAuk

# IPFS / Pinata
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
# OR use JWT token:
PINATA_JWT=your_pinata_jwt_token
```

Create `contracts/.env`:

```env
PRIVATE_KEY=0x3f8061a5857a392ac24993936b0109b0c2b1952ed1428d50aa0e9a23a167959e
POLYGON_AMOY_RPC=https://polygon-amoy.g.alchemy.com/v2/Db6C4RgfEaaDVcHvPllsg
```

### 3. Smart Contracts (Already Deployed ✅)

**Contracts are already deployed to Polygon Amoy!** No need to redeploy unless you want to deploy to a different network.

If you need to deploy to a new network:

```bash
cd contracts

# Install dependencies
npm install --legacy-peer-deps

# Compile contracts
npx hardhat compile

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.ts --network polygonAmoy
```

**Current Deployment:**
- Passport: `0x3780f8b9f618e8e7fd0be2e209617e583f0e325c`
- Verifier: `0xd749736bb339b44639bcaef09ac2248dee0b7a39`

The frontend is already configured with these addresses in `web/src/lib/contract.ts`.

### 4. MINTER_ROLE Status ✅

**MINTER_ROLE is already configured!** The deployer address (`0x10ac9924a78051BdD770978740C5084205cdB628`) has MINTER_ROLE, which is the same as your backend service address. No additional role granting is needed.

If you need to grant MINTER_ROLE to a different address in the future:

```bash
cd contracts

# Set the address that should receive MINTER_ROLE
export MINTER_ADDRESS=0xYourBackendAddress

# Grant the role
npx hardhat run scripts/grant-minter-role.ts --network polygonAmoy
```

**Note**: The backend address is derived from `PRIVATE_KEY` in your `web/.env.local`.

### 5. Run Frontend

```bash
cd web

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` to see the application.

## 📱 Application Pages

- **`/`** - Landing page with features and quick actions
- **`/start`** - Onboarding: Create profile and get started
- **`/kyc`** - KYC verification: Upload ID, selfie, and liveness video
- **`/mint`** - Mint zkPassport: Convert verified session to on-chain passport
- **`/dashboard`** - View profile and passport status
- **`/my/profile`** - Manage your profile information
- **`/admin`** - Admin panel: Revoke passports, update verifier (role-gated)
- **`/stealth`** - Generate stealth addresses (ERC-5564)
- **`/docs`** - Documentation
- **`/faq`** - Frequently asked questions

## 🔄 User Flow

1. **Connect Wallet** → User connects their wallet via RainbowKit
2. **Create Profile** → User fills in basic information (stored off-chain)
3. **Complete KYC** → Upload ID, selfie, and liveness video
   - Files uploaded to Pinata IPFS
   - Gemini AI verifies documents
   - Verification results stored in MongoDB
4. **Get Session ID** → Receive proof handle after successful verification
5. **Mint Passport** → Backend service mints soulbound NFT on-chain
6. **View Dashboard** → Check passport status and attributes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Styling
- **wagmi + viem** - Ethereum interaction
- **RainbowKit** - Wallet connection UI
- **TypeScript** - Type safety

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB** - Temporary session storage
- **Gemini AI** - Document verification
- **Pinata** - IPFS storage

### Smart Contracts
- **Solidity 0.8.24** - Contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Security libraries
- **Polygon Amoy** - Testnet deployment

## 📋 Smart Contract Details

### OblivionPassport.sol

**Contract Address**: `0x3780f8b9f618e8e7fd0be2e209617e583f0e325c`  
**View on**: [PolygonScan Amoy](https://amoy.polygonscan.com/address/0x3780f8b9f618e8e7fd0be2e209617e583f0e325c)

**Features:**
- ✅ Soulbound NFT (non-transferable)
- ✅ Stores verification flags as attributes
- ✅ Identity hash commitment
- ✅ Revocable by admin
- ✅ Role-based access control (MINTER_ROLE, REVOKER_ROLE)
- ✅ Duplicate prevention (one passport per address and identity hash)
- ✅ Helper functions: `hasAddressMinted()`, `totalSupply()`

**Key Functions:**
- `mintPassport()` - Mint new passport (requires MINTER_ROLE)
- `getAttributes()` - Read passport attributes
- `revoke()` - Revoke passport (requires REVOKER_ROLE)
- `isRevoked()` - Check revocation status
- `hasAddressMinted(address)` - Check if address has minted
- `totalSupply()` - Get total passports minted

### MockVerifier.sol

**Contract Address**: `0xd749736bb339b44639bcaef09ac2248dee0b7a39`  
**View on**: [PolygonScan Amoy](https://amoy.polygonscan.com/address/0xd749736bb339b44639bcaef09ac2248dee0b7a39)

Simple mock verifier for testing. Returns `true` when `allow=true`. In production, replace with real ZK verifier.

## 🔐 Security Considerations

- ✅ **Private keys** stored in environment variables (never commit)
- ✅ **Documents** stored temporarily, deleted after verification
- ✅ **Soulbound NFTs** prevent transfer abuse
- ✅ **Role-based access** for minting and revocation
- ✅ **Identity hashes** prevent duplicate passports
- ⚠️ **Mock verifier** - Replace with real ZK circuit in production
- ⚠️ **Sanctions check** - Currently mocked, integrate real API

## 🧪 Testing

### Test KYC Flow

1. Go to `/start` and create a profile
2. Navigate to `/kyc` and upload:
   - ID document (image or PDF)
   - Selfie photo
   - Liveness video
3. Wait for AI verification
4. Copy the session ID
5. Go to `/mint` and mint your passport

### Verify On-Chain

1. Go to `/dashboard`
2. Enter your token ID
3. View passport attributes and status

## 📚 Documentation

- **Deployment Guide**: See `web/DEPLOYMENT.md`
- **Deployment Info**: See `DEPLOYMENT_INFO.md` (latest deployment details)
- **Final Checklist**: See `web/FINAL_CHECKLIST.md`
- **Deployment Verification**: See `DEPLOYMENT_VERIFICATION.md`
- **Contract Code**: `contracts/contracts/`
- **API Routes**: `web/src/app/api/`

## 🔗 Quick Links

- **PolygonScan Amoy Explorer**: [explorer.amoy.network](https://explorer.amoy.network)
- **Passport Contract**: [View on PolygonScan](https://amoy.polygonscan.com/address/0x3780f8b9f618e8e7fd0be2e209617e583f0e325c)
- **Verifier Contract**: [View on PolygonScan](https://amoy.polygonscan.com/address/0xd749736bb339b44639bcaef09ac2248dee0b7a39)

## 📊 Deployment Information

### Contract Deployment Details

**Deployment Date**: December 12, 2025  
**Network**: Polygon Amoy Testnet  
**Chain ID**: 80002  
**RPC URL**: `https://polygon-amoy.g.alchemy.com/v2/Db6C4RgfEaaDVcHvPllsg`

**Deployed Contracts:**
- **OblivionPassport**: `0x3780f8b9f618e8e7fd0be2e209617e583f0e325c`
  - Transaction: `0x79046d9c6348c42d6dde3a77376695dd09b24dac48ab3c4bed2d3ae8fd44b923`
- **MockVerifier**: `0xd749736bb339b44639bcaef09ac2248dee0b7a39`
  - Transaction: `0x97788311e66da0e1b70fde2c87015fdec9ee517afc5ccec2086125e7c3f432ae`

**Deployer**: `0x10ac9924a78051BdD770978740C5084205cdB628`  
**Roles**: DEFAULT_ADMIN_ROLE, MINTER_ROLE, REVOKER_ROLE

For detailed deployment information, see `DEPLOYMENT_INFO.md`.

## 🚧 Production TODOs

- [ ] Replace MockVerifier with real ZK circuit (Circom/SnarkJS)
- [ ] Integrate real sanctions API
- [ ] Implement proper signature verification for auth
- [ ] Add rate limiting to API routes
- [ ] Set up monitoring and logging
- [ ] Implement document deletion after verification
- [ ] Add audit logging
- [ ] Performance optimization
- [ ] Full ERC-5564 stealth address implementation
- [ ] Contract verification on PolygonScan

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues or questions:
- Check `web/DEPLOYMENT.md` for deployment help
- Review `web/FINAL_CHECKLIST.md` for setup verification
- Open an issue on GitHub

---

**Built with ❤️ for privacy-preserving identity verification**
