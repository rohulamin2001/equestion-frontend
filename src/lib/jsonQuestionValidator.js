/**
 * Validates a JSON array of question objects before importing to DB.
 * Checks for syntax errors, required metadata, and category-specific fields.
 */

const VALID_INSTITUTION_TYPES = ["School", "College", "Madrasah"];
const VALID_ACADEMIC_LEVELS = [
  "Primary",
  "Secondary",
  "Higher Secondary",
  "Ebtedayee",
  "Dakhil",
  "Alim",
];
const VALID_DIFFICULTIES = ["Easy", "Medium", "Hard"];
const MONGODB_OBJECTID_REGEX = /^[0-9a-fA-F]{24}$/;

export function isHtmlEmpty(html) {
  if (!html) return true;
  if (typeof html !== "string") return false;
  if (
    /<(img|svg|canvas|audio|video|iframe|embed|object|picture)[^>]*>/i.test(
      html,
    )
  ) {
    return false;
  }
  let text = html
    .replace(/<[^>]*>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length === 0;
}

export function validateQuestionsJson(jsonInput) {
  let rawQuestions;

  // 1. Syntax / Parsing check
  if (typeof jsonInput === "string") {
    try {
      rawQuestions = JSON.parse(jsonInput);
    } catch (err) {
      return {
        isValid: false,
        questions: [],
        errors: [`JSON সিনট্যাক্স এরর: ${err.message}`],
        stats: null,
      };
    }
  } else {
    rawQuestions = jsonInput;
  }

  let questions = [];

  if (Array.isArray(rawQuestions)) {
    questions = rawQuestions.filter(
      (item) => item && typeof item === "object" && !item._instructions,
    );
  } else if (typeof rawQuestions === "object" && rawQuestions !== null) {
    if (Array.isArray(rawQuestions.questions)) {
      questions = rawQuestions.questions.filter(
        (item) => item && typeof item === "object" && !item._instructions,
      );
    } else if (!rawQuestions._instructions) {
      questions = [rawQuestions];
    }
  } else {
    return {
      isValid: false,
      questions: [],
      errors: ["JSON ফাইলটিতে কোনো প্রশ্ন অবজেক্ট বা অ্যারে পাওয়া যায়নি।"],
      stats: null,
    };
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return {
      isValid: false,
      questions: [],
      errors: ["JSON ফাইলটিতে কোনো প্রশ্নের ডাটা পাওয়া যায়নি (অ্যারে খালি)।"],
      stats: null,
    };
  }

  const errors = [];
  const validQuestions = [];
  let mcqCount = 0;
  let creativeCount = 0;
  let otherCount = 0;

  // 2. Validate Item by Item
  questions.forEach((q, index) => {
    const itemNum = index + 1;
    const prefix = `প্রশ্ন #${itemNum}`;

    if (!q || typeof q !== "object") {
      errors.push(`${prefix}: প্রশ্নটি সঠিক অবজেক্ট ফরম্যাটে নেই।`);
      return;
    }

    // Top-Level Metadata Checks
    if (
      !q.className ||
      typeof q.className !== "string" ||
      !q.className.trim()
    ) {
      errors.push(`${prefix}: 'className' (শ্রেণী) নির্ধারণ করা আবশ্যক।`);
    }

    if (
      !q.institutionType ||
      !VALID_INSTITUTION_TYPES.includes(q.institutionType)
    ) {
      errors.push(
        `${prefix}: 'institutionType' অবশ্যই 'School', 'College' বা 'Madrasah' হতে হবে।`,
      );
    }

    if (!q.academicLevel || !VALID_ACADEMIC_LEVELS.includes(q.academicLevel)) {
      errors.push(
        `${prefix}: 'academicLevel' অবশ্যই সঠিক লেভেল (যেমন 'Secondary') হতে হবে।`,
      );
    }

    if (
      !q.subjectId ||
      !MONGODB_OBJECTID_REGEX.test(String(q.subjectId).trim())
    ) {
      errors.push(
        `${prefix}: 'subjectId' আবশ্যক এবং একটি বৈধ 24-character MongoDB ID হতে হবে।`,
      );
    }

    const chapNum = Number(q.chapterNumber);
    if (!q.chapterNumber || isNaN(chapNum) || chapNum <= 0) {
      errors.push(
        `${prefix}: 'chapterNumber' (অধ্যায় নম্বর) একটি ধনাত্মক সংখ্যা হতে হবে।`,
      );
    }

    if (!q.category || typeof q.category !== "string" || !q.category.trim()) {
      errors.push(`${prefix}: 'category' (প্রশ্নের ধরণ) নির্ধারণ করা আবশ্যক।`);
    }

    if (!q.difficulty || !VALID_DIFFICULTIES.includes(q.difficulty)) {
      errors.push(
        `${prefix}: 'difficulty' অবশ্যই 'Easy', 'Medium' বা 'Hard' হতে হবে।`,
      );
    }

    if (q.examHistory !== undefined) {
      if (!Array.isArray(q.examHistory)) {
        errors.push(`${prefix}: 'examHistory' অবশ্যই একটি অ্যারে হতে হবে।`);
      } else {
        q.examHistory.forEach((item, ehIdx) => {
          if (
            !item ||
            typeof item !== "object" ||
            !item.board ||
            !Array.isArray(item.years)
          ) {
            errors.push(
              `${prefix}: 'examHistory' #${ehIdx + 1} এ 'board' এবং 'years' অ্যারে থাকা আবশ্যক।`,
            );
          }
        });
      }
    }

    // Category-Specific Payload Checks
    const category = q.category ? q.category.trim() : "";

    if (category === "MCQ") {
      mcqCount++;
      if (!q.mcqData || typeof q.mcqData !== "object") {
        errors.push(`${prefix} [MCQ]: 'mcqData' অবজেক্ট থাকা আবশ্যক।`);
      } else {
        const mcq = q.mcqData;
        const mcqType = mcq.mcqType || "Simple";

        if (mcqType === "Contextual" && isHtmlEmpty(mcq.stem)) {
          errors.push(
            `${prefix} [MCQ]: অভিন্ন তথ্যভিত্তিক বহুনির্বাচনির জন্য 'stem' (উদ্দীপক) আবশ্যক।`,
          );
        }

        if (mcqType !== "Contextual" && isHtmlEmpty(mcq.questionText)) {
          errors.push(
            `${prefix} [MCQ]: 'mcqData.questionText' (প্রশ্নের বিবরণ) আবশ্যক।`,
          );
        }

        if (!Array.isArray(mcq.options) || mcq.options.length < 2) {
          errors.push(
            `${prefix} [MCQ]: 'mcqData.options' এ অন্তত ২টি অপশন থাকা আবশ্যক।`,
          );
        } else if (mcq.options.some((opt) => isHtmlEmpty(opt))) {
          errors.push(
            `${prefix} [MCQ]: 'mcqData.options' এর কোনো অপশন খালি রাখা যাবে না।`,
          );
        }

        if (
          mcq.correctAnswer === undefined ||
          mcq.correctAnswer === null ||
          isNaN(Number(mcq.correctAnswer)) ||
          Number(mcq.correctAnswer) < 0 ||
          (Array.isArray(mcq.options) &&
            Number(mcq.correctAnswer) >= mcq.options.length)
        ) {
          errors.push(
            `${prefix} [MCQ]: 'mcqData.correctAnswer' অপশন ইনডেক্স নম্বর (0, 1, 2...) হতে হবে।`,
          );
        }

        if (mcqType === "MultipleCompletion") {
          if (
            !Array.isArray(mcq.statements) ||
            mcq.statements.filter((s) => !isHtmlEmpty(s)).length < 2
          ) {
            errors.push(
              `${prefix} [MCQ]: বহুপদী সমাপ্তিসূচকের জন্য অন্তত ২টি 'statements' প্রদান করতে হবে।`,
            );
          }
        }
      }
    } else if (category === "Creative") {
      creativeCount++;
      if (!q.creativeData || typeof q.creativeData !== "object") {
        errors.push(`${prefix} [সৃজনশীল]: 'creativeData' অবজেক্ট থাকা আবশ্যক।`);
      } else {
        const cd = q.creativeData;
        if (isHtmlEmpty(cd.stem)) {
          errors.push(
            `${prefix} [সৃজনশীল]: 'creativeData.stem' (উদ্দীপক) থাকা আবশ্যক।`,
          );
        }

        const subQ = cd.subQuestions;
        if (!subQ || typeof subQ !== "object") {
          errors.push(
            `${prefix} [সৃজনশীল]: 'creativeData.subQuestions' অবজেক্ট থাকা আবশ্যক।`,
          );
        } else {
          if (!subQ.cognitiveA || isHtmlEmpty(subQ.cognitiveA.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'ক' নং প্রশ্ন (subQuestions.cognitiveA.text) আবশ্যক।`,
            );
          }
          if (!subQ.cognitiveB || isHtmlEmpty(subQ.cognitiveB.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'খ' নং প্রশ্ন (subQuestions.cognitiveB.text) আবশ্যক।`,
            );
          }
          if (!subQ.cognitiveC || isHtmlEmpty(subQ.cognitiveC.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'গ' নং প্রশ্ন (subQuestions.cognitiveC.text) আবশ্যক।`,
            );
          }
          if (!subQ.cognitiveD || isHtmlEmpty(subQ.cognitiveD.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'ঘ' নং প্রশ্ন (subQuestions.cognitiveD.text) আবশ্যক।`,
            );
          }
        }
      }
    } else {
      otherCount++;
      if (
        !q.generalData ||
        typeof q.generalData !== "object" ||
        isHtmlEmpty(q.generalData.questionText)
      ) {
        errors.push(
          `${prefix} [${category}]: 'generalData.questionText' থাকা আবশ্যক।`,
        );
      }
    }

    if (errors.length === 0) {
      validQuestions.push(q);
    }
  });

  const isValid = errors.length === 0;

  return {
    isValid,
    totalCount: questions.length,
    validCount: validQuestions.length,
    questions,
    errors,
    stats: {
      mcqCount,
      creativeCount,
      otherCount,
    },
  };
}

/**
 * Validates raw pasted JSON text for a specific category (without top-level metadata requirements).
 * Top-level metadata (Class, Subject, Chapter, Category, etc.) will be injected automatically from UI state.
 */
export function validateCategoryQuestionsJson(jsonInput, targetCategory = "MCQ") {
  if (!jsonInput || typeof jsonInput !== "string" || !jsonInput.trim()) {
    return {
      isValid: false,
      questions: [],
      errors: ["কোনো JSON টেক্সট পেস্ট করা হয়নি।"],
      validCount: 0,
      totalCount: 0,
    };
  }

  let rawData;
  try {
    rawData = JSON.parse(jsonInput);
  } catch (err) {
    return {
      isValid: false,
      questions: [],
      errors: [`JSON সিনট্যাক্স এরর: ${err.message}`],
      validCount: 0,
      totalCount: 0,
    };
  }

  let questionsList = [];
  const processItem = (item) => {
    if (!item || typeof item !== "object" || item._instructions) return;

    // Handle Grouped MCQ structure (isGroup: true or passageStem with nested questions array)
    if ((item.isGroup || item.passageStem || item.stem) && Array.isArray(item.questions)) {
      const gId =
        item.passageGroupId ||
        `passage_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const stemText = item.passageStem || item.stem || "";
      item.questions.forEach((gq, idx) => {
        if (gq && typeof gq === "object") {
          questionsList.push({
            ...gq,
            passageGroupId: gId,
            passageStem: stemText,
            passageOrder: typeof gq.passageOrder === "number" ? gq.passageOrder : idx,
          });
        }
      });
    } else {
      questionsList.push(item);
    }
  };

  if (Array.isArray(rawData)) {
    rawData.forEach(processItem);
  } else if (typeof rawData === "object" && rawData !== null) {
    if (Array.isArray(rawData.questions) && !rawData.passageStem && !rawData.stem) {
      rawData.questions.forEach(processItem);
    } else {
      processItem(rawData);
    }
  }

  if (questionsList.length === 0) {
    return {
      isValid: false,
      questions: [],
      errors: ["JSON ডাটাতে কোনো প্রশ্নের অবজেক্ট পাওয়া যায়নি।"],
      validCount: 0,
      totalCount: 0,
    };
  }

  const errors = [];
  const validQuestions = [];

  questionsList.forEach((q, idx) => {
    const itemNum = idx + 1;
    const prefix = `প্রশ্ন #${itemNum}`;

    if (!q || typeof q !== "object") {
      errors.push(`${prefix}: অবজেক্ট ফরম্যাট সঠিক নয়।`);
      return;
    }

    if (targetCategory === "MCQ") {
      if (!q.mcqData || typeof q.mcqData !== "object") {
        errors.push(`${prefix} [MCQ]: 'mcqData' অবজেক্ট থাকা আবশ্যক।`);
      } else {
        const mcq = q.mcqData;
        const mcqType = mcq.mcqType || "Simple";

        if (mcqType !== "Contextual" && isHtmlEmpty(mcq.questionText)) {
          errors.push(`${prefix} [MCQ]: 'mcqData.questionText' থাকা আবশ্যক।`);
        }
        if (mcqType === "Contextual" && isHtmlEmpty(mcq.stem)) {
          errors.push(
            `${prefix} [MCQ]: উদ্দীপকভিত্তিক প্রশ্নের জন্য 'mcqData.stem' থাকা আবশ্যক।`,
          );
        }
        if (!Array.isArray(mcq.options) || mcq.options.length < 2) {
          errors.push(`${prefix} [MCQ]: 'mcqData.options' এ অন্তত ২টি অপশন থাকতে হবে।`);
        } else if (mcq.options.some((opt) => isHtmlEmpty(opt))) {
          errors.push(
            `${prefix} [MCQ]: 'mcqData.options' এর কোনো অপশন খালি রাখা যাবে না।`,
          );
        }

        if (
          mcq.correctAnswer === undefined ||
          mcq.correctAnswer === null ||
          isNaN(Number(mcq.correctAnswer)) ||
          Number(mcq.correctAnswer) < 0 ||
          (Array.isArray(mcq.options) &&
            Number(mcq.correctAnswer) >= mcq.options.length)
        ) {
          errors.push(
            `${prefix} [MCQ]: 'mcqData.correctAnswer' সঠিক অপশন নম্বর (0, 1, 2...) হতে হবে।`,
          );
        }
      }
    } else if (targetCategory === "Creative") {
      if (!q.creativeData || typeof q.creativeData !== "object") {
        errors.push(`${prefix} [সৃজনশীল]: 'creativeData' অবজেক্ট থাকা আবশ্যক।`);
      } else {
        const cd = q.creativeData;
        if (isHtmlEmpty(cd.stem)) {
          errors.push(
            `${prefix} [সৃজনশীল]: 'creativeData.stem' (উদ্দীপক) থাকা আবশ্যক।`,
          );
        }
        const subQ = cd.subQuestions;
        if (!subQ || typeof subQ !== "object") {
          errors.push(
            `${prefix} [সৃজনশীল]: 'creativeData.subQuestions' অবজেক্ট থাকা আবশ্যক।`,
          );
        } else {
          if (!subQ.cognitiveA || isHtmlEmpty(subQ.cognitiveA.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'ক' (subQuestions.cognitiveA.text) আবশ্যক।`,
            );
          }
          if (!subQ.cognitiveB || isHtmlEmpty(subQ.cognitiveB.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'খ' (subQuestions.cognitiveB.text) আবশ্যক।`,
            );
          }
          if (!subQ.cognitiveC || isHtmlEmpty(subQ.cognitiveC.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'গ' (subQuestions.cognitiveC.text) আবশ্যক।`,
            );
          }
          if (!subQ.cognitiveD || isHtmlEmpty(subQ.cognitiveD.text)) {
            errors.push(
              `${prefix} [সৃজনশীল]: 'ঘ' (subQuestions.cognitiveD.text) আবশ্যক।`,
            );
          }
        }
      }
    } else {
      if (
        !q.generalData ||
        typeof q.generalData !== "object" ||
        isHtmlEmpty(q.generalData.questionText)
      ) {
        errors.push(
          `${prefix} [${targetCategory}]: 'generalData.questionText' থাকা আবশ্যক।`,
        );
      }
    }

    validQuestions.push(q);
  });

  const isValid = errors.length === 0;

  return {
    isValid,
    totalCount: questionsList.length,
    validCount: validQuestions.length,
    questions: validQuestions,
    errors,
  };
}

