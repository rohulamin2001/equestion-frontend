import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "../../../lib/apiClient";

export const usePricingManagement = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [subscribersPage, setSubscribersPage] = useState(1);
  const [subscribersSearch, setSubscribersSearch] = useState("");

  // Fetch packages
  const packagesQuery = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await apiClient.get("/subscriptions/packages?all=true");
      return {
        packages: res.data.packages || [],
        coupons: res.data.coupons || [],
      };
    },
  });

  // Fetch admin discounts/coupons
  const discountsQuery = useQuery({
    queryKey: ["adminDiscounts"],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/subscriptions/admin/discounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.discounts || [];
    },
  });

  // Update Package (Price or Status)
  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, basePrice, isActive }) => {
      const token = await getToken();
      const payload = {};
      if (basePrice !== undefined) payload.basePrice = basePrice;
      if (isActive !== undefined) payload.isActive = isActive;
      const res = await apiClient.put(
        `/subscriptions/admin/packages/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });

  // Save (Create or Update) Discount
  const saveDiscountMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const token = await getToken();
      if (id) {
        const res = await apiClient.put(
          `/subscriptions/admin/discounts/${id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return res.data;
      } else {
        const res = await apiClient.post(
          "/subscriptions/admin/discounts",
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscounts"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });

  // Delete Discount
  const deleteDiscountMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      const res = await apiClient.delete(
        `/subscriptions/admin/discounts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDiscounts"] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });

  // Fetch subscribers (for admin) - paginated and searchable
  const subscribersQuery = useQuery({
    queryKey: ["subscribers", subscribersPage, subscribersSearch],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/subscriptions/subscribers", {
        params: {
          page: subscribersPage,
          limit: 10,
          search: subscribersSearch,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        subscribers: res.data.subscribers || [],
        total: res.data.total || 0,
        pages: res.data.pages || 1,
        currentPage: res.data.currentPage || 1,
      };
    },
  });

  // Toggle subscription suspension (for admin)
  const toggleSuspensionMutation = useMutation({
    mutationFn: async ({ userId, subscriptionId, isSuspended }) => {
      const token = await getToken();
      const res = await apiClient.put(
        `/subscriptions/subscribers/${userId}/suspend`,
        { subscriptionId, isSuspended },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  // Remove subscription (for super admin)
  const removeSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, subscriptionId }) => {
      const token = await getToken();
      const res = await apiClient.delete(
        `/subscriptions/subscribers/${userId}/remove/${subscriptionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    },
  });

  return {
    packages:
      packagesQuery.data?.packages ||
      (Array.isArray(packagesQuery.data) ? packagesQuery.data : []),
    loadingPackages: packagesQuery.isLoading,
    refetchPackages: packagesQuery.refetch,

    discounts: discountsQuery.data || [],
    loadingDiscounts: discountsQuery.isLoading,
    refetchDiscounts: discountsQuery.refetch,

    subscribers: subscribersQuery.data?.subscribers || [],
    subscribersTotal: subscribersQuery.data?.total || 0,
    subscribersPages: subscribersQuery.data?.pages || 1,
    subscribersCurrentPage: subscribersQuery.data?.currentPage || 1,
    loadingSubscribers: subscribersQuery.isLoading,
    refetchSubscribers: subscribersQuery.refetch,

    subscribersPage,
    setSubscribersPage,
    subscribersSearch,
    setSubscribersSearch,

    updatePackage: updatePackageMutation,
    saveDiscount: saveDiscountMutation,
    deleteDiscount: deleteDiscountMutation,
    toggleSuspension: toggleSuspensionMutation,
    removeSubscription: removeSubscriptionMutation,
  };
};
