import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FHEVault to Sepolia testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const FHEVault = await ethers.getContractFactory("FHEVault");
  const fheVault = await FHEVault.deploy();

  await fheVault.waitForDeployment();

  const contractAddress = await fheVault.getAddress();
  console.log("FHEVault deployed to:", contractAddress);

  console.log("\nDeployment Summary:");
  console.log("=".repeat(50));
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
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
