export const CATEGORIES_MAP = [
  // Standard question types
  { value: 'MCQ', label: 'বহু নির্বাচনী প্রশ্ন' },
  { value: 'Creative', label: 'সৃজনশীল প্রশ্ন' },
  { value: 'ShortAnswer', label: 'সংক্ষিপ্ত প্রশ্ন' },
  { value: 'BroadQuestion', label: 'রচনামূলক প্রশ্ন' },
  { value: 'FillInBlanks', label: 'শূন্যস্থান পূরণ' },
  { value: 'Matching', label: 'মিলকরণ' },
  { value: 'Poem', label: 'কবিতা' },
  { value: 'SentenceFormation', label: 'বাক্য গঠন' },
  { value: 'ConjunctLetters', label: 'যুক্তবর্ণ' },
  { value: 'WordMeaning', label: 'শব্দার্থ' },
  { value: 'Punctuation', label: 'বিরামচিহ্ন' },
  { value: 'GenderChange', label: 'লিঙ্গান্তর' },
  { value: 'Antonym', label: 'বিপরীত শব্দ' },
  { value: 'FormFilling', label: 'ফরম পূরণ' },
  { value: 'Paragraph', label: 'অনুচ্ছেদ' },
  { value: 'Essay', label: 'রচনা' },
  { value: 'OneWordSubstitution', label: 'এক কথায় প্রকাশ' },
  { value: 'Synonym', label: 'সমার্থক শব্দ' },
  { value: 'Tense', label: 'ক্রিয়ার কাল' },
  { value: 'PoemTheme', label: 'কবিতার মূলভাব' },
  { value: 'Notice', label: 'বিজ্ঞপ্তি' },
  { value: 'SadhuCholit', label: 'সাধু ও চলিত রূপ' },
  { value: 'ComprehensionQuestion', label: 'অনুচ্ছেদ থেকে প্রশ্ন' },
  { value: 'ProseTheme', label: 'গদ্য অনুচ্ছেদের মূলভাব' },
  { value: 'Application', label: 'আবেদন পত্র' },
  { value: 'LetterWriting', label: 'চিঠি লিখন' },
  { value: 'DescriptiveQuestion', label: 'বর্ণনামূলক প্রশ্ন' },
];

export const CATEGORY_VALUES = CATEGORIES_MAP.map((c) => c.value);

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES_MAP.map((c) => [c.value, c.label])
);

export const CATEGORY_ORDER = [
  'Creative',
  'BroadQuestion',
  'ShortAnswer',
  'MCQ',
  ...CATEGORIES_MAP.map((c) => c.value).filter(
    (v) => !['Creative', 'BroadQuestion', 'ShortAnswer', 'MCQ'].includes(v)
  ),
];
