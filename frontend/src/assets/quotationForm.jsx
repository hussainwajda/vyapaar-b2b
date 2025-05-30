import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
export default function RequestQuotationForm({ product }) {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getEmailFromUser } = useAuth();
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
  
  const [formData, setFormData] = useState({
    senderId: getEmailFromUser(),
    senderName: "",
    message: "",
    productInterest: product?.title || "",
    quantity: product?.minOrderQuantity || 1,
    budget: "",
    deliveryLocation: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if(getEmailFromUser == null) {
      toast({
        title: "Error",
        description: "User not logged in",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return
    }
    
    try {
      const response = await fetch(`${ServerUrl}/api/quotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId
        })
      });

      if (!response.ok) throw new Error("Failed to submit quotation request");

      toast({
        title: "Request Submitted",
        description: "Your quotation request has been sent successfully.",
      });
      
      navigate(-1); // Go back to previous page
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ToastContainer />
      <Card>
        <CardHeader>
          <CardTitle>Request Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="senderName">Your Company Name</Label>
              <Input
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productInterest">Product of Interest</Label>
              <Input
                id="productInterest"
                name="productInterest"
                value={formData.productInterest}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity Needed</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                min={product?.minOrderQuantity || 1}
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget</Label>
              <Input
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g. Rs.200,000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryLocation">Delivery Location</Label>
              <Input
                id="deliveryLocation"
                name="deliveryLocation"
                value={formData.deliveryLocation}
                onChange={handleChange}
                placeholder="e.g. Pune, Maharashtra, India"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Requirements</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end gap-4 text-[var(--color-heading)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}