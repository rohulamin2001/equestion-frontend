import { CATEGORIES_MAP } from "@/constants/categories";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useMyQuestions() {
  const navigate = useNavigate();
  const [pageSize, setPageSizeState] = useState(10);
  const qm = useQuestionManagement({ isPersonalOnly: true, pageSize });
  const { getToken } = useAuth();

  // Personal stats query for currently logged-in user
  const { data: personalStatsData } = useQuery({
    queryKey: ["personalQuestionStats"],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get("/questions/personal-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  const personalStats = personalStatsData?.stats || { total: 0, pending: 0, approved: 0, rejected: 0 };

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
    isFetchingNextPage
  } = qm.questionsQuery;

  const questions = questionsData?.pages
    ? questionsData.pages.flatMap((p) => p.questions)
    : [];

  // Cascading helpers
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

  // Active subjects & chapters for filters based on selected class
  const filterSubjects = qm.syllabusList.filter((s) => {
    const typeMatch = !qm.filterType || s.institutionType === qm.filterType;
    const levelMatch = !qm.filterLevel || s.academicLevel === qm.filterLevel;
    const classMatch = !qm.filterClass || s.className === qm.filterClass;
    return typeMatch && levelMatch && classMatch;
  });
  const selectedSyllabusObj = qm.syllabusList.find((s) => s._id === qm.filterSubjectId);
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
    navigate("/dashboard/add-question", { state: { editQuestion: question } });
  };

  // Trigger delete question
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await qm.deleteQuestionMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Bengali Date helper
  const formatBengaliDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  // Count Statistics
  const totalCount = questionsData?.pages?.[0]?.pagination?.total || questions.length;
  const mcqCount = questions.filter((q) => q.category === "MCQ").length;
  const creativeCount = questions.filter((q) => q.category === "Creative").length;
  const otherCount = questions.length - mcqCount - creativeCount;

  const setPageSize = (size) => {
    setPageSizeState(size);
  };

  const visibleQuestions = questions;
  const hasMore = hasNextPage;

  return {
    navigate,
    qm,
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
    formatBengaliDate,
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
  };
}
