import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitStrategySchema, type SubmitStrategy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface StrategyFormProps {
  onSubmit: (data: SubmitStrategy) => void;
  isLoading?: boolean;
}

export function StrategyForm({ onSubmit, isLoading = false }: StrategyFormProps) {
  const form = useForm<SubmitStrategy>({
    resolver: zodResolver(submitStrategySchema),
    defaultValues: {
      riskLevel: 5,
      allocation: 50,
      timeframe: 30,
    },
  });

  const riskLevel = form.watch("riskLevel");
  const allocation = form.watch("allocation");
  const timeframe = form.watch("timeframe");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Strategy Parameters
        </CardTitle>
        <CardDescription>
          Enter your trading strategy parameters. All data will be encrypted using FHE before submission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Risk Level */}
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                    <TrendingUp className="h-4 w-4" />
                    Risk Level
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                        data-testid="slider-risk-level"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Conservative</span>
                        <span className="text-lg font-mono font-semibold" data-testid="text-risk-value">
                          {riskLevel}/10
                        </span>
                        <span className="text-xs text-muted-foreground">Aggressive</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    🔒 This value will be encrypted and never revealed to the smart contract
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allocation */}
            <FormField
              control={form.control}
              name="allocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                    <DollarSign className="h-4 w-4" />
                    Allocation Percentage
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="w-full"
                        data-testid="slider-allocation"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">0%</span>
                        <span className="text-lg font-mono font-semibold" data-testid="text-allocation-value">
                          {allocation}%
                        </span>
                        <span className="text-xs text-muted-foreground">100%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    🔒 Percentage of portfolio allocated to this strategy (encrypted)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timeframe */}
            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide">
                    <Calendar className="h-4 w-4" />
                    Investment Timeframe (Days)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      className="font-mono"
                      data-testid="input-timeframe"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    🔒 Expected holding period in days (1-365, encrypted)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
              data-testid="button-submit-strategy"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Encrypting & Submitting...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Encrypt & Submit Strategy
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
