import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const { toast } = useToast();
  
  // FHE keys (normally stored securely)
  const [keyPair] = useState(() => generateFHEKeyPair());
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState<EncryptionStep>("idle");
  const [encryptedHash, setEncryptedHash] = useState<string>();
  const [strategyId, setStrategyId] = useState<string>();
  const [encryptedScore, setEncryptedScore] = useState<string>();
  const [decryptedScore, setDecryptedScore] = useState<number>();
  const [percentile, setPercentile] = useState<number>();
  const [recommendation, setRecommendation] = useState<string>();
  const [category, setCategory] = useState<'excellent' | 'good' | 'moderate' | 'poor'>();
  
  // Loading states
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Submit strategy mutation
  const submitMutation = useMutation({
    mutationFn: async (data: {
      riskLevel: number;
      allocation: number;
      timeframe: number;
      encryptedData: string;
      encryptedHash: string;
    }) => {
      const response = await apiRequest(
        'POST',
        '/api/strategies/submit',
        data
      );
      const json = await response.json();
      return json as { strategyId: string };
    },
  });

  // Compute strategy mutation
  const computeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest(
        'POST',
        `/api/strategies/${id}/compute`,
        {}
      );
      const json = await response.json();
      return json as { encryptedScore: string };
    },
  });

  const handleSubmitStrategy = async (data: SubmitStrategy) => {
    resetWorkflow();
    
    try {
      // Step 1: Encrypt locally
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
      
      // Step 2: Submit to blockchain (backend API)
      setCurrentStep("submitting");
      await simulateDelay(1000);
      
      const submitResult = await submitMutation.mutateAsync({
        riskLevel: data.riskLevel,
        allocation: data.allocation,
        timeframe: data.timeframe,
        encryptedData: encryptionResult.encryptedData,
        encryptedHash: encryptionResult.hash,
      });
      
      setStrategyId(submitResult.strategyId);
      
      toast({
        title: "Submitted to Blockchain",
        description: "Encrypted data sent to FHEVault contract",
      });
      
      // Step 3: Smart contract computation (backend API)
      setCurrentStep("computing");
      await simulateDelay(1500);
      
      const computeResult = await computeMutation.mutateAsync(submitResult.strategyId);
      
      setEncryptedScore(computeResult.encryptedScore);
      
      toast({
        title: "Computation Complete",
        description: "Encrypted performance score ready for decryption",
      });
      
      // Step 4: Ready for decryption
      setCurrentStep("completed");
      
    } catch (error) {
      console.error("Strategy submission failed:", error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An error occurred during the encryption workflow",
        variant: "destructive",
      });
      resetWorkflow();
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
    setIsDemoRunning(true);
    
    try {
      // Demo strategy parameters
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
      
      // Auto-decrypt after computation
      await simulateDelay(1000);
      
      // The encryptedScore state should be set by now from handleSubmitStrategy
      // We can directly call decrypt since the state was updated
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

  const isSubmitting = submitMutation.isPending || computeMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="heading-hero">
            Confidential Strategy Vault
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl" data-testid="text-hero-description">
            Prove your trading strategy performance without revealing your private logic. 
            Powered by Fully Homomorphic Encryption with Zama.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsCards />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Input & Demo */}
          <div className="lg:col-span-2 space-y-6">
            <StrategyForm 
              onSubmit={handleSubmitStrategy} 
              isLoading={isSubmitting || isDemoRunning}
            />
            
            <DemoButton 
              onRunDemo={handleRunDemo}
              isLoading={isDemoRunning}
              disabled={isSubmitting}
            />
          </div>

          {/* Right Column - Status & Results */}
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

        {/* Educational Section */}
        <div className="mb-8">
          <HowItWorks />
        </div>

        {/* Footer */}
        <footer className="py-6 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p data-testid="text-footer-info">
              Built with Hardhat, React, and simulated FHE for demonstration purposes
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
