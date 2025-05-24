import { Plus, Handshake, Mail, AlertTriangle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/lib/types";

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "product_added",
    icon: "plus",
    iconBg: "bg-blue-100 text-blue-600",
    description: "New product Industrial Lathe was added",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "request_received",
    icon: "handshake",
    iconBg: "bg-green-100 text-green-600",
    description: "Connection request from TechCorp Industries",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    type: "inquiry_received",
    icon: "mail",
    iconBg: "bg-purple-100 text-purple-600",
    description: "New inquiry for PCB Components",
    timestamp: "6 hours ago",
  },
  {
    id: "4",
    type: "low_stock",
    icon: "alert",
    iconBg: "bg-yellow-100 text-yellow-600",
    description: "Low stock alert for Brake Assembly",
    timestamp: "1 day ago",
  },
  {
    id: "5",
    type: "order_completed",
    icon: "check",
    iconBg: "bg-green-100 text-green-600",
    description: "Order completed for Metal Components",
    timestamp: "2 days ago",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "plus":
      return Plus;
    case "handshake":
      return Handshake;
    case "mail":
      return Mail;
    case "alert":
      return AlertTriangle;
    case "check":
      return Check;
    default:
      return Plus;
  }
};

export default function RecentActivity() {
  return (
    <Card className="bg-[var(--color-heading)] text-[var(--color-primary)] neon-border">
      <CardHeader className="px-6 py-4 border-b border-slate-200">
        <CardTitle className="text-lg font-semibold text-[var(--color-primary)">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const IconComponent = getIcon(activity.icon);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-primary)">{activity.description}</p>
                  <p className="text-xs text-red-500">{activity.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
