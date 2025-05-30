import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Eye, Package, MapPin, Calendar, DollarSign, User, Phone, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  const {getEmailFromUser} = useAuth();
  const userEmail = getEmailFromUser();


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        if (!userEmail) {
          return;
        }
        const response = await axios.get(`${ServerUrl}/api/orders/manufacturer`, {
          params: { userEmail }
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "pending":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">{status}</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">{status}</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">{status}</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700">{status}</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700">{status}</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge variant="default" className="bg-green-600">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const formatDecimal = (value) => {
    if (!value) return "0.00";
    return parseFloat(value.toString()).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders Management</h1>
        <p className="text-sm text-slate-500">Track and manage all incoming orders from buyers</p>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order._id} className="bg-[var(--color-heading)] neon-border hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">ORD-{order._id.slice(-6).toUpperCase()}</CardTitle>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={order.user?.profilePicture} alt="Buyer" />
                  <AvatarFallback className="text-xs">
                    {order.user?.name?.split(' ').map(n => n[0]).join('') || "C"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{order.user?.name || "Customer"}</p>
                  <p className="text-xs text-slate-500">{order.user?.company || "Individual Buyer"}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Total Amount</p>
                  <p className="font-medium text-slate-900">${formatDecimal(order.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment</p>
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-slate-500">Product</p>
                <p className="font-medium text-slate-900 line-clamp-1">
                  {order.product?.title || "Unknown Product"}
                </p>
              </div>

              <div className="text-sm">
                <p className="text-slate-500">Order Date</p>
                <p className="font-medium text-slate-900">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </p>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-[var(--color-secondary)] text-[var(--color-heading)] hover:bg-[var(--color-primary)] hover:text-[var(--color-heading)]"
                onClick={() => setSelectedOrder(order)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - ORD-{selectedOrder?._id.slice(-6).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status & Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium">Order Status</span>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium">Payment Status</span>
                    </div>
                    {getPaymentBadge(selectedOrder.paymentStatus)}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium">Shipping Method</span>
                    </div>
                    <p className="text-sm font-medium capitalize">
                      {selectedOrder.shipping_type || "Standard"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Buyer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Buyer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Company</p>
                    <p className="font-medium">{selectedOrder.user?.company || "Individual Buyer"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contact Person</p>
                    <p className="font-medium">{selectedOrder.user?.name || "Customer"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedOrder.user?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedOrder.user?.phone || "Not provided"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Products Ordered */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        {selectedOrder.product?.image && (
                          <img 
                            src={selectedOrder.product.image} 
                            alt={selectedOrder.product.title} 
                            className="w-16 h-16 object-contain rounded-md"
                          />
                        )}
                        <div>
                          <p className="font-medium">{selectedOrder.product?.title || "Unknown Product"}</p>
                          <p className="text-sm text-slate-600">
                            Quantity: {selectedOrder.product?.quantity || 1} × ${formatDecimal(selectedOrder.product?.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">${formatDecimal(selectedOrder.product?.total)}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span>${formatDecimal(selectedOrder.product?.total)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shipping</span>
                        <span>${formatDecimal(selectedOrder.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tax</span>
                        <span>${formatDecimal(selectedOrder.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>${formatDecimal(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Shipping Address</p>
                      <p className="font-medium">
                        {selectedOrder.shippingAddress?.street && (
                          <>
                            {selectedOrder.shippingAddress.street}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                            {selectedOrder.shippingAddress.country}, {selectedOrder.shippingAddress.postalCode}
                          </>
                        ) || "Address not available"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Order Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                      {selectedOrder.trackingNumber && (
                        <>
                          <p className="text-sm text-slate-500 mt-2">Tracking Number</p>
                          <p className="font-medium">{selectedOrder.trackingNumber}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-slate-500">Payment Method</p>
                    <p className="font-medium capitalize">
                      {selectedOrder.paymentMethod?.replace('-', ' ') || "Unknown"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}