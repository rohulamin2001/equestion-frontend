/**
 * Utility functions to parse and structure general questions,
 * especially reading comprehension / passage questions with sub-questions (ক, খ, গ, ঘ, ঙ).
 */

export const BENGALI_SUB_LETTERS = [
  "ক.",
  "খ.",
  "গ.",
  "ঘ.",
  "ঙ.",
  "চ.",
  "ছ.",
  "জ.",
  "ঝ.",
  "ঞ.",
];

/**
 * Normalizes generalData so that sub-questions (whether provided as an array or
 * embedded in questionText / suggestedAnswer) are uniformly extracted and structured.
 */
export function getStructuredGeneralData(generalData) {
  if (!generalData) {
    return {
      stem: "",
      instruction: "",
      subQuestions: null,
      suggestedAnswer: "",
      marks: 0,
    };
  }

  const stem = generalData.stem || "";
  const marks = generalData.marks || 0;

  // Case 1: Structured subQuestions array is already present
  if (
    Array.isArray(generalData.subQuestions) &&
    generalData.subQuestions.length > 0
  ) {
    return {
      stem,
      instruction: generalData.questionText || "",
      subQuestions: generalData.subQuestions.map((sq, idx) => ({
        identifier: sq.identifier || BENGALI_SUB_LETTERS[idx] || `${idx + 1}.`,
        text: sq.text || "",
        answer: sq.answer || "",
        marks: sq.marks || 2,
      })),
      suggestedAnswer: generalData.suggestedAnswer || "",
      marks,
    };
  }

  // Case 2: Check if questionText has sub-questions with Bengali markers (ক., খ., etc.)
  const qHtml = generalData.questionText || "";
  const aHtml = generalData.suggestedAnswer || "";

  // Regular expression to find markers like ক., খ., ক), খ)
  const markerRegex =
    /(?:^|>|\s)([ক-ঞ][.)])\s*([\s\S]*?)(?=(?:(?:^|>|\s)[ক-ঞ][.)]|$))/g;
  const qMatches = [...qHtml.matchAll(markerRegex)];

  if (qMatches.length >= 2) {
    const firstMatchIdx = qHtml.indexOf(qMatches[0][0]);
    let instruction = qHtml.substring(0, firstMatchIdx).trim();
    instruction = instruction.replace(/<p>\s*<\/p>$/i, "").trim();

    // Parse answers by marker
    const aMatches = [...aHtml.matchAll(markerRegex)];
    const answersMap = {};
    aMatches.forEach((m) => {
      const key = m[1].replace(/[.)]/, "").trim();
      let ansText = m[2].trim();
      ansText = ansText
        .replace(/<\/?p[^>]*>/gi, "")
        .replace(/<br\s*\/?>/gi, " ")
        .trim();
      answersMap[key] = ansText;
    });

    const parsedSubs = qMatches.map((m) => {
      const marker = m[1];
      const key = marker.replace(/[.)]/, "").trim();
      let subText = m[2].trim();
      subText = subText
        .replace(/<\/?p[^>]*>/gi, "")
        .replace(/<br\s*\/?>/gi, " ")
        .trim();

      return {
        identifier: marker,
        text: subText,
        answer: answersMap[key] || "",
        marks: Math.round(marks / qMatches.length) || 2,
      };
    });

    return {
      stem,
      instruction,
      subQuestions: parsedSubs,
      suggestedAnswer: aHtml,
      marks,
    };
  }

  // Case 3: Regular general question without sub-questions
  return {
    stem,
    instruction: qHtml,
    subQuestions: null,
    suggestedAnswer: aHtml,
    marks,
  };
}
