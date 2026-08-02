export const CLASSES_MAP = [
  { value: "Class 1", label: "১ম শ্রেণী", type: "School", level: "Primary" },
  { value: "Class 2", label: "২য় শ্রেণী", type: "School", level: "Primary" },
  { value: "Class 3", label: "৩য় শ্রেণী", type: "School", level: "Primary" },
  { value: "Class 4", label: "৪র্থ শ্রেণী", type: "School", level: "Primary" },
  { value: "Class 5", label: "৫ম শ্রেণী", type: "School", level: "Primary" },
  {
    value: "Class 6",
    label: "৬ষ্ঠ শ্রেণী",
    type: "School",
    level: "Secondary",
  },
  { value: "Class 7", label: "৭ম শ্রেণী", type: "School", level: "Secondary" },
  { value: "Class 8", label: "৮ম শ্রেণী", type: "School", level: "Secondary" },
  {
    value: "Class 9-10",
    label: "নবম/দশম শ্রেণী",
    type: "School",
    level: "Secondary",
  },
  {
    value: "HSC",
    label: "এইচএসসি",
    type: "College",
    level: "Higher Secondary",
  },
];

export const MADRASAH_CLASSES_MAP = [
  {
    value: "Class 1",
    label: "১ম শ্রেণী (ইবতেদায়ী)",
    type: "Madrasah",
    level: "Ebtedayee",
  },
  {
    value: "Class 2",
    label: "২য় শ্রেণী (ইবতেদায়ী)",
    type: "Madrasah",
    level: "Ebtedayee",
  },
  {
    value: "Class 3",
    label: "৩য় শ্রেণী (ইবতেদায়ী)",
    type: "Madrasah",
    level: "Ebtedayee",
  },
  {
    value: "Class 4",
    label: "৪র্থ শ্রেণী (ইবতেদায়ী)",
    type: "Madrasah",
    level: "Ebtedayee",
  },
  {
    value: "Class 5",
    label: "৫ম শ্রেণী (ইবতেদায়ী)",
    type: "Madrasah",
    level: "Ebtedayee",
  },
  {
    value: "Class 6",
    label: "৬ষ্ঠ শ্রেণী (দাখিল)",
    type: "Madrasah",
    level: "Dakhil",
  },
  {
    value: "Class 7",
    label: "৭ম শ্রেণী (দাখিল)",
    type: "Madrasah",
    level: "Dakhil",
  },
  {
    value: "Class 8",
    label: "৮ম শ্রেণী (দাখিল)",
    type: "Madrasah",
    level: "Dakhil",
  },
  {
    value: "Class 9-10",
    label: "নবম/দশম শ্রেণী (দাখিল)",
    type: "Madrasah",
    level: "Dakhil",
  },
  { value: "HSC", label: "এইচএসসি (আলিম)", type: "Madrasah", level: "Alim" },
];

// Level-wise Default Class Arrays
export const DEFAULT_PRIMARY_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
];
export const DEFAULT_SECONDARY_CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9-10",
];
export const DEFAULT_COLLEGE_CLASSES = ["HSC"];

export const DEFAULT_EBTEDAYEE_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
];
export const DEFAULT_DAKHIL_CLASSES = [
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9-10",
];
export const DEFAULT_ALIM_CLASSES = ["HSC"];

// Filtered options array for Subscription / Generator (Class 3 to HSC)
export const GENERATOR_CLASSES = CLASSES_MAP.filter((c) =>
  [
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9-10",
    "HSC",
  ].includes(c.value),
);

// Group-enabled classes (classes that allow Science/Humanities/Business Studies group selection)
export const GROUP_ENABLED_CLASSES = [
  "Class 9-10",
  "HSC",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

export const isGroupEnabledClass = (className) =>
  GROUP_ENABLED_CLASSES.includes(className);

export const getClassLabel = (classValue) => {
  const item = CLASSES_MAP.find((c) => c.value === classValue);
  return item ? item.label : classValue;
};
