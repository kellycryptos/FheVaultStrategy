import { JsonRpcProvider, Wallet, ContractFactory } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("Deploying FHEVault to Sepolia testnet...");

  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is required");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  
  console.log("Deploying with account:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Account balance:", (Number(balance) / 1e18).toFixed(4), "ETH");

  if (balance === 0n) {
    throw new Error("Account has no ETH. Please fund it with Sepolia ETH from a faucet.");
  }

  const artifactPath = path.join(process.cwd(), 'contracts/artifacts/contracts/FHEVault.sol/FHEVault.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  
  console.log("Deploying contract...");
  const contract = await factory.deploy();
  
  console.log("Waiting for deployment confirmation...");
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("FHEVault deployed to:", contractAddress);

  console.log("\nDeployment Summary:");
  console.log("=".repeat(50));
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", wallet.address);
  console.log("Network: Sepolia Testnet (Chain ID: 11155111)");
  console.log("=".repeat(50));

  console.log("\nVerification Command:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);

  console.log("\nAdd this to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
