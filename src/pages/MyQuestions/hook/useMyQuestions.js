import { CATEGORIES_MAP } from "@/constants/categories";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useMyQuestions() {
  const navigate = useNavigate();
  const qm = useQuestionManagement({ isPersonalOnly: true });

  // Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch personal questions
  const { data: questions = [], isLoading, isError, refetch } = qm.questionsQuery;

  // Cascading helpers
  const filterActiveTypes = Array.from(new Set(qm.allowedClasses.map(c => c.type)));
  const filterActiveLevels = Array.from(
    new Set(qm.allowedClasses.filter(c => c.type === qm.filterType).map(c => c.level))
  );
  const filterActiveClasses = qm.allowedClasses.filter(
    c => c.type === qm.filterType && c.level === qm.filterLevel
  );

  const handleFilterTypeChange = (type) => {
    qm.setFilterType(type);
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
    const classes = qm.allowedClasses.filter(c => c.type === qm.filterType && c.level === level);
    if (classes.length > 0) {
      qm.setFilterClass(classes[0].value, qm.filterType, level);
      qm.setFilterSubjectId("");
      qm.setFilterChapter("");
    }
  };

  // Active subjects & chapters for filters based on selected class
  const filterSubjects = qm.syllabusList.filter(
    (s) => s.className === qm.filterClass && s.institutionType === qm.filterType && s.academicLevel === qm.filterLevel
  );
  const selectedSyllabusObj = qm.syllabusList.find((s) => s._id === qm.filterSubjectId);
  const filterChapters = selectedSyllabusObj?.chapters || [];

  // Reset filters
  const handleResetFilters = () => {
    if (qm.allowedClasses && qm.allowedClasses.length > 0) {
      const first = qm.allowedClasses[0];
      qm.setFilterType(first.type);
      qm.setFilterLevel(first.level);
      qm.setFilterClass(first.value);
    } else {
      qm.setFilterType("School");
      qm.setFilterLevel("Secondary");
      qm.setFilterClass("Class 6");
    }
    qm.setFilterSubjectId("");
    qm.setFilterChapter("");
    qm.setFilterCategory("");
    qm.setFilterDifficulty("");
    qm.setFilterSearch("");
    qm.setFilterVersion("");
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
    if (filterSubjects.length === 0) {
      return [];
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
  const totalCount = questions.length;
  const mcqCount = questions.filter((q) => q.category === "MCQ").length;
  const creativeCount = questions.filter((q) => q.category === "Creative").length;
  const otherCount = totalCount - mcqCount - creativeCount;

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
  };
}
