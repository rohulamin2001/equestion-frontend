export const PACKAGE_CATEGORIES_MAP = [
  { id: "tutor", label: "ব্যক্তিগত শিক্ষক সংস্করণ" },
  { id: "bundle", label: "শ্রেণিভিত্তিক বান্ডেল সংস্করণ" },
  { id: "coaching", label: "কোচিং সেন্টার সংস্করণ" },
  { id: "school", label: "প্রাতিষ্ঠানিক স্কুল সংস্করণ" },
];

export const SUBSCRIPTION_TRANSLATION_MAP = {
  // Classes
  "Class 1": "১ম শ্রেণি",
  "Class 2": "২য় শ্রেণি",
  "Class 3": "৩য় শ্রেণি",
  "Class 4": "৪র্থ শ্রেণি",
  "Class 5": "৫ম শ্রেণি",
  "Class 6": "৬ষ্ঠ শ্রেণি",
  "Class 7": "৭ম শ্রেণি",
  "Class 8": "৮ম শ্রেণি",
  "Class 9": "৯ম শ্রেণি",
  "Class 10": "১০ম শ্রেণি",
  "Class 11": "১১শ শ্রেণি",
  "Class 12": "দ্বাদশ শ্রেণি",
  // Packages
  "class-3-to-5": "৩য় - ৫ম শ্রেণি বান্ডেল প্যাকেজ",
  "class-6-to-10": "৬ষ্ঠ - ১০ম শ্রেণি বান্ডেল প্যাকেজ",
  "all-classes": "সকল শ্রেণি বান্ডেল প্যাকেজ",
  "teacher-bangla-6-10": "বাংলা শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-math-6-10": "গণিত শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-science-6-10": "বিজ্ঞান শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-english-6-10": "ইংরেজি শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-ict-6-10": "আইসিটি শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-bgs-6-10": "বাওবি শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-islam-6-10": "ধর্ম শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
  "teacher-agriculture-6-10": "কৃষি শিক্ষা শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম)",
};

export const translateSubscriptionKey = (key) => {
  if (!key) return "";
  return SUBSCRIPTION_TRANSLATION_MAP[key] || SUBSCRIPTION_TRANSLATION_MAP[key.trim()] || key;
};
