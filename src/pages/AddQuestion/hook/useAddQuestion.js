import { CATEGORIES_MAP } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import { useQuestionManagement } from "@/hooks/useQuestionManagement";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  Easy: { label: "সহজ", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Medium: { label: "মধ্যম", color: "bg-amber-50 text-amber-700 border-amber-200" },
  Hard: { label: "কঠিন", color: "bg-red-50 text-red-700 border-red-200" },
};

export { CATEGORIES_MAP, CLASSES_MAP };

export function useAddQuestion() {
  const { getToken } = useAuth();
  const qm = useQuestionManagement({ skipFetch: true });
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'class' | 'subject' | 'chapter' | 'school' | 'board' | 'year' | 'levelTag' | null
  const [showStep2Error, setShowStep2Error] = useState(false);

  // Fetch all active metadata options
  const { data: metadataList = [], isLoading: loadingMetadata } = useQuery({
    queryKey: ["activeMetadataList"],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get("/question-metadata", {
        params: { activeOnly: "true" },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.metadata || [];
    },
  });

  const activeSchools = metadataList.filter((m) => m.type === "School");
  const activeBoards = metadataList.filter((m) => m.type === "Board");
  const activeYears = metadataList.filter((m) => m.type === "Year");
  const activeLevels = metadataList.filter((m) => m.type === "Level");
  const activeSpecialSearches = metadataList.filter((m) => m.type === "SpecialSearch");

  useEffect(() => {
    if (location.state?.editQuestion) {
      qm.handleOpenEditMode(location.state.editQuestion);
      // Clear navigation state so that refresh doesn't trigger edit mode again
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, qm, navigate, location.pathname]);

  const formActiveTypes = Array.from(new Set(qm.allowedClasses.map((c) => c.type)));
  const formActiveLevels = Array.from(
    new Set(qm.allowedClasses.filter((c) => c.type === qm.formType).map((c) => c.level))
  );
  const formActiveClasses = qm.allowedClasses.filter(
    (c) => c.type === qm.formType && c.level === qm.formLevel
  );

  const handleFormTypeChange = (type) => {
    qm.setFormType(type);
    const levels = Array.from(
      new Set(qm.allowedClasses.filter((c) => c.type === type).map((c) => c.level))
    );
    if (levels.length > 0) {
      const firstLevel = levels[0];
      qm.setFormLevel(firstLevel);
      const classes = qm.allowedClasses.filter(
        (c) => c.type === type && c.level === firstLevel
      );
      if (classes.length > 0) {
        qm.setFormClass(classes[0].value);
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
      (c) => c.type === qm.formType && c.level === level
    );
    if (classes.length > 0) {
      qm.setFormClass(classes[0].value);
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
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
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
  };
}
