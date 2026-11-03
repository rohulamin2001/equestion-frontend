import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export function useQuestionHierarchy({
  onFilterChange,
  scope = "personal",
} = {}) {
  const [currentPath, setCurrentPath] = useState({
    type: null,
    className: null,
    subjectId: null,
    chapterNumber: null,
    category: null,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["questionHierarchyStats", scope],
    queryFn: async () => {
      const response = await apiClient.get("/questions/hierarchy-stats", {
        params: { scope },
      });
      return response.data;
    },
    staleTime: 60 * 1000,
  });

  const institutions = useMemo(() => data?.institutions || [], [data]);
  const totalQuestions = data?.totalQuestions || 0;

  const selectedInstitution = useMemo(() => {
    if (!currentPath.type) return null;
    return institutions.find((inst) => inst.id === currentPath.type) || null;
  }, [institutions, currentPath.type]);

  const selectedClass = useMemo(() => {
    if (!selectedInstitution || !currentPath.className) return null;
    return (
      selectedInstitution.classes.find(
        (cls) => cls.id === currentPath.className,
      ) || null
    );
  }, [selectedInstitution, currentPath.className]);

  const selectedSubject = useMemo(() => {
    if (!selectedClass || !currentPath.subjectId) return null;
    return (
      selectedClass.subjects.find((sub) => sub.id === currentPath.subjectId) ||
      null
    );
  }, [selectedClass, currentPath.subjectId]);

  const selectedChapter = useMemo(() => {
    if (!selectedSubject || currentPath.chapterNumber === null) return null;
    return (
      selectedSubject.chapters.find(
        (ch) =>
          Number(ch.chapterNumber) === Number(currentPath.chapterNumber),
      ) || null
    );
  }, [selectedSubject, currentPath.chapterNumber]);

  // Current level: 0=root, 1=type, 2=class, 3=subject, 4=chapter
  const currentLevel = useMemo(() => {
    if (!currentPath.type) return 0;
    if (!currentPath.className) return 1;
    if (!currentPath.subjectId) return 2;
    if (currentPath.chapterNumber === null) return 3;
    return 4;
  }, [currentPath]);

  // Breadcrumbs items array for navigation
  const breadcrumbs = useMemo(() => {
    const list = [
      {
        level: 0,
        label: "সকল প্রতিষ্ঠান",
        count: totalQuestions,
        active: currentLevel === 0,
      },
    ];

    if (selectedInstitution) {
      list.push({
        level: 1,
        label: selectedInstitution.label,
        count: selectedInstitution.count,
        active: currentLevel === 1,
      });
    }

    if (selectedClass) {
      list.push({
        level: 2,
        label: selectedClass.label,
        count: selectedClass.count,
        active: currentLevel === 2,
      });
    }

    if (selectedSubject) {
      list.push({
        level: 3,
        label: selectedSubject.name,
        count: selectedSubject.count,
        active: currentLevel === 3,
      });
    }

    if (selectedChapter) {
      list.push({
        level: 4,
        label: selectedChapter.chapterName,
        count: selectedChapter.count,
        active: currentLevel === 4,
      });
    }

    return list;
  }, [
    currentLevel,
    totalQuestions,
    selectedInstitution,
    selectedClass,
    selectedSubject,
    selectedChapter,
  ]);

  // Navigation handlers
  const selectInstitution = (inst) => {
    const newPath = {
      type: inst.id,
      className: null,
      subjectId: null,
      chapterNumber: null,
      category: null,
    };
    setCurrentPath(newPath);
    if (onFilterChange) {
      onFilterChange({
        type: inst.id,
        className: "",
        subjectId: "",
        chapterNumber: "",
        category: "",
      });
    }
  };

  const selectClass = (cls) => {
    const newPath = {
      ...currentPath,
      className: cls.id,
      subjectId: null,
      chapterNumber: null,
      category: null,
    };
    setCurrentPath(newPath);
    if (onFilterChange) {
      onFilterChange({
        type: currentPath.type,
        className: cls.id,
        subjectId: "",
        chapterNumber: "",
        category: "",
      });
    }
  };

  const selectSubject = (sub) => {
    const newPath = {
      ...currentPath,
      subjectId: sub.id,
      chapterNumber: null,
      category: null,
    };
    setCurrentPath(newPath);
    if (onFilterChange) {
      onFilterChange({
        type: currentPath.type,
        className: currentPath.className,
        subjectId: sub.id,
        chapterNumber: "",
        category: "",
      });
    }
  };

  const selectChapter = (ch) => {
    const newPath = {
      ...currentPath,
      chapterNumber: ch.chapterNumber,
      category: null,
    };
    setCurrentPath(newPath);
    if (onFilterChange) {
      onFilterChange({
        type: currentPath.type,
        className: currentPath.className,
        subjectId: currentPath.subjectId,
        chapterNumber: ch.chapterNumber,
        category: "",
      });
    }
  };

  const selectCategory = (cat) => {
    const newPath = {
      ...currentPath,
      category: currentPath.category === cat.category ? null : cat.category,
    };
    setCurrentPath(newPath);
    if (onFilterChange) {
      onFilterChange({
        type: currentPath.type,
        className: currentPath.className,
        subjectId: currentPath.subjectId,
        chapterNumber: currentPath.chapterNumber,
        category: currentPath.category === cat.category ? "" : cat.category,
      });
    }
  };

  const navigateUp = () => {
    if (currentLevel === 4) {
      selectSubject(selectedSubject);
    } else if (currentLevel === 3) {
      selectClass(selectedClass);
    } else if (currentLevel === 2) {
      selectInstitution(selectedInstitution);
    } else if (currentLevel === 1) {
      resetToRoot();
    }
  };

  const resetToRoot = () => {
    setCurrentPath({
      type: null,
      className: null,
      subjectId: null,
      chapterNumber: null,
      category: null,
    });
    if (onFilterChange) {
      onFilterChange({
        type: "",
        className: "",
        subjectId: "",
        chapterNumber: "",
        category: "",
      });
    }
  };

  const jumpTo = (levelIndex) => {
    if (levelIndex === 0) resetToRoot();
    else if (levelIndex === 1 && selectedInstitution)
      selectInstitution(selectedInstitution);
    else if (levelIndex === 2 && selectedClass) selectClass(selectedClass);
    else if (levelIndex === 3 && selectedSubject)
      selectSubject(selectedSubject);
    else if (levelIndex === 4 && selectedChapter)
      selectChapter(selectedChapter);
  };

  return {
    institutions,
    totalQuestions,
    isLoading,
    isError,
    refetch,
    currentPath,
    currentLevel,
    selectedInstitution,
    selectedClass,
    selectedSubject,
    selectedChapter,
    breadcrumbs,
    selectInstitution,
    selectClass,
    selectSubject,
    selectChapter,
    selectCategory,
    navigateUp,
    resetToRoot,
    jumpTo,
  };
}

