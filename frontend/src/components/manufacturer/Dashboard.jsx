import { useEffect, useState } from "react";
import axios from "axios";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentActivity from "@/components/dashboard/recent-activity";
import QuickActions from "@/components/dashboard/quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import ProductCard from "../products/product-card";
import { useLocation } from 'react-router-dom';
import { RefreshCcw } from "lucide-react"

export default function Dashboard() {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const email = user?.UserAttributes[0]?.Value;
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await axios.get(`${ServerUrl}/api/dashboard/stats`,{
          params: {email: email}
        });
        setStats(response.data.data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await axios.get(`${ServerUrl}/api/products`,{
          params: {email: email}
        });
        setProducts(response.data.data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchStats();
    fetchProducts();
  }, [location.key]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !stats) {
    toast.error(error || "Failed to load dashboard data");
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error || "Failed to load dashboard data"}</div>
      </div>
    );
  }

  const recentProducts = products?.slice(0, 3) || [];
  const sortedProducts = [...recentProducts].sort((a, b) => {
  // Assuming `createdAt` is a string that can be parsed into a Date object
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);

  return dateB.getTime() - dateA.getTime(); // For descending (most recent first)
});

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover />
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="lg:col-span-2">
          <Card className="bg-[var(--color-heading)] neon-border text-[var(--color-primary)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Products</CardTitle>
              <div className="flex items-center space-x-2">
                <RefreshCcw className="cursor-pointer" onClick={() => window.location.reload()} />
                <Link to="/manufacturer/products" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {productsLoading ? (
                <div className="text-center text-slate-500">Loading products...</div>
              ) : recentProducts.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  No products found. <Link to="/manufacturer/products" className="text-primary hover:underline">Add your first product</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>

      {/* Quick Actions and Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        {/* <PendingRequests /> */}
      </div>
    </div>
  );
}
