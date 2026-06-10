import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import { useUserContext } from "@/context/UserContext";

export function useQuestionBank() {
  const navigate = useNavigate();
  const qm = useQuestionManagement();
  const { userProfile, role } = useUserContext();

  // Dialog / Modal States
  const [selectedPreviewQuestion, setSelectedPreviewQuestion] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch global questions (personal = false)
  const { data: questions = [], isLoading, isError, refetch } = qm.fetchQuestionsQuery(false);

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
        qm.setFilterClass(classes[0].value);
        qm.setFilterSubjectId("");
        qm.setFilterChapter("");
      }
    }
  };

  const handleFilterLevelChange = (level) => {
    qm.setFilterLevel(level);
    const classes = qm.allowedClasses.filter(c => c.type === qm.filterType && c.level === level);
    if (classes.length > 0) {
      qm.setFilterClass(classes[0].value);
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

  // Check management permission (creator or Super Admin / Admin)
  const canManageQuestion = (q) => {
    if (!q || !userProfile) return false;
    const isCreator = q.creatorId?._id === userProfile._id || q.creatorId === userProfile._id;
    const isAdmin = ["Super Admin", "Admin"].includes(role);
    return isCreator || isAdmin;
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

  // Count Statistics
  const totalCount = questions.length;
  const mcqCount = questions.filter((q) => q.category === "MCQ").length;
  const creativeCount = questions.filter((q) => q.category === "Creative").length;
  const otherCount = totalCount - mcqCount - creativeCount;

  return {
    navigate,
    qm,
    role,
    questions,
    isLoading,
    isError,
    refetch,
    selectedPreviewQuestion,
    setSelectedPreviewQuestion,
    deleteConfirmId,
    setDeleteConfirmId,
    showFilters,
    setShowFilters,
    filterActiveTypes,
    filterActiveLevels,
    filterActiveClasses,
    handleFilterTypeChange,
    handleFilterLevelChange,
    filterSubjects,
    filterChapters,
    handleResetFilters,
    handleEdit,
    handleDeleteConfirm,
    canManageQuestion,
    formatBengaliDate,
    totalCount,
    mcqCount,
    creativeCount,
    otherCount,
  };
}
