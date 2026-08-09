import { CATEGORIES_MAP } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import apiClient from "@/lib/apiClient";
import { validateCategoryQuestionsJson } from "@/lib/jsonQuestionValidator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const stripHtmlText = (html) => {
  if (!html || typeof html !== "string") return "";
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || doc.body.innerText || "";
    return text.replace(/\u00a0/g, " ").trim();
  } catch {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
  }
};

const extractQuestionStem = (q, category) => {
  if (!q || typeof q !== "object") return "";
  if (category === "MCQ") {
    return (
      q.mcqData?.questionText ||
      q.questionText ||
      q.mcqData?.stem ||
      q.stem ||
      ""
    ).trim();
  } else if (category === "Creative") {
    return (q.creativeData?.stem || q.stem || "").trim();
  } else {
    return (
      q.generalData?.questionText ||
      q.questionText ||
      q.stem ||
      ""
    ).trim();
  }
};

// Exported constants used by both hook and UI
export const TYPE_LABELS = {
  School: "স্কুল (School)",
  College: "কলেজ (College)",
  Madrasah: "মাদ্রাসা (Madrasah)",
};

export const LEVEL_LABELS = {
  Primary: "প্রাথমিক (Primary)",
  Secondary: "মাধ্যমিক (Secondary)",
  "Higher Secondary": "উচ্চমাধ্যমিক (Higher Secondary)",
  Ebtedayee: "ইবতেদায়ী (Ebtedayee)",
  Dakhil: "দাখিল (Dakhil)",
  Alim: "আলিম (Alim)",
};

export const DIFFICULTY_MAP = {
  Easy: {
    label: "সহজ",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Medium: {
    label: "মধ্যম",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Hard: { label: "কঠিন", color: "bg-red-50 text-red-700 border-red-200" },
};

export { CATEGORIES_MAP, CLASSES_MAP };

export function useAddQuestion() {
  const qm = useQuestionManagement({ skipFetch: true });
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'class' | 'subject' | 'chapter' | 'school' | 'board' | 'year' | 'levelTag' | null
  const [showStep2Error, setShowStep2Error] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch all active metadata options
  const { data: metadataList = [], isLoading: loadingMetadata } = useQuery({
    queryKey: ["activeMetadataList"],
    queryFn: async () => {
      const response = await apiClient.get("/question-metadata", {
        params: { activeOnly: "true" },
      });
      return response.data.metadata || [];
    },
  });

  const activeSchools = metadataList.filter((m) => m.type === "School");
  const activeBoards = metadataList.filter((m) => m.type === "Board");
  const activeYears = metadataList
    .filter((m) => m.type === "Year")
    .sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
  const activeLevels = metadataList.filter((m) => m.type === "Level");
  const activeSpecialSearches = metadataList.filter(
    (m) => m.type === "SpecialSearch",
  );

  const editQuestion = location.state?.editQuestion;

  useEffect(() => {
    if (editQuestion) {
      qm.handleOpenEditMode(editQuestion);
      // Clear navigation state so that refresh doesn't trigger edit mode again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [editQuestion, qm.handleOpenEditMode, navigate, location.pathname]);

  const formActiveTypes = Array.from(
    new Set(qm.allowedClasses.map((c) => c.type)),
  );
  const formActiveLevels = Array.from(
    new Set(
      qm.allowedClasses
        .filter((c) => c.type === qm.formType)
        .map((c) => c.level),
    ),
  );
  const formActiveClasses = qm.allowedClasses.filter(
    (c) => c.type === qm.formType && c.level === qm.formLevel,
  );

  const handleFormTypeChange = (type) => {
    qm.setFormType(type);
    const levels = Array.from(
      new Set(
        qm.allowedClasses.filter((c) => c.type === type).map((c) => c.level),
      ),
    );
    if (levels.length > 0) {
      const firstLevel = levels[0];
      qm.setFormLevel(firstLevel);
      const classes = qm.allowedClasses.filter(
        (c) => c.type === type && c.level === firstLevel,
      );
      if (classes.length > 0) {
        qm.setFormClass(classes[0].value, type, firstLevel);
        qm.setFormGroup("General");
        qm.setFormSubjectId("");
        qm.setFormChapterNumber("");
        qm.setFormTopics([]);
      }
    }
  };

  const handleFormLevelChange = (level) => {
    qm.setFormLevel(level);
    const classes = qm.allowedClasses.filter(
      (c) => c.type === qm.formType && c.level === level,
    );
    if (classes.length > 0) {
      qm.setFormClass(classes[0].value, qm.formType, level);
      qm.setFormGroup("General");
      qm.setFormSubjectId("");
      qm.setFormChapterNumber("");
      qm.setFormTopics([]);
    }
  };

  // Helper validation for steps
  const isStep1Valid = () => {
    return (
      qm.formType &&
      qm.formLevel &&
      qm.formClass &&
      qm.formSubjectId &&
      qm.formCategory
    );
  };

  const handleNextStep = () => {
    if (qm.activeStep === 1) {
      if (!isStep1Valid()) return;
      qm.setActiveStep(2);
    } else if (qm.activeStep === 2) {
      if (!qm.formChapterNumber) {
        setShowStep2Error(true);
        toast.error("অধ্যায় নির্বাচন করা আবশ্যক");
        return;
      }
      setShowStep2Error(false);
      qm.setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    qm.setActiveStep((prev) => prev - 1);
  };

  const handleStepClick = (step) => {
    if (step === 1) {
      qm.setActiveStep(1);
    } else if (step === 2) {
      if (isStep1Valid()) {
        qm.setActiveStep(2);
      }
    } else if (step === 3) {
      if (!isStep1Valid()) return;
      if (!qm.formChapterNumber) {
        setShowStep2Error(true);
        toast.error("অধ্যায় নির্বাচন করা আবশ্যক");
        return;
      }
      setShowStep2Error(false);
      qm.setActiveStep(3);
    }
  };

  const handleChapterSelect = (chapterNumber) => {
    qm.setFormChapterNumber(chapterNumber);
    qm.setFormTopics([]);
    setShowStep2Error(false);
  };

  const handleTopicToggle = (topic) => {
    qm.setFormTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  // Client & Server Duplicate Detection States
  const [serverDuplicates, setServerDuplicates] = useState([]);
  const [isCheckingServerDuplicates, setIsCheckingServerDuplicates] =
    useState(false);

  // 1. Instant Client-Side Duplicate Check (Derived via useMemo)
  const clientDuplicates = useMemo(() => {
    if (
      qm.activeStep !== 2 ||
      qm.step2EditorMode !== "json" ||
      !qm.rawPastedJsonText?.trim()
    ) {
      return [];
    }

    const validation = validateCategoryQuestionsJson(
      qm.rawPastedJsonText,
      qm.formCategory,
    );

    if (
      !validation.isValid ||
      !Array.isArray(validation.questions) ||
      validation.questions.length === 0
    ) {
      return [];
    }

    const clientDups = [];
    const textMap = new Map();

    validation.questions.forEach((q, idx) => {
      const index = idx + 1;
      const rawText = extractQuestionStem(q, qm.formCategory);
      const strippedText = stripHtmlText(rawText);

      if (strippedText) {
        if (textMap.has(strippedText)) {
          const firstIndex = textMap.get(strippedText);
          clientDups.push({
            index,
            text: strippedText,
            matchedWithIndex: firstIndex,
          });
        } else {
          textMap.set(strippedText, index);
        }
      }
    });

    return clientDups;
  }, [
    qm.rawPastedJsonText,
    qm.activeStep,
    qm.step2EditorMode,
    qm.formCategory,
  ]);

  // React Query Mutation for backend duplicate check
  const checkDuplicateMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post(
        "/questions/check-duplicates",
        payload,
      );
      return response.data;
    },
  });

  // 2. Debounced Server-Side Duplicate Check Effect
  useEffect(() => {
    if (
      qm.activeStep !== 2 ||
      qm.step2EditorMode !== "json" ||
      !qm.rawPastedJsonText?.trim()
    ) {
      const resetTimer = setTimeout(() => {
        setServerDuplicates([]);
        setIsCheckingServerDuplicates(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const validation = validateCategoryQuestionsJson(
      qm.rawPastedJsonText,
      qm.formCategory,
    );

    if (
      !validation.isValid ||
      !Array.isArray(validation.questions) ||
      validation.questions.length === 0
    ) {
      const resetTimer = setTimeout(() => {
        setServerDuplicates([]);
        setIsCheckingServerDuplicates(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(async () => {
      setIsCheckingServerDuplicates(true);
      try {
        const payload = {
          className: qm.formClass,
          subjectId: qm.formSubjectId,
          chapterNumber: Number(qm.formChapterNumber),
          category: qm.formCategory,
          questions: validation.questions,
        };
        const res = await checkDuplicateMutation.mutateAsync(payload);
        if (res?.success && Array.isArray(res.serverDuplicates)) {
          setServerDuplicates(res.serverDuplicates);
        } else {
          setServerDuplicates([]);
        }
      } catch (err) {
        console.error("Duplicate check failed:", err);
      } finally {
        setIsCheckingServerDuplicates(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    qm.rawPastedJsonText,
    qm.activeStep,
    qm.step2EditorMode,
    qm.formClass,
    qm.formSubjectId,
    qm.formChapterNumber,
    qm.formCategory,
  ]);

  // Handler to remove a specific duplicate question from rawPastedJsonText
  const handleRemoveDuplicateItem = (itemIndexToRemove) => {
    try {
      const parsed = JSON.parse(qm.rawPastedJsonText);
      if (Array.isArray(parsed)) {
        let flatIndex = 0;
        const updated = [];
        for (const item of parsed) {
          if (
            (item?.isGroup || item?.passageStem || item?.stem) &&
            Array.isArray(item?.questions)
          ) {
            const remainingSubQuestions = [];
            for (const subQ of item.questions) {
              flatIndex++;
              if (flatIndex !== itemIndexToRemove) {
                remainingSubQuestions.push(subQ);
              }
            }
            if (remainingSubQuestions.length > 0) {
              updated.push({ ...item, questions: remainingSubQuestions });
            }
          } else {
            flatIndex++;
            if (flatIndex !== itemIndexToRemove) {
              updated.push(item);
            }
          }
        }
        qm.setRawPastedJsonText(JSON.stringify(updated, null, 2));
        toast.success(`প্রশ্ন #${itemIndexToRemove} রিমুভ করা হয়েছে`);
      }
    } catch {
      toast.error("JSON ফরম্যাট সঠিক নয়");
    }
  };

  return {
    qm,
    navigate,
    activeDropdown,
    setActiveDropdown,
    showStep2Error,
    setShowStep2Error,
    formActiveTypes,
    formActiveLevels,
    formActiveClasses,
    handleFormTypeChange,
    handleFormLevelChange,
    isStep1Valid,
    handleNextStep,
    handlePrevStep,
    handleStepClick,
    handleChapterSelect,
    handleTopicToggle,
    activeSchools,
    activeBoards,
    activeYears,
    activeLevels,
    activeSpecialSearches,
    loadingMetadata,
    deleteConfirmId,
    setDeleteConfirmId,
    clientDuplicates,
    serverDuplicates,
    isCheckingServerDuplicates,
    handleRemoveDuplicateItem,
  };
}
