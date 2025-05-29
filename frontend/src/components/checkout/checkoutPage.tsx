import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  CreditCard, 
  Building, 
  Shield, 
  Clock,
  CheckCircle,
  Package,
  Truck
} from "lucide-react";

// Mock checkout data
const mockCartItems = [
  {
    id: 1,
    title: "Industrial Precision CNC Lathe Machine",
    price: 12500,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=100&h=100",
    supplier: "ACME Manufacturing",
    leadTime: "15-20 days"
  },
  {
    id: 2,
    title: "Electronic Control Board PCB",
    price: 89.99,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=100&h=100",
    supplier: "TechCorp Industries",
    leadTime: "10-15 days"
  }
];

const mockAddresses = [
  {
    id: 1,
    name: "John Smith",
    company: "Manufacturing Corp",
    address: "1234 Industrial Ave",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    country: "United States",
    phone: "+1-555-0199",
    isDefault: true
  },
  {
    id: 2,
    name: "John Smith",
    company: "Secondary Facility",
    address: "5678 Factory Blvd",
    city: "Dallas",
    state: "TX",
    zipCode: "75201",
    country: "United States",
    phone: "+1-555-0288",
    isDefault: false
  }
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [newAddress, setNewAddress] = useState({
    name: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: ""
  });

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 150; // Flat shipping fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    // Create order and redirect to order confirmation
    const orderId = `ORD-${Date.now()}`;
    setLocation(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/products')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="text-sm text-slate-500">Review your order and complete your purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Address & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                {mockAddresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={address.id.toString()} id={address.id.toString()} className="mt-1" />
                    <Label htmlFor={address.id.toString()} className="flex-1 cursor-pointer">
                      <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{address.name}</div>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p className="font-medium">{address.company}</p>
                          <p>{address.address}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button 
                variant="outline" 
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>

              {showNewAddressForm && (
                <div className="border rounded-lg p-4 space-y-4 bg-slate-50">
                  <h4 className="font-medium text-slate-900">Add New Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        value={newAddress.company}
                        onChange={(e) => setNewAddress({...newAddress, company: e.target.value})}
                        placeholder="Manufacturing Corp"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                        placeholder="1234 Industrial Ave"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="Houston"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={newAddress.state} onValueChange={(value) => setNewAddress({...newAddress, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        placeholder="77001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        placeholder="+1-555-0199"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Save Address</Button>
                    <Button variant="outline" size="sm" onClick={() => setShowNewAddressForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {/* Credit/Debit Card */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="card" id="card" className="mt-1" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3 mb-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Credit or Debit Card</span>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="space-y-3 mt-4">
                          <div>
                            <Label>Card Number</Label>
                            <Input placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Expiry Date</Label>
                              <Input placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <Input placeholder="123" />
                            </div>
                          </div>
                          <div>
                            <Label>Cardholder Name</Label>
                            <Input placeholder="John Smith" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Label>
                </div>

                {/* Trade Credit */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="trade-credit" id="trade-credit" className="mt-1" />
                  <Label htmlFor="trade-credit" className="flex-1 cursor-pointer">
                    <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-green-600" />
                        <div>
                          <span className="font-medium">Trade Credit</span>
                          <p className="text-sm text-slate-600">Net 30 payment terms</p>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Financing */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="financing" id="financing" className="mt-1" />
                  <Label htmlFor="financing" className="flex-1 cursor-pointer">
                    <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <div>
                          <span className="font-medium">Equipment Financing</span>
                          <p className="text-sm text-slate-600">0% APR for 12 months</p>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                {/* Bank Transfer */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" className="mt-1" />
                  <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                    <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="font-medium">Bank Transfer</span>
                          <p className="text-sm text-slate-600">Direct wire transfer</p>
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Special Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add any special delivery instructions, technical requirements, or notes for the supplier..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">{item.supplier}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Truck className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{item.leadTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span>${shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Security & Guarantees */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Quality guarantee</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Package className="h-4 w-4 text-green-600" />
                  <span>Damage protection</span>
                </div>
              </div>

              <Separator />

              {/* Place Order */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm text-slate-600">
                    I agree to the <span className="text-blue-600 cursor-pointer">Terms & Conditions</span>
                  </Label>
                </div>
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Your order will be processed securely
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}