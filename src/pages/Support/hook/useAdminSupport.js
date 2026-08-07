import apiClient from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useAdminSupport() {
  const queryClient = useQueryClient();

  // Filters State
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTicketId, setActiveTicketId] = useState(null);

  // Fetch admin support stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["adminSupportStats"],
    queryFn: async () => {
      const response = await apiClient.get("/tickets/stats");
      return response.data;
    },
  });

  // Fetch all tickets for Admin / Support Team
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isError,
    refetch: refetchTickets,
  } = useQuery({
    queryKey: [
      "adminTickets",
      statusFilter,
      priorityFilter,
      categoryFilter,
      assignedFilter,
      searchQuery,
    ],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (assignedFilter) params.assignedTo = assignedFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await apiClient.get("/tickets/admin/all", { params });
      return response.data;
    },
  });

  // Fetch single ticket details for admin (includes internal notes)
  const {
    data: ticketDetailsData,
    isLoading: isTicketDetailsLoading,
    refetch: refetchTicketDetails,
  } = useQuery({
    queryKey: ["adminTicketDetails", activeTicketId],
    queryFn: async () => {
      if (!activeTicketId) return null;
      const response = await apiClient.get(`/tickets/${activeTicketId}`);
      return response.data;
    },
    enabled: Boolean(activeTicketId),
  });

  // Fetch canned response templates
  const { data: cannedResponsesData, isLoading: isCannedLoading } = useQuery({
    queryKey: ["cannedResponses"],
    queryFn: async () => {
      const response = await apiClient.get("/canned-responses");
      return response.data;
    },
  });

  // Add Message / Reply / Internal Note Mutation
  const addMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message, isInternalNote, attachments }) => {
      const response = await apiClient.post(`/tickets/${ticketId}/messages`, {
        message,
        isInternalNote,
        attachments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminTicketDetails", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      queryClient.invalidateQueries({ queryKey: ["adminSupportStats"] });
    },
  });

  // Update Status / Priority / Assignment Mutation
  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status, priority, assignedTo }) => {
      const response = await apiClient.patch(`/tickets/${ticketId}/status`, {
        status,
        priority,
        assignedTo,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminTicketDetails", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["adminTickets"] });
      queryClient.invalidateQueries({ queryKey: ["adminSupportStats"] });
    },
  });

  // Create Canned Response Mutation
  const createCannedResponseMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/canned-responses", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cannedResponses"] });
    },
  });

  // Delete Canned Response Mutation
  const deleteCannedResponseMutation = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.delete(`/canned-responses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cannedResponses"] });
    },
  });

  return {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    assignedFilter,
    setAssignedFilter,
    searchQuery,
    setSearchQuery,
    activeTicketId,
    setActiveTicketId,
    stats: statsData?.stats || {
      total: 0,
      open: 0,
      inProgress: 0,
      waiting: 0,
      resolved: 0,
      closed: 0,
      avgRating: 5.0,
    },
    isStatsLoading,
    tickets: ticketsData?.tickets || [],
    isTicketsLoading,
    isError,
    refetchTickets,
    ticketDetails: ticketDetailsData?.ticket || null,
    isTicketDetailsLoading,
    refetchTicketDetails,
    cannedResponses: cannedResponsesData?.cannedResponses || [],
    isCannedLoading,
    addMessageMutation,
    updateTicketStatusMutation,
    createCannedResponseMutation,
    deleteCannedResponseMutation,
  };
}
