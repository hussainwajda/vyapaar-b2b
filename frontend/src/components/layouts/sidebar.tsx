
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Box, 
  FileText, 
  Mail, 
  Bell, 
  Settings, 
  Factory,
  ShoppingCart,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { set } from "react-hook-form";

const navigation = [
  { name: "Dashboard", href: "/manufacturer/dashboard", icon: BarChart3 },
  { name: "Products", href: "/manufacturer/products", icon: Box },
  { name: "Quotation Requests", href: "/manufacturer/requests", icon: FileText },
  { name: "Orders", href: "/manufacturer/orders", icon: ShoppingCart },
  { name: "Messages", href: "/manufacturer/messages", icon: Mail },
  { name: "Analytics", href: "/manufacturer/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/manufacturer/notifications", icon: Bell },
  { name: "Settings", href: "/manufacturer/settings", icon: Settings },
];

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { user, getEmailFromUser } = useAuth();
  const userEmail = getEmailFromUser();
  const ServerUrl = "http://localhost:3001";  
  const [manufacturer, setManufacturer] = useState(null);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (userEmail) {
         // Fetch manufacturer profile
        const manufacturerRes = await axios.get(`${ServerUrl}/api/manufacturerProfile`, {
          params: { email: userEmail }
        });

        if (!manufacturerRes.data || manufacturerRes.data.status !== 200) {
          throw new Error(manufacturerRes.data.message || "Invalid manufacturer data");
        }

        setManufacturer(manufacturerRes.data.data);
        
        // Fetch requests
        const requestsRes = await axios.get(`${ServerUrl}/api/requests`, { params: { email: userEmail } });
        if (!requestsRes.data || requestsRes.data.status !== 200) {
          throw new Error(requestsRes.data.message || "Invalid manufacturer data");
        }
        setRequests(requestsRes.data.data);
        
        // // Fetch messages
        const messagesRes = await axios.get(`${ServerUrl}/api/messages`, { params: { email: userEmail } });
        if (!messagesRes.data || messagesRes.data.status !== 200) {
          throw new Error(messagesRes.data.message || "Invalid manufacturer data");
        }
        setMessages(messagesRes.data.data);
        
        // // Fetch notifications
        const notificationsRes = await axios.get(`${ServerUrl}/api/notifications`, { params: { email: userEmail } });  
        if (!notificationsRes.data || notificationsRes.data.status !== 200) {
          throw new Error(notificationsRes.data.message || "Invalid manufacturer data");
        }
        setNotifications(notificationsRes.data.data); 
        }
        
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching sidebar data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  const pendingRequests = requests?.filter(r => r.status === "pending").length || 0;
  const unreadMessages = messages?.filter(m => !m.isRead).length || 0;
  const unreadNotifications = notifications?.filter(n => !n.isRead).length || 0;

  const getBadgeCount = (name) => {
    switch (name) {
      case "Quotation Requests":
        return pendingRequests;
      case "Messages":
        return unreadMessages;
      case "Notifications":
        return unreadNotifications;
      case "Orders":
        return 5; // Mock count for now
      default:
        return 0;
    }
  };

  if (error) {
    return (
      <aside className="flex flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-full p-4 text-red-500">
          Error loading data: {error}
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-shrink-0">
      <div className="flex flex-col w-64 bg-[var(--color-primary)] !text-[var(--color-heading)] border-r border-slate-200 h-full">
        {/* Logo & Company */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Factory className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--color-heading)]">ManufactureHub</h1>
              <p className="text-xs text-slate-500">
                {loading ? "Loading..." : manufacturer?.name || "No company"}
              </p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href; // Correct check
            const badgeCount = getBadgeCount(item.name);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item ${isActive ? "bg-[--color-secondary] text-white" : ""}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
                {badgeCount > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {badgeCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={manufacturer?.logo_url || ""} alt="User avatar" />
              <AvatarFallback>
                {manufacturer?.contactPerson?.split(' ').map(n => n[0]).join('') || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium uppercase text-red-900 truncate">
                {loading ? "Loading..." : manufacturer?.contact_person?.name || "Unknown"}
              </p>
              <p className="text-xs text-slate-500 truncate">Manufacturing Director</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}