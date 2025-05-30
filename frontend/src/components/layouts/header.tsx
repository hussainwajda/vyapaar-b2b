import { useState, useEffect } from "react";
import { Search, Plus, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import ProductForm from "@/components/products/product-form";
import BulkProductForm from "@/components/products/bulk-product-form";
import type { Manufacturer } from "../../shared/schema";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BlurText from "../../assets/BlurText";
import { toast, ToastContainer } from "react-toastify";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getEmailFromUser } = useAuth();
  const userEmail = getEmailFromUser();
  
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);

  const handleSuccessfulSubmit = () => {
    setIsProductModalOpen(false);
    setIsBulkModalOpen(false);
    toast.success("Product added successfully");
    window.location.reload();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch manufacturer profile
        const manufacturerResponse = await axios.get(`${ServerUrl}/api/manufacturerProfile`, {
          params: { email: userEmail }
        });
        const manufacturerData = manufacturerResponse.data.data;
        setManufacturer(manufacturerData);

        // Fetch notifications
        const notificationsResponse = await axios.get(`${ServerUrl}/api/notifications`);
        const notificationsData = notificationsResponse.data.data;
        setNotifications(notificationsData);

      } catch (err) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching header data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
  <>  
    <ToastContainer />
    <header className="bg-[var(--color-primary)] text-[var(--color-heading)] border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <BlurText className="text-2xl font-semibold text-[var(--color-heading)]"
            text="Dashboard" />
            <p className="text-sm text-slate-500">
              {loading ? "Loading..." : `Welcome back, ${manufacturer?.contact_person?.name?.split(' ')[0] || "User"}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products, requests..."
              className="pl-10 w-80"
            />
          </div>
          
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsProductModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Single Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsBulkModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Bulk Add Products
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Single Product Modal */}
          <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
            <DialogContent className="max-w-4xl ">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <ProductForm onSuccess={() => handleSuccessfulSubmit()} />
            </DialogContent>
          </Dialog>

          {/* Bulk Product Modal */}
          <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Bulk Add Products</DialogTitle>
              </DialogHeader>
              <BulkProductForm onSuccess={() => setIsBulkModalOpen(false)} />
            </DialogContent>
          </Dialog>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  </>
  );
}