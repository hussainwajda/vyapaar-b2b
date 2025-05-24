export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  pendingRequests: number;
  newInquiries: number;
  unreadNotifications: number;
  totalRevenue: number;
  lowStockProducts: number;
}

export interface ActivityItem {
  id: string;
  type: 'product_added' | 'request_received' | 'inquiry_received' | 'low_stock' | 'order_completed';
  icon: string;
  iconBg: string;
  description: string;
  timestamp: string;
}
