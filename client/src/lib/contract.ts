import { Contract, BrowserProvider, JsonRpcSigner } from 'ethers';

const CONTRACT_ABI = [
  "function submitStrategy(bytes calldata encryptedData, bytes32 dataHash) external returns (bytes32 strategyId)",
  "function computeStrategy(bytes32 strategyId) external",
  "function getStrategy(bytes32 strategyId) external view returns (tuple(address owner, bytes encryptedData, bytes32 dataHash, bytes encryptedScore, uint256 submittedAt, uint256 computedAt, uint8 status))",
  "function getEncryptedScore(bytes32 strategyId) external view returns (bytes memory)",
  "function getUserStrategies(address user) external view returns (bytes32[] memory)",
  "function getStats() external view returns (uint256 _totalStrategies, uint256 _totalComputations)",
  "event StrategySubmitted(bytes32 indexed strategyId, address indexed owner, bytes32 dataHash, uint256 timestamp)",
  "event StrategyComputed(bytes32 indexed strategyId, bytes encryptedScore, uint256 timestamp)",
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export function getContract(
  signerOrProvider: JsonRpcSigner | BrowserProvider
): Contract {
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export interface StrategyData {
  owner: string;
  encryptedData: string;
  dataHash: string;
  encryptedScore: string;
  submittedAt: bigint;
  computedAt: bigint;
  status: number;
}

export enum StrategyStatus {
  Pending = 0,
  Computing = 1,
  Completed = 2,
  Failed = 3,
}

export async function submitStrategyToContract(
  signer: JsonRpcSigner,
  encryptedData: string,
  dataHash: string
): Promise<string> {
  const contract = getContract(signer);
  
  const encryptedDataBytes = new TextEncoder().encode(encryptedData);
  const dataHashBytes = dataHash.startsWith('0x') ? dataHash : `0x${dataHash}`;
  
  const tx = await contract.submitStrategy(encryptedDataBytes, dataHashBytes);
  const receipt = await tx.wait();
  
  const event = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((event: any) => event?.name === 'StrategySubmitted');
  
  if (!event) {
    throw new Error('StrategySubmitted event not found');
  }
  
  return event.args.strategyId;
}

export async function computeStrategyOnContract(
  signer: JsonRpcSigner,
  strategyId: string
): Promise<void> {
  const contract = getContract(signer);
  const tx = await contract.computeStrategy(strategyId);
  await tx.wait();
}

export async function getStrategyFromContract(
  provider: BrowserProvider | JsonRpcSigner,
  strategyId: string
): Promise<StrategyData> {
  const contract = getContract(provider);
  const strategy = await contract.getStrategy(strategyId);
  
  return {
    owner: strategy.owner,
    encryptedData: new TextDecoder().decode(
      new Uint8Array(strategy.encryptedData.slice(2).match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))
    ),
    dataHash: strategy.dataHash,
    encryptedScore: strategy.encryptedScore,
    submittedAt: strategy.submittedAt,
    computedAt: strategy.computedAt,
    status: strategy.status,
  };
}

export async function getEncryptedScoreFromContract(
  provider: BrowserProvider | JsonRpcSigner,
  strategyId: string
): Promise<string> {
  const contract = getContract(provider);
  const encryptedScore = await contract.getEncryptedScore(strategyId);
  
  return new TextDecoder().decode(
    new Uint8Array(encryptedScore.slice(2).match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))
  );
}

export async function getContractStats(
  provider: BrowserProvider
): Promise<{ totalStrategies: bigint; totalComputations: bigint }> {
  const contract = getContract(provider);
  const [totalStrategies, totalComputations] = await contract.getStats();
  
  return { totalStrategies, totalComputations };
}
