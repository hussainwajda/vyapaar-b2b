import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, Calendar } from "lucide-react";

// Revenue data over time
const revenueData = [
  { month: "Jan", revenue: 45000, orders: 12, quotations: 25 },
  { month: "Feb", revenue: 52000, orders: 15, quotations: 30 },
  { month: "Mar", revenue: 48000, orders: 14, quotations: 28 },
  { month: "Apr", revenue: 61000, orders: 18, quotations: 35 },
  { month: "May", revenue: 55000, orders: 16, quotations: 32 },
  { month: "Jun", revenue: 67000, orders: 21, quotations: 40 },
  { month: "Jul", revenue: 73000, orders: 24, quotations: 45 },
  { month: "Aug", revenue: 69000, orders: 22, quotations: 42 },
  { month: "Sep", revenue: 78000, orders: 26, quotations: 48 },
  { month: "Oct", revenue: 82000, orders: 28, quotations: 52 },
  { month: "Nov", revenue: 89000, orders: 31, quotations: 58 },
  { month: "Dec", revenue: 95000, orders: 35, quotations: 65 }
];

// Product performance data
const productPerformance = [
  { product: "Precision Lathe", sales: 89000, units: 12, margin: "24%" },
  { product: "Control Boards", sales: 45000, units: 150, margin: "31%" },
  { product: "Brake Assembly", sales: 62000, units: 85, margin: "18%" },
  { product: "CNC Parts", sales: 38000, units: 95, margin: "28%" },
  { product: "Electronics", sales: 29000, units: 120, margin: "35%" }
];

// Customer segments
const customerSegments = [
  { name: "Automotive", value: 35, revenue: 180000, color: "#8B5CF6" },
  { name: "Electronics", value: 28, revenue: 145000, color: "#06B6D4" },
  { name: "Industrial", value: 22, revenue: 115000, color: "#10B981" },
  { name: "Aerospace", value: 15, revenue: 78000, color: "#F59E0B" }
];

// Conversion funnel
const conversionData = [
  { stage: "Website Visits", count: 12500, percentage: 100 },
  { stage: "Product Views", count: 8200, percentage: 66 },
  { stage: "Quotation Requests", count: 1850, percentage: 15 },
  { stage: "Quotations Sent", count: 1620, percentage: 13 },
  { stage: "Orders Placed", count: 285, percentage: 2.3 }
];

// Geographic performance
const geographicData = [
  { region: "North America", orders: 145, revenue: 285000, growth: "+12%" },
  { region: "Europe", orders: 89, revenue: 178000, growth: "+8%" },
  { region: "Asia Pacific", orders: 76, revenue: 152000, growth: "+15%" },
  { region: "Latin America", orders: 34, revenue: 68000, growth: "+6%" }
];

export default function Analytics() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const revenueGrowth = ((revenueData[11].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Business Analytics</h1>
          <p className="text-sm text-slate-500">Comprehensive insights into your manufacturing business performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="12months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{revenueGrowth}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">+18%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-slate-900">${avgOrderValue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">-3%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Customers</p>
                <p className="text-2xl font-bold text-slate-900">1,284</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Orders Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#06B6D4" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionData.map((stage, index) => (
              <div key={stage.stage} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium text-slate-700">
                  {stage.stage}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                    <span className="text-sm font-medium text-slate-900">
                      {stage.count.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {stage.percentage}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {geographicData.map((region) => (
              <div key={region.region} className="p-4 border rounded-lg">
                <h3 className="font-medium text-slate-900 mb-2">{region.region}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Orders</span>
                    <span className="text-sm font-medium">{region.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Revenue</span>
                    <span className="text-sm font-medium">${region.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Growth</span>
                    <Badge variant="outline" className="text-xs text-green-600">
                      {region.growth}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
