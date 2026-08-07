import { isGroupEnabledClass } from "@/constants/classes";
import apiClient from "@/lib/apiClient";
import { validateCategoryQuestionsJson } from "@/lib/jsonQuestionValidator";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useAcademicConfig } from "./useAcademicConfig";

export const isHtmlEmpty = (html) => {
  if (!html) return true;
  if (typeof html !== "string") return false;
  if (
    /<(img|svg|canvas|audio|video|iframe|embed|object|picture)[^>]*>/i.test(
      html,
    )
  ) {
    return false;
  }
  let text;
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      text = doc.body.textContent || doc.body.innerText || "";
    } catch {
      text = html.replace(/<[^>]*>/g, "");
    }
  } else {
    text = html.replace(/<[^>]*>/g, "");
  }
  return (
    text
      .replace(/\u00a0/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim().length === 0
  );
};

export function useQuestionManagement(options = {}) {
  const isSubmittingRef = useRef(false);
  const { isPersonalOnly = false, skipFetch = false, pageSize = 10 } = options;
  const queryClient = useQueryClient();
  const {
    allowedClasses,
    config,
    isLoading: configLoading,
  } = useAcademicConfig();

  // Wizard Step State
  const [activeStep, setActiveStep] = useState(1);
  const [isSavingPasted, setIsSavingPasted] = useState(false);

  // Active list filters (for QuestionBank and MyQuestions pages) - Derived State Pattern
  const [userFilterType, setUserFilterType] = useState("");
  const [userFilterLevel, setUserFilterLevel] = useState("");
  const [userFilterClass, setUserFilterClass] = useState("");

  const firstAllowed =
    allowedClasses && allowedClasses.length > 0 ? allowedClasses[0] : null;

  const filterType = userFilterType;
  const filterLevel = userFilterLevel;
  const filterClass = userFilterClass;

  const setFilterType = setUserFilterType;
  const setFilterLevel = setUserFilterLevel;
  const setFilterClass = (
    clsVal,
    targetTypeOverride = null,
    targetLevelOverride = null,
  ) => {
    const targetType =
      targetTypeOverride !== null
        ? targetTypeOverride
        : userFilterType || filterType;
    const targetLevel =
      targetLevelOverride !== null
        ? targetLevelOverride
        : userFilterLevel || filterLevel;
    const clsObj = allowedClasses.find(
      (c) =>
        c.value === clsVal && c.type === targetType && c.level === targetLevel,
    );
    if (clsObj) {
      setUserFilterType(clsObj.type);
      setUserFilterLevel(clsObj.level);
      setUserFilterClass(clsVal);
    } else {
      const fallbackObj = allowedClasses.find((c) => c.value === clsVal);
      if (fallbackObj) {
        setUserFilterType(fallbackObj.type);
        setUserFilterLevel(fallbackObj.level);
        setUserFilterClass(clsVal);
      } else {
        setUserFilterClass(clsVal);
      }
    }
  };

  const [filterSubjectId, setFilterSubjectId] = useState("");
  const [filterChapter, setFilterChapter] = useState("");
  const [filterVersion, setFilterVersion] = useState("");

  const [filterCategory, setFilterCategory] = useState("");

  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPersonal, setFilterPersonal] = useState(isPersonalOnly);

  // Form Field States - Derived State Pattern
  const [userFormType, setUserFormType] = useState(null);
  const [userFormLevel, setUserFormLevel] = useState(null);
  const [userFormClass, setUserFormClass] = useState(null);

  const isFormSelectionValid = allowedClasses.some(
    (c) =>
      c.value === userFormClass &&
      c.type === userFormType &&
      c.level === userFormLevel,
  );

  const formType = isFormSelectionValid
    ? userFormType
    : firstAllowed
      ? firstAllowed.type
      : "School";
  const formLevel = isFormSelectionValid
    ? userFormLevel
    : firstAllowed
      ? firstAllowed.level
      : "Secondary";
  const formClass = isFormSelectionValid
    ? userFormClass
    : firstAllowed
      ? firstAllowed.value
      : "Class 6";

  const setFormType = setUserFormType;
  const setFormLevel = setUserFormLevel;
  const setFormClass = useCallback(
    (clsVal, targetTypeOverride = null, targetLevelOverride = null) => {
      const targetType =
        targetTypeOverride !== null
          ? targetTypeOverride
          : userFormType || formType;
      const targetLevel =
        targetLevelOverride !== null
          ? targetLevelOverride
          : userFormLevel || formLevel;
      const clsObj = allowedClasses.find(
        (c) =>
          c.value === clsVal &&
          c.type === targetType &&
          c.level === targetLevel,
      );
      if (clsObj) {
        setUserFormType(clsObj.type);
        setUserFormLevel(clsObj.level);
        setUserFormClass(clsVal);
      } else {
        const fallbackObj = allowedClasses.find((c) => c.value === clsVal);
        if (fallbackObj) {
          setUserFormType(fallbackObj.type);
          setUserFormLevel(fallbackObj.level);
          setUserFormClass(clsVal);
        } else {
          setUserFormClass(clsVal);
        }
      }
    },
    [
      allowedClasses,
      userFormType,
      formType,
      userFormLevel,
      formLevel,
      setUserFormType,
      setUserFormLevel,
      setUserFormClass,
    ],
  );

  const [userFormVersion, setUserFormVersion] = useState(null);
  const defaultVersion =
    config?.versions && config.versions.length > 0
      ? config.versions[0]
      : "Bangla";
  const formVersion = userFormVersion ?? defaultVersion;

  const changeFormVersion = (val) => {
    setUserFormVersion(val);
    setFormSubjectId("");
    setFormChapterNumber("");
    setFormTopics([]);
  };

  const [formSubjectId, setFormSubjectId] = useState("");
  const [formGroup, setFormGroup] = useState("General");
  const [formChapterNumber, setFormChapterNumber] = useState("");
  const [formTopics, setFormTopics] = useState([]);

  // Fetch Syllabus list (for populating Class & Subject dropdowns)
  const { data: syllabusList = [], isLoading: loadingSyllabus } = useQuery({
    queryKey: ["globalSyllabusList"],
    queryFn: async () => {
      const response = await apiClient.get("/syllabus");
      return response.data.syllabus;
    },
  });

  // Get active subjects for selected class inside the form, filtering by group if class 9-12
  const formSubjects = syllabusList.filter((s) => {
    if (s.className !== formClass) return false;
    if (s.institutionType !== formType) return false;
    if (s.academicLevel !== formLevel) return false;

    const syllabusVersion = s.version || "Bangla";
    if (syllabusVersion !== formVersion) return false;
    const isClass9to12 = isGroupEnabledClass(formClass);
    if (isClass9to12) {
      // Show subjects matching selected group OR general group
      return s.group === formGroup || s.group === "General" || !s.group;
    }
    return true;
  });
  // Get active chapters for selected subject inside the form
  const selectedSyllabusObj = syllabusList.find((s) => s._id === formSubjectId);
  const formChapters = selectedSyllabusObj?.chapters || [];

  // Derived formCategory based on subject allowed categories
  const [userFormCategory, setUserFormCategory] = useState("MCQ");
  const allowedCategoriesForSubject =
    formSubjectId && selectedSyllabusObj
      ? selectedSyllabusObj?.subjectId?.categories || []
      : [];

  const formCategory =
    allowedCategoriesForSubject.length > 0
      ? allowedCategoriesForSubject.includes(userFormCategory)
        ? userFormCategory
        : allowedCategoriesForSubject[0]
      : "";
  const setFormCategory = setUserFormCategory;

  const [formDifficulty, setFormDifficulty] = useState("Medium");

  // New metadata fields
  const [formYear, setFormYear] = useState([]);
  const [formBoard, setFormBoard] = useState([]);
  const [formExamHistory, setFormExamHistory] = useState([
    { board: "", years: [] },
  ]);
  const [formSchool, setFormSchool] = useState([]);
  const [formLevelTag, setFormLevelTag] = useState("");
  const [formSpecialSearch, setFormSpecialSearch] = useState([]);

  const addExamHistoryRow = useCallback(() => {
    setFormExamHistory((prev) => [...prev, { board: "", years: [] }]);
  }, []);

  const removeExamHistoryRow = useCallback((index) => {
    setFormExamHistory((prev) =>
      prev.length > 1
        ? prev.filter((_, i) => i !== index)
        : [{ board: "", years: [] }],
    );
  }, []);

  const updateExamHistoryBoard = useCallback((index, boardName) => {
    setFormExamHistory((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, board: boardName } : item,
      ),
    );
  }, []);

  const toggleExamHistoryYear = useCallback((index, yearStr) => {
    setFormExamHistory((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const exists = item.years.includes(yearStr);
        const newYears = exists
          ? item.years.filter((y) => y !== yearStr)
          : [...item.years, yearStr];
        return { ...item, years: newYears };
      }),
    );
  }, []);

  // Draft list for batch question creation
  const [questionsList, setQuestionsList] = useState([]);
  const [editingDraftId, setEditingDraftId] = useState(null);

  // MCQ Specific Form Fields
  const [isGroupedMcq, setIsGroupedMcq] = useState(false);
  const [mcqGroupQuestions, setMcqGroupQuestions] = useState([
    {
      mcqType: "Simple",
      mcqQuestionText: "",
      mcqStatements: ["", "", ""],
      mcqOptions: ["", "", "", ""],
      mcqCorrectAnswer: 0,
      mcqExplanation: "",
    },
    {
      mcqType: "Simple",
      mcqQuestionText: "",
      mcqStatements: ["", "", ""],
      mcqOptions: ["", "", "", ""],
      mcqCorrectAnswer: 0,
      mcqExplanation: "",
    },
  ]);

  const [mcqType, setMcqType] = useState("Simple");
  const [mcqStem, setMcqStem] = useState("");
  const [mcqQuestionText, setMcqQuestionText] = useState("");
  const [mcqStatements, setMcqStatements] = useState(["", "", ""]); // for MultipleCompletion
  const [mcqOptions, setMcqOptions] = useState(["", "", "", ""]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);
  const [mcqExplanation, setMcqExplanation] = useState("");

  // Creative (সৃজনশীল) Specific Form Fields
  const [creativeStem, setCreativeStem] = useState("");
  const [creativeCognitiveA, setCreativeCognitiveA] = useState("");
  const [creativeCognitiveA_Answer, setCreativeCognitiveA_Answer] =
    useState("");
  const [creativeCognitiveB, setCreativeCognitiveB] = useState("");
  const [creativeCognitiveB_Answer, setCreativeCognitiveB_Answer] =
    useState("");
  const [creativeCognitiveC, setCreativeCognitiveC] = useState("");
  const [creativeCognitiveC_Answer, setCreativeCognitiveC_Answer] =
    useState("");
  const [creativeCognitiveD, setCreativeCognitiveD] = useState("");
  const [creativeCognitiveD_Answer, setCreativeCognitiveD_Answer] =
    useState("");

  // General Questions (Short/Broad/Matching/FillInBlanks)
  const [generalQuestionText, setGeneralQuestionText] = useState("");
  const [generalStem, setGeneralStem] = useState(""); // structured stem (optional)
  const [generalSubQuestions, setGeneralSubQuestions] = useState([]); // array of { text: '', marks: '' }
  const [generalSuggestedAnswer, setGeneralSuggestedAnswer] = useState("");
  const [generalMarks, setGeneralMarks] = useState(1);

  const [editingQuestion, setEditingQuestion] = useState(null); // null if creating
  const [editingPassageGroup, setEditingPassageGroup] = useState(null);

  // Step 2 Editor Mode: 'form' (default manual form) | 'json' (smart JSON paste mode)
  const [step2EditorMode, setStep2EditorMode] = useState("form");
  const [rawPastedJsonText, setRawPastedJsonText] = useState("");

  // Reset Form
  const resetForm = useCallback(
    (resetStepAndMeta = false) => {
      if (resetStepAndMeta) {
        setActiveStep(1);
        setFormType(filterType);
        setFormLevel(filterLevel);
        setFormClass(filterClass);
        setUserFormVersion(null);
        setFormSubjectId("");
        setFormGroup("General");
        setFormChapterNumber("");
        setFormTopics([]);
        setFormCategory("MCQ");
        setFormDifficulty("Medium");

        // Reset metadata
        setFormYear([]);
        setFormBoard([]);
        setFormExamHistory([{ board: "", years: [] }]);
        setFormSchool([]);
        setFormLevelTag("");
        setFormSpecialSearch([]);
      }

      setQuestionsList([]);
      setEditingDraftId(null);
      setEditingPassageGroup(null);
      setStep2EditorMode("form");
      setRawPastedJsonText("");

      setIsGroupedMcq(false);
      setMcqGroupQuestions([
        {
          mcqType: "Simple",
          mcqQuestionText: "",
          mcqStatements: ["", "", ""],
          mcqOptions: ["", "", "", ""],
          mcqCorrectAnswer: 0,
          mcqExplanation: "",
        },
        {
          mcqType: "Simple",
          mcqQuestionText: "",
          mcqStatements: ["", "", ""],
          mcqOptions: ["", "", "", ""],
          mcqCorrectAnswer: 0,
          mcqExplanation: "",
        },
      ]);

      setMcqType("Simple");
      setMcqStem("");
      setMcqQuestionText("");
      setMcqStatements(["", "", ""]);
      setMcqOptions(["", "", "", ""]);
      setMcqCorrectAnswer(0);
      setMcqExplanation("");

      setCreativeStem("");
      setCreativeCognitiveA("");
      setCreativeCognitiveA_Answer("");
      setCreativeCognitiveB("");
      setCreativeCognitiveB_Answer("");
      setCreativeCognitiveC("");
      setCreativeCognitiveC_Answer("");
      setCreativeCognitiveD("");
      setCreativeCognitiveD_Answer("");

      setGeneralQuestionText("");
      setGeneralStem("");
      setGeneralSubQuestions([]);
      setGeneralSuggestedAnswer("");
      setGeneralMarks(1);

      setEditingQuestion(null);
    },
    [filterClass, filterType, filterLevel],
  );

  // Set form values from existing question for editing
  const handleOpenEditMode = useCallback((target) => {
    if (!target) return;

    if (target.isGroup) {
      const qMeta = target.meta || target.questions?.[0] || {};
      setEditingPassageGroup(target);
      setEditingQuestion(qMeta);

      setFormType(qMeta.institutionType || "School");
      setFormLevel(qMeta.academicLevel || "Secondary");
      setFormClass(qMeta.className);
      setUserFormVersion(qMeta.subjectId?.version || "Bangla");
      setFormSubjectId(qMeta.subjectId?._id || qMeta.subjectId || "");
      setFormGroup(qMeta.subjectId?.group || "General");
      setFormChapterNumber(
        qMeta.chapterNumber ? qMeta.chapterNumber.toString() : "",
      );
      setFormTopics(qMeta.topics || []);
      setFormCategory("MCQ");
      setFormDifficulty(qMeta.difficulty || "Medium");

      setFormYear(
        Array.isArray(qMeta.year)
          ? [...qMeta.year]
          : typeof qMeta.year === "string" && qMeta.year
            ? qMeta.year.split(",").map((s) => s.trim())
            : [],
      );
      setFormBoard(
        Array.isArray(qMeta.board)
          ? [...qMeta.board]
          : typeof qMeta.board === "string" && qMeta.board
            ? qMeta.board.split(",").map((s) => s.trim())
            : [],
      );
      setFormSchool(
        Array.isArray(qMeta.school)
          ? [...qMeta.school]
          : typeof qMeta.school === "string" && qMeta.school
            ? qMeta.school.split(",").map((s) => s.trim())
            : [],
      );
      setFormLevelTag(qMeta.level || "");
      setFormSpecialSearch(
        Array.isArray(qMeta.specialSearch)
          ? [...qMeta.specialSearch]
          : typeof qMeta.specialSearch === "string" && qMeta.specialSearch
            ? qMeta.specialSearch.split(",").map((s) => s.trim())
            : [],
      );

      setIsGroupedMcq(true);
      setMcqStem(target.passageStem || "");
      setMcqGroupQuestions(
        (target.questions || []).map((q) => ({
          _id: q._id,
          mcqType: q.mcqData?.mcqType || "Simple",
          mcqQuestionText: q.mcqData?.questionText || "",
          mcqStatements: q.mcqData?.statements?.length
            ? [...q.mcqData.statements]
            : ["", "", ""],
          mcqOptions: q.mcqData?.options?.length
            ? [...q.mcqData.options]
            : ["", "", "", ""],
          mcqCorrectAnswer: q.mcqData?.correctAnswer ?? 0,
          mcqExplanation: q.mcqData?.explanation || "",
        })),
      );

      setActiveStep(2);
      return;
    }

    const question = target;
    setEditingPassageGroup(null);
    setEditingQuestion(question);

    setFormType(question.institutionType || "School");
    setFormLevel(question.academicLevel || "Secondary");
    setFormClass(question.className);
    setUserFormVersion(question.subjectId?.version || "Bangla");
    setFormSubjectId(question.subjectId?._id || question.subjectId || "");
    setFormGroup(question.subjectId?.group || "General");
    setFormChapterNumber(question.chapterNumber.toString());
    setFormTopics(question.topics || []);
    setFormCategory(question.category);
    setFormDifficulty(question.difficulty);

    // Load examHistory
    if (
      Array.isArray(question.examHistory) &&
      question.examHistory.length > 0
    ) {
      setFormExamHistory(
        question.examHistory.map((eh) => ({
          board: eh.board || "",
          years: Array.isArray(eh.years) ? [...eh.years] : [],
        })),
      );
    } else if (
      (Array.isArray(question.board) && question.board.length > 0) ||
      (Array.isArray(question.year) && question.year.length > 0)
    ) {
      setFormExamHistory([
        {
          board: question.board?.[0] || "",
          years: Array.isArray(question.year) ? [...question.year] : [],
        },
      ]);
    } else {
      setFormExamHistory([{ board: "", years: [] }]);
    }

    setFormYear(
      Array.isArray(question.year)
        ? [...question.year]
        : typeof question.year === "string" && question.year
          ? question.year.split(",").map((s) => s.trim())
          : [],
    );
    setFormBoard(
      Array.isArray(question.board)
        ? [...question.board]
        : typeof question.board === "string" && question.board
          ? question.board.split(",").map((s) => s.trim())
          : [],
    );
    setFormSchool(
      Array.isArray(question.school)
        ? [...question.school]
        : typeof question.school === "string" && question.school
          ? question.school.split(",").map((s) => s.trim())
          : [],
    );
    setFormLevelTag(question.level || "");
    setFormSpecialSearch(
      Array.isArray(question.specialSearch)
        ? [...question.specialSearch]
        : typeof question.specialSearch === "string" && question.specialSearch
          ? question.specialSearch.split(",").map((s) => s.trim())
          : [],
    );

    if (question.category === "MCQ") {
      setMcqType(question.mcqData?.mcqType || "Simple");
      setMcqStem(question.mcqData?.stem || "");
      setMcqQuestionText(question.mcqData?.questionText || "");
      setMcqStatements(question.mcqData?.statements || ["", "", ""]);
      setMcqOptions(question.mcqData?.options || ["", "", "", ""]);
      setMcqCorrectAnswer(question.mcqData?.correctAnswer || 0);
      setMcqExplanation(question.mcqData?.explanation || "");
    } else if (question.category === "Creative") {
      setCreativeStem(question.creativeData?.stem || "");
      setCreativeCognitiveA(
        question.creativeData?.subQuestions?.cognitiveA?.text || "",
      );
      setCreativeCognitiveA_Answer(
        question.creativeData?.subQuestions?.cognitiveA?.answer || "",
      );
      setCreativeCognitiveB(
        question.creativeData?.subQuestions?.cognitiveB?.text || "",
      );
      setCreativeCognitiveB_Answer(
        question.creativeData?.subQuestions?.cognitiveB?.answer || "",
      );
      setCreativeCognitiveC(
        question.creativeData?.subQuestions?.cognitiveC?.text || "",
      );
      setCreativeCognitiveC_Answer(
        question.creativeData?.subQuestions?.cognitiveC?.answer || "",
      );
      setCreativeCognitiveD(
        question.creativeData?.subQuestions?.cognitiveD?.text || "",
      );
      setCreativeCognitiveD_Answer(
        question.creativeData?.subQuestions?.cognitiveD?.answer || "",
      );
    } else {
      setGeneralQuestionText(question.generalData?.questionText || "");
      setGeneralStem(question.generalData?.stem || "");
      setGeneralSubQuestions(question.generalData?.subQuestions || []);
      setGeneralSuggestedAnswer(question.generalData?.suggestedAnswer || "");
      setGeneralMarks(question.generalData?.marks || 1);
    }

    setActiveStep(2); // Jump straight to editor when editing
  }, []);

  const [sortOrder, setSortOrder] = useState("desc");
  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  // Fetch Questions list (for QuestionBank and MyQuestions)
  const questionsQuery = useInfiniteQuery({
    queryKey: [
      filterPersonal ? "myQuestionsList" : "globalQuestionsList",
      filterType,
      filterLevel,
      filterClass,
      filterSubjectId,
      filterChapter,
      filterCategory,
      filterDifficulty,
      filterSearch,
      filterVersion,
      filterStatus,
      filterPersonal,
      pageSize,
      sortOrder,
    ],
    enabled: !skipFetch,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        className: filterClass,
        personal: filterPersonal ? "true" : "false",
        institutionType: filterType,
        academicLevel: filterLevel,
        page: pageParam,
        limit: pageSize,
        sortOrder,
      };
      if (filterSubjectId) params.subjectId = filterSubjectId;
      if (filterChapter) params.chapterNumber = filterChapter;
      if (filterCategory) params.category = filterCategory;
      if (filterDifficulty) params.difficulty = filterDifficulty;
      if (filterSearch) params.search = filterSearch;
      if (filterVersion) params.version = filterVersion;

      if (filterStatus) {
        params.status = filterStatus;
      } else if (!filterPersonal) {
        params.status = "Approved";
      }

      const response = await apiClient.get("/questions", { params });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination || {};
      return page < pages ? page + 1 : undefined;
    },
  });

  // Add Question Mutation
  const addQuestionMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/questions", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["personalQuestionStats"] });
      toast.success("প্রশ্নটি সফলভাবে ডাটাবেজে যুক্ত হয়েছে!");
      resetForm();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "প্রশ্ন সংরক্ষণ করতে ব্যর্থ হয়েছে",
      );
    },
    onSettled: () => {
      isSubmittingRef.current = false;
    },
  });

  // Update Question Mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.put(`/questions/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["personalQuestionStats"] });
      toast.success("প্রশ্নটি সফলভাবে আপডেট করা হয়েছে!");
      resetForm();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error ||
          err.message ||
          "প্রশ্ন আপডেট করতে ব্যর্থ হয়েছে",
      );
    },
    onSettled: () => {
      isSubmittingRef.current = false;
    },
  });

  // Delete Question Mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (target) => {
      const id = typeof target === "object" ? target.id : target;
      const deleteAllGroup =
        typeof target === "object" ? target.deleteAllGroup : false;
      const url = deleteAllGroup
        ? `/questions/${id}?deleteAllGroup=true`
        : `/questions/${id}`;
      await apiClient.delete(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["globalQuestionsList"] });
      queryClient.invalidateQueries({ queryKey: ["personalQuestionStats"] });
      toast.success("প্রশ্নটি সফলভাবে মুছে ফেলা হয়েছে!");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || err.message || "প্রশ্ন মুছতে ব্যর্থ হয়েছে",
      );
    },
  });

  // Insert sample Category JSON template without top-level metadata (metadata will be auto-injected from UI)
  const handleInsertSampleCategoryJson = useCallback(
    (subType = "All") => {
      let sample;
      if (formCategory === "MCQ") {
        const simpleSample = {
          difficulty: "Easy",
          topics: ["সততার পুরস্কার"],
          examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026", "2025"] }],
          school: ["মতিঝিল আইডিয়াল স্কুল ও কলেজ"],
          level: "জ্ঞান",
          specialSearch: ["অনুশীলনি"],
          mcqData: {
            mcqType: "Simple",
            questionText:
              "<p>'সততার পুরস্কার' গল্পে প্রথম লোকটির শরীরে কী রোগ ছিল?</p>",
            options: [
              "<p>ধবল রোগ</p>",
              "<p>টাকপড়া</p>",
              "<p>অন্ধত্ব</p>",
              "<p>জ্বর</p>",
            ],
            correctAnswer: 0,
            explanation:
              "<p>গল্প অনুযায়ী প্রথম লোকটির শরীর ধবল রোগে আক্রান্ত ছিল।</p>",
          },
        };

        const multipleCompletionSample = {
          difficulty: "Medium",
          topics: ["সততার পুরস্কার"],
          examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
          school: ["ভিকারুননিসা নূন স্কুল ও কলেজ"],
          level: "অনুধাবন",
          specialSearch: ["রিপিটেড স্কুল"],
          mcqData: {
            mcqType: "MultipleCompletion",
            questionText: "<p>'সততার পুরস্কার' গল্পের মূল শিক্ষা হলো—</p>",
            statements: [
              "সততা ও ঈমানদারী",
              "আল্লাহর প্রতি কৃতজ্ঞতা প্রকাশ",
              "অকৃতজ্ঞতার কুফল",
            ],
            options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
            correctAnswer: 3,
            explanation:
              "<p>তিনটি বাক্যই সততার পুরস্কার গল্পের মূল শিক্ষার অন্তর্ভুক্ত।</p>",
          },
        };

        const contextualSample = {
          difficulty: "Hard",
          topics: ["সততার পুরস্কার"],
          examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
          school: ["গভ. ল্যাবরেটরি হাই স্কুল"],
          level: "প্রয়োগ",
          specialSearch: ["অভিন্ন তথ্যভিত্তিক"],
          mcqData: {
            mcqType: "Contextual",
            stem: "<p>রাফিজ একজন গরিব লোককে সাধ্যমতো সাহায্য করল, কিন্তু তার ভাই কালাম তাকে তাড়িয়ে দিল।</p>",
            questionText:
              "<p>উদ্দীপকের রাফিজের আচরণের সাথে 'সততার পুরস্কার' গল্পের কোন চরিত্রের মিল রয়েছে?</p>",
            options: [
              "<p>তৃতীয় ইহুদি</p>",
              "<p>প্রথম ইহুদি</p>",
              "<p>দ্বিতীয় ইহুদি</p>",
              "<p>ফেরেশতা</p>",
            ],
            correctAnswer: 0,
            explanation:
              "<p>তৃতীয় ইহুদি অন্ধত্ব দূর হওয়ার পর আল্লাহর প্রতি কৃতজ্ঞ ছিল।</p>",
          },
        };

        const groupedSample = {
          isGroup: true,
          passageStem:
            "<p>রফিক সাহেব তার জমিতে রাসায়নিক সারের পরিবর্তে জৈব সার ব্যবহার করায় জমির উর্বরতা বৃদ্ধি পেল এবং ফলন ভালো হলো...</p>",
          questions: [
            {
              difficulty: "Medium",
              topics: ["উদ্ভিদের শারীরতত্ত্ব"],
              examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
              school: ["ভিকারুননিসা নূন স্কুল ও কলেজ"],
              level: "Famous School",
              mcqData: {
                mcqType: "Simple",
                questionText:
                  "<p>উদ্দীপকে রফিক সাহেবের ব্যবহৃত সার ব্যবহারের মূল সুবিধা কোনটি?</p>",
                options: [
                  "মাটির অনুজীব রক্ষা পায়",
                  "উৎপাদন খরচ বহুগুণ বাড়ে",
                  "মাটির অম্লতা বৃদ্ধি পায়",
                  "পানির ধারণক্ষমতা কমে",
                ],
                correctAnswer: 0,
                explanation:
                  "<p>জৈব সার মাটির গঠন উন্নত করে এবং অনুজীবের ক্রিয়া বৃদ্ধি করে।</p>",
              },
            },
            {
              difficulty: "Hard",
              topics: ["উদ্ভিদের শারীরতত্ত্ব"],
              examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
              mcqData: {
                mcqType: "MultipleCompletion",
                questionText: "<p>সবুজ সার ব্যবহারের ফলে—</p>",
                statements: [
                  "মাটির উর্বরতা স্থায়ী হয়",
                  "পরিবেশবান্ধব কৃষিকাজ নিশ্চিত হয়",
                  "রাসায়নিক দূষণ হ্রাস পায়",
                ],
                options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
                correctAnswer: 3,
                explanation: "<p>তিনটি তথ্যই সঠিক।</p>",
              },
            },
          ],
        };

        if (subType === "Simple") {
          sample = [simpleSample];
        } else if (subType === "MultipleCompletion") {
          sample = [multipleCompletionSample];
        } else if (subType === "Contextual") {
          sample = [contextualSample];
        } else if (subType === "Grouped") {
          sample = [groupedSample];
        } else {
          sample = [
            simpleSample,
            multipleCompletionSample,
            contextualSample,
            groupedSample,
          ];
        }
      } else if (formCategory === "Creative") {
        sample = [
          {
            difficulty: "Medium",
            topics: ["উদ্ভিদের শারীরতত্ত্ব"],
            examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
            school: ["ঢাকা রেসিডেনসিয়াল মডেল কলেজ"],
            level: "Famous School",
            specialSearch: ["পরীক্ষায় আসার মতো"],
            creativeData: {
              stem: "<p>এখানে মূল উদ্দীপক বা অনুচ্ছেদটি লিখুন...</p>",
              subQuestions: {
                cognitiveA: {
                  text: "<p>'ক' (জ্ঞানমূলক) প্রশ্ন লিখুন...</p>",
                  answer: "<p>'ক' প্রশ্নের উত্তর...</p>",
                  marks: 1,
                },
                cognitiveB: {
                  text: "<p>'খ' (অনুধাবনমূলক) প্রশ্ন লিখুন...</p>",
                  answer: "<p>'খ' প্রশ্নের উত্তর...</p>",
                  marks: 2,
                },
                cognitiveC: {
                  text: "<p>'গ' (প্রয়োগমূলক) প্রশ্ন লিখুন...</p>",
                  answer: "<p>'গ' প্রশ্নের উত্তর...</p>",
                  marks: 3,
                },
                cognitiveD: {
                  text: "<p>'ঘ' (উচ্চতর দক্ষতা) প্রশ্ন লিখুন...</p>",
                  answer: "<p>'ঘ' প্রশ্নের উত্তর...</p>",
                  marks: 4,
                },
              },
            },
          },
        ];
      } else {
        sample = [
          {
            difficulty: "Easy",
            topics: ["সাধারণ জ্ঞান"],
            examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
            school: ["গভ. ল্যাবরেটরি হাই স্কুল"],
            level: "Top School",
            specialSearch: ["সংক্ষিপ্ত প্রশ্ন"],
            generalData: {
              questionText: "<p>এখানে সংক্ষিপ্ত প্রশ্নটি লিখুন...</p>",
              suggestedAnswer: "<p>এখানে উত্তর লিখুন...</p>",
              marks: 2,
            },
          },
        ];
      }
      setRawPastedJsonText(JSON.stringify(sample, null, 2));
    },
    [formCategory],
  );

  // Save pasted raw JSON questions by auto-injecting UI Step 1 & Step 2 metadata
  const savePastedJsonQuestions = useCallback(async () => {
    if (
      !formClass ||
      !formSubjectId ||
      !formChapterNumber ||
      !formCategory ||
      !formType ||
      !formLevel
    ) {
      toast.error(
        "দয়া করে আবশ্যকীয় মেটাডাটা ক্ষেত্রসমূহ (Class, Subject, Chapter, Category) পূরণ করুন",
      );
      return;
    }

    const validation = validateCategoryQuestionsJson(
      rawPastedJsonText,
      formCategory,
    );
    if (
      !validation.isValid ||
      !validation.questions ||
      validation.questions.length === 0
    ) {
      toast.error(
        "JSON ডাটাতে কোনো বৈধ প্রশ্ন পাওয়া যায়নি। দয়া করে এররসমূহ ঠিক করুন।",
      );
      return;
    }

    const cleanedExamHistory = formExamHistory
      .filter((item) => item.board && item.years && item.years.length > 0)
      .map((item) => ({ board: item.board, years: item.years }));

    // Inject global metadata into each question object
    const finalPayloads = validation.questions.map((q) => {
      const qExamHistory =
        Array.isArray(q.examHistory) && q.examHistory.length > 0
          ? q.examHistory
          : cleanedExamHistory;
      const qDerivedBoards = Array.from(
        new Set(qExamHistory.map((item) => item.board)),
      );
      const qDerivedYears = Array.from(
        new Set(qExamHistory.flatMap((item) => item.years)),
      );

      const parseSchoolSemicolons = (val, fallback = []) => {
        if (!val || (Array.isArray(val) && val.length === 0)) return fallback;
        if (typeof val === "string") {
          return val
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        if (Array.isArray(val)) {
          return val
            .flatMap((item) =>
              typeof item === "string" ? item.split(";") : item,
            )
            .map((s) => (typeof s === "string" ? s.trim() : s))
            .filter(Boolean);
        }
        return fallback;
      };

      return {
        ...q,
        className: formClass,
        subjectId: formSubjectId,
        chapterNumber: Number(formChapterNumber),
        topics: q.topics || formTopics || [],
        category: formCategory,
        difficulty: q.difficulty || formDifficulty || "Medium",
        institutionType: formType,
        academicLevel: formLevel,
        examHistory: qExamHistory,
        year: qDerivedYears.length > 0 ? qDerivedYears : formYear,
        board: qDerivedBoards.length > 0 ? qDerivedBoards : formBoard,
        school: parseSchoolSemicolons(q.school, formSchool || []),
        level: q.level || formLevelTag || "",
        specialSearch: q.specialSearch || formSpecialSearch || [],
      };
    });

    if (isSavingPasted || addQuestionMutation.isPending) return;

    setIsSavingPasted(true);
    isSubmittingRef.current = true;
    try {
      await addQuestionMutation.mutateAsync(finalPayloads);
      setRawPastedJsonText("");
    } catch (err) {
      console.error("Error saving pasted questions:", err);
    } finally {
      setIsSavingPasted(false);
      isSubmittingRef.current = false;
    }
  }, [
    isSavingPasted,
    formClass,
    formSubjectId,
    formChapterNumber,
    formCategory,
    formType,
    formLevel,
    rawPastedJsonText,
    formExamHistory,
    formTopics,
    formDifficulty,
    formYear,
    formBoard,
    formSchool,
    formLevelTag,
    formSpecialSearch,
    addQuestionMutation,
  ]);

  // Validate and build payload from current editor values
  const buildPayloadFromForm = useCallback(() => {
    if (
      !formClass ||
      !formSubjectId ||
      !formChapterNumber ||
      !formCategory ||
      !formType ||
      !formLevel
    ) {
      toast.error("দয়া করে আবশ্যকীয় মেটাডাটা ক্ষেত্রসমূহ পূরণ করুন");
      return null;
    }

    const cleanedExamHistory = formExamHistory
      .filter((item) => item.board && item.years && item.years.length > 0)
      .map((item) => ({
        board: item.board,
        years: item.years,
      }));

    const derivedBoards = Array.from(
      new Set(cleanedExamHistory.map((item) => item.board)),
    );
    const derivedYears = Array.from(
      new Set(cleanedExamHistory.flatMap((item) => item.years)),
    );

    const payload = {
      className: formClass,
      subjectId: formSubjectId,
      chapterNumber: Number(formChapterNumber),
      topics: formTopics,
      category: formCategory,
      difficulty: formDifficulty,
      institutionType: formType,
      academicLevel: formLevel,
      examHistory: cleanedExamHistory,
      year: derivedYears.length > 0 ? derivedYears : formYear,
      board: derivedBoards.length > 0 ? derivedBoards : formBoard,
      school: formSchool,
      level: formLevelTag,
      specialSearch: formSpecialSearch,
    };

    if (formCategory === "MCQ") {
      if (isGroupedMcq) {
        if (isHtmlEmpty(mcqStem)) {
          toast.error("উদ্দীপকভিত্তিক প্রশ্নগুচ্ছের জন্য উদ্দীপক আবশ্যক");
          return null;
        }

        const payloads = [];
        const groupId =
          Date.now().toString() + Math.random().toString(36).substring(2, 9);
        const stemText = mcqStem.trim();

        for (let i = 0; i < mcqGroupQuestions.length; i++) {
          const mq = mcqGroupQuestions[i];
          if (isHtmlEmpty(mq.mcqQuestionText)) {
            toast.error(`প্রশ্ন ${i + 1} এর মূল টেক্সট আবশ্যক`);
            return null;
          }
          if (
            mq.mcqType === "MultipleCompletion" &&
            mq.mcqStatements.filter((s) => !isHtmlEmpty(s)).length < 2
          ) {
            toast.error(
              `প্রশ্ন ${i + 1} এর জন্য অন্তত ২টি বক্তব্য প্রদান করুন`,
            );
            return null;
          }
          if (mq.mcqOptions.some((o) => isHtmlEmpty(o))) {
            toast.error(`প্রশ্ন ${i + 1} এর ৪টি অপশনই আবশ্যক`);
            return null;
          }

          payloads.push({
            ...payload,
            passageGroupId: groupId,
            passageStem: stemText,
            passageOrder: i,
            mcqData: {
              mcqType: mq.mcqType,
              questionText: mq.mcqQuestionText.trim(),
              statements:
                mq.mcqType === "MultipleCompletion"
                  ? mq.mcqStatements
                      .filter((s) => !isHtmlEmpty(s))
                      .map((s) => s.trim())
                  : [],
              options: mq.mcqOptions.map((o) =>
                isHtmlEmpty(o) ? "" : o.trim(),
              ),
              correctAnswer: Number(mq.mcqCorrectAnswer),
              explanation: isHtmlEmpty(mq.mcqExplanation)
                ? ""
                : mq.mcqExplanation.trim(),
            },
          });
        }
        return payloads;
      } else {
        payload.mcqData = {
          mcqType,
          stem: isHtmlEmpty(mcqStem) ? "" : mcqStem.trim(),
          questionText: isHtmlEmpty(mcqQuestionText)
            ? ""
            : mcqQuestionText.trim(),
          statements:
            mcqType === "MultipleCompletion"
              ? mcqStatements
                  .filter((s) => !isHtmlEmpty(s))
                  .map((s) => s.trim())
              : [],
          options: mcqOptions.map((o) => (isHtmlEmpty(o) ? "" : o.trim())),
          correctAnswer: Number(mcqCorrectAnswer),
          explanation: isHtmlEmpty(mcqExplanation) ? "" : mcqExplanation.trim(),
        };

        if (mcqType === "Contextual" && isHtmlEmpty(mcqStem)) {
          toast.error(
            "বহুপদী/অভিন্ন তথ্যভিত্তিক বহুনির্বাচনি প্রশ্নের জন্য উদ্দীপক আবশ্যক",
          );
          return null;
        }
        if (isHtmlEmpty(mcqQuestionText) && mcqType !== "Contextual") {
          toast.error(
            "দয়া করে বহুনির্বাচনি প্রশ্নের মূল টেক্সট লিখুন (খালি স্পেস গ্রহণযোগ্য নয়)",
          );
          return null;
        }
        if (
          mcqType === "MultipleCompletion" &&
          payload.mcqData.statements.length < 2
        ) {
          toast.error(
            "বহুপদী সমাপ্তিসূচক প্রশ্নের জন্য অন্তত ২টি বক্তব্য প্রদান করুন",
          );
          return null;
        }
        if (payload.mcqData.options.some((o) => isHtmlEmpty(o))) {
          toast.error(
            "বহুনির্বাচনি প্রশ্নের ৪টি অপশনই আবশ্যক (খালি স্পেস গ্রহণযোগ্য নয়)",
          );
          return null;
        }
      }
    } else if (formCategory === "Creative") {
      payload.creativeData = {
        stem: isHtmlEmpty(creativeStem) ? "" : creativeStem.trim(),
        subQuestions: {
          cognitiveA: {
            text: isHtmlEmpty(creativeCognitiveA)
              ? ""
              : creativeCognitiveA.trim(),
            answer: isHtmlEmpty(creativeCognitiveA_Answer)
              ? ""
              : creativeCognitiveA_Answer.trim(),
            marks: 1,
          },
          cognitiveB: {
            text: isHtmlEmpty(creativeCognitiveB)
              ? ""
              : creativeCognitiveB.trim(),
            answer: isHtmlEmpty(creativeCognitiveB_Answer)
              ? ""
              : creativeCognitiveB_Answer.trim(),
            marks: 2,
          },
          cognitiveC: {
            text: isHtmlEmpty(creativeCognitiveC)
              ? ""
              : creativeCognitiveC.trim(),
            answer: isHtmlEmpty(creativeCognitiveC_Answer)
              ? ""
              : creativeCognitiveC_Answer.trim(),
            marks: 3,
          },
          cognitiveD: {
            text: isHtmlEmpty(creativeCognitiveD)
              ? ""
              : creativeCognitiveD.trim(),
            answer: isHtmlEmpty(creativeCognitiveD_Answer)
              ? ""
              : creativeCognitiveD_Answer.trim(),
            marks: 4,
          },
        },
      };

      if (isHtmlEmpty(creativeStem)) {
        toast.error(
          "সৃজনশীল প্রশ্নের জন্য উদ্দীপক আবশ্যক (খালি স্পেস গ্রহণযোগ্য নয়)",
        );
        return null;
      }
      if (isHtmlEmpty(creativeCognitiveA)) {
        toast.error(
          "সৃজনশীল প্রশ্নের 'ক' নং প্রশ্ন পূরণ করুন (খালি স্পেস গ্রহণযোগ্য নয়)",
        );
        return null;
      }
      if (isHtmlEmpty(creativeCognitiveB)) {
        toast.error(
          "সৃজনশীল প্রশ্নের 'খ' নং প্রশ্ন পূরণ করুন (খালি স্পেস গ্রহণযোগ্য নয়)",
        );
        return null;
      }
      if (isHtmlEmpty(creativeCognitiveC)) {
        toast.error(
          "সৃজনশীল প্রশ্নের 'গ' নং প্রশ্ন পূরণ করুন (খালি স্পেস গ্রহণযোগ্য নয়)",
        );
        return null;
      }
      if (isHtmlEmpty(creativeCognitiveD)) {
        toast.error(
          "সৃজনশীল প্রশ্নের 'ঘ' নং প্রশ্ন পূরণ করুন (খালি স্পেস গ্রহণযোগ্য নয়)",
        );
        return null;
      }
    } else {
      payload.generalData = {
        questionText: isHtmlEmpty(generalQuestionText)
          ? ""
          : generalQuestionText.trim(),
        stem: isHtmlEmpty(generalStem) ? "" : generalStem.trim(),
        subQuestions: generalSubQuestions
          .filter((q) => !isHtmlEmpty(q.text))
          .map((q) => ({ text: q.text.trim(), marks: Number(q.marks) || 1 })),
        suggestedAnswer: isHtmlEmpty(generalSuggestedAnswer)
          ? ""
          : generalSuggestedAnswer.trim(),
        marks: Number(generalMarks) || 1,
      };

      if (isHtmlEmpty(generalQuestionText)) {
        toast.error("দয়া করে প্রশ্নের বিবরণ লিখুন (খালি স্পেস গ্রহণযোগ্য নয়)");
        return null;
      }
    }

    return payload;
  }, [
    formClass,
    formSubjectId,
    formChapterNumber,
    formTopics,
    formCategory,
    formDifficulty,
    formType,
    formLevel,
    formYear,
    formBoard,
    formSchool,
    formLevelTag,
    formSpecialSearch,
    isGroupedMcq,
    mcqGroupQuestions,
    mcqType,
    mcqStem,
    mcqQuestionText,
    mcqStatements,
    mcqOptions,
    mcqCorrectAnswer,
    mcqExplanation,
    creativeStem,
    creativeCognitiveA,
    creativeCognitiveB,
    creativeCognitiveC,
    creativeCognitiveD,
    generalQuestionText,
    generalStem,
    generalSubQuestions,
    generalSuggestedAnswer,
    generalMarks,
  ]);

  // Add current form data as a draft question to list
  const addQuestionToList = useCallback(() => {
    const qPayload = buildPayloadFromForm();
    if (!qPayload) return false;

    // Attach temporary frontend ID
    if (Array.isArray(qPayload)) {
      const payloadsWithIds = qPayload.map((p) => ({
        ...p,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      }));
      setQuestionsList((prev) => [...prev, ...payloadsWithIds]);
    } else {
      qPayload.id =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setQuestionsList((prev) => [...prev, qPayload]);
    }

    // Clear question editors only, keep metadata
    setIsGroupedMcq(false);
    setMcqGroupQuestions([
      {
        mcqType: "Simple",
        mcqQuestionText: "",
        mcqStatements: ["", "", ""],
        mcqOptions: ["", "", "", ""],
        mcqCorrectAnswer: 0,
        mcqExplanation: "",
      },
      {
        mcqType: "Simple",
        mcqQuestionText: "",
        mcqStatements: ["", "", ""],
        mcqOptions: ["", "", "", ""],
        mcqCorrectAnswer: 0,
        mcqExplanation: "",
      },
    ]);
    setMcqType("Simple");
    setMcqStem("");
    setMcqQuestionText("");
    setMcqStatements(["", "", ""]);
    setMcqOptions(["", "", "", ""]);
    setMcqCorrectAnswer(0);
    setMcqExplanation("");

    setCreativeStem("");

    // Clear new metadata (keep metadata, only clear cognitive subquestions for creative and general fields)
    setCreativeCognitiveA("");
    setCreativeCognitiveA_Answer("");
    setCreativeCognitiveB("");
    setCreativeCognitiveB_Answer("");
    setCreativeCognitiveC("");
    setCreativeCognitiveC_Answer("");
    setCreativeCognitiveD("");
    setCreativeCognitiveD_Answer("");

    setGeneralQuestionText("");
    setGeneralStem("");
    setGeneralSubQuestions([]);
    setGeneralSuggestedAnswer("");
    setGeneralMarks(1);

    toast.success("প্রশ্নটি সফলভাবে তালিকায় যুক্ত হয়েছে!");
    return true;
  }, [buildPayloadFromForm]);

  // Remove draft question from list
  const removeQuestionFromList = useCallback((tempId) => {
    setQuestionsList((prev) => prev.filter((q) => q.id !== tempId));
  }, []);

  // Edit draft question from list
  const editDraftQuestion = useCallback(
    (draftId) => {
      const question = questionsList.find((q) => q.id === draftId);
      if (!question) return;

      setEditingDraftId(draftId);

      setFormType(question.institutionType || "School");
      setFormLevel(question.academicLevel || "Secondary");
      setFormClass(question.className);

      // Find subject version from syllabusList
      const syllabusObj = syllabusList.find(
        (s) => s._id === question.subjectId,
      );
      setUserFormVersion(syllabusObj?.version || "Bangla");

      setFormSubjectId(question.subjectId);
      setFormGroup(syllabusObj?.group || "General");
      setFormChapterNumber(question.chapterNumber.toString());
      setFormTopics(question.topics || []);
      setFormCategory(question.category);
      setFormDifficulty(question.difficulty);

      // Load metadata
      setFormYear(
        Array.isArray(question.year)
          ? [...question.year]
          : typeof question.year === "string" && question.year
            ? question.year.split(",").map((s) => s.trim())
            : [],
      );
      setFormBoard(
        Array.isArray(question.board)
          ? [...question.board]
          : typeof question.board === "string" && question.board
            ? question.board.split(",").map((s) => s.trim())
            : [],
      );
      setFormSchool(
        Array.isArray(question.school)
          ? [...question.school]
          : typeof question.school === "string" && question.school
            ? question.school.split(",").map((s) => s.trim())
            : [],
      );
      setFormLevelTag(question.level || "");
      setFormSpecialSearch(
        Array.isArray(question.specialSearch)
          ? [...question.specialSearch]
          : typeof question.specialSearch === "string" && question.specialSearch
            ? question.specialSearch.split(",").map((s) => s.trim())
            : [],
      );

      if (question.category === "MCQ") {
        setMcqType(question.mcqData?.mcqType || "Simple");
        setMcqStem(question.mcqData?.stem || "");
        setMcqQuestionText(question.mcqData?.questionText || "");
        setMcqStatements(question.mcqData?.statements || ["", "", ""]);
        setMcqOptions(question.mcqData?.options || ["", "", "", ""]);
        setMcqCorrectAnswer(question.mcqData?.correctAnswer || 0);
        setMcqExplanation(question.mcqData?.explanation || "");
      } else if (question.category === "Creative") {
        setCreativeStem(question.creativeData?.stem || "");
        setCreativeCognitiveA(
          question.creativeData?.subQuestions?.cognitiveA?.text || "",
        );
        setCreativeCognitiveA_Answer(
          question.creativeData?.subQuestions?.cognitiveA?.answer || "",
        );
        setCreativeCognitiveB(
          question.creativeData?.subQuestions?.cognitiveB?.text || "",
        );
        setCreativeCognitiveB_Answer(
          question.creativeData?.subQuestions?.cognitiveB?.answer || "",
        );
        setCreativeCognitiveC(
          question.creativeData?.subQuestions?.cognitiveC?.text || "",
        );
        setCreativeCognitiveC_Answer(
          question.creativeData?.subQuestions?.cognitiveC?.answer || "",
        );
        setCreativeCognitiveD(
          question.creativeData?.subQuestions?.cognitiveD?.text || "",
        );
        setCreativeCognitiveD_Answer(
          question.creativeData?.subQuestions?.cognitiveD?.answer || "",
        );
      } else {
        setGeneralQuestionText(question.generalData?.questionText || "");
        setGeneralStem(question.generalData?.stem || "");
        setGeneralSubQuestions(question.generalData?.subQuestions || []);
        setGeneralSuggestedAnswer(question.generalData?.suggestedAnswer || "");
        setGeneralMarks(question.generalData?.marks || 1);
      }
    },
    [
      questionsList,
      syllabusList,
      setFormType,
      setFormLevel,
      setFormClass,
      setUserFormVersion,
      setFormSubjectId,
      setFormGroup,
      setFormChapterNumber,
      setFormTopics,
      setFormCategory,
      setFormDifficulty,
      setFormYear,
      setFormBoard,
      setFormSchool,
      setFormLevelTag,
      setFormSpecialSearch,
      setMcqType,
      setMcqStem,
      setMcqQuestionText,
      setMcqStatements,
      setMcqOptions,
      setMcqCorrectAnswer,
      setMcqExplanation,
      setCreativeStem,
      setCreativeCognitiveA,
      setCreativeCognitiveA_Answer,
      setCreativeCognitiveB,
      setCreativeCognitiveB_Answer,
      setCreativeCognitiveC,
      setCreativeCognitiveC_Answer,
      setCreativeCognitiveD,
      setCreativeCognitiveD_Answer,
      setGeneralQuestionText,
      setGeneralStem,
      setGeneralSubQuestions,
      setGeneralSuggestedAnswer,
      setGeneralMarks,
    ],
  );

  // Update draft question in the list
  const updateDraftQuestion = useCallback(() => {
    if (!editingDraftId) return false;
    const qPayload = buildPayloadFromForm();
    if (!qPayload) return false;

    // Retain the same temporary ID
    qPayload.id = editingDraftId;

    // Update in questionsList
    setQuestionsList((prev) =>
      prev.map((q) => (q.id === editingDraftId ? qPayload : q)),
    );

    // Clear question editors only, keep metadata
    setMcqType("Simple");
    setMcqStem("");
    setMcqQuestionText("");
    setMcqStatements(["", "", ""]);
    setMcqOptions(["", "", "", ""]);
    setMcqCorrectAnswer(0);
    setMcqExplanation("");

    setCreativeStem("");
    setCreativeCognitiveA("");
    setCreativeCognitiveB("");
    setCreativeCognitiveC("");
    setCreativeCognitiveD("");

    setGeneralQuestionText("");
    setGeneralStem("");
    setGeneralSubQuestions([]);
    setGeneralSuggestedAnswer("");
    setGeneralMarks(1);

    // Clear new metadata
    setFormYear([]);
    setFormBoard([]);
    setFormSchool([]);
    setFormLevelTag("");
    setFormSpecialSearch([]);

    setEditingDraftId(null);
    toast.success("প্রশ্নটি সফলভাবে তালিকায় আপডেট করা হয়েছে!");
    return true;
  }, [
    editingDraftId,
    buildPayloadFromForm,
    setQuestionsList,
    setMcqType,
    setMcqStem,
    setMcqQuestionText,
    setMcqStatements,
    setMcqOptions,
    setMcqCorrectAnswer,
    setMcqExplanation,
    setCreativeStem,
    setCreativeCognitiveA,
    setCreativeCognitiveB,
    setCreativeCognitiveC,
    setCreativeCognitiveD,
    setGeneralQuestionText,
    setGeneralStem,
    setGeneralSubQuestions,
    setGeneralSuggestedAnswer,
    setGeneralMarks,
    setFormYear,
    setFormBoard,
    setFormSchool,
    setFormLevelTag,
    setFormSpecialSearch,
    setEditingDraftId,
  ]);

  // Cancel editing draft question
  const cancelEditDraft = useCallback(() => {
    setEditingDraftId(null);

    // Clear editors
    setMcqType("Simple");
    setMcqStem("");
    setMcqQuestionText("");
    setMcqStatements(["", "", ""]);
    setMcqOptions(["", "", "", ""]);
    setMcqCorrectAnswer(0);
    setMcqExplanation("");

    setCreativeStem("");
    setCreativeCognitiveA("");
    setCreativeCognitiveB("");
    setCreativeCognitiveC("");
    setCreativeCognitiveD("");

    setGeneralQuestionText("");
    setGeneralStem("");
    setGeneralSubQuestions([]);
    setGeneralSuggestedAnswer("");
    setGeneralMarks(1);

    // Clear new metadata
    setFormYear([]);
    setFormBoard([]);
    setFormSchool([]);
    setFormLevelTag("");
    setFormSpecialSearch([]);
  }, [
    setMcqType,
    setMcqStem,
    setMcqQuestionText,
    setMcqStatements,
    setMcqOptions,
    setMcqCorrectAnswer,
    setMcqExplanation,
    setCreativeStem,
    setCreativeCognitiveA,
    setCreativeCognitiveB,
    setCreativeCognitiveC,
    setCreativeCognitiveD,
    setGeneralQuestionText,
    setGeneralStem,
    setGeneralSubQuestions,
    setGeneralSuggestedAnswer,
    setGeneralMarks,
    setFormYear,
    setFormBoard,
    setFormSchool,
    setFormLevelTag,
    setFormSpecialSearch,
    setEditingDraftId,
  ]);

  // Submit Handler
  const handleSaveQuestion = async () => {
    if (isSubmittingRef.current || formLoading) return;
    isSubmittingRef.current = true;

    if (editingPassageGroup || (editingQuestion && isGroupedMcq)) {
      const groupId =
        editingPassageGroup?.passageGroupId ||
        editingQuestion?.passageGroupId ||
        Date.now().toString();
      if (isHtmlEmpty(mcqStem)) {
        toast.error("উদ্দীপকভিত্তিক প্রশ্নগুচ্ছের জন্য উদ্দীপক আবশ্যক");
        isSubmittingRef.current = false;
        return;
      }

      // Validate all sub-questions
      for (let i = 0; i < mcqGroupQuestions.length; i++) {
        const mq = mcqGroupQuestions[i];
        if (isHtmlEmpty(mq.mcqQuestionText)) {
          toast.error(`প্রশ্ন ${i + 1} এর মূল টেক্সট আবশ্যক`);
          isSubmittingRef.current = false;
          return;
        }
        if (
          mq.mcqType === "MultipleCompletion" &&
          mq.mcqStatements.filter((s) => !isHtmlEmpty(s)).length < 2
        ) {
          toast.error(`প্রশ্ন ${i + 1} এর জন্য অন্তত ২টি বক্তব্য প্রদান করুন`);
          isSubmittingRef.current = false;
          return;
        }
        if (mq.mcqOptions.some((o) => isHtmlEmpty(o))) {
          toast.error(`প্রশ্ন ${i + 1} এর ৪টি অপশনই আবশ্যক`);
          isSubmittingRef.current = false;
          return;
        }
      }

      try {
        const basePayload = {
          className: formClass,
          institutionType: formType,
          academicLevel: formLevel,
          subjectId: formSubjectId,
          chapterNumber: Number(formChapterNumber),
          topics: formTopics,
          category: "MCQ",
          difficulty: formDifficulty,
          year: formYear,
          board: formBoard,
          school: formSchool,
          level: formLevelTag,
          specialSearch: formSpecialSearch,
          passageGroupId: groupId,
          passageStem: mcqStem.trim(),
        };

        const originalQuestions = editingPassageGroup?.questions || [];
        const originalIds = new Set(originalQuestions.map((q) => q._id));
        const currentIds = new Set(
          mcqGroupQuestions.map((mq) => mq._id).filter(Boolean),
        );

        const updatePromises = [];
        const newPayloads = [];

        for (let i = 0; i < mcqGroupQuestions.length; i++) {
          const mq = mcqGroupQuestions[i];
          const itemPayload = {
            ...basePayload,
            passageOrder: i,
            mcqData: {
              mcqType: mq.mcqType,
              questionText: mq.mcqQuestionText.trim(),
              statements:
                mq.mcqType === "MultipleCompletion"
                  ? mq.mcqStatements
                      .filter((s) => !isHtmlEmpty(s))
                      .map((s) => s.trim())
                  : [],
              options: mq.mcqOptions.map((o) =>
                isHtmlEmpty(o) ? "" : o.trim(),
              ),
              correctAnswer: Number(mq.mcqCorrectAnswer),
              explanation: isHtmlEmpty(mq.mcqExplanation)
                ? ""
                : mq.mcqExplanation.trim(),
            },
          };

          if (mq._id && originalIds.has(mq._id)) {
            updatePromises.push(
              apiClient.put(`/questions/${mq._id}`, itemPayload),
            );
          } else {
            newPayloads.push(itemPayload);
          }
        }

        const deletePromises = [];
        for (const qId of originalIds) {
          if (!currentIds.has(qId)) {
            deletePromises.push(apiClient.delete(`/questions/${qId}`));
          }
        }

        if (newPayloads.length > 0) {
          updatePromises.push(apiClient.post("/questions", newPayloads));
        }

        await Promise.all([...updatePromises, ...deletePromises]);

        toast.success("উদ্দীপকভিত্তিক প্রশ্নগুচ্ছ সফলভাবে হালনাগাদ করা হয়েছে");
        queryClient.invalidateQueries({ queryKey: ["questions"] });
        queryClient.invalidateQueries({ queryKey: ["questionStats"] });
        setEditingPassageGroup(null);
        setEditingQuestion(null);
        resetForm();
      } catch (err) {
        console.error("Passage group edit error:", err);
        toast.error("উদ্দীপকভিত্তিক প্রশ্নগুচ্ছ সেভ করতে সমস্যা হয়েছে");
      } finally {
        isSubmittingRef.current = false;
      }
      return;
    }

    if (editingQuestion) {
      const payload = buildPayloadFromForm();
      if (!payload) {
        isSubmittingRef.current = false;
        return;
      }
      updateQuestionMutation.mutate({ id: editingQuestion._id, payload });
      return;
    }

    let payloads;
    if (questionsList.length > 0) {
      payloads = questionsList.map((q) => {
        const payload = { ...q };
        delete payload.id;
        return payload;
      });
    } else {
      const singlePayload = buildPayloadFromForm();
      if (!singlePayload) {
        isSubmittingRef.current = false;
        return;
      }
      payloads = Array.isArray(singlePayload) ? singlePayload : [singlePayload];
    }

    addQuestionMutation.mutate(payloads);
  };

  const formLoading =
    addQuestionMutation.isPending || updateQuestionMutation.isPending;

  return {
    // Wizard Steps
    activeStep,
    setActiveStep,

    // Syllabus helpers
    syllabusList,
    loadingSyllabus,
    formSubjects,
    formChapters,
    selectedSyllabusObj,
    allowedClasses,
    configLoading,

    // Filter states
    filterType,
    setFilterType,
    filterLevel,
    setFilterLevel,
    filterClass,
    setFilterClass,
    filterSubjectId,
    setFilterSubjectId,
    filterChapter,
    setFilterChapter,
    filterCategory,
    setFilterCategory,
    filterDifficulty,
    setFilterDifficulty,
    filterSearch,
    setFilterSearch,
    filterVersion,
    setFilterVersion,
    filterStatus,
    setFilterStatus,
    filterPersonal,
    setFilterPersonal,
    sortOrder,
    setSortOrder,
    toggleSortOrder,

    // Form fields & setters
    formType,
    setFormType,
    formLevel,
    setFormLevel,
    formClass,
    setFormClass,
    formSubjectId,
    setFormSubjectId,
    formGroup,
    setFormGroup,
    formChapterNumber,
    setFormChapterNumber,
    formTopics,
    setFormTopics,
    formCategory,
    setFormCategory,
    formDifficulty,
    setFormDifficulty,
    formVersion,
    changeFormVersion,
    config,

    // Metadata fields & setters
    formYear,
    setFormYear,
    formBoard,
    setFormBoard,
    formExamHistory,
    setFormExamHistory,
    addExamHistoryRow,
    removeExamHistoryRow,
    updateExamHistoryBoard,
    toggleExamHistoryYear,
    formSchool,
    setFormSchool,
    formLevelTag,
    setFormLevelTag,
    formSpecialSearch,
    setFormSpecialSearch,

    // MCQ fields & setters
    isGroupedMcq,
    setIsGroupedMcq,
    mcqGroupQuestions,
    setMcqGroupQuestions,
    mcqType,
    setMcqType,
    mcqStem,
    setMcqStem,
    mcqQuestionText,
    setMcqQuestionText,
    mcqStatements,
    setMcqStatements,
    mcqOptions,
    setMcqOptions,
    mcqCorrectAnswer,
    setMcqCorrectAnswer,
    mcqExplanation,
    setMcqExplanation,

    // Creative fields & setters
    creativeStem,
    setCreativeStem,
    creativeCognitiveA,
    setCreativeCognitiveA,
    creativeCognitiveA_Answer,
    setCreativeCognitiveA_Answer,
    creativeCognitiveB,
    setCreativeCognitiveB,
    creativeCognitiveB_Answer,
    setCreativeCognitiveB_Answer,
    creativeCognitiveC,
    setCreativeCognitiveC,
    creativeCognitiveC_Answer,
    setCreativeCognitiveC_Answer,
    creativeCognitiveD,
    setCreativeCognitiveD,
    creativeCognitiveD_Answer,
    setCreativeCognitiveD_Answer,

    // General fields & setters
    generalQuestionText,
    setGeneralQuestionText,
    generalStem,
    setGeneralStem,
    generalSubQuestions,
    setGeneralSubQuestions,
    generalSuggestedAnswer,
    setGeneralSuggestedAnswer,
    generalMarks,
    setGeneralMarks,

    // CRUD Queries & Mutations
    questionsQuery,
    deleteQuestionMutation,
    handleSaveQuestion,
    handleOpenEditMode,
    resetForm,

    // Draft batch creation
    questionsList,
    setQuestionsList,
    addQuestionToList,
    removeQuestionFromList,
    editingDraftId,
    editDraftQuestion,
    updateDraftQuestion,
    cancelEditDraft,

    // API statuses
    formLoading,
    editingQuestion,
    editingPassageGroup,
    isSavingPasted: isSavingPasted || addQuestionMutation.isPending,
    isSavingBulk: isSavingPasted || addQuestionMutation.isPending,

    // Step 2 Editor Mode & Smart JSON Paste
    step2EditorMode,
    setStep2EditorMode,
    rawPastedJsonText,
    setRawPastedJsonText,
    handleInsertSampleCategoryJson,
    savePastedJsonQuestions,
  };
}
