import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Eye, Package, MapPin, Calendar, DollarSign, User, Phone, Mail } from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-2024-001",
    buyerName: "TechCorp Industries",
    buyerEmail: "purchasing@techcorp.com",
    buyerPhone: "+1-555-0199",
    buyerCompany: "TechCorp Industries LLC",
    products: [
      {
        name: "Industrial Precision Lathe Machine",
        quantity: 2,
        unitPrice: 12500,
        total: 25000
      }
    ],
    totalAmount: 25000,
    status: "confirmed",
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: "1234 Industrial Ave, Houston, TX 77001",
    paymentStatus: "paid",
    notes: "Urgent delivery required for new facility setup"
  },
  {
    id: "ORD-2024-002", 
    buyerName: "Global Electronics Ltd",
    buyerEmail: "orders@globalelectronics.com",
    buyerPhone: "+1-555-0288",
    buyerCompany: "Global Electronics Ltd",
    products: [
      {
        name: "Electronic Control Board PCB",
        quantity: 100,
        unitPrice: 89.99,
        total: 8999
      }
    ],
    totalAmount: 8999,
    status: "processing",
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: "567 Tech Park Blvd, San Jose, CA 95110",
    paymentStatus: "pending",
    notes: "Testing batch for quality approval"
  },
  {
    id: "ORD-2024-003",
    buyerName: "AutoParts Manufacturing",
    buyerEmail: "procurement@autoparts.com", 
    buyerPhone: "+1-555-0377",
    buyerCompany: "AutoParts Manufacturing Inc",
    products: [
      {
        name: "Automotive Brake Assembly",
        quantity: 50,
        unitPrice: 245,
        total: 12250
      }
    ],
    totalAmount: 12250,
    status: "shipped",
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: "890 Manufacturing Row, Detroit, MI 48201",
    paymentStatus: "paid",
    notes: "Monthly recurring order"
  },
  {
    id: "ORD-2024-004",
    buyerName: "Industrial Solutions Inc",
    buyerEmail: "buyers@industrialsolutions.com",
    buyerPhone: "+1-555-0466", 
    buyerCompany: "Industrial Solutions Inc",
    products: [
      {
        name: "Industrial Precision Lathe Machine",
        quantity: 1,
        unitPrice: 12500,
        total: 12500
      },
      {
        name: "Electronic Control Board PCB",
        quantity: 25,
        unitPrice: 89.99,
        total: 2249.75
      }
    ],
    totalAmount: 14749.75,
    status: "delivered",
    orderDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    expectedDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: "123 Factory Lane, Cleveland, OH 44101",
    paymentStatus: "paid",
    notes: "Satisfied customer, potential for future large orders"
  }
];

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Confirmed</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge variant="default" className="bg-green-600">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Orders Management</h1>
        <p className="text-sm text-slate-500">Track and manage all incoming orders from buyers</p>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOrders.map((order) => (
          <Card key={order.id} className="bg-[var(--color-heading)] neon-border hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{order.id}</CardTitle>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" alt="Buyer" />
                  <AvatarFallback className="text-xs">
                    {order.buyerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{order.buyerName}</p>
                  <p className="text-xs text-slate-500">{order.buyerCompany}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Total Amount</p>
                  <p className="font-medium text-slate-900">${order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Payment</p>
                  {getPaymentBadge(order.paymentStatus)}
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-slate-500">Products</p>
                <p className="font-medium text-slate-900">
                  {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="text-sm">
                <p className="text-slate-500">Order Date</p>
                <p className="font-medium text-slate-900">
                  {formatDistanceToNow(new Date(order.orderDate), { addSuffix: true })}
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
              Order Details - {selectedOrder?.id}
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
                      <span className="text-sm font-medium">Expected Delivery</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(selectedOrder.expectedDelivery).toLocaleDateString()}
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
                    <p className="font-medium">{selectedOrder.buyerCompany}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Contact Person</p>
                    <p className="font-medium">{selectedOrder.buyerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedOrder.buyerEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedOrder.buyerPhone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Products Ordered */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Products Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-slate-600">
                            Quantity: {product.quantity} × ${product.unitPrice.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-semibold">${product.total.toLocaleString()}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Amount</span>
                      <span>${selectedOrder.totalAmount.toLocaleString()}</span>
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
                      <p className="font-medium">{selectedOrder.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Order Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedOrder.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-500">Special Notes</p>
                      <p className="font-medium">{selectedOrder.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}