import { Lock, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/Web3Context";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Header() {
  const { 
    account, 
    network, 
    isConnected, 
    isConnecting, 
    error,
    connectWallet, 
    disconnectWallet,
    switchToSepolia 
  } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isSepoliaNetwork = network?.chainId === BigInt(11155111);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight">FHEVault</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Confidential Strategy Vault</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isConnected && network && (
                <Badge 
                  variant={isSepoliaNetwork ? "secondary" : "destructive"} 
                  className="hidden md:flex gap-2" 
                  data-testid="badge-network"
                >
                  <div 
                    className={`h-2 w-2 rounded-full ${isSepoliaNetwork ? 'bg-green-500 animate-pulse-subtle' : 'bg-orange-500'}`}
                    data-testid="indicator-network-status"
                  ></div>
                  <span className="text-xs">{network.name}</span>
                </Badge>
              )}

              {isConnected && !isSepoliaNetwork && (
                <Button
                  onClick={switchToSepolia}
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                  data-testid="button-switch-network"
                >
                  Switch to Sepolia
                </Button>
              )}

              <ThemeToggle />

              {isConnected ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="gap-2"
                      data-testid="button-wallet-connected"
                    >
                      <Wallet className="h-4 w-4" />
                      <span className="hidden sm:inline" data-testid="text-wallet-address">
                        {formatAddress(account!)}
                      </span>
                      <span className="sm:hidden" data-testid="text-wallet-status-mobile">
                        Connected
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={disconnectWallet}
                      data-testid="button-wallet-disconnect"
                    >
                      Disconnect
                    </DropdownMenuItem>
                    {!isSepoliaNetwork && (
                      <DropdownMenuItem 
                        onClick={switchToSepolia}
                        data-testid="button-switch-network-menu"
                      >
                        Switch to Sepolia
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="gap-2"
                  data-testid="button-wallet-connect"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline" data-testid="text-wallet-address">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </span>
                  <span className="sm:hidden" data-testid="text-wallet-status-mobile">
                    {isConnecting ? "Connecting..." : "Connect"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="container mx-auto px-4 md:px-6 pt-4">
          <Alert variant="destructive" data-testid="alert-wallet-error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
