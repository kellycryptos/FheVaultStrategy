import { Lock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = () => {
    // Simulate wallet connection
    if (!isConnected) {
      const mockAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
      setAddress(mockAddress);
      setIsConnected(true);
    } else {
      setAddress(null);
      setIsConnected(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight">FHEVault</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Confidential Strategy Vault</p>
            </div>
          </div>

          {/* Right side: Network & Wallet */}
          <div className="flex items-center gap-3">
            {/* Network indicator */}
            <Badge variant="secondary" className="hidden md:flex gap-2" data-testid="badge-network">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-subtle" data-testid="indicator-network-status"></div>
              <span className="text-xs">Hardhat Local</span>
            </Badge>

            {/* Wallet Connection */}
            <Button
              onClick={handleConnect}
              variant={isConnected ? "secondary" : "default"}
              className="gap-2"
              data-testid="button-wallet-connect"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline" data-testid="text-wallet-address">
                {isConnected ? address : "Connect Wallet"}
              </span>
              <span className="sm:hidden" data-testid="text-wallet-status-mobile">
                {isConnected ? "Connected" : "Connect"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
