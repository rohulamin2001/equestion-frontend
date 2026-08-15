import { CATEGORIES_MAP } from "@/constants/categories";
import { useUserContext } from "@/context/UserContext";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import apiClient from "@/lib/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useMyQuestions() {
  const navigate = useNavigate();
  const { role, userProfile } = useUserContext();
  const isAdmin = ["Super Admin", "Admin"].includes(role || userProfile?.role);

  const [pageSize, setPageSizeState] = useState(10);
  const qm = useQuestionManagement({ isPersonalOnly: true, pageSize });

  // Bulk Selection State
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Personal stats query for currently logged-in user
  const { data: personalStatsData } = useQuery({
    queryKey: [
      "personalQuestionStats",
      qm.filterType,
      qm.filterLevel,
      qm.filterClass,
      qm.filterSubjectId,
      qm.filterChapter,
      qm.filterCategory,
      qm.filterDifficulty,
      qm.filterSearch,
      qm.filterVersion,
      qm.filterStatus,
    ],
    queryFn: async () => {
      const params = {};
      if (qm.filterType) params.institutionType = qm.filterType;
      if (qm.filterLevel) params.academicLevel = qm.filterLevel;
      if (qm.filterClass) params.className = qm.filterClass;
      if (qm.filterSubjectId) params.subjectId = qm.filterSubjectId;
      if (qm.filterChapter) params.chapterNumber = qm.filterChapter;
      if (qm.filterCategory) params.category = qm.filterCategory;
      if (qm.filterDifficulty) params.difficulty = qm.filterDifficulty;
      if (qm.filterSearch) params.search = qm.filterSearch;
      if (qm.filterVersion) params.version = qm.filterVersion;
      if (qm.filterStatus) params.status = qm.filterStatus;

      const response = await apiClient.get("/questions/personal-stats", {
        params,
      });
      return response.data;
    },
  });

  const personalStats = personalStatsData?.stats || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const queryClient = useQueryClient();

  const requestReviewMutation = useMutation({
    mutationFn: async ({ id, comment }) => {
      const response = await apiClient.post(`/questions/${id}/request-review`, {
        comment,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalQuestionStats"] });
      qm.questionsQuery.refetch();
    },
  });

  const handleRequestReview = async (id, comment) => {
    await requestReviewMutation.mutateAsync({ id, comment });
  };

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      const response = await apiClient.post("/questions/bulk-delete", {
        questionIds: ids,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["personalQuestionStats"] });
      toast.success(
        data?.message || "নির্বাচিত প্রশ্নসমূহ সফলভাবে মুছে ফেলা হয়েছে!",
      );
      setSelectedQuestionIds([]);
      setBulkDeleteConfirmOpen(false);
      qm.questionsQuery.refetch();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "বাল্ক ডিলিট সম্পন্ন করতে ব্যর্থ হয়েছে",
      );
    },
  });

  const handleBulkDeleteConfirm = async () => {
    if (selectedQuestionIds.length === 0) return;
    try {
      await bulkDeleteMutation.mutateAsync(selectedQuestionIds);
    } catch (err) {
      console.error(err);
    }
  };

  // Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch personal questions from pages
  const {
    data: questionsData,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = qm.questionsQuery;

  const questions = questionsData?.pages
    ? questionsData.pages.flatMap((p) => p.questions)
    : [];

  // Cascading helpers
  const filterActiveTypes = Array.from(
    new Set(qm.allowedClasses.map((c) => c.type)),
  );
  const filterActiveLevels = qm.filterType
    ? Array.from(
        new Set(
          qm.allowedClasses
            .filter((c) => c.type === qm.filterType)
            .map((c) => c.level),
        ),
      )
    : Array.from(new Set(qm.allowedClasses.map((c) => c.level)));
  const filterActiveClasses = Array.from(
    new Map(
      qm.allowedClasses
        .filter((c) => {
          const typeMatch = !qm.filterType || c.type === qm.filterType;
          const levelMatch = !qm.filterLevel || c.level === qm.filterLevel;
          return typeMatch && levelMatch;
        })
        .map((c) => [c.value, c]),
    ).values(),
  );

  const handleFilterTypeChange = (type) => {
    qm.setFilterType(type);
    if (!type) {
      qm.setFilterLevel("");
      qm.setFilterClass("");
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
      return;
    }
    const levels = Array.from(
      new Set(
        qm.allowedClasses.filter((c) => c.type === type).map((c) => c.level),
      ),
    );
    if (levels.length > 0) {
      const firstLevel = levels[0];
      qm.setFilterLevel(firstLevel);
      const classes = qm.allowedClasses.filter(
        (c) => c.type === type && c.level === firstLevel,
      );
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
    const classes = qm.allowedClasses.filter(
      (c) => c.type === qm.filterType && c.level === level,
    );
    if (classes.length > 0) {
      qm.setFilterClass(classes[0].value, qm.filterType, level);
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
    }
  };

  // Active subjects & chapters for filters based on selected class
  const filterSubjects = qm.syllabusList.filter((s) => {
    const typeMatch = !qm.filterType || s.institutionType === qm.filterType;
    const levelMatch = !qm.filterLevel || s.academicLevel === qm.filterLevel;
    const classMatch = !qm.filterClass || s.className === qm.filterClass;
    return typeMatch && levelMatch && classMatch;
  });
  const selectedSyllabusObj = qm.syllabusList.find(
    (s) => s._id === qm.filterSubjectId,
  );
  const filterChapters = selectedSyllabusObj?.chapters || [];

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
    qm.setFilterStatus("");
  };

  // Trigger edit question
  const handleEdit = (question) => {
    if (question.status === "Approved") return;
    navigate("/dashboard/add-question", { state: { editQuestion: question } });
  };

  // Trigger delete question
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    const targetQuestion = questions.find((q) => q._id === deleteConfirmId);
    if (targetQuestion?.status === "Approved") {
      setDeleteConfirmId(null);
      return;
    }
    try {
      await qm.deleteQuestionMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Bengali Date & Time helper
  const formatBengaliDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return `${datePart} (সময়: ${timePart})`;
  };

  // Get active categories dynamically based on selected class/level/subject configuration
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
        return subjectCats.map((catVal) => {
          const matched = CATEGORIES_MAP.find((c) => c.value === catVal);
          return matched || { value: catVal, label: catVal };
        });
      }
    }

    const activeSyllabuses = qm.syllabusList.filter(
      (s) =>
        s.className === qm.filterClass &&
        s.institutionType === qm.filterType &&
        s.academicLevel === qm.filterLevel,
    );

    const catSet = new Set();
    activeSyllabuses.forEach((s) => {
      const cats = s.subjectId?.categories || [];
      cats.forEach((c) => catSet.add(c));
    });

    if (catSet.size > 0) {
      return Array.from(catSet).map((catVal) => {
        const matched = CATEGORIES_MAP.find((c) => c.value === catVal);
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

  // Count Statistics from Database API
  const totalCount =
    personalStats?.total ??
    questionsData?.pages?.[0]?.pagination?.total ??
    questions.length;
  const mcqCount = personalStats?.mcq ?? 0;
  const creativeCount = personalStats?.creative ?? 0;
  const otherCount = personalStats?.other ?? 0;

  const setPageSize = (size) => {
    setPageSizeState(size);
  };

  const visibleQuestions = questions;
  const hasMore = hasNextPage;

  // Bulk selection helper logic
  const isQuestionDeletable = (q) => {
    if (!q) return false;
    if (isAdmin) return true;
    return q.status !== "Approved";
  };

  const deletableQuestions = visibleQuestions.filter(isQuestionDeletable);

  const isAllSelected =
    deletableQuestions.length > 0 &&
    deletableQuestions.every((q) => selectedQuestionIds.includes(q._id));

  const isSomeSelected = selectedQuestionIds.length > 0 && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all currently deletable questions
      const deletableIdSet = new Set(deletableQuestions.map((q) => q._id));
      setSelectedQuestionIds((prev) =>
        prev.filter((id) => !deletableIdSet.has(id)),
      );
    } else {
      // Select all currently deletable questions
      const deletableIds = deletableQuestions.map((q) => q._id);
      setSelectedQuestionIds((prev) =>
        Array.from(new Set([...prev, ...deletableIds])),
      );
    }
  };

  const toggleSelectQuestion = (id, isGroup = false, groupQuestions = []) => {
    if (isGroup && Array.isArray(groupQuestions)) {
      const deletableGroupQuestions =
        groupQuestions.filter(isQuestionDeletable);
      const deletableGroupIds = deletableGroupQuestions.map((q) => q._id);
      const allGroupSelected =
        deletableGroupIds.length > 0 &&
        deletableGroupIds.every((gId) => selectedQuestionIds.includes(gId));

      if (allGroupSelected) {
        // Deselect group
        const groupSet = new Set(deletableGroupIds);
        setSelectedQuestionIds((prev) =>
          prev.filter((qId) => !groupSet.has(qId)),
        );
      } else {
        // Select all deletable in group
        setSelectedQuestionIds((prev) =>
          Array.from(new Set([...prev, ...deletableGroupIds])),
        );
      }
    } else {
      // Single question toggle
      setSelectedQuestionIds((prev) =>
        prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id],
      );
    }
  };

  const clearSelection = () => {
    setSelectedQuestionIds([]);
  };

  const isQuestionSelected = (id) => selectedQuestionIds.includes(id);

  const isGroupFullySelected = (groupQuestions = []) => {
    const deletableGroup = groupQuestions.filter(isQuestionDeletable);
    return (
      deletableGroup.length > 0 &&
      deletableGroup.every((q) => selectedQuestionIds.includes(q._id))
    );
  };

  const isGroupPartiallySelected = (groupQuestions = []) => {
    const deletableGroup = groupQuestions.filter(isQuestionDeletable);
    const selectedCount = deletableGroup.filter((q) =>
      selectedQuestionIds.includes(q._id),
    ).length;
    return selectedCount > 0 && selectedCount < deletableGroup.length;
  };

  return {
    navigate,
    qm,
    isAdmin,
    deleteConfirmId,
    setDeleteConfirmId,
    showFilters,
    setShowFilters,
    questions,
    isLoading,
    isError,
    refetch,
    filterActiveTypes,
    filterActiveLevels,
    filterActiveClasses,
    handleFilterTypeChange,
    handleFilterLevelChange,
    filterSubjects,
    selectedSyllabusObj,
    filterChapters,
    handleResetFilters,
    handleEdit,
    handleDeleteConfirm,
    formatBengaliDateTime,
    getActiveCategories,
    totalCount,
    mcqCount,
    creativeCount,
    otherCount,
    personalStats,
    // Pagination & Infinite Scroll exports
    pageSize,
    setPageSize,
    visibleQuestions,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
    requestReviewMutation,
    handleRequestReview,
    // Bulk Selection & Delete exports
    selectedQuestionIds,
    setSelectedQuestionIds,
    bulkDeleteConfirmOpen,
    setBulkDeleteConfirmOpen,
    bulkDeleteMutation,
    handleBulkDeleteConfirm,
    isQuestionDeletable,
    deletableQuestions,
    isAllSelected,
    isSomeSelected,
    toggleSelectAll,
    toggleSelectQuestion,
    clearSelection,
    isQuestionSelected,
    isGroupFullySelected,
    isGroupPartiallySelected,
  };
}
