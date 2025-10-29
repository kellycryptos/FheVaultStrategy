# FHEVault - Confidential Strategy Vault

A full-stack decentralized application demonstrating privacy-preserving trading strategy evaluation using Fully Homomorphic Encryption (FHE) with the Zama protocol.

## 🔐 Overview

FHEVault allows traders to prove their strategy performance **without revealing their private logic**. Using Fully Homomorphic Encryption, users can:

1. **Encrypt** their strategy parameters locally (client-side)
2. **Submit** encrypted data to a smart contract
3. **Compute** performance scores on encrypted data (on-chain)
4. **Decrypt** results locally - only they can see the actual score

This demonstrates end-to-end confidential computation on blockchain data.

---

## 🧠 What is Fully Homomorphic Encryption (FHE)?

**Fully Homomorphic Encryption** is a revolutionary cryptographic technique that enables computations to be performed directly on encrypted data without ever decrypting it.

### Key Benefits for FHEVault:

- **Privacy**: Strategy parameters remain encrypted at all times
- **Confidentiality**: Smart contract computes on encrypted data and returns encrypted results
- **Security**: Only the user can decrypt the final score using their private key
- **Transparency**: No one (including blockchain validators) can see strategy details

### FHE in Trading Strategies:

Traditional approach:
```
Strategy → Public Analysis → Everyone sees your edge ❌
```

FHE approach:
```
Strategy → Encrypted → On-chain Computation → Encrypted Score → Private Decrypt ✅
```

---

## 🏗️ System Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite (fast development)
- TailwindCSS + shadcn/ui (modern, accessible UI)
- TanStack Query (data fetching & caching)
- TypeScript (type safety)

**Backend:**
- Express.js (API server)
- In-memory storage (MemStorage for demo)
- TypeScript

**Smart Contracts:**
- Solidity (contract language)
- Hardhat (development environment)
- Mock FHE SDK (simulated encryption for local testing)

**Blockchain:**
- Local Hardhat Node (for testing)
- Ethers.js (Web3 interaction)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                                                           │
│  ┌──────────────┐         ┌─────────────────────────┐   │
│  │ FHE Key Pair │         │   Strategy Input Form   │   │
│  │ Generation   │         │  (Risk, Alloc, Time)   │   │
│  └──────┬───────┘         └──────────┬──────────────┘   │
│         │                            │                   │
│         │                            ▼                   │
│         │                  ┌─────────────────┐          │
│         └─────────────────▶│ Local Encryption│          │
│                            │   (FHE Public)   │          │
│                            └────────┬─────────┘          │
└─────────────────────────────────────┼────────────────────┘
                                      │ Encrypted Data
                                      ▼
                    ┌─────────────────────────────────┐
                    │      Express.js Backend         │
                    │  /api/strategies/submit         │
                    │  /api/strategies/:id/compute    │
                    │  /api/strategies/:id/result     │
                    └─────────────┬───────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────────┐
                    │     Smart Contract (Solidity)   │
                    │                                 │
                    │  • Receive encrypted data       │
                    │  • Compute on encrypted data    │
                    │  • Return encrypted score       │
                    └─────────────┬───────────────────┘
                                  │ Encrypted Score
                                  ▼
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                                                           │
│         ┌─────────────────────┐                          │
│         │  Local Decryption   │◀─── FHE Private Key      │
│         │ (FHE Private Key)   │                          │
│         └──────────┬──────────┘                          │
│                    │                                      │
│                    ▼                                      │
│         ┌─────────────────────┐                          │
│         │  Decrypted Score    │                          │
│         │  (Only user sees)   │                          │
│         └─────────────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Key Generation**: Client generates FHE public/private key pair locally
2. **Encryption**: Strategy parameters encrypted with public key (client-side)
3. **Submission**: Encrypted data sent to backend API
4. **Storage**: Backend stores encrypted data and forwards to smart contract
5. **Computation**: Smart contract evaluates performance on encrypted data
6. **Result**: Encrypted score returned to backend and stored
7. **Decryption**: Client retrieves encrypted score and decrypts with private key

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository** (if not already in Replit):
```bash
git clone <repository-url>
cd fhevault
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

This starts:
- **Frontend**: Vite dev server with React app
- **Backend**: Express.js API server
- **Hardhat Node**: Local blockchain (auto-started)

4. **Open your browser**:
```
http://localhost:5000
```

---

## 📖 Usage Guide

### Running the Demo

The easiest way to see FHEVault in action:

1. Click the **"Run Demo Transaction"** button
2. Watch the automated workflow:
   - ✅ Local encryption of sample strategy
   - ✅ Submission to smart contract
   - ✅ Encrypted computation
   - ✅ Local decryption of results

### Manual Strategy Submission

1. **Adjust Strategy Parameters**:
   - **Risk Level** (1-10): Conservative to aggressive
   - **Allocation** (0-100%): Portfolio percentage
   - **Timeframe** (1-365 days): Investment horizon

2. **Click "Encrypt & Submit Strategy"**:
   - Data is encrypted locally with FHE
   - Encrypted data sent to smart contract
   - Computation performed on encrypted data

3. **View Encryption Status**:
   - Track the workflow progress
   - See encrypted data hash
   - Monitor computation status

4. **Decrypt Results**:
   - Click "Decrypt Score Locally"
   - View your performance score (0-100)
   - Read personalized recommendations

---

## 🧪 Testing

### Unit Tests

Run the backend tests:
```bash
npm test
```

### Smart Contract Tests

Test the Solidity contracts:
```bash
cd contracts
npx hardhat test
```

### E2E Testing

Test the complete workflow:
```bash
npm run test:e2e
```

---

## 🌐 Deployment

### Deploy to Testnet

Currently configured for local Hardhat network. To deploy to a testnet:

#### 1. Configure Network

Edit `hardhat.config.ts`:
```typescript
networks: {
  sepolia: {
    url: process.env.SEPOLIA_RPC_URL,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

#### 2. Set Environment Variables

Create `.env`:
```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=your_wallet_private_key
```

#### 3. Deploy Contracts

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

#### 4. Update Frontend

Update `client/src/config/contracts.ts` with deployed contract address.

### Production Deployment

For production with **real Zama FHE**:

1. **Replace Mock FHE**: 
   - Install Zama's fhEVM SDK
   - Update `client/src/lib/fhe-utils.ts`
   - Use real FHE encryption/decryption

2. **Deploy to Zama Network**:
   - Configure Zama testnet in Hardhat
   - Deploy contracts to fhEVM-compatible chain
   - Update frontend contract addresses

3. **Backend Deployment**:
   - Deploy Express.js to your hosting (Railway, Render, etc.)
   - Set environment variables
   - Configure CORS for production domain

---

## 🔧 Project Structure

```
fhevault/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.tsx           # App header with wallet connection
│   │   │   ├── StrategyForm.tsx     # Strategy input form
│   │   │   ├── EncryptionStatus.tsx # FHE workflow status tracker
│   │   │   ├── ResultsDisplay.tsx   # Encrypted/decrypted results
│   │   │   ├── DemoButton.tsx       # Demo mode trigger
│   │   │   ├── HowItWorks.tsx       # Educational accordion
│   │   │   ├── StatsCards.tsx       # Statistics display
│   │   │   └── ui/                  # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── fhe-utils.ts         # FHE encryption/decryption utilities
│   │   │   └── queryClient.ts       # TanStack Query config
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main application page
│   │   ├── App.tsx                  # Root component & routing
│   │   └── index.css                # Global styles & design tokens
│   └── index.html                   # HTML entry point
│
├── server/                    # Backend Express.js application
│   ├── routes.ts              # API route definitions
│   ├── storage.ts             # In-memory storage implementation
│   └── index.ts               # Server entry point
│
├── shared/                    # Shared TypeScript types
│   └── schema.ts              # Data models & Zod schemas
│
├── contracts/                 # Solidity smart contracts (to be added)
│   ├── FHEVault.sol          # Main vault contract
│   └── test/                  # Contract tests
│
├── hardhat.config.ts          # Hardhat configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── vite.config.ts             # Vite build configuration
└── package.json               # Dependencies & scripts
```

---

## 🔐 Security Considerations

### Current Implementation (Demo)

⚠️ **This is a demonstration using simulated FHE**:
- Mock encryption/decryption for local testing
- Real FHE operations require Zama's production SDK
- Do not use with real trading strategies or sensitive data

### Production Recommendations

For production deployment:

1. **Use Real FHE**:
   - Integrate Zama's fhEVM SDK
   - Deploy to FHE-enabled blockchain
   - Use TFHE-rs for cryptographic operations

2. **Key Management**:
   - Store private keys securely (hardware wallets)
   - Never expose private keys in client code
   - Implement proper key rotation

3. **Smart Contract Audits**:
   - Professional security audit before mainnet
   - Test extensively on testnet
   - Bug bounty program

4. **API Security**:
   - Rate limiting on endpoints
   - Input validation and sanitization
   - HTTPS only in production

---

## 🎯 Future Enhancements

### Phase 1 (Current): Local Demo
- ✅ Simulated FHE encryption/decryption
- ✅ Mock smart contract computation
- ✅ Complete UI/UX workflow
- ✅ Educational resources

### Phase 2: Zama Integration
- [ ] Real fhEVM SDK integration
- [ ] Deploy to Zama testnet
- [ ] Production-grade encryption
- [ ] Smart contract optimization

### Phase 3: Advanced Features
- [ ] Strategy comparison dashboard
- [ ] Historical performance tracking
- [ ] Multi-strategy portfolio analysis
- [ ] Strategy sharing & verification
- [ ] Encrypted benchmarking against market

### Phase 4: Production
- [ ] Mainnet deployment
- [ ] Institutional-grade security
- [ ] API for programmatic access
- [ ] Mobile application

---

## 📚 Learn More

### FHE Resources
- [Zama Official Website](https://www.zama.ai)
- [fhEVM Documentation](https://docs.zama.ai/fhevm)
- [TFHE-rs Library](https://github.com/zama-ai/tfhe-rs)

### Technical Deep Dives
- [What is Fully Homomorphic Encryption?](https://en.wikipedia.org/wiki/Homomorphic_encryption)
- [FHE Use Cases in DeFi](https://www.zama.ai/post/confidential-defi-with-fhevm)
- [Building with fhEVM](https://docs.zama.ai/fhevm/getting-started)

### Development Tools
- [Hardhat Documentation](https://hardhat.org/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- **Zama** for pioneering FHE technology
- **Hardhat** for excellent Ethereum development tools
- **shadcn/ui** for beautiful, accessible components
- The FHE research community for advancing privacy-preserving computation

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review Zama's official resources

---

**Built with ❤️ for privacy-preserving DeFi**
