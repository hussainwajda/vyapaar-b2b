import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../../context/AuthContext"

export default function OrderDetailsPage() {
  const { id: orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const ServerUrl = import.meta.env.VITE_SERVER_URL
  const { getEmailFromUser } = useAuth()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/order/${orderId}`)
        console.log(res.data)
        setOrder(res.data.order)

        if (res.data?.product?.productId) {
          const productRes = await axios.get(`${ServerUrl}/api/products/${res.data.product.productId}`)
          setProduct(productRes.data)
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err)
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const formattedDate = order?.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy") : "N/A"

  const formatPrice = (amount) => {
    if (!amount) return "₹0.00"
    const value =
      typeof amount === "object" && "$numberDecimal" in amount
        ? amount.$numberDecimal
        : amount
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h3 className="text-lg font-medium">Order not found</h3>
        <p className="text-muted-foreground">We couldn’t find the order you're looking for.</p>
        <Link to="/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto my-6 py-6 px-4 max-w-7xl rounded-lg bg-[var(--color-primary)] text-[var(--color-heading)]">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:underline">Your Account</Link>
        <span className="mx-2">›</span>
        <Link to="/my-orders" className="hover:underline">Your Orders</Link>
        <span className="mx-2">›</span>
        <span>Order Details</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>Order placed {formattedDate}</span>
            <span>Order number {order._id}</span>
          </div>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          Invoice <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Ship to</h3>
                <p className="text-sm text-muted-foreground">Address ID: {order.shippingAddress}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {order.paymentMethod?.replace("-", " ")}
                  {order.razorpayDetails?.method && <div>via {order.razorpayDetails.method}</div>}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{formatPrice(order.product.total)}</span></div>
                  <div className="flex justify-between"><span>Shipping:</span><span>{formatPrice(order.shippingFee || 0)}</span></div>
                  <div className="flex justify-between"><span>Tax:</span><span>{formatPrice(order.tax || 0)}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium"><span>Total:</span><span>{formatPrice(order.totalAmount)}</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-medium">
                    {order.status === "Delivered" ? `Delivered ${formattedDate}` : order.status}
                  </h2>
                  <Badge variant={order.status === "Delivered" ? "success" : "outline"}>{order.shippingStatus}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {order.status === "Delivered" ? "Package was delivered" : `${order.status} - ${order.shippingStatus}`}
                </p>
                {order.trackingNumber && <p className="text-sm mt-1 text-muted-foreground">Tracking: {order.trackingNumber}</p>}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex gap-4">
                  {order.product?.image ? (
                    <Link to={`/product/${order.product.productId}`} className="w-[150px] h-[150px] bg-muted rounded-md flex items-center justify-center">
                        <img src={order.product.image} alt={order.product.title} width={120} height={120} className="object-cover rounded-md" />
                    </Link>
                  ) : (
                    <div className="w-[120px] h-[120px] bg-muted rounded-md flex items-center justify-center">No image</div>
                  )}
                  <div>
                    <Link to={`/product/${order.product.productId}`} className="font-medium hover:underline block mb-1">
                      {order.product.title}
                    </Link>
                    {product?.manufacturerEmail && (
                      <p className="text-sm text-muted-foreground mb-1">Sold by: {product.manufacturerEmail}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Quantity: {order.product.quantity}</p>
                    <p className="font-medium mt-1">{formatPrice(order.product.unitPrice)}</p>
                  </div>
                </div>

                <div className="flex flex-col text-[var(--color-heading)] gap-2 md:min-w-[200px]">
                  <Button variant="outline">Track package</Button>
                  <Button variant="outline">Return items</Button>
                  <Button variant="outline">Leave feedback</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-right">
              <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
              <p className="text-lg font-medium text-red-600">{formatPrice(order.totalAmount)}</p>
              <p className="text-xs text-muted-foreground mt-2">Part of your order qualifies for FREE delivery.</p>
              <Link to="#" className="text-xs text-primary hover:underline">Details</Link>
              <Button className="w-full mt-4">Go to Cart</Button>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}
