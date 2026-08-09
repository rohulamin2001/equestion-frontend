import { useUserContext } from "@/context/UserContext";
import apiClient from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function useStaffManagement() {
  const { userProfile } = useUserContext();
  const queryClient = useQueryClient();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [activeDropdownMemberId, setActiveDropdownMemberId] = useState(null);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Question Creator");
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userToReset2FA, setUserToReset2FA] = useState(null);

  // Fetch staff members query
  const {
    data: staffList = [],
    isLoading: loading,
    error: fetchError,
    refetch: fetchStaff,
  } = useQuery({
    queryKey: ["staffList", searchQuery, roleFilter],
    queryFn: async () => {
      const params = {};
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
        params.includeSubscribers = "true";
      }
      if (roleFilter && roleFilter !== "all") {
        params.role = roleFilter;
      }
      const response = await apiClient.get("/users/staff", { params });
      return response.data.staff;
    },
  });

  const error = fetchError
    ? fetchError.response?.data?.error ||
      fetchError.message ||
      "স্টাফ তালিকা লোড করতে ব্যর্থ হয়েছে"
    : null;

  // Handle staff registration mutation
  const addStaffMutation = useMutation({
    mutationFn: async (newStaff) => {
      const response = await apiClient.post("/users/staff", newStaff);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      toast.success("নতুন স্টাফ সফলভাবে যুক্ত করা হয়েছে!");
      // Reset form
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setPassword("");
      setRole("Question Creator");

      // Auto close modal after delay
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "স্টাফ যুক্ত করতে ব্যর্থ হয়েছে",
      );
    },
  });

  const formLoading = addStaffMutation.isPending;

  const handleAddStaff = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !/^(\+88)?01[3-9]\d{8}$/.test(phoneNumber.trim())) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    addStaffMutation.mutate({
      firstName,
      lastName,
      phoneNumber: phoneNumber.trim(),
      password,
      role,
    });
  };

  // Handle role modification mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const response = await apiClient.put(`/users/staff/${userId}/role`, {
        role: newRole,
      });
      return { userId, newRole, data: response.data };
    },
    onSuccess: ({ userId, newRole }) => {
      queryClient.setQueryData(["staffList"], (oldList) => {
        if (!oldList) return [];
        return oldList.map((member) =>
          member._id === userId ? { ...member, role: newRole } : member,
        );
      });
      toast.success("স্টাফ মেম্বারের রোল সফলভাবে পরিবর্তন করা হয়েছে!");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "রোল আপডেট করতে ব্যর্থ হয়েছে",
      );
    },
  });

  const handleRoleChange = async (userId, newRole) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  // Handle staff deletion mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (userId) => {
      await apiClient.delete(`/users/staff/${userId}`);
      return { userId };
    },
    onSuccess: ({ userId }) => {
      queryClient.setQueryData(["staffList"], (oldList) => {
        if (!oldList) return [];
        return oldList.filter((member) => member._id !== userId);
      });
      toast.success("স্টাফ মেম্বারকে সফলভাবে তালিকা থেকে মুছে ফেলা হয়েছে!");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "স্টাফ মুছতে ব্যর্থ হয়েছে",
      );
    },
  });

  const handleDeleteStaff = async (userId) => {
    setStaffToDelete(userId);
  };

  // Handle 2FA Admin Reset mutation
  const reset2FAMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await apiClient.post(`/auth/2fa/admin-reset/${userId}`);
      return { userId, message: response.data?.message };
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      toast.success(
        message || "ব্যবহারকারীর ২-স্টেপ নিরাপত্তা সফলভাবে রিসেট করা হয়েছে!",
      );
      setUserToReset2FA(null);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "২FA রিসেট করতে ব্যর্থ হয়েছে",
      );
    },
  });

  const handleConfirmReset2FA = () => {
    if (userToReset2FA?._id) {
      reset2FAMutation.mutate(userToReset2FA._id);
    }
  };

  return {
    userProfile,
    // Modal states
    isModalOpen,
    setIsModalOpen,
    staffToDelete,
    setStaffToDelete,
    activeDropdownMemberId,
    setActiveDropdownMemberId,
    userToReset2FA,
    setUserToReset2FA,
    // Search & Filter
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    // Form fields
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    role,
    setRole,
    showPassword,
    setShowPassword,
    isRoleDropdownOpen,
    setIsRoleDropdownOpen,
    // Queries / mutations data
    staffList,
    loading,
    error,
    fetchStaff,
    formLoading,
    deleteStaffPending: deleteStaffMutation.isPending,
    deleteStaffVariables: deleteStaffMutation.variables,
    reset2FAPending: reset2FAMutation.isPending,
    // Handlers
    handleAddStaff,
    handleRoleChange,
    handleDeleteStaff,
    handleConfirmReset2FA,
    deleteStaffMutation,
  };
}
