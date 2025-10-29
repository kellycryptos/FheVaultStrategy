# FHEVault - Confidential Strategy Vault

## Overview

FHEVault is a live decentralized application demonstrating privacy-preserving trading strategy evaluation using Fully Homomorphic Encryption (FHE). The application allows traders to prove their strategy performance without revealing their private logic by connecting to MetaMask, encrypting strategy parameters locally, submitting encrypted data to a smart contract on Sepolia testnet, computing performance scores on encrypted data, and decrypting results locally using their private keys.

## Recent Changes (October 29, 2025)

- **Web3 Integration**: Added real MetaMask wallet connection using Ethers.js v6
- **Sepolia Testnet**: Configured for deployment and interaction with Sepolia testnet
- **Contract Interactions**: Replaced mock API with real blockchain transactions
- **Network Detection**: Added UI for detecting and switching to Sepolia network
- **Deployment Scripts**: Created deployment script for Sepolia testnet

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing

**UI Design System:**
- shadcn/ui component library built on Radix UI primitives
- TailwindCSS for utility-first styling with custom theme configuration
- Design philosophy based on Carbon Design System principles adapted for technical dashboards
- Custom color system supporting light/dark modes with CSS variables
- Typography: Inter for UI elements, JetBrains Mono for technical data (addresses, hashes, encrypted values)

**State Management:**
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Hook Form with Zod validation for form state and input validation
- Local React state for workflow progression and encryption status
- Web3Context for wallet connection state (provider, signer, account, network)

**Component Architecture:**
- Modular components organized by feature (StrategyForm, EncryptionStatus, ResultsDisplay, etc.)
- UI components follow atomic design principles with shared primitives in `/components/ui/`
- Custom hooks for mobile detection and toast notifications

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for type-safe API development
- Custom middleware for request logging and JSON parsing with raw body capture
- Vite integration for development with HMR (Hot Module Reload)

**API Design:**
- RESTful API endpoints under `/api` namespace
- Strategy submission endpoint: `POST /api/strategies/submit`
- Simulated smart contract computation layer (placeholder for production FHE integration)

**Data Storage:**
- In-memory storage implementation (MemStorage class) for development
- Storage interface (IStorage) designed for future database integration
- Drizzle ORM configured for PostgreSQL with schema definitions for production

**Smart Contract Simulation:**
- Mock FHE computation functions that simulate encrypted data processing
- Placeholder for actual Zama fhEVM SDK integration
- Returns encrypted scores that match client-side decryption expectations

### External Dependencies

**Blockchain Integration:**
- Hardhat development environment for Ethereum smart contract development
- Configured for Sepolia testnet (chainId: 11155111) and local development
- Solidity 0.8.20 with optimizer enabled
- Ethers.js v6 for Web3 wallet connections and contract interactions
- TypeChain for type-safe contract interactions
- MetaMask integration via Web3Context and custom hooks
- Deployment scripts for Sepolia testnet

**Cryptography (FHE):**
- Mock FHE utilities currently implemented for demonstration
- Designed for integration with Zama's fhEVM SDK for production
- Client-side key generation, encryption, and decryption functions
- Base64 encoding for encrypted data transmission

**Database (Production Ready):**
- Drizzle ORM with PostgreSQL dialect
- Neon serverless PostgreSQL adapter (`@neondatabase/serverless`)
- Schema defined in `/shared/schema.ts` with strategies table
- Migration system configured in `drizzle.config.ts`

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components (accordion, dialog, dropdown, etc.)
- Lucide React for consistent iconography
- class-variance-authority (CVA) for component variant management
- tailwind-merge and clsx for conditional className handling

**Development Tools:**
- TypeScript for type safety across frontend and backend
- ESBuild for backend bundling in production
- Replit-specific plugins for development environment integration
- PostCSS with Autoprefixer for CSS processing

**Validation & Forms:**
- Zod for runtime type validation and schema definition
- React Hook Form for performant form state management
- drizzle-zod for automatic schema generation from database models

### Data Flow

1. **Wallet Connection:** User connects MetaMask wallet → Web3Provider manages connection state → Network detection ensures Sepolia testnet
2. **Client-side Encryption:** User inputs strategy parameters → FHE key pair generated → Data encrypted with public key → Encrypted payload created
3. **Blockchain Submission:** Encrypted data + hash sent directly to FHEVault smart contract on Sepolia → Transaction signed with MetaMask → Strategy ID returned
4. **Computation:** User triggers computation on smart contract → Simulated FHE computation on encrypted data → Encrypted score generated and stored on-chain
5. **Decryption:** Client retrieves encrypted score from contract → Decrypts locally with private key → Displays results with recommendations

### Configuration Management

- Environment variables:
  - `DATABASE_URL` for production database (optional)
  - `PRIVATE_KEY` for contract deployment (required for deployment)
  - `SEPOLIA_RPC_URL` for Sepolia testnet RPC (optional, defaults to public RPC)
  - `VITE_CONTRACT_ADDRESS` for deployed contract address (required for frontend)
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)
- Separate build configurations for client (Vite) and server (ESBuild)
- TypeScript strict mode enabled with ESNext module resolution

### Contract Deployment

To deploy FHEVault to Sepolia testnet:

1. Set up environment variables in `.env`
2. Run: `npx hardhat run contracts/scripts/deploy-sepolia.ts --network sepolia`
3. Copy deployed contract address to `VITE_CONTRACT_ADDRESS` in `.env`
4. Restart the application

The deployed contract address will be used by the frontend to interact with the blockchain.