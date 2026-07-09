import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import apiClient from "../../../lib/apiClient";

export const useSubscription = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch packages & coupons
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

  // Fetch active subscriptions
  const mySubscriptionsQuery = useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: async () => {
      const token = await getToken();
      const res = await apiClient.get("/subscriptions/my-subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.subscriptions || [];
    },
  });

  // Validate coupon code
  const validateCouponMutation = useMutation({
    mutationFn: async ({ code, packageId, version, cartTotal }) => {
      const token = await getToken();
      const res = await apiClient.post(
        "/subscriptions/validate-coupon",
        { code, packageId, version, cartTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.coupon;
    },
  });

  // Purchase subscription
  const purchaseSubscriptionMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const res = await apiClient.post(
        "/subscriptions/purchase",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
    },
  });

  return {
    packages: packagesQuery.data?.packages || [],
    coupons: packagesQuery.data?.coupons || [],
    loadingPackages: packagesQuery.isLoading,
    refetchPackages: packagesQuery.refetch,

    mySubscriptions: mySubscriptionsQuery.data || [],
    loadingSubscriptions: mySubscriptionsQuery.isLoading,
    refetchSubscriptions: mySubscriptionsQuery.refetch,

    validateCoupon: validateCouponMutation,
    purchaseSubscription: purchaseSubscriptionMutation,
  };
};
