import { expect } from "chai";
import { ethers } from "hardhat";
import { FHEVault } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("FHEVault", function () {
  let fheVault: FHEVault;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const FHEVaultFactory = await ethers.getContractFactory("FHEVault");
    fheVault = await FHEVaultFactory.deploy();
    await fheVault.waitForDeployment();
  });

  describe("Strategy Submission", function () {
    it("Should submit encrypted strategy successfully", async function () {
      const encryptedData = ethers.toUtf8Bytes("encrypted_strategy_data_sample");
      const dataHash = ethers.keccak256(encryptedData);

      const tx = await fheVault.connect(user1).submitStrategy(encryptedData, dataHash);
      const receipt = await tx.wait();

      // Check event emission
      expect(receipt?.logs.length).to.be.greaterThan(0);

      // Verify total strategies increased
      const [totalStrategies] = await fheVault.getStats();
      expect(totalStrategies).to.equal(1);
    });

    it("Should reject empty encrypted data", async function () {
      const emptyData = ethers.toUtf8Bytes("");
      const dataHash = ethers.keccak256(emptyData);

      await expect(
        fheVault.connect(user1).submitStrategy(emptyData, dataHash)
      ).to.be.revertedWith("Empty encrypted data");
    });

    it("Should track user strategies", async function () {
      const encryptedData = ethers.toUtf8Bytes("encrypted_strategy_data");
      const dataHash = ethers.keccak256(encryptedData);

      await fheVault.connect(user1).submitStrategy(encryptedData, dataHash);

      const userStrategies = await fheVault.getUserStrategies(user1.address);
      expect(userStrategies.length).to.equal(1);
    });
  });

  describe("Strategy Computation", function () {
    let strategyId: string;

    beforeEach(async function () {
      const encryptedData = ethers.toUtf8Bytes("encrypted_strategy_data");
      const dataHash = ethers.keccak256(encryptedData);

      const tx = await fheVault.connect(user1).submitStrategy(encryptedData, dataHash);
      const receipt = await tx.wait();

      // Extract strategyId from event
      const event = receipt?.logs[0];
      if (event && 'args' in event) {
        strategyId = event.args[0];
      }
    });

    it("Should compute strategy successfully", async function () {
      await fheVault.connect(user1).computeStrategy(strategyId);

      const strategy = await fheVault.getStrategy(strategyId);
      expect(strategy.status).to.equal(2); // Completed status
      expect(strategy.encryptedScore).to.not.equal("0x");
    });

    it("Should only allow owner to compute", async function () {
      await expect(
        fheVault.connect(user2).computeStrategy(strategyId)
      ).to.be.revertedWith("Not strategy owner");
    });

    it("Should increment computation count", async function () {
      await fheVault.connect(user1).computeStrategy(strategyId);

      const [, totalComputations] = await fheVault.getStats();
      expect(totalComputations).to.equal(1);
    });

    it("Should not allow double computation", async function () {
      await fheVault.connect(user1).computeStrategy(strategyId);

      await expect(
        fheVault.connect(user1).computeStrategy(strategyId)
      ).to.be.revertedWith("Already computed or in progress");
    });
  });

  describe("Strategy Retrieval", function () {
    it("Should retrieve encrypted score after computation", async function () {
      const encryptedData = ethers.toUtf8Bytes("encrypted_strategy_data");
      const dataHash = ethers.keccak256(encryptedData);

      const submitTx = await fheVault.connect(user1).submitStrategy(encryptedData, dataHash);
      const submitReceipt = await submitTx.wait();

      const event = submitReceipt?.logs[0];
      let strategyId: string = "";
      if (event && 'args' in event) {
        strategyId = event.args[0];
      }

      await fheVault.connect(user1).computeStrategy(strategyId);

      const encryptedScore = await fheVault.getEncryptedScore(strategyId);
      expect(encryptedScore).to.not.equal("0x");
    });

    it("Should revert when getting score for non-computed strategy", async function () {
      const encryptedData = ethers.toUtf8Bytes("encrypted_strategy_data");
      const dataHash = ethers.keccak256(encryptedData);

      const submitTx = await fheVault.connect(user1).submitStrategy(encryptedData, dataHash);
      const submitReceipt = await submitTx.wait();

      const event = submitReceipt?.logs[0];
      let strategyId: string = "";
      if (event && 'args' in event) {
        strategyId = event.args[0];
      }

      await expect(
        fheVault.getEncryptedScore(strategyId)
      ).to.be.revertedWith("Computation not complete");
    });
  });

  describe("Statistics", function () {
    it("Should track multiple strategies and computations", async function () {
      // Submit three strategies
      for (let i = 0; i < 3; i++) {
        const encryptedData = ethers.toUtf8Bytes(`strategy_${i}`);
        const dataHash = ethers.keccak256(encryptedData);
        await fheVault.connect(user1).submitStrategy(encryptedData, dataHash);
      }

      const [totalStrategies, totalComputations] = await fheVault.getStats();
      expect(totalStrategies).to.equal(3);
      expect(totalComputations).to.equal(0);
    });
  });
});
