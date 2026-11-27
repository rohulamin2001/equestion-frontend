import apiClient from "@/lib/apiClient";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export const smartboardApi = {
  // Lessons
  listLessons: async (params = {}) => {
    const res = await apiClient.get("/smartboard/lessons", { params });
    return res.data;
  },
  createLesson: async (payload) => {
    const res = await apiClient.post("/smartboard/lessons", payload);
    return res.data;
  },
  getLesson: async (lessonId) => {
    const res = await apiClient.get(`/smartboard/lessons/${lessonId}`);
    return res.data;
  },
  updateLesson: async (lessonId, payload) => {
    const res = await apiClient.patch(`/smartboard/lessons/${lessonId}`, payload);
    return res.data;
  },
  deleteLesson: async (lessonId) => {
    const res = await apiClient.delete(`/smartboard/lessons/${lessonId}`);
    return res.data;
  },
  duplicateLesson: async (lessonId) => {
    const res = await apiClient.post(`/smartboard/lessons/${lessonId}/duplicate`);
    return res.data;
  },
  restoreLessonVersion: async (lessonId, versionId) => {
    const res = await apiClient.post(`/smartboard/lessons/${lessonId}/restore`, {
      versionId,
    });
    return res.data;
  },

  // Slides
  createSlide: async (lessonId, payload) => {
    const res = await apiClient.post(
      `/smartboard/lessons/${lessonId}/slides`,
      payload,
    );
    return res.data;
  },
  saveSlide: async (lessonId, slideId, payload) => {
    const res = await apiClient.put(
      `/smartboard/lessons/${lessonId}/slides/${slideId}`,
      payload,
    );
    return res.data;
  },
  deleteSlide: async (lessonId, slideId) => {
    const res = await apiClient.delete(
      `/smartboard/lessons/${lessonId}/slides/${slideId}`,
    );
    return res.data;
  },
  reorderSlides: async (lessonId, slideOrder) => {
    const res = await apiClient.put(
      `/smartboard/lessons/${lessonId}/slide-order`,
      { slideOrder },
    );
    return res.data;
  },

  // Assets (Cloudflare R2 / existing /upload fallback)
  uploadImageFile: async (file, lessonId = null) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "smartboard");
    if (lessonId) {
      formData.append("lessonId", lessonId);
    }
    const res = await apiClient.post("/smartboard/assets/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Share
  getShareStatus: async (lessonId) => {
    const res = await apiClient.get(`/smartboard/lessons/${lessonId}/share`);
    return res.data;
  },
  createOrUpdateShare: async (lessonId, payload) => {
    const res = await apiClient.post(
      `/smartboard/lessons/${lessonId}/share`,
      payload,
    );
    return res.data;
  },
  revokeShare: async (lessonId) => {
    const res = await apiClient.delete(`/smartboard/lessons/${lessonId}/share`);
    return res.data;
  },

  // Public unauthenticated fetch (does not attach user cookies/tokens unnecessarily)
  getPublicNote: async (shareToken) => {
    const res = await axios.get(`${API_BASE}/smartboard/public/${shareToken}`);
    return res.data;
  },
};
