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
