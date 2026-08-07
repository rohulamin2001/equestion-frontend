import apiClient from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useSupport() {
  const queryClient = useQueryClient();

  // Filters State
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch support stats
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ["supportStats"],
    queryFn: async () => {
      const response = await apiClient.get("/tickets/stats");
      return response.data;
    },
  });

  // Fetch user tickets
  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isError,
    refetch: refetchTickets,
  } = useQuery({
    queryKey: ["userTickets", statusFilter, categoryFilter, searchQuery],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await apiClient.get("/tickets/user", { params });
      return response.data;
    },
  });

  // Fetch single ticket details
  const {
    data: ticketDetailsData,
    isLoading: isTicketDetailsLoading,
    refetch: refetchTicketDetails,
  } = useQuery({
    queryKey: ["ticketDetails", activeTicketId],
    queryFn: async () => {
      if (!activeTicketId) return null;
      const response = await apiClient.get(`/tickets/${activeTicketId}`);
      return response.data;
    },
    enabled: Boolean(activeTicketId),
  });

  // Create Ticket Mutation
  const createTicketMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/tickets", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
      queryClient.invalidateQueries({ queryKey: ["supportStats"] });
      setIsCreateModalOpen(false);
    },
  });

  // Add Message / Reply Mutation
  const addMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message, attachments }) => {
      const response = await apiClient.post(`/tickets/${ticketId}/messages`, {
        message,
        attachments,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticketDetails", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
    },
  });

  // Submit Rating Mutation
  const submitRatingMutation = useMutation({
    mutationFn: async ({ ticketId, satisfactionRating, feedbackComment }) => {
      const response = await apiClient.post(`/tickets/${ticketId}/rate`, {
        satisfactionRating,
        feedbackComment,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ticketDetails", variables.ticketId],
      });
      queryClient.invalidateQueries({ queryKey: ["userTickets"] });
      queryClient.invalidateQueries({ queryKey: ["supportStats"] });
    },
  });

  return {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    activeTicketId,
    setActiveTicketId,
    isCreateModalOpen,
    setIsCreateModalOpen,
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
    createTicketMutation,
    addMessageMutation,
    submitRatingMutation,
  };
}
