# FHEVault - Confidential Strategy Vault

A live decentralized application that demonstrates privacy-preserving trading strategy evaluation using Fully Homomorphic Encryption (FHE) on the Sepolia testnet. Submit encrypted strategies, compute performance scores on encrypted data, and decrypt results locally—all without revealing your private logic.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MetaMask browser extension
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fhevault.git
cd fhevault

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
# Edit .env and add your configuration

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`.

## 📝 Deploying to Sepolia Testnet

### Step 1: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_wallet_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org
VITE_CONTRACT_ADDRESS=will_be_set_after_deployment
```

**⚠️ Never commit your private key to version control!**

### Step 2: Deploy the Contract

```bash
npx hardhat run contracts/scripts/deploy-sepolia.ts --network sepolia
```

After deployment, you'll see output like:

```
FHEVault deployed to: 0x1234...5678
```

### Step 3: Update Configuration

Copy the deployed contract address and update your `.env` file:

```env
VITE_CONTRACT_ADDRESS=0x1234...5678
```

### Step 4: Restart the Application

Restart the development server to pick up the new contract address.

## 🔧 How It Works

### 1. Connect Your Wallet

- Click "Connect Wallet" in the header
- Approve the connection in MetaMask
- Switch to Sepolia testnet if prompted

### 2. Submit an Encrypted Strategy

- Enter your strategy parameters (Risk Level, Allocation, Timeframe)
- Click "Submit Strategy"
- Your data is encrypted locally using FHE
- The encrypted data is submitted to the smart contract on Sepolia

### 3. Compute on Encrypted Data

- The smart contract computes a performance score on your encrypted data
- This happens without ever decrypting your strategy parameters
- Results are returned in encrypted form

### 4. Decrypt Results Locally

- Click "Decrypt Score" to reveal your performance score
- Decryption happens locally using your private key
- View your score, percentile ranking, and recommendations

## 🏗️ Architecture

### Frontend

- **React 18** with TypeScript
- **Ethers.js v6** for blockchain interactions
- **TailwindCSS + shadcn/ui** for modern, accessible UI
- **TanStack Query** for data fetching and state management
- **Web3Context** for wallet connection management

### Smart Contract

- **Solidity 0.8.20** with FHEVault contract
- Deployed on **Sepolia testnet**
- Simulated FHE operations (production would use Zama's fhEVM)
- Events for strategy submission and computation

### Key Features

- ✅ Real MetaMask integration
- ✅ Sepolia testnet deployment
- ✅ Client-side encryption before submission
- ✅ On-chain encrypted data storage
- ✅ Simulated encrypted computation
- ✅ Local decryption of results
- ✅ Network detection and switching

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Smart Contracts
npx hardhat compile                                    # Compile contracts
npx hardhat test                                       # Run contract tests
npx hardhat run contracts/scripts/deploy-sepolia.ts --network sepolia  # Deploy to Sepolia

# Production Build
npm run build        # Build for production
npm run start        # Start production server
```

## 🔐 Security Notes

- **Private Keys**: Never commit private keys to version control
- **Test Networks Only**: This demo is designed for testnets (Sepolia)
- **Mock Encryption**: Current implementation uses simulated FHE for demonstration
- **Production**: For production use, integrate with Zama's fhEVM on supported networks

## 🌐 Network Configuration

### Sepolia Testnet

- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com/

## 📚 Learn More

- [Zama FHE](https://www.zama.ai) - Fully Homomorphic Encryption
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Sepolia Testnet](https://sepolia.dev/)

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

## 🎯 Roadmap

- [ ] Integrate with Zama's fhEVM for real FHE operations
- [ ] Add support for WalletConnect
- [ ] Implement strategy comparison features
- [ ] Add historical performance tracking
- [ ] Create advanced analytics dashboard
- [ ] Deploy to Zama testnet

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Built with ❤️ using Hardhat, React, Ethers.js, and FHE encryption**
