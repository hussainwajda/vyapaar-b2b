import { useQuery } from "@tanstack/react-query";
import type { DashboardStats } from "@/lib/types";
import type { Product, Request, Message, Notification } from "../shared/schema";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
}

export function useRequests() {
  return useQuery<Request[]>({
    queryKey: ["/api/requests/received"],
  });
}

export function useMessages() {
  return useQuery<Message[]>({
    queryKey: ["/api/messages/received"],
  });
}

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });
}
