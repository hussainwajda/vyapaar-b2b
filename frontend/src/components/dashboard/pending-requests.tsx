import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "../../context/AuthContext";

type Request = {
  id: number;
  senderId: number;
  message: string;
  status: string;
};

export default function PendingRequests() {
  const ServerUrl = "http://localhost:3001";
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const user = useAuth();
  const email = user?.UserAttributes[0]?.Value;

  // Fetch requests with useEffect
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/requests/received`, {
          email: email
        });
        setRequests(res.data || []);
      } catch (error) {
        console.error("Failed to load requests", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Mutation to update request status
  const updateRequestMutation = useMutation({
  mutationFn: ({ id, status }: { id: number; status: string }) =>
    axios.patch(`${ServerUrl}/api/requests/${id}`, { status }),

  onSuccess: (_, variables) => {
    // Optimistically update local state
    setRequests((prev) =>
      prev.map((r) =>
        r.id === variables.id ? { ...r, status: variables.status } : r
      )
    );
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    toast({
      title: "Request Updated",
      description: "Request status has been updated successfully.",
    });
  },

  onError: () => {
    toast({
      title: "Error",
      description: "Failed to update request status.",
      variant: "destructive",
    });
  },
});

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-900">
          Pending Requests
        </CardTitle>
        <Link
          href="/requests"
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : pendingRequests.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No pending requests
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.slice(0, 3).map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" alt="Company logo" />
                    <AvatarFallback>
                      {`${request.senderId}`.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Request from Manufacturer #{request.senderId}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-xs">
                      {request.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() =>
                      updateRequestMutation.mutate({
                        id: request.id,
                        status: "accepted",
                      })
                    }
                    disabled={updateRequestMutation.isPending}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    onClick={() =>
                      updateRequestMutation.mutate({
                        id: request.id,
                        status: "rejected",
                      })
                    }
                    disabled={updateRequestMutation.isPending}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
