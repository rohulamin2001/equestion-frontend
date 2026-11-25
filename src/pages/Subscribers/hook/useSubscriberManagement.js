import apiClient from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useSubscriberManagement() {
  const queryClient = useQueryClient();

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [versionFilter, setVersionFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Selection & Detail Drawer
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeSubscriberId, setActiveSubscriberId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page & selection when filters change
  const updateFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedIds([]);
  };

  const resetAllFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setUserTypeFilter("all");
    setVersionFilter("all");
    setPackageFilter("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("newest");
    setPage(1);
    setSelectedIds([]);
  };

  // 1. Subscribers List Query
  const subscribersQuery = useQuery({
    queryKey: [
      "adminSubscribers",
      page,
      debouncedSearch,
      statusFilter,
      userTypeFilter,
      versionFilter,
      packageFilter,
      dateFrom,
      dateTo,
      sortBy,
    ],
    queryFn: async () => {
      const res = await apiClient.get("/admin/subscribers", {
        params: {
          page,
          limit: 15,
          search: debouncedSearch,
          status: statusFilter,
          userType: userTypeFilter,
          version: versionFilter,
          packageId: packageFilter,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
          sortBy,
        },
      });
      return res.data;
    },
  });

  // 2. Single Subscriber Details Query (for Detail Drawer)
  const detailsQuery = useQuery({
    queryKey: ["adminSubscriberDetails", activeSubscriberId],
    queryFn: async () => {
      const res = await apiClient.get(`/admin/subscribers/${activeSubscriberId}`);
      return res.data;
    },
    enabled: Boolean(activeSubscriberId),
  });

  // 3. Academic Config & Subjects (for Assign Subscription Modal)
  const academicQuery = useQuery({
    queryKey: ["academicConfig"],
    queryFn: async () => {
      const res = await apiClient.get("/academic-config");
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const subjectsQuery = useQuery({
    queryKey: ["allSubjectsForAssign"],
    queryFn: async () => {
      const res = await apiClient.get("/subjects");
      return res.data?.subjects || res.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const invalidateSubscriberQueries = (userId) => {
    queryClient.invalidateQueries({ queryKey: ["adminSubscribers"] });
    if (userId) {
      queryClient.invalidateQueries({
        queryKey: ["adminSubscriberDetails", userId],
      });
    }
  };

  // Mutations
  const assignSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, payload }) => {
      const res = await apiClient.post(
        `/admin/subscribers/${userId}/subscriptions`,
        payload,
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "সাবস্ক্রিপশন বরাদ্দ করা হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "সাবস্ক্রিপশন বরাদ্দ ব্যর্থ হয়েছে");
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, subscriptionId, payload }) => {
      const res = await apiClient.patch(
        `/admin/subscribers/${userId}/subscriptions/${subscriptionId}`,
        payload,
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "সাবস্ক্রিপশন আপডেট করা হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "সাবস্ক্রিপশন আপডেট ব্যর্থ হয়েছে");
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, subscriptionId }) => {
      const res = await apiClient.delete(
        `/admin/subscribers/${userId}/subscriptions/${subscriptionId}`,
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "সাবস্ক্রিপশন মুছে ফেলা হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "সাবস্ক্রিপশন মোছা যায়নি");
    },
  });

  const toggleAccountStatusMutation = useMutation({
    mutationFn: async ({ userId, isAccountSuspended, reason }) => {
      const res = await apiClient.patch(
        `/admin/subscribers/${userId}/account-status`,
        { isAccountSuspended, reason },
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "অ্যাকাউন্ট স্ট্যাটাস আপডেট হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন করা যায়নি");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, payload }) => {
      const res = await apiClient.patch(
        `/admin/subscribers/${userId}/profile`,
        payload,
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "প্রোফাইল আপডেট হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "প্রোফাইল আপডেট ব্যর্থ হয়েছে");
    },
  });

  const revokeSessionsMutation = useMutation({
    mutationFn: async ({ userId, sessionId }) => {
      const url = sessionId
        ? `/admin/subscribers/${userId}/sessions/${sessionId}`
        : `/admin/subscribers/${userId}/sessions`;
      const res = await apiClient.delete(url);
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "ডিভাইস সেশন বাতিল করা হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "ডিভাইস সেশন বাতিল করা যায়নি");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword, sendViaSms }) => {
      const res = await apiClient.post(
        `/admin/subscribers/${userId}/reset-password`,
        { newPassword, sendViaSms },
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      if (data?.smsWarning) {
        toast.warning(`পাসওয়ার্ড পরিবর্তন হয়েছে, তবে SMS যায়নি: ${data.smsWarning}`);
      } else {
        toast.success(data?.message || "পাসওয়ার্ড রিসেট সফল হয়েছে");
      }
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "পাসওয়ার্ড রিসেট করা যায়নি");
    },
  });

  const reset2FAMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await apiClient.patch(`/admin/subscribers/${userId}/reset-2fa`);
      return res.data;
    },
    onSuccess: (data, userId) => {
      toast.success(data?.message || "2FA রিসেট করা হয়েছে");
      invalidateSubscriberQueries(userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "2FA রিসেট করা যায়নি");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ userId, note }) => {
      const res = await apiClient.post(`/admin/subscribers/${userId}/notes`, {
        note,
      });
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "নোট সংরক্ষণ করা হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "নোট সংরক্ষণ ব্যর্থ হয়েছে");
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async ({ userId, noteId }) => {
      const res = await apiClient.delete(
        `/admin/subscribers/${userId}/notes/${noteId}`,
      );
      return res.data;
    },
    onSuccess: (data, vars) => {
      toast.success(data?.message || "নোট মুছে ফেলা হয়েছে");
      invalidateSubscriberQueries(vars.userId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "নোট মোছা যায়নি");
    },
  });

  const sendSmsMutation = useMutation({
    mutationFn: async ({ userIds, message }) => {
      const res = await apiClient.post("/admin/subscribers/send-sms", {
        userIds,
        message,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.failedCount > 0) {
        toast.warning(data.message);
      } else {
        toast.success(data?.message || "SMS পাঠানো হয়েছে");
      }
      setSelectedIds([]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "SMS পাঠানো যায়নি");
    },
  });

  const bulkExtendMutation = useMutation({
    mutationFn: async ({ userIds, extendDays }) => {
      const res = await apiClient.post("/admin/subscribers/bulk-extend", {
        userIds,
        extendDays,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "বাল্ক মেয়াদ বাড়ানো হয়েছে");
      setSelectedIds([]);
      invalidateSubscriberQueries(activeSubscriberId);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "বাল্ক মেয়াদ বাড়ানো যায়নি");
    },
  });

  const impersonateMutation = useMutation({
    mutationFn: async (userId) => {
      const res = await apiClient.post(`/admin/subscribers/${userId}/impersonate`);
      return res.data;
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "ভিউ-অ্যাজ মোড চালু করা যায়নি");
    },
  });

  // Export CSV Handler
  const [exporting, setExporting] = useState(false);
  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const res = await apiClient.get("/admin/subscribers/export", {
        params: {
          search: debouncedSearch,
          status: statusFilter,
          userType: userTypeFilter,
          version: versionFilter,
          packageId: packageFilter,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        },
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute(
        "download",
        `subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success("CSV ফাইল ডাউনলোড হয়েছে");
    } catch {
      toast.error("CSV এক্সপোর্ট করতে ব্যর্থ হয়েছে");
    } finally {
      setExporting(false);
    }
  };

  return {
    subscribers: subscribersQuery.data?.subscribers || [],
    stats: subscribersQuery.data?.stats || {},
    packages: subscribersQuery.data?.packages || [],
    total: subscribersQuery.data?.total || 0,
    pages: subscribersQuery.data?.pages || 1,
    currentPage: subscribersQuery.data?.currentPage || 1,
    loadingList: subscribersQuery.isLoading,
    fetchingList: subscribersQuery.isFetching,
    listError: subscribersQuery.error,
    refetchList: subscribersQuery.refetch,

    // Filters
    page,
    setPage,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter: updateFilter(setStatusFilter),
    userTypeFilter,
    setUserTypeFilter: updateFilter(setUserTypeFilter),
    versionFilter,
    setVersionFilter: updateFilter(setVersionFilter),
    packageFilter,
    setPackageFilter: updateFilter(setPackageFilter),
    dateFrom,
    setDateFrom: updateFilter(setDateFrom),
    dateTo,
    setDateTo: updateFilter(setDateTo),
    sortBy,
    setSortBy: updateFilter(setSortBy),
    resetAllFilters,

    // Selection & Drawer
    selectedIds,
    setSelectedIds,
    activeSubscriberId,
    setActiveSubscriberId,
    detailsData: detailsQuery.data || null,
    loadingDetails: detailsQuery.isLoading,

    // Academic Reference
    academicConfig: academicQuery.data?.config || academicQuery.data || null,
    allSubjects: Array.isArray(subjectsQuery.data) ? subjectsQuery.data : [],

    // Mutations & Export
    assignSubscription: assignSubscriptionMutation,
    updateSubscription: updateSubscriptionMutation,
    deleteSubscription: deleteSubscriptionMutation,
    toggleAccountStatus: toggleAccountStatusMutation,
    updateProfile: updateProfileMutation,
    revokeSessions: revokeSessionsMutation,
    resetPassword: resetPasswordMutation,
    reset2FA: reset2FAMutation,
    addNote: addNoteMutation,
    deleteNote: deleteNoteMutation,
    sendSms: sendSmsMutation,
    bulkExtend: bulkExtendMutation,
    impersonate: impersonateMutation,
    handleExportCsv,
    exporting,
  };
}
