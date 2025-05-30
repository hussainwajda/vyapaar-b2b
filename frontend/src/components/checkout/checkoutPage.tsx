import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../../context/AuthContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {getTaxRate} from "../../assets/taxCalc";
import Razorpay from "razorpay";

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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [shippingType, setShippingType] = useState("Standard");
  const { product, quantity, price } = location.state || {};
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState("1");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: ""
  });
  const {getEmailFromUser} = useAuth();

  const addAddress = async (addressData: any) => {
  try {
    const response = await axios.post(
      `${SERVER_URL}/api/add-address`,
      addressData,
      {
        params: {
          userId: getEmailFromUser() // Assuming this returns user email or ID
        }
      }
    );
    toast.success("Address added successfully");
    setShowNewAddressForm(false);
    return response.data;
  } catch (err) {
    console.error("Failed to add address:", err);
    throw err;
  }
};

const handleRazorpayPayment = async () => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/create-order`, {
      amount: total.toFixed(0), // amount in paise
    });

    const { id: order_id } = response.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay test key
      amount: total.toFixed(0),
      currency: "INR",
      name: "Vyapaar",
      description: "Order Payment",
      order_id,
      handler: async function (response: any) {
        toast.success("Payment Successful!");

        await submitOrder(response.razorpay_payment_id);
      },
      prefill: {
        email: getEmailFromUser(),
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment initiation failed:", err);
    toast.error("Failed to initiate payment");
  }
};

const submitOrder = async (paymentId: string) => {
  if (!selectedAddress || selectedAddress.length < 24) {
  toast.error("Please select a valid shipping address.");
  return;
}
  try {
    const res = await axios.post(`${SERVER_URL}/api/submit-order`, {
      userId: getEmailFromUser(),
      product: {
        productId: product._id,
        title: product.title,
        image: product.images?.[0],
        quantity,
        unitPrice: price,
        total: price * quantity
      },
      shippingAddress: selectedAddress,
      paymentMethod: "card",
      shipping_type: shippingType,
      shippingFee: shipping,
      tax,
      totalAmount: total,
      paymentStatus: "Paid",
      razorpayPaymentId: paymentId
    });

    toast.success("Order placed successfully!");
    setTimeout(() => {
      window.location.href = `/order/${res.data.orderId}`;
    }, 1500);
  } catch (err) {
    console.error("Order submission failed:", err);
    toast.error("Failed to place order");
  }
};


useEffect(() => {
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      if (!getEmailFromUser()) {
        return;
      }
      const response = await axios.get(`${SERVER_URL}/api/getAddresses`, {
        params: {
          userId: getEmailFromUser()
        }
      });
      console.log("response",response.data);
      setAddresses(response.data.data || []);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  fetchAddresses();
}, [getEmailFromUser]);

  const subtotal = price * quantity;;
  const shipping = 1;
  let taxPercentage = 0;
  if (product && product.category) {
    const taxRateString = getTaxRate(product.category, product.subCategory);
    if (taxRateString) {
      const match = taxRateString.match(/(\d+)%/);
      if (match && match[1]) {
        taxPercentage = parseFloat(match[1]) / 100;
      } else if (taxRateString === "0%") {
        taxPercentage = 0;
      }
    }
  }
  const tax = subtotal * taxPercentage;
  const total = subtotal + shipping + tax;

  // const handlePlaceOrder = () => {
  //   const orderId = `ORD-${Date.now()}`;
  //   setLocation(`/order-confirmation/${orderId}`);
  // };
  const normalizedAddresses = Array.isArray(addresses) ? addresses : (addresses ? [addresses] : []);
  console.log("normal",normalizedAddresses);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ToastContainer />
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-heading)]">Checkout</h1>
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
                
                {isloading ? <p>Loading...</p> : normalizedAddresses?.map((address) => (
                  <div key={address._id} className="flex items-start space-x-3">
                    <RadioGroupItem value={address._id} id={address._id} className="mt-1" />
                    <Label htmlFor={address._id} className="flex-1 cursor-pointer">
                      <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-slate-900">{address?.name}</div>
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
                className="w-full bg-[var(--color-primary)] text-[var(--color-heading)]"
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
                        <SelectItem value="AP">Andhra Pradesh</SelectItem>
                        <SelectItem value="AR">Arunachal Pradesh</SelectItem>
                        <SelectItem value="AS">Assam</SelectItem>
                        <SelectItem value="BR">Bihar</SelectItem>
                        <SelectItem value="CT">Chhattisgarh</SelectItem>
                        <SelectItem value="GA">Goa</SelectItem>
                        <SelectItem value="GJ">Gujarat</SelectItem>
                        <SelectItem value="HR">Haryana</SelectItem>
                        <SelectItem value="HP">Himachal Pradesh</SelectItem>
                        <SelectItem value="JH">Jharkhand</SelectItem>
                        <SelectItem value="KA">Karnataka</SelectItem>
                        <SelectItem value="KL">Kerala</SelectItem>
                        <SelectItem value="MP">Madhya Pradesh</SelectItem>
                        <SelectItem value="MH">Maharashtra</SelectItem>
                        <SelectItem value="MN">Manipur</SelectItem>
                        <SelectItem value="ML">Meghalaya</SelectItem>
                        <SelectItem value="MZ">Mizoram</SelectItem>
                        <SelectItem value="NL">Nagaland</SelectItem>
                        <SelectItem value="OD">Odisha</SelectItem>
                        <SelectItem value="PB">Punjab</SelectItem>
                        <SelectItem value="RJ">Rajasthan</SelectItem>
                        <SelectItem value="SK">Sikkim</SelectItem>
                        <SelectItem value="TN">Tamil Nadu</SelectItem>
                        <SelectItem value="TG">Telangana</SelectItem>
                        <SelectItem value="TR">Tripura</SelectItem>
                        <SelectItem value="UP">Uttar Pradesh</SelectItem>
                        <SelectItem value="UT">Uttarakhand</SelectItem>
                        <SelectItem value="WB">West Bengal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={newAddress.zipCode}
                        onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        placeholder="411044"
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
                    <Button size="sm" onClick={() => addAddress(newAddress)}>Save Address</Button>
                    <Button className="bg-[var(--color-primary)] text-[var(--color-heading)]" variant="outline" size="sm" onClick={() => setShowNewAddressForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Select Delivery Type</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={shippingType} onValueChange={setShippingType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Priority">Priority</SelectItem>
                    <SelectItem value="Express">Express</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
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
                {product && (
                  <div className="flex space-x-3">
                    <img src={product.images?.[0]} alt={product.title} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 truncate">{product.title}</h4>
                      <p className="text-xs text-slate-500">{product.manufacturerEmail}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-slate-600">Qty: {quantity}</span>
                        <span className="text-sm font-medium">
                          ₹{(price * quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Truck className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{product.leadTime || "Lead time not available"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span>Rs.{shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (GST{taxPercentage * 100}%)</span>
                  <span>Rs.{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">Rs.{total.toFixed(2)}</span>
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
                  onClick={handleRazorpayPayment}
                >
                  Pay Now
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