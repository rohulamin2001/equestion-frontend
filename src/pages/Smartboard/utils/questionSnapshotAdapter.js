import { getCategoryDisplayName } from "@/constants/categories";
import { getStructuredGeneralData } from "@/utils/generalQuestionUtils";

const OPTION_LETTERS_BN = ["ক", "খ", "গ", "ঘ", "ঙ"];
const SUB_KEYS_CREATIVE = [
  { key: "cognitiveA", label: "ক", defaultMarks: 1 },
  { key: "cognitiveB", label: "খ", defaultMarks: 2 },
  { key: "cognitiveC", label: "গ", defaultMarks: 3 },
  { key: "cognitiveD", label: "ঘ", defaultMarks: 4 },
];

/**
 * Strips HTML tags to produce concise plain-text preview snippets for drawers.
 */
export function stripHtmlPreview(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Normalizes any Question document from Smart Proshno Bank (`MCQ`, `Creative`, or 40+ `generalData` categories)
 * into a self-contained immutable Smartboard snapshot object.
 */
export function normalizeQuestionToSnapshot(question, subjectContext = null) {
  if (!question || typeof question !== "object") {
    return {
      category: "Question",
      categoryLabel: "প্রশ্ন",
      mcqType: null,
      stimulus: "",
      instruction: "",
      questionText: "",
      statements: [],
      options: [],
      correctOptionIndex: null,
      correctAnswer: "",
      explanation: "",
      subQuestions: [],
      suggestedAnswer: "",
      marks: null,
      imageUrl: "",
    };
  }

  const category = question.category || question.questionType || "MCQ";
  const categoryLabel = getCategoryDisplayName(
    category,
    subjectContext || question.subjectId || false,
  );
  const sharedPassage = question.passageStem || "";
  const imageUrl = question.imageUrl || question.questionImage || "";

  // 1. MCQ (`question.mcqData`)
  if (category === "MCQ" && question.mcqData) {
    const mcq = question.mcqData;
    const options = Array.isArray(mcq.options) ? [...mcq.options] : [];
    const statements = Array.isArray(mcq.statements)
      ? mcq.statements.filter(Boolean)
      : [];
    const correctIdx =
      typeof mcq.correctAnswer === "number" &&
      mcq.correctAnswer >= 0 &&
      mcq.correctAnswer < options.length
        ? mcq.correctAnswer
        : null;

    const correctAnswerText =
      correctIdx !== null
        ? `(${OPTION_LETTERS_BN[correctIdx] || correctIdx + 1}) ${options[correctIdx]}`
        : "";

    return {
      category,
      categoryLabel: categoryLabel || "বহু নির্বাচনী প্রশ্ন",
      mcqType: mcq.mcqType || "Simple",
      stimulus: sharedPassage || mcq.stem || "",
      instruction: "",
      questionText: mcq.questionText || "",
      statements,
      options,
      correctOptionIndex: correctIdx,
      correctAnswer: correctAnswerText,
      explanation: mcq.explanation || "",
      subQuestions: [],
      suggestedAnswer: "",
      marks: mcq.marks ?? 1,
      imageUrl,
    };
  }

  // 2. Creative / সৃজনশীল (`question.creativeData`)
  if (category === "Creative" && question.creativeData) {
    const cq = question.creativeData;
    const rawSubs = cq.subQuestions || {};
    const subQuestions = SUB_KEYS_CREATIVE.map(({ key, label, defaultMarks }) => {
      const item = rawSubs[key];
      if (!item || (!item.text && !item.answer)) return null;
      return {
        label,
        text: item.text || "",
        answer: item.answer || "",
        marks: item.marks ?? defaultMarks,
      };
    }).filter(Boolean);

    const totalMarks = subQuestions.reduce(
      (sum, sq) => sum + (Number(sq.marks) || 0),
      0,
    );

    return {
      category,
      categoryLabel: categoryLabel || "সৃজনশীল প্রশ্ন",
      mcqType: null,
      stimulus: cq.stem || sharedPassage || "",
      instruction: "",
      questionText: "",
      statements: [],
      options: [],
      correctOptionIndex: null,
      correctAnswer: "",
      explanation: "",
      subQuestions,
      suggestedAnswer: "",
      marks: totalMarks || 10,
      imageUrl,
    };
  }

  // 3. General & English/Bangla Special Categories (`question.generalData`)
  if (question.generalData) {
    const parsed = getStructuredGeneralData(question.generalData);
    const subQuestions = Array.isArray(parsed.subQuestions)
      ? parsed.subQuestions.map((sq, idx) => ({
          label: sq.identifier || `${OPTION_LETTERS_BN[idx] || idx + 1}.`,
          text: sq.text || "",
          answer: sq.answer || "",
          marks: sq.marks ?? null,
        }))
      : [];

    // When structured subQuestions exist, `instruction` holds the prompt line and `stem` holds the passage
    const primaryQuestionHtml =
      subQuestions.length > 0 ? parsed.instruction || "" : parsed.questionText || "";

    return {
      category,
      categoryLabel: categoryLabel || category,
      mcqType: null,
      stimulus: sharedPassage || parsed.stem || "",
      instruction: parsed.instruction || "",
      questionText: primaryQuestionHtml,
      statements: [],
      options: [],
      correctOptionIndex: null,
      correctAnswer: "",
      explanation: "",
      subQuestions,
      suggestedAnswer: parsed.suggestedAnswer || "",
      marks: parsed.marks || null,
      imageUrl,
    };
  }

  // 4. Fallback for plain / legacy question payloads
  const fallbackOptions = Array.isArray(question.options)
    ? [...question.options]
    : [];
  const fallbackIdx =
    typeof question.correctOptionIndex === "number"
      ? question.correctOptionIndex
      : typeof question.correctAnswer === "number"
        ? question.correctAnswer
        : null;

  return {
    category,
    categoryLabel: categoryLabel || category,
    mcqType: null,
    stimulus: sharedPassage || question.stimulus || question.stem || "",
    instruction: "",
    questionText:
      question.questionText || question.question || question.stem || "",
    statements: [],
    options: fallbackOptions,
    correctOptionIndex: fallbackIdx,
    correctAnswer:
      fallbackIdx !== null && fallbackOptions[fallbackIdx]
        ? `(${OPTION_LETTERS_BN[fallbackIdx] || fallbackIdx + 1}) ${fallbackOptions[fallbackIdx]}`
        : typeof question.correctAnswer === "string"
          ? question.correctAnswer
          : "",
    explanation: question.explanation || question.solution || "",
    subQuestions: Array.isArray(question.subQuestions)
      ? question.subQuestions
      : [],
    suggestedAnswer: question.suggestedAnswer || "",
    marks: question.marks || null,
    imageUrl,
  };
}

/**
 * Returns rich HTML suitable for displaying a question snippet in QuestionImportDrawer.
 */
export function getQuestionDrawerPreviewHtml(question) {
  const snap = normalizeQuestionToSnapshot(question);
  return (
    snap.questionText ||
    snap.stimulus ||
    snap.subQuestions?.[0]?.text ||
    "<i>প্রশ্নের বিবরণ দেখুন</i>"
  );
}
