import { useState, useEffect, useRef } from "react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import apiClient from "@/lib/apiClient";
import { toast } from "sonner";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import { CATEGORIES_MAP } from "@/constants/categories";

export function useQuestionApproval() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [pageSize, setPageSize] = useState(10);
  
  const qm = useQuestionManagement({ isPersonalOnly: false, pageSize, skipFetch: true });
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPreviewQuestion, setSelectedPreviewQuestion] = useState(null);

  // Stats query
  const { data: statsData, refetch: refetchStats } = useQuery({
    queryKey: ["questionStats"],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get("/questions/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const stats = statsData?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 };

  // Infinite query for questions matching 8 parameters of Question Bank
  const {
    data: questionsData,
    isLoading,
    isError,
    refetch: refetchQuestions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "approvalQuestionsList",
      filterStatus,
      qm.filterType,
      qm.filterLevel,
      qm.filterClass,
      qm.filterSubjectId,
      qm.filterChapter,
      qm.filterCategory,
      qm.filterDifficulty,
      qm.filterSearch,
      qm.filterVersion,
      pageSize,
    ],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const token = await getToken();
      const params = {
        page: pageParam,
        limit: pageSize,
        status: filterStatus,
      };
      if (qm.filterType) params.institutionType = qm.filterType;
      if (qm.filterLevel) params.academicLevel = qm.filterLevel;
      if (qm.filterClass) params.className = qm.filterClass;
      if (qm.filterSubjectId) params.subjectId = qm.filterSubjectId;
      if (qm.filterChapter) params.chapterNumber = qm.filterChapter;
      if (qm.filterCategory) params.category = qm.filterCategory;
      if (qm.filterDifficulty) params.difficulty = qm.filterDifficulty;
      if (qm.filterSearch) params.search = qm.filterSearch;
      if (qm.filterVersion) params.version = qm.filterVersion;

      const response = await apiClient.get("/questions", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination || {};
      return page < pages ? page + 1 : undefined;
    },
  });

  const questions = questionsData?.pages
    ? questionsData.pages.flatMap((p) => p.questions)
    : [];
  const filterActiveTypes = Array.from(new Set(qm.allowedClasses.map(c => c.type)));
  const filterActiveLevels = qm.filterType
    ? Array.from(new Set(qm.allowedClasses.filter(c => c.type === qm.filterType).map(c => c.level)))
    : Array.from(new Set(qm.allowedClasses.map(c => c.level)));
  const filterActiveClasses = qm.allowedClasses.filter(c => {
    const typeMatch = !qm.filterType || c.type === qm.filterType;
    const levelMatch = !qm.filterLevel || c.level === qm.filterLevel;
    return typeMatch && levelMatch;
  });

  const handleFilterTypeChange = (type) => {
    qm.setFilterType(type);
    if (!type) {
      qm.setFilterLevel("");
      qm.setFilterClass("");
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
      return;
    }
    const levels = Array.from(new Set(qm.allowedClasses.filter(c => c.type === type).map(c => c.level)));
    if (levels.length > 0) {
      const firstLevel = levels[0];
      qm.setFilterLevel(firstLevel);
      const classes = qm.allowedClasses.filter(c => c.type === type && c.level === firstLevel);
      if (classes.length > 0) {
        qm.setFilterClass(classes[0].value, type, firstLevel);
        qm.setFilterSubjectId("");
        qm.setFilterChapter("");
      }
    }
  };

  const handleFilterLevelChange = (level) => {
    qm.setFilterLevel(level);
    if (!level) {
      qm.setFilterClass("");
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
      return;
    }
    const classes = qm.allowedClasses.filter(c => c.type === qm.filterType && c.level === level);
    if (classes.length > 0) {
      qm.setFilterClass(classes[0].value, qm.filterType, level);
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
    }
  };

  const filterSubjects = qm.syllabusList.filter((s) => {
    const typeMatch = !qm.filterType || s.institutionType === qm.filterType;
    const levelMatch = !qm.filterLevel || s.academicLevel === qm.filterLevel;
    const classMatch = !qm.filterClass || s.className === qm.filterClass;
    return typeMatch && levelMatch && classMatch;
  });
  const selectedSyllabusObj = qm.syllabusList.find((s) => s._id === qm.filterSubjectId);
  const filterChapters = selectedSyllabusObj?.chapters || [];

  // Status update mutation (Approve/Reject)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }) => {
      const token = await getToken();
      const response = await apiClient.patch(
        `/questions/${id}/status`,
        { status, rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionStats"] });
      queryClient.invalidateQueries({ queryKey: ["approvalQuestionsList"] });
      refetchStats();
      refetchQuestions();
      toast.success("প্রশ্নের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!");
      setSelectedPreviewQuestion(null);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"
      );
    },
  });

  const handleUpdateStatus = (id, newStatus, rejectionReason) => {
    updateStatusMutation.mutate({ id, status: newStatus, rejectionReason });
  };

  // Intersection Observer for Infinite Scroll
  const observerRef = useRef(null);
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  // Reset all filters
  const handleResetFilters = () => {
    qm.setFilterType("");
    qm.setFilterLevel("");
    qm.setFilterClass("");
    qm.setFilterSubjectId("");
    qm.setFilterChapter("");
    qm.setFilterCategory("");
    qm.setFilterDifficulty("");
    qm.setFilterSearch("");
    qm.setFilterVersion("");
  };

  const getActiveCategories = () => {
    if (qm.filterClass && filterSubjects.length === 0) {
      return [];
    }
    if (!qm.filterClass) {
      return [
        { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
        { value: "Creative", label: "সৃজনশীল প্রশ্ন (CQ)" },
        { value: "ShortAnswer", label: "সংক্ষিপ্ত প্রশ্ন" },
        { value: "FillInBlanks", label: "শূন্যস্থান পূরণ" },
        { value: "Matching", label: "মিলকরণ" },
        { value: "BroadQuestion", label: "রচনামূলক প্রশ্ন" },
      ];
    }
    if (qm.filterSubjectId && selectedSyllabusObj) {
      const subjectCats = selectedSyllabusObj?.subjectId?.categories || [];
      if (subjectCats.length > 0) {
        return subjectCats.map(catVal => {
          const matched = CATEGORIES_MAP.find(c => c.value === catVal);
          return matched || { value: catVal, label: catVal };
        });
      }
    }

    const activeSyllabuses = qm.syllabusList.filter(
      (s) => s.className === qm.filterClass && s.institutionType === qm.filterType && s.academicLevel === qm.filterLevel
    );

    const catSet = new Set();
    activeSyllabuses.forEach(s => {
      const cats = s.subjectId?.categories || [];
      cats.forEach(c => catSet.add(c));
    });

    if (catSet.size > 0) {
      return Array.from(catSet).map(catVal => {
        const matched = CATEGORIES_MAP.find(c => c.value === catVal);
        return matched || { value: catVal, label: catVal };
      });
    }

    const isPrimary = ["Primary", "Ebtedayee"].includes(qm.filterLevel);
    return isPrimary
      ? [
          { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
          { value: "ShortAnswer", label: "সংক্ষিপ্ত প্রশ্ন" },
          { value: "FillInBlanks", label: "শূন্যস্থান পূরণ" },
          { value: "Matching", label: "মিলকরণ" },
          { value: "BroadQuestion", label: "রচনামূলক প্রশ্ন" },
        ]
      : [
          { value: "MCQ", label: "বহুনির্বাচনি (MCQ)" },
          { value: "Creative", label: "সৃজনশীল প্রশ্ন (CQ)" },
          { value: "ShortAnswer", label: "সংক্ষিপ্ত প্রশ্ন" },
          { value: "BroadQuestion", label: "রচনামূলক প্রশ্ন" },
        ];
  };

  const hasActiveFilters = 
    qm.filterType ||
    qm.filterLevel ||
    qm.filterClass ||
    qm.filterSubjectId ||
    qm.filterChapter ||
    qm.filterCategory ||
    qm.filterDifficulty ||
    qm.filterSearch ||
    qm.filterVersion;

  return {
    filterStatus,
    setFilterStatus,
    pageSize,
    setPageSize,
    qm,
    showFilters,
    setShowFilters,
    selectedPreviewQuestion,
    setSelectedPreviewQuestion,
    stats,
    questions,
    isLoading,
    isError,
    refetchQuestions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    filterActiveTypes,
    filterActiveLevels,
    filterActiveClasses,
    handleFilterTypeChange,
    handleFilterLevelChange,
    filterSubjects,
    selectedSyllabusObj,
    filterChapters,
    updateStatusMutation,
    handleUpdateStatus,
    observerRef,
    handleResetFilters,
    getActiveCategories,
    hasActiveFilters,
  };
}
