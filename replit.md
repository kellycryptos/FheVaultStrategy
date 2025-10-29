# FHEVault - Confidential Strategy Vault

## Overview

FHEVault is a full-stack decentralized application demonstrating privacy-preserving trading strategy evaluation using Fully Homomorphic Encryption (FHE) with the Zama protocol. The application allows traders to prove their strategy performance without revealing their private logic by encrypting strategy parameters locally, submitting encrypted data to a smart contract, computing performance scores on encrypted data, and decrypting results locally using their private keys.

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
- Configured for local Hardhat network (chainId: 1337)
- Solidity 0.8.20 with optimizer enabled
- TypeChain for type-safe contract interactions
- Prepared for Zama testnet deployment (configuration commented out)

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

1. **Client-side Encryption:** User inputs strategy parameters → FHE key pair generated → Data encrypted with public key → Encrypted payload created
2. **Submission:** Encrypted data + hash sent to `/api/strategies/submit` → Server validates and stores → Smart contract computation initiated
3. **Computation:** Simulated FHE computation on encrypted data → Encrypted score generated → Results stored with strategy
4. **Decryption:** Client retrieves encrypted score → Decrypts locally with private key → Displays results with recommendations

### Configuration Management

- Environment variables expected: `DATABASE_URL` for production database
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)
- Separate build configurations for client (Vite) and server (ESBuild)
- TypeScript strict mode enabled with ESNext module resolution