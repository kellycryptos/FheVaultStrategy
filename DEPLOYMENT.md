# Deployment Guide

## Push to GitHub

### 1. Initialize Git Repository (if not already done)

```bash
git init
```

### 2. Add Remote Repository

Replace `yourusername/yourrepo` with your actual GitHub repository:

```bash
git remote add origin https://github.com/yourusername/yourrepo.git
```

### 3. Stage All Files

The .gitignore file will automatically exclude sensitive and platform-specific files:

```bash
git add .
```

### 4. Commit Changes

```bash
git commit -m "Initial commit: FHEVault - Confidential Strategy Vault Dapp"
```

### 5. Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Deploy Anywhere

### Using Vercel

1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variable: `VITE_CONTRACT_ADDRESS`
4. Deploy

### Using Netlify

1. Visit [netlify.com](https://netlify.com)
2. Import your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_CONTRACT_ADDRESS`

### Using Traditional Hosting

```bash
# Build the application
npm run build

# Deploy the dist/ folder to your hosting provider
```

## Environment Variables for Production

When deploying to production, set these environment variables:

- `VITE_CONTRACT_ADDRESS`: Your deployed contract address on Sepolia
- `NODE_ENV`: Set to `production`

## Smart Contract Deployment

If you need to deploy your own contract:

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run contracts/scripts/deploy-sepolia.ts --network sepolia
```

After deployment, update your `.env` file with the new contract address.

## Testing Locally After Clone

```bash
# Clone the repository
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at http://localhost:5000

## Requirements

- Node.js 18+
- MetaMask browser extension
- Sepolia testnet ETH (for transactions)

## Current Deployed Contract

The application is currently configured to use:
- Contract Address: `0x9cD17DAD80CE2fE9b1d3804cf53e66f8930040F5`
- Network: Sepolia Testnet
- Chain ID: 11155111

You can use this existing contract or deploy your own.
