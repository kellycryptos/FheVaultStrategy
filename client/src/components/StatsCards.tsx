import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, TrendingUp, Shield, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Strategy } from "@shared/schema";

export function StatsCards() {
  const { data: strategies = [] } = useQuery<Strategy[]>({
    queryKey: ['/api/strategies'],
    enabled: false, // Will be enabled when backend is connected
  });

  const stats = [
    {
      title: "Total Encryptions",
      value: strategies.length.toString(),
      icon: Lock,
      description: "Strategies encrypted",
    },
    {
      title: "Computations",
      value: strategies.filter(s => s.status === 'completed').length.toString(),
      icon: TrendingUp,
      description: "Successfully computed",
    },
    {
      title: "Privacy Preserved",
      value: "100%",
      icon: Shield,
      description: "Zero data exposure",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
