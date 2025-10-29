import { useState } from "react";
import { Header } from "@/components/Header";
import { StrategyForm } from "@/components/StrategyForm";
import { EncryptionStatus, type EncryptionStep } from "@/components/EncryptionStatus";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { DemoButton } from "@/components/DemoButton";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsCards } from "@/components/StatsCards";
import type { SubmitStrategy } from "@shared/schema";
import { 
  generateFHEKeyPair, 
  encryptStrategyData, 
  decryptScore,
  getScoreRecommendation 
} from "@/lib/fhe-utils";
import { 
  submitStrategyToContract, 
  computeStrategyOnContract,
  getEncryptedScoreFromContract 
} from "@/lib/contract";
import { useWallet } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { toast } = useToast();
  const { signer, isConnected, connectWallet, network } = useWallet();
  
  const [keyPair] = useState(() => generateFHEKeyPair());
  
  const [currentStep, setCurrentStep] = useState<EncryptionStep>("idle");
  const [encryptedHash, setEncryptedHash] = useState<string>();
  const [strategyId, setStrategyId] = useState<string>();
  const [encryptedScore, setEncryptedScore] = useState<string>();
  const [decryptedScore, setDecryptedScore] = useState<number>();
  const [percentile, setPercentile] = useState<number>();
  const [recommendation, setRecommendation] = useState<string>();
  const [category, setCategory] = useState<'excellent' | 'good' | 'moderate' | 'poor'>();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const isSepoliaNetwork = network?.chainId === BigInt(11155111);

  const handleSubmitStrategy = async (data: SubmitStrategy) => {
    if (!isConnected || !signer) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit a strategy",
        variant: "destructive",
      });
      return;
    }

    if (!isSepoliaNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia testnet",
        variant: "destructive",
      });
      return;
    }

    resetWorkflow();
    setIsSubmitting(true);
    
    try {
      setCurrentStep("encrypting");
      await simulateDelay(800);
      
      const encryptionResult = encryptStrategyData(
        data.riskLevel,
        data.allocation,
        data.timeframe,
        keyPair.publicKey
      );
      
      setEncryptedHash(encryptionResult.hash);
      
      toast({
        title: "Data Encrypted",
        description: "Strategy parameters encrypted with FHE public key",
      });
      
      setCurrentStep("submitting");
      await simulateDelay(500);
      
      const contractStrategyId = await submitStrategyToContract(
        signer,
        encryptionResult.encryptedData,
        encryptionResult.hash
      );
      
      setStrategyId(contractStrategyId);
      
      toast({
        title: "Submitted to Blockchain",
        description: "Encrypted data sent to FHEVault contract on Sepolia",
      });
      
      setCurrentStep("computing");
      await simulateDelay(500);
      
      await computeStrategyOnContract(signer, contractStrategyId);
      
      const encryptedResult = await getEncryptedScoreFromContract(signer, contractStrategyId);
      setEncryptedScore(encryptedResult);
      
      toast({
        title: "Computation Complete",
        description: "Encrypted performance score ready for decryption",
      });
      
      setCurrentStep("completed");
      
    } catch (error: any) {
      console.error("Strategy submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred during the encryption workflow",
        variant: "destructive",
      });
      resetWorkflow();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedScore) return;
    
    setIsDecrypting(true);
    
    try {
      await simulateDelay(600);
      
      const score = decryptScore(encryptedScore, keyPair.privateKey);
      const analysis = getScoreRecommendation(score);
      
      setDecryptedScore(score);
      setPercentile(analysis.percentile);
      setRecommendation(analysis.recommendation);
      setCategory(analysis.category);
      
      toast({
        title: "Score Decrypted",
        description: `Your strategy scored ${score}/100`,
      });
    } catch (error) {
      console.error("Decryption failed:", error);
      toast({
        title: "Decryption Failed",
        description: "Could not decrypt the score",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleRunDemo = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to run the demo",
        variant: "destructive",
      });
      return;
    }

    setIsDemoRunning(true);
    
    try {
      const demoStrategy: SubmitStrategy = {
        riskLevel: 7,
        allocation: 75,
        timeframe: 90,
      };
      
      toast({
        title: "Demo Started",
        description: "Running automated FHE workflow demonstration",
      });
      
      await handleSubmitStrategy(demoStrategy);
      
      await simulateDelay(1000);
      await handleDecrypt();
      
    } catch (error) {
      console.error("Demo failed:", error);
      toast({
        title: "Demo Failed",
        description: "An error occurred during the demo",
        variant: "destructive",
      });
    } finally {
      setIsDemoRunning(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep("idle");
    setEncryptedHash(undefined);
    setStrategyId(undefined);
    setEncryptedScore(undefined);
    setDecryptedScore(undefined);
    setPercentile(undefined);
    setRecommendation(undefined);
    setCategory(undefined);
  };

  const simulateDelay = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="heading-hero">
            Confidential Strategy Vault
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl" data-testid="text-hero-description">
            Prove your trading strategy performance without revealing your private logic. 
            Powered by Fully Homomorphic Encryption with Zama.
          </p>
        </div>

        {!isConnected && (
          <Alert className="mb-6" data-testid="alert-connect-wallet">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>Connect your wallet to start using FHEVault on Sepolia testnet</span>
              <Button onClick={connectWallet} size="sm" data-testid="button-connect-inline">
                Connect Wallet
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isConnected && !isSepoliaNetwork && (
          <Alert variant="destructive" className="mb-6" data-testid="alert-wrong-network">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please switch to Sepolia testnet to use this application
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <StatsCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <StrategyForm 
              onSubmit={handleSubmitStrategy} 
              isLoading={isSubmitting || isDemoRunning}
            />
            
            <DemoButton 
              onRunDemo={handleRunDemo}
              isLoading={isDemoRunning}
              disabled={isSubmitting || !isConnected || !isSepoliaNetwork}
            />
          </div>

          <div className="space-y-6">
            <EncryptionStatus
              currentStep={currentStep}
              encryptedHash={encryptedHash}
              strategyId={strategyId}
            />
            
            <ResultsDisplay
              encryptedScore={encryptedScore}
              decryptedScore={decryptedScore}
              percentile={percentile}
              recommendation={recommendation}
              category={category}
              onDecrypt={handleDecrypt}
              isDecrypting={isDecrypting}
            />
          </div>
        </div>

        <div className="mb-8">
          <HowItWorks />
        </div>

        <footer className="py-6 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p data-testid="text-footer-info">
              Built with Hardhat, React, Ethers.js, and FHE encryption on Sepolia testnet
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.zama.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-zama"
              >
                Powered by Zama FHE
              </a>
              <span>•</span>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-github"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
