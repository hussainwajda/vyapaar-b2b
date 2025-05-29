import { Box, Handshake, Mail, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} active`,
      icon: Box,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+12%",
      trendText: "from last month",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      subtitle: "2.4h avg response",
      icon: Handshake,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: null,
      trendText: null,
    },
    {
      title: "New Inquiries",
      value: stats.newInquiries,
      subtitle: "+18% from last week",
      icon: Mail,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: "+18%",
      trendText: "from last week",
    },
    {
      title: "Revenue (MTD)",
      value: `₹${(stats.totalRevenue / 1000).toFixed(1)}K`,
      subtitle: "+24% from last month",
      icon: DollarSign,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+24%",
      trendText: "from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="stat-card bg-[var(--color-heading)] neon-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--color-primary)]">{card.title}</p>
                <p className="text-3xl font-bold text-[var(--color-secondary)]">{card.value}</p>
                {card.trend && (
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {card.trend} {card.trendText}
                  </p>
                )}
                {card.subtitle && !card.trend && (
                  <p className="text-sm text-slate-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {card.subtitle}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
