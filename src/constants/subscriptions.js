import { CLASSES_MAP } from "./classes";

export const PACKAGE_CATEGORIES_MAP = [
  { id: "tutor", label: "ব্যক্তিগত শিক্ষক সংস্করণ" },
  { id: "bundle", label: "শ্রেণিভিত্তিক বান্ডেল সংস্করণ" },
  { id: "coaching", label: "কোচিং সেন্টার সংস্করণ" },
  { id: "school", label: "প্রাতিষ্ঠানিক স্কুল সংস্করণ" },
];

// Dynamically generate class translation entries from CLASSES_MAP
const classTranslations = CLASSES_MAP.reduce((acc, curr) => {
  acc[curr.value] = curr.label;
  return acc;
}, {});

export const SUBSCRIPTION_TRANSLATION_MAP = {
  ...classTranslations,
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
  // Madrasah Mappings
  Madrasah: "মাদ্রাসা",
  "class-3-to-5-madrasah": "৩য় - ৫ম শ্রেণি বান্ডেল প্যাকেজ (মাদ্রাসা)",
  "class-6-to-10-madrasah": "৬ষ্ঠ - ১০ম শ্রেণি বান্ডেল প্যাকেজ (মাদ্রাসা)",
  "all-classes-madrasah": "সকল শ্রেণি বান্ডেল প্যাকেজ (মাদ্রাসা)",
  "teacher-bangla-6-10-madrasah":
    "বাংলা শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-math-6-10-madrasah": "গণিত শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-science-6-10-madrasah":
    "বিজ্ঞান শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-english-6-10-madrasah":
    "ইংরেজি শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-ict-6-10-madrasah": "আইসিটি শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-bgs-6-10-madrasah": "বাওবি শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-islam-6-10-madrasah": "ধর্ম শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
  "teacher-agriculture-6-10-madrasah":
    "কৃষি শিক্ষা শিক্ষক সংস্করণ (৬ষ্ঠ - ১০ম) (মাদ্রাসা)",
};

export const translateSubscriptionKey = (key) => {
  if (!key) return "";
  return (
    SUBSCRIPTION_TRANSLATION_MAP[key] ||
    SUBSCRIPTION_TRANSLATION_MAP[key.trim()] ||
    key
  );
};
