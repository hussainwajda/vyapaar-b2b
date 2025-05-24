import { useNotifications } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck, Bell, Package, Handshake, Mail, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const getNotificationIcon = (type) => {
  switch (type) {
    case "product_added":
      return Package;
    case "request_received":
      return Handshake;
    case "inquiry_received":
      return Mail;
    case "low_stock":
      return AlertTriangle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "product_added":
      return "text-blue-600 bg-blue-100";
    case "request_received":
      return "text-green-600 bg-green-100";
    case "inquiry_received":
      return "text-purple-600 bg-purple-100";
    case "low_stock":
      return "text-yellow-600 bg-yellow-100";
    default:
      return "text-slate-600 bg-slate-100";
  }
};

export default function Notifications() {
  const [ notifications, setNotifications] = useState([]);
  const { toast } = useToast();
  const { getEmailFromUser } = useAuth();
  const email = getEmailFromUser();
  const [isLoading, setIsLoading] = useState(true); 
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/manufacturer/notifications", {
          params: { email: email }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading notifications...</div>
      </div>
    );
  }

  const unreadNotifications = notifications?.filter(n => !n.isRead) || [];
  const readNotifications = notifications?.filter(n => n.isRead) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Stay updated with your business activities</p>
        </div>
        {unreadNotifications.length > 0 && (
          <Button
            variant="outline"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Unread Notifications</span>
              <Badge variant="destructive">{unreadNotifications.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {unreadNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div key={notification.id} className="p-6 bg-blue-50/50">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900">{notification.title}</h3>
                        <p className="text-slate-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsReadMutation.mutate(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Read Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>
            {unreadNotifications.length > 0 ? "Previous Notifications" : "All Notifications"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(unreadNotifications.length === 0 ? notifications : readNotifications)?.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg mb-2">No notifications</p>
              <p className="text-sm">You're all caught up! No notifications to show.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {(unreadNotifications.length === 0 ? notifications : readNotifications)?.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <div key={notification.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900">{notification.title}</h3>
                        <p className="text-slate-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {notification.isRead && (
                        <div className="text-green-600">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}