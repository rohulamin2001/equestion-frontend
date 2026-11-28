// Utility functions for Questions pages and components

export const parseBanglaNumber = (val) => {
  if (!val) return 0;
  let cleanStr = String(val)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  const digitsOnly = cleanStr.match(/[০-৯0-9]/g);
  if (!digitsOnly) return 0;
  const digitsStr = digitsOnly.join("");

  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const englishStr = digitsStr.replace(/[০-৯]/g, (d) =>
    String(banglaDigits.indexOf(d)),
  );

  const parsed = Number(englishStr);
  return isNaN(parsed) ? 0 : parsed;
};

export const getChapterNames = (set, syllabusList) => {
  if (!set.chapters || set.chapters.length === 0) return "";
  const targetSubjectId = set.subjectId?._id || set.subjectId;
  const matchingSyllabus = syllabusList?.find(
    (s) =>
      s.className === set.className &&
      (s.subjectId?._id === targetSubjectId || s.subjectId === targetSubjectId),
  );
  if (!matchingSyllabus || !matchingSyllabus.chapters) {
    return `অধ্যায়: ${set.chapters.join(", ")}`;
  }
  const names = set.chapters.map((chapNum) => {
    const chap = matchingSyllabus.chapters.find(
      (c) =>
        c.chapterNumber === chapNum ||
        String(c.chapterNumber) === String(chapNum),
    );
    return chap ? chap.chapterName : `অধ্যায় ${chapNum}`;
  });
  return names.join(", ");
};

export const getCategoryMarkLabel = (category, count) => {
  const toBengaliNumber = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num)
      .split("")
      .map((d) => (d >= "0" && d <= "9" ? banglaDigits[Number(d)] : d))
      .join("");
  };

  if (category === "MCQ") {
    return `${toBengaliNumber(count)} × ১ = ${toBengaliNumber(count)}`;
  }
  if (category === "ShortAnswer") {
    return `${toBengaliNumber(count)} × ২ = ${toBengaliNumber(count * 2)}`;
  }
  if (category === "Creative") {
    return `${toBengaliNumber(count)} × ১০ = ${toBengaliNumber(count * 10)}`;
  }
  return "";
};

export const DIFFICULTY_BADGES = {
  Easy: {
    label: "সহজ",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Medium: {
    label: "মধ্যম",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Hard: {
    label: "কঠিন",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export const COGNITIVE_LEVEL_LABELS = {
  Knowledge: "জ্ঞান",
  Understanding: "অনুধাবন",
  Application: "প্রয়োগ",
  "Higher Order": "উচ্চতর দক্ষতা",
};

export const MCQ_TYPE_LABELS = {
  Simple: "সাধারণ MCQ",
  MultipleCompletion: "বহুপদী সমাপ্তিসূচক",
  Contextual: "অভিন্ন তথ্য/উদ্দীপকভিত্তিক",
};

export function toBnNumber(num) {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num ?? "").replace(/\d/g, (d) => digits[Number(d)]);
}

/**
 * Computes consistent point weight of any question across MCQ, Creative, and General formats.
 */
export function getQuestionMarks(q) {
  if (!q || typeof q !== "object") return 0;
  if (q.category === "MCQ") {
    return Number(q.mcqData?.marks) || 1;
  }
  if (q.category === "Creative") {
    const subs = q.creativeData?.subQuestions || {};
    const total = ["cognitiveA", "cognitiveB", "cognitiveC", "cognitiveD"].reduce(
      (sum, key) => sum + (Number(subs[key]?.marks) || 0),
      0,
    );
    return total > 0 ? total : 10;
  }
  if (
    Array.isArray(q.generalData?.subQuestions) &&
    q.generalData.subQuestions.length > 0 &&
    !q.generalData?.marks
  ) {
    return q.generalData.subQuestions.reduce(
      (sum, sq) => sum + (Number(sq.marks) || 2),
      0,
    );
  }
  return Number(q.generalData?.marks) || 1;
}

function normalizeStringArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((v) => (v != null ? String(v).trim() : "")).filter(Boolean);
  }
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Extracts normalized metadata & keywords attached during question authoring
 * so cards, tooltips, and the Right Metadata Inspector render uniformly.
 */
export function extractQuestionMetadata(q, availableChapters = []) {
  if (!q || typeof q !== "object") {
    return {
      uid: "",
      schools: [],
      boardYearPairs: [],
      topics: [],
      specialSearches: [],
      levelLabel: "",
      difficultyMeta: { label: "—", className: "bg-slate-50 text-slate-600 border-slate-200" },
      chapterName: "",
      marks: 0,
      hasImage: false,
      hasAnswer: false,
    };
  }

  const schools = normalizeStringArray(q.school);
  const topics = normalizeStringArray(q.topics);
  const specialSearches = normalizeStringArray(q.specialSearch);

  // Merge modern examHistory [{ board, years }] with legacy top-level board/year arrays
  const boardYearPairs = [];
  if (Array.isArray(q.examHistory) && q.examHistory.length > 0) {
    for (const entry of q.examHistory) {
      if (!entry) continue;
      const b = entry.board ? String(entry.board).trim() : "";
      const ys = Array.isArray(entry.years) ? entry.years.filter(Boolean) : [];
      if (b && ys.length > 0) {
        boardYearPairs.push(`${b} (${ys.join(", ")})`);
      } else if (b) {
        boardYearPairs.push(b);
      } else if (ys.length > 0) {
        boardYearPairs.push(ys.join(", "));
      }
    }
  } else {
    const legacyBoards = normalizeStringArray(q.board);
    const legacyYears = normalizeStringArray(q.year);
    const joined = [legacyBoards.join(", "), legacyYears.join(", ")]
      .filter(Boolean)
      .join(" — ");
    if (joined) boardYearPairs.push(joined);
  }

  const chapterMatch = availableChapters.find(
    (c) => Number(c.chapterNumber) === Number(q.chapterNumber),
  );

  const rawHtmlBlob = [
    q.passageStem,
    q.mcqData?.stem,
    q.mcqData?.questionText,
    ...(q.mcqData?.options || []),
    q.creativeData?.stem,
    q.generalData?.stem,
    q.generalData?.questionText,
  ]
    .filter(Boolean)
    .join(" ");

  const hasAnswer = Boolean(
    (q.category === "MCQ" &&
      (q.mcqData?.correctAnswer !== undefined || q.mcqData?.explanation)) ||
      (q.category === "Creative" &&
        ["cognitiveA", "cognitiveB", "cognitiveC", "cognitiveD"].some(
          (k) => q.creativeData?.subQuestions?.[k]?.answer,
        )) ||
      (q.generalData?.suggestedAnswer ||
        (Array.isArray(q.generalData?.subQuestions) &&
          q.generalData.subQuestions.some((sq) => sq.answer))),
  );

  const rawLevel = q.level ? String(q.level).trim() : "";

  return {
    uid: q.questionUid || "",
    schools,
    boardYearPairs,
    topics,
    specialSearches,
    levelLabel: COGNITIVE_LEVEL_LABELS[rawLevel] || rawLevel,
    difficultyMeta: DIFFICULTY_BADGES[q.difficulty] || {
      label: q.difficulty || "সাধারণ",
      className: "bg-slate-50 text-slate-600 border-slate-200",
    },
    chapterName: chapterMatch?.chapterName || "",
    marks: getQuestionMarks(q),
    hasImage: /<img\b[^>]*>/i.test(rawHtmlBlob),
    hasAnswer,
  };
}
