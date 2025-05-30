import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import axios from "axios"
import { format } from "date-fns"
import { ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useAuth } from "../../context/AuthContext"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState("past 3 months")
  const ServerUrl = import.meta.env.VITE_SERVER_URL;

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const {getEmailFromUser} = useAuth();
  const userEmail = getEmailFromUser();

  useEffect(() => {
    const getOrdersandproduct = async () => {
      try {
        const response = await axios.get(`${ServerUrl}/api/orders?email=${encodeURIComponent(userEmail)}`)
        console.log(response)
        const sortedOrders = response.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setOrders(sortedOrders)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    getOrdersandproduct()
  }, [userEmail])

  const filteredOrders = orders.filter((order) =>
    order.product.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">
            Your Account
          </Link>
          <span className="mx-2">›</span>
          <span>Your Orders</span>
        </div>

        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid grid-cols-4 max-w-md">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="buy-again">Buy Again</TabsTrigger>
              <TabsTrigger value="not-shipped">Not Yet Shipped</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled Orders</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search all orders"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="default">Search Orders</Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="font-medium">{filteredOrders.length} orders</span>
          <span>placed in</span>
          <Button variant="outline" className="flex items-center gap-2">
            {timeFilter}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders?.length > 0 ? (
          <div className="flex flex-col gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard(order) {
  console.log(order?.order.createdAt);
  const formattedDate = order?.order.createdAt ? format(new Date(order.order.createdAt), "dd MMM yyyy") : "Nan";
 
  const displayPrice = order.order.totalAmount && typeof order.order.totalAmount === 'object' && '$numberDecimal' in order.order.totalAmount
    ? order.order.totalAmount.$numberDecimal
    ? order.order.totalAmount.$numberDecimal
    : order.order.totalAmount 
    : order.order.totalAmount;

  return (
    <Card className="overflow-hidden bg-[var(--color-primary)] text-[var(--color-heading)]">
      <div className="bg-[var(--color-primary)] p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">ORDER PLACED</div>
          <div>{formattedDate}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">TOTAL</div>
          <div>Rs.{displayPrice}</div>
        </div>
        <div className="flex flex-col md:items-end">
          <div className="text-xs text-muted-foreground">ORDER # {order.order._id}</div>
          <div className="flex gap-2">
            <Button variant="link" className="p-0 h-auto text-[var(--color-heading)]">
              <Link to={`/order/${order.order._id}`}>View order details</Link>
            </Button>
            <Button variant="link" className="p-0 h-auto text-[var(--color-heading)]">
              Invoice <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="font-medium text-lg">
            {order.order.status === "Delivered" ? <>Delivered {formattedDate}</> : <>{order.order.status}</>}
          </div>
          <div className="text-muted-foreground">
            {order.order.status === "Delivered"
              ? "Package was delivered"
              : `${order.order.status} - ${order.order.shippingStatus}`}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4">
            {order.order?.product?.image ? (
              <img
                src={order?.order?.product?.image}
                alt={order.order.product.title}
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-[100px] h-[100px] bg-muted rounded-md flex items-center justify-center">
                No image
              </div>
            )}
            <div className="flex flex-col">
              <Link
                to={`/product/${order?.order?.product?.productId}`}
                className="font-medium hover:text-red hover:underline line-clamp-2"
              >
                {order?.order.product?.title}
              </Link>
              <div className="text-sm text-muted-foreground mt-1">
                Quantity: {order?.order.product?.quantity}
              </div>
              {order.order.paymentStatus && (
                <Badge
                  variant={order.order.paymentStatus === "Completed" ? "success" : "outline"}
                  className="mt-2 w-fit"
                >
                  {order.order.paymentStatus}
                </Badge>
              )}
            </div>
          </div>

          {/* <div className="flex flex-col md:flex-row gap-2 md:ml-auto">
            <Button variant="outline">Track package</Button>
            <Button variant="outline">Return items</Button>
            <Button variant="outline">Leave feedback</Button>
          </div> */}
        </div>
      </div>
    </Card>
  )
}
