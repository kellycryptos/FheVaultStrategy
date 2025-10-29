import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FHEVault contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy FHEVault
  const FHEVault = await ethers.getContractFactory("FHEVault");
  const fheVault = await FHEVault.deploy();

  await fheVault.waitForDeployment();
  const address = await fheVault.getAddress();

  console.log("FHEVault deployed to:", address);
  console.log("\nContract deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Update frontend with contract address");
  console.log("2. Verify contract on block explorer (if deploying to testnet)");
  console.log("3. Test contract interactions");

  // Get initial stats
  const [totalStrategies, totalComputations] = await fheVault.getStats();
  console.log("\nInitial contract stats:");
  console.log("- Total strategies:", totalStrategies.toString());
  console.log("- Total computations:", totalComputations.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
