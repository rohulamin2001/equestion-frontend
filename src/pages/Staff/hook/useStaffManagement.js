import { useState } from 'react';
import { useAuth } from '@clerk/react';
import { useUserContext } from '@/context/UserContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';
import { toast } from 'sonner';

export function useStaffManagement() {
  const { getToken } = useAuth();
  const { userProfile } = useUserContext();
  const queryClient = useQueryClient();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [activeDropdownMemberId, setActiveDropdownMemberId] = useState(null);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Question Creator');
  const [showPassword, setShowPassword] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Fetch staff members query
  const {
    data: staffList = [],
    isLoading: loading,
    error: fetchError,
    refetch: fetchStaff,
  } = useQuery({
    queryKey: ['staffList'],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/users/staff', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.staff;
    },
  });

  const error = fetchError
    ? fetchError.response?.data?.error || fetchError.message || 'স্টাফ তালিকা লোড করতে ব্যর্থ হয়েছে'
    : null;

  // Handle staff registration mutation
  const addStaffMutation = useMutation({
    mutationFn: async (newStaff) => {
      const token = await getToken();
      const response = await apiClient.post('/users/staff', newStaff, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffList'] });
      toast.success('নতুন স্টাফ সফলভাবে যুক্ত করা হয়েছে!');
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRole('Question Creator');
      
      // Auto close modal after delay
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || 'স্টাফ যুক্ত করতে ব্যর্থ হয়েছে');
    },
  });

  const formLoading = addStaffMutation.isPending;

  const handleAddStaff = async (e) => {
    e.preventDefault();

    addStaffMutation.mutate({
      firstName,
      lastName,
      email,
      password,
      role,
    });
  };

  // Handle role modification mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const token = await getToken();
      const response = await apiClient.put(`/users/staff/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { userId, newRole, data: response.data };
    },
    onSuccess: ({ userId, newRole }) => {
      queryClient.setQueryData(['staffList'], (oldList) => {
        if (!oldList) return [];
        return oldList.map((member) =>
          member._id === userId ? { ...member, role: newRole } : member
        );
      });
      toast.success('স্টাফ মেম্বারের রোল সফলভাবে পরিবর্তন করা হয়েছে!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'রোল আপডেট করতে ব্যর্থ হয়েছে');
    },
  });

  const handleRoleChange = async (userId, newRole) => {
    updateRoleMutation.mutate({ userId, newRole });
  };

  // Handle staff deletion mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (userId) => {
      const token = await getToken();
      await apiClient.delete(`/users/staff/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { userId };
    },
    onSuccess: ({ userId }) => {
      queryClient.setQueryData(['staffList'], (oldList) => {
        if (!oldList) return [];
        return oldList.filter((member) => member._id !== userId);
      });
      toast.success('স্টাফ মেম্বারকে সফলভাবে তালিকা থেকে মুছে ফেলা হয়েছে!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'স্টাফ মুছতে ব্যর্থ হয়েছে');
    },
  });

  const handleDeleteStaff = async (userId) => {
    setStaffToDelete(userId);
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
    // Form fields
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
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
    // Handlers
    handleAddStaff,
    handleRoleChange,
    handleDeleteStaff,
    deleteStaffMutation,
  };
}
