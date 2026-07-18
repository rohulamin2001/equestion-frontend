import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuestions } from "./useQuestions";
import { useUserContext } from "../../../context/UserContext.jsx";

const CATEGORY_ORDER = [
  "Creative",
  "BroadQuestion",
  "ShortAnswer",
  "MCQ",
  "FillInBlanks",
  "Matching",
  "Poem",
  "SentenceFormation",
  "ConjunctLetters",
  "WordMeaning",
  "Punctuation",
  "GenderChange",
  "Antonym",
  "FormFilling",
  "Paragraph",
  "Essay",
];

const CATEGORY_LABELS = {
  Creative: "সৃজনশীল প্রশ্ন",
  BroadQuestion: "রচনামূলক প্রশ্ন",
  ShortAnswer: "সংক্ষিপ্ত উত্তর প্রশ্ন",
  MCQ: "বহু নির্বাচনী প্রশ্ন",
  FillInBlanks: "শূন্যস্থান পূরণ",
  Matching: "বাম-ডান মিলকরণ",
  Poem: "কবিতা",
  SentenceFormation: "বাক্য গঠন",
  ConjunctLetters: "যুক্তবর্ণ",
  WordMeaning: "শব্দার্থ",
  Punctuation: "বিরামচিহ্ন",
  GenderChange: "লিঙ্গ পরিবর্তন",
  Antonym: "বিপরীত শব্দ",
  FormFilling: "ফরম পূরণ",
  Paragraph: "অনুচ্ছেদ",
  Essay: "রচনা",
};

export function useQuestionPreview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const targetId = searchParams.get("setId") || "";
  const idsParam = searchParams.get("setId") || searchParams.get("setIds") || "";

  const {
    loadingSets,
    activeSetId,
    setActiveSetId,
    activeSet: dbActiveSet,
    syllabusList,
  } = useQuestions();

  const [layoutSettings, setLayoutSettings] = useState({
    paperSize: "A4",
    columns: 1,
    columnDivider: true,
    lineSpacing: 0,
    columnGap: 15,
    fontSize: 14,
    fontFamily: "SolaimanLipi",
    optionStyle: "●",
    pagePaddingTop: 32,
    pagePaddingBottom: 32,
    pagePaddingLeft: 32,
    pagePaddingRight: 32,
    attachments: {
      answerSheet: false,
      omr: false,
      important: false,
      questionInfo: false,
      studentInfo: false,
      marksGrid: false,
      subjectCode: false,
    },
    metadata: {
      className: true,
      subjectName: true,
      chapterName: false,
      setCode: true,
      programName: true,
      instructions: true,
    },
    branding: {
      logo: false,
      header: false,
      footer: false,
      watermark: false,
      address: false,
    },
  });

  const { userProfile } = useUserContext();
  const [activeTab, setActiveTab] = useState("settings");
  const [editingSubjectCode, setEditingSubjectCode] = useState(false);
  const [initializedSetId, setInitializedSetId] = useState(null);
  const [activeSet, setActiveSet] = useState(null);

  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  if (dbActiveSet && dbActiveSet._id !== initializedSetId) {
    setInitializedSetId(dbActiveSet._id);
    setActiveSet(dbActiveSet);
    if (dbActiveSet.settings) {
      setLayoutSettings(dbActiveSet.settings);
    }
  }

  const handleEditorActivate = (rect) => {
    setToolbarPos({
      top: Math.max(10, rect.top - 10),
      left: rect.left + rect.width / 2,
    });
    setToolbarVisible(true);
  };

  const handleEditorDeactivate = () => {
    setToolbarVisible(false);
  };

  const questions = activeSet?.questions;
  const groupedQuestions = useMemo(() => {
    if (!questions) return [];

    const groups = {};
    questions.forEach((q) => {
      const cat = q.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(q);
    });

    const isCombinedMode = activeSet?.category === "Combined";
    const targetClasses = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
    const isTargetClass = targetClasses.includes(activeSet?.className);

    let finalOrder = CATEGORY_ORDER;
    if (isCombinedMode && isTargetClass) {
      finalOrder = [
        "MCQ",
        "ShortAnswer",
        "Creative",
        ...CATEGORY_ORDER.filter(cat => cat !== "MCQ" && cat !== "ShortAnswer" && cat !== "Creative")
      ];
    }

    const orderedGroups = [];

    finalOrder.forEach((cat) => {
      if (groups[cat] && groups[cat].length > 0) {
        let groupSerial = 1;
        const qsWithSerial = groups[cat].map((q) => ({
          ...q,
          serialNumber: groupSerial++,
        }));
        orderedGroups.push({
          category: cat,
          label: CATEGORY_LABELS[cat] || "সাধারণ প্রশ্ন",
          questions: qsWithSerial,
        });
        delete groups[cat];
      }
    });

    Object.keys(groups).forEach((cat) => {
      let groupSerial = 1;
      const qsWithSerial = groups[cat].map((q) => ({
        ...q,
        serialNumber: groupSerial++,
      }));
      orderedGroups.push({
        category: cat,
        label: CATEGORY_LABELS[cat] || cat,
        questions: qsWithSerial,
      });
    });

    return orderedGroups;
  }, [questions, activeSet?.category, activeSet?.className]);

  const handleSaveSetField = (field, value) => {
    if (!activeSet) return;
    setActiveSet((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveQuestionEdit = (question, updatedFields) => {
    if (!activeSet) return;

    const updatedQuestions = activeSet.questions.map((q) => {
      if ((q._id || q) === question._id) {
        return {
          ...q,
          ...updatedFields,
          mcqData:
            q.category === "MCQ"
              ? { ...q.mcqData, ...updatedFields.mcqData }
              : undefined,
          creativeData:
            q.category === "Creative"
              ? { ...q.creativeData, ...updatedFields.creativeData }
              : undefined,
          generalData: !["MCQ", "Creative"].includes(q.category)
            ? { ...q.generalData, ...updatedFields.generalData }
            : undefined,
        };
      }
      return q;
    });

    setActiveSet((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  useEffect(() => {
    if (targetId && activeSetId !== targetId) {
      setActiveSetId(targetId);
    }
  }, [targetId, activeSetId, setActiveSetId]);

  const handleSaveSettings = () => {
    // Only local state
  };

  const updateSettingField = (category, field, value) => {
    setLayoutSettings((prev) => {
      let updated;
      if (category) {
        updated = {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: value,
          },
        };
      } else {
        updated = {
          ...prev,
          [field]: value,
        };
      }
      handleSaveSettings(updated);
      return updated;
    });
  };

  const handleRemoveQuestion = (questionId) => {
    if (!activeSet) return;
    const updatedQuestions = activeSet.questions.filter(
      (q) => (q._id || q) !== questionId,
    );
    setActiveSet((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
    toast.success("প্রশ্নটি সাময়িকভাবে সরানো হয়েছে");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAll = () => {
    toast.success("প্রশ্নপত্র সেটিংস সংরক্ষণ করা হয়েছে!");
    navigate(`/dashboard/questions?setId=${idsParam}`);
  };

  const handleGoBackToSelect = () => {
    navigate(`/dashboard/questions/select?setId=${activeSetId}&setIds=${idsParam}`);
  };

  return {
    loadingSets,
    activeSet,
    layoutSettings,
    activeTab,
    setActiveTab,
    editingSubjectCode,
    setEditingSubjectCode,
    toolbarVisible,
    toolbarPos,
    groupedQuestions,
    handleEditorActivate,
    handleEditorDeactivate,
    handleSaveSetField,
    handleSaveQuestionEdit,
    updateSettingField,
    handleRemoveQuestion,
    handlePrint,
    handleSaveAll,
    handleGoBackToSelect,
    userProfile,
    syllabusList,
  };
}
