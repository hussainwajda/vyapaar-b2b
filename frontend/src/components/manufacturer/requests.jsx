import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

// Mock data for quotation requests
const mockRequests = [
  {
    id: 1,
    senderId: 2,
    senderName: "TechCorp Industries",
    message: "We are interested in bulk ordering precision lathe machines for our new manufacturing facility. Please provide quotation for 10 units.",
    productInterest: "Industrial Precision Lathe Machine",
    quantity: 10,
    status: "pending",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    budget: "$125,000",
    deliveryLocation: "Texas, USA"
  },
  {
    id: 2,
    senderId: 3,
    senderName: "Global Electronics Ltd",
    message: "Looking for electronic control boards PCB for our upcoming project. Need competitive pricing for bulk orders.",
    productInterest: "Electronic Control Board PCB",
    quantity: 500,
    status: "pending",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    budget: "$45,000",
    deliveryLocation: "California, USA"
  },
  {
    id: 3,
    senderId: 4,
    senderName: "AutoParts Manufacturing",
    message: "Require quotation for automotive brake assemblies. We are a certified automotive supplier looking for reliable partners.",
    productInterest: "Automotive Brake Assembly",
    quantity: 200,
    status: "approved",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    budget: "$49,000",
    deliveryLocation: "Michigan, USA"
  },
  {
    id: 4,
    senderId: 5,
    senderName: "Industrial Solutions Inc",
    message: "We need industrial equipment for our new facility expansion. Please provide detailed quotation with specifications.",
    productInterest: "Heavy Machinery",
    quantity: 5,
    status: "approved",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    budget: "$200,000",
    deliveryLocation: "Ohio, USA"
  }
];

export default function Requests() {
  const [selectedTab, setSelectedTab] = useState("all");

  const allRequests = mockRequests;
  const unreadRequests = mockRequests.filter(r => !r.isRead);
  const approvedRequests = mockRequests.filter(r => r.status === "approved");

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      case "contacted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Contacted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const RequestCard = ({ request }) => (
    <Card key={request.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt="Sender" />
              <AvatarFallback>
                {`${request.senderId}`.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-slate-900">
                  Request from Manufacturer #{request.senderId}
                </h3>
                {getStatusBadge(request.status)}
              </div>
              <p className="text-slate-600 mb-3">{request.message}</p>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {request.status === "pending" && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                onClick={() => updateRequestMutation.mutate({ id: request.id, status: "accepted" })}
                disabled={updateRequestMutation.isPending}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                onClick={() => updateRequestMutation.mutate({ id: request.id, status: "rejected" })}
                disabled={updateRequestMutation.isPending}
              >
                Decline
              </Button>
            </div>
          )}
          
          {request.status === "accepted" && (
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              onClick={() => updateRequestMutation.mutate({ id: request.id, status: "contacted" })}
              disabled={updateRequestMutation.isPending}
            >
              Mark as Contacted
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getRequestsForTab = (tab) => {
    switch (tab) {
      case "all":
        return allRequests;
      case "unread":
        return unreadRequests;
      case "approved":
        return approvedRequests;
      default:
        return allRequests;
    }
  };

  const currentRequests = getRequestsForTab(selectedTab);

  const QuotationRequestCard = ({ request }) => (
    <Card key={request.id} className="mb-4 bg-[var(--color-heading)] neon-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt="Company" />
              <AvatarFallback>
                {request.senderName.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-slate-900">{request.senderName}</h3>
                {getStatusBadge(request.status)}
                {!request.isRead && (
                  <Badge variant="destructive" className="text-xs">New</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-slate-500">Product Interest</p>
                  <p className="text-sm font-medium text-slate-700">{request.productInterest}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Quantity</p>
                  <p className="text-sm font-medium text-slate-700">{request.quantity.toLocaleString()} units</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Budget</p>
                  <p className="text-sm font-medium text-slate-700">{request.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Delivery Location</p>
                  <p className="text-sm font-medium text-slate-700">{request.deliveryLocation}</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-3">{request.message}</p>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {request.status === "pending" && (
            <div className="flex space-x-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quotation Requests</h1>
        <p className="text-sm text-slate-500">Manage incoming quotation requests from potential buyers</p>
      </div>

      {/* Requests Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All ({allRequests.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          {currentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-slate-500">
                  <p className="text-lg mb-2">No {selectedTab} requests</p>
                  <p className="text-sm">
                    {selectedTab === "all" 
                      ? "You have no quotation requests at the moment." 
                      : `You have no ${selectedTab} quotation requests.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {currentRequests.map((request) => (
                <QuotationRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
