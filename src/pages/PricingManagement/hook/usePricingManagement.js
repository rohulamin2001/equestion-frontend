import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";

export const usePricingManagement = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch packages
  const packagesQuery = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const res = await apiClient.get("/subscriptions/packages");
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

  // Update Package Price
  const updatePackagePriceMutation = useMutation({
    mutationFn: async ({ id, basePrice }) => {
      const token = await getToken();
      const res = await apiClient.put(
        `/subscriptions/admin/packages/${id}`,
        { basePrice },
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

  return {
    packages:
      packagesQuery.data?.packages ||
      (Array.isArray(packagesQuery.data) ? packagesQuery.data : []),
    loadingPackages: packagesQuery.isLoading,
    refetchPackages: packagesQuery.refetch,

    discounts: discountsQuery.data || [],
    loadingDiscounts: discountsQuery.isLoading,
    refetchDiscounts: discountsQuery.refetch,

    updatePackagePrice: updatePackagePriceMutation,
    saveDiscount: saveDiscountMutation,
    deleteDiscount: deleteDiscountMutation,
  };
};
