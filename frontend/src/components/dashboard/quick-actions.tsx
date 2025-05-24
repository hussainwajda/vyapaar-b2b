import { useState } from "react";
import { Plus, Upload, Download, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductForm from "@/components/products/product-form";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { toast } = useToast();

  const handleBulkUpload = () => {
    toast({
      title: "Bulk Upload",
      description: "Bulk upload feature coming soon!",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Data export feature coming soon!",
    });
  };

  const handleViewAnalytics = () => {
    toast({
      title: "Analytics",
      description: "Detailed analytics coming soon!",
    });
  };

  const actions = [
    {
      name: "Add Product",
      icon: Plus,
      onClick: () => setIsProductModalOpen(true),
    },
    {
      name: "Bulk Upload",
      icon: Upload,
      onClick: handleBulkUpload,
    },
    {
      name: "Export Data",
      icon: Download,
      onClick: handleExportData,
    },
    {
      name: "View Reports",
      icon: BarChart3,
      onClick: handleViewAnalytics,
    },
  ];

  return (
    <Card className="bg-[var(--color-heading)] neon-border text-[var(--color-primary)]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.name}
              variant="outline"
              className="flex flex-col bg-[var(--color-primary)] items-center p-4 h-auto border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5"
              onClick={action.onClick}
            >
              <action.icon className="h-6 w-6 text-[var(--color-heading)] mb-2" />
              <span className="text-sm font-medium text-slate-700">{action.name}</span>
            </Button>
          ))}
        </div>
      </CardContent>

      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={() => setIsProductModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
