import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, JsonRpcSigner, Network } from 'ethers';

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  account: string | null;
  network: Network | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToSepolia: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!account && !!provider;

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this app.');
      }

      const ethProvider = new BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.');
      }

      const ethSigner = await ethProvider.getSigner();
      const ethNetwork = await ethProvider.getNetwork();
      
      setProvider(ethProvider);
      setSigner(ethSigner);
      setAccount(accounts[0]);
      setNetwork(ethNetwork);
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setNetwork(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setNetwork(null);
    setError(null);
  };

  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setError(null);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CONFIG],
          });
          setError(null);
        } catch (addError: any) {
          console.error('Failed to add Sepolia network:', addError);
          setError('Failed to add Sepolia network. Please add it manually in MetaMask.');
        }
      } else if (switchError.code === 4001) {
        console.log('User rejected network switch');
        setError(null);
      } else {
        console.error('Failed to switch to Sepolia network:', switchError);
        setError('Failed to switch to Sepolia network. Please switch manually in MetaMask.');
      }
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        if (provider) {
          provider.getSigner().then(setSigner);
        }
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [account, provider]);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const ethProvider = new BrowserProvider(window.ethereum);
          const accounts = await ethProvider.send('eth_accounts', []);
          
          if (accounts.length > 0) {
            const ethSigner = await ethProvider.getSigner();
            const ethNetwork = await ethProvider.getNetwork();
            
            setProvider(ethProvider);
            setSigner(ethSigner);
            setAccount(accounts[0]);
            setNetwork(ethNetwork);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    network,
    isConnecting,
    isConnected,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWallet() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWallet must be used within a Web3Provider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
