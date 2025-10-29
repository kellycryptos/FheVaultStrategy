import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock, Server, Key, ArrowRight } from "lucide-react";

export function HowItWorks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          How FHE Works in FHEVault
        </CardTitle>
        <CardDescription>
          Understanding Fully Homomorphic Encryption for confidential trading strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-fhe">
            <AccordionTrigger className="text-sm font-medium">
              What is Fully Homomorphic Encryption (FHE)?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                FHE is a revolutionary cryptographic technique that allows computations to be performed 
                directly on encrypted data without ever decrypting it. This means:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Your sensitive strategy parameters remain encrypted at all times</li>
                <li>The smart contract computes on encrypted data and returns encrypted results</li>
                <li>Only you can decrypt the final score using your private key</li>
                <li>No one else (including the blockchain validators) can see your strategy details</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="workflow">
            <AccordionTrigger className="text-sm font-medium">
              The FHEVault Workflow
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">1. Key Generation</p>
                    <p className="text-xs">Generate FHE public/private key pair locally in your browser</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">2. Client-Side Encryption</p>
                    <p className="text-xs">Encrypt your strategy parameters using the FHE public key</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">3. Blockchain Submission</p>
                    <p className="text-xs">Send encrypted data to the FHEVault smart contract</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">4. Encrypted Computation</p>
                    <p className="text-xs">Smart contract evaluates strategy performance on encrypted data</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">5. Local Decryption</p>
                    <p className="text-xs">Decrypt the encrypted score using your private key to see results</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="why-fhe">
            <AccordionTrigger className="text-sm font-medium">
              Why Use FHE for Trading Strategies?
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>FHE enables traders to prove their strategy performance without revealing proprietary logic:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Privacy:</strong> Keep your competitive edge by never exposing strategy parameters</li>
                <li><strong>Verification:</strong> Get trustless, blockchain-verified performance scores</li>
                <li><strong>Transparency:</strong> Prove performance to investors without revealing your secret sauce</li>
                <li><strong>Compliance:</strong> Meet regulatory requirements while maintaining confidentiality</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="zama">
            <AccordionTrigger className="text-sm font-medium">
              About Zama & fhEVM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                This demo uses simulated FHE for local testing. For production deployment:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Zama fhEVM:</strong> Production-ready FHE blockchain for Ethereum</li>
                <li><strong>TFHE-rs:</strong> Rust library for fast homomorphic encryption operations</li>
                <li><strong>Integration:</strong> Replace mock FHE utilities with actual Zama SDK</li>
                <li><strong>Network:</strong> Deploy to Zama's testnet or compatible FHE-enabled chains</li>
              </ul>
              <p className="pt-2 text-xs">
                Learn more at <a href="https://www.zama.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">zama.ai</a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
