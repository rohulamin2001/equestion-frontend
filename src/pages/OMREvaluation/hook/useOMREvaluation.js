import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../lib/apiClient";
import { toast } from "sonner";

// Query Keys
export const OMR_KEYS = {
  templates: ["omr", "templates"],
  tokens: ["omr", "tokens"],
  tokenDetails: (id) => ["omr", "token", id],
  results: (tokenId) => ["omr", "results", tokenId],
  health: ["omr", "health"],
};

/**
 * Fetch all available OMR templates
 */
export function useOMRTemplates() {
  return useQuery({
    queryKey: OMR_KEYS.templates,
    queryFn: async () => {
      const res = await apiClient.get("/omr/templates");
      return res.data?.templates || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Fetch all tokens for current user
 */
export function useOMRTokens() {
  return useQuery({
    queryKey: OMR_KEYS.tokens,
    queryFn: async () => {
      const res = await apiClient.get("/omr/tokens");
      return res.data?.tokens || [];
    },
  });
}

/**
 * Fetch details of a single token
 */
export function useOMRTokenDetails(id) {
  return useQuery({
    queryKey: OMR_KEYS.tokenDetails(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get(`/omr/tokens/${id}`);
      return res.data?.token || null;
    },
    enabled: Boolean(id),
  });
}

/**
 * Create a new Exam Token with Answer Key
 */
export function useCreateOMRToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post("/omr/tokens", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OMR টোকেন তৈরি হয়েছে!");
      queryClient.invalidateQueries({ queryKey: OMR_KEYS.tokens });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "টোকেন তৈরি করতে ব্যর্থ হয়েছে"
      );
    },
  });
}

/**
 * Update an existing Token
 */
export function useUpdateOMRToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await apiClient.put(`/omr/tokens/${id}`, payload);
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message || "টোকেন আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: OMR_KEYS.tokens });
      queryClient.invalidateQueries({
        queryKey: OMR_KEYS.tokenDetails(variables.id),
      });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "টোকেন আপডেট করতে ব্যর্থ হয়েছে"
      );
    },
  });
}

/**
 * Delete a Token
 */
export function useDeleteOMRToken() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/omr/tokens/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "টোকেন মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: OMR_KEYS.tokens });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "টোকেন মুছতে ব্যর্থ হয়েছে"
      );
    },
  });
}

/**
 * Evaluate single OMR image
 */
export function useEvaluateOMR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData }) => {
      const res = await apiClient.post("/omr/evaluate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (data, variables) => {
      const tokenId = variables.formData.get("tokenId");
      if (tokenId) {
        queryClient.invalidateQueries({
          queryKey: OMR_KEYS.results(tokenId),
        });
        queryClient.invalidateQueries({ queryKey: OMR_KEYS.tokens });
      }
    },
  });
}

/**
 * Get results by Token ID
 */
export function useOMRResults(tokenId) {
  return useQuery({
    queryKey: OMR_KEYS.results(tokenId),
    queryFn: async () => {
      if (!tokenId) return null;
      const res = await apiClient.get(`/omr/results/${tokenId}`);
      return res.data || null;
    },
    enabled: Boolean(tokenId),
  });
}

/**
 * Delete single student result
 */
export function useDeleteOMRResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ resultId, tokenId }) => {
      const res = await apiClient.delete(`/omr/results/${resultId}`);
      return { data: res.data, tokenId };
    },
    onSuccess: (_, variables) => {
      toast.success("শিক্ষার্থীর রেজাল্ট মুছে ফেলা হয়েছে");
      if (variables.tokenId) {
        queryClient.invalidateQueries({
          queryKey: OMR_KEYS.results(variables.tokenId),
        });
        queryClient.invalidateQueries({ queryKey: OMR_KEYS.tokens });
      }
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "রেজাল্ট মুছতে ব্যর্থ হয়েছে"
      );
    },
  });
}

/**
 * Check Python Microservice Health
 */
export function usePythonServiceHealth() {
  return useQuery({
    queryKey: OMR_KEYS.health,
    queryFn: async () => {
      try {
        const res = await apiClient.get("/omr/health");
        return res.data;
      } catch {
        return { success: false, healthy: false, status: "OFFLINE" };
      }
    },
    refetchInterval: 15000, // Check every 15s
  });
}
