export const NAV_LINKS = [
  { href: "#home", label: "হোম" },
  { href: "#features", label: "ফিচার" },
  { href: "#workflow", label: "কীভাবে কাজ করে" },
  { href: "#omr", label: "মূল্যায়ন" },
  { href: "#faq", label: "FAQ" },
];

export const HERO_HIGHLIGHTS = [
  {
    id: "trust",
    title: "আস্থা ও নির্ভরতা",
    description: "দেশজুড়ে শিক্ষক ও শিক্ষাপ্রতিষ্ঠানের আস্থা ও নির্ভরতা",
    icon: "ShieldCheck",
  },
  {
    id: "auto",
    title: "স্বয়ংক্রিয় প্রস্তুত",
    description: "একটি ক্লিকেই স্বয়ংক্রিয় প্রশ্ন, শিট ও অনলাইন পরীক্ষা প্রস্তুত",
    icon: "Zap",
  },
  {
    id: "database",
    title: "সমৃদ্ধ ডাটাবেজ",
    description: "যাচাইকৃত বিপুল প্রশ্নের সমৃদ্ধ ডাটাবেজ ও আপডেট কারিকুলাম",
    icon: "Database",
  },
  {
    id: "accuracy",
    title: "শতভাগ নিখুঁত",
    description: "টাইপিং ও ভুল শুধরানোর ঝামেলামুক্ত শতভাগ নিখুঁত আউটপুট",
    icon: "CheckCircle2",
  },
];

export const FEATURES = [
  {
    id: "qgen",
    title: "অধ্যায়ভিত্তিক প্রশ্নপত্র তৈরি",
    description:
      "শ্রেণি, বিষয়, অধ্যায় ও প্রশ্নের ধরন নির্বাচন করে দ্রুত তৈরি করুন সম্পূর্ণ প্রশ্নপত্র।",
    icon: "FileQuestion",
    span: false,
  },
  {
    id: "omr",
    title: "OMR তৈরি ও মূল্যায়ন",
    description:
      "১০–১০০টি প্রশ্নের কাস্টম OMR তৈরি করুন এবং স্ক্যান করে স্বয়ংক্রিয়ভাবে মূল্যায়ন করুন।",
    icon: "ScanLine",
    span: false,
  },
  {
    id: "lecture",
    title: "লেকচার শীট",
    description:
      "শিক্ষার্থীদের জন্য সুন্দর ও সংগঠিত লেকচার শীট তৈরি ও সংরক্ষণ করুন।",
    icon: "BookOpen",
    span: false,
  },
  {
    id: "routine",
    title: "ক্লাস রুটিন",
    description:
      "শিক্ষক ও শিক্ষার্থীদের জন্য সহজে ক্লাস রুটিন তৈরি ও পরিচালনা করুন।",
    icon: "CalendarClock",
    span: false,
  },
  {
    id: "exam",
    title: "অনলাইন পরীক্ষা",
    description:
      "ব্যাচ বা শ্রেণিভিত্তিক অনলাইন পরীক্ষা তৈরি করুন এবং ফলাফল ও পারফরম্যান্স বিশ্লেষণ করুন।",
    icon: "ClipboardCheck",
    span: true,
  },
  {
    id: "bank",
    title: "প্রশ্নব্যাংক",
    description:
      "বিষয়, অধ্যায়, টপিক, বোর্ড ও প্রশ্নের ধরন অনুযায়ী প্রশ্ন খুঁজে দ্রুত প্রশ্নপত্র তৈরি করুন।",
    icon: "Library",
    span: false,
  },
];

export const PLATFORM_TOOLS = [
  "Question Paper Generator",
  "OMR Evaluator",
  "Online Exam",
  "Lecture Sheet",
  "Class Routine",
  "Question Bank",
];

export const QGEN_BULLETS = [
  "অধ্যায়ভিত্তিক প্রশ্ন নির্বাচন",
  "MCQ ও CQ প্রশ্ন",
  "Board Question filtering",
  "Difficulty selection",
  "Question randomization",
  "Custom header & logo",
  "Watermark",
  "PDF export",
  "Print ready layout",
];

export const OMR_BULLETS = [
  "১০–১০০ প্রশ্নের OMR",
  "মোবাইল ক্যামেরা / স্ক্যানার সাপোর্ট",
  "সঠিক / ভুল / unanswered detection",
  "Negative marking",
  "Multiple marking detection",
  "Automatic result calculation",
  "Student-wise result",
];

export const EXAM_BULLETS = [
  "Batch-based exam",
  "Secure exam link",
  "Online MCQ examination",
  "Automatic result",
  "Performance analytics",
  "Offline printable version",
];

export const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "প্রশ্ন নির্বাচন করুন",
    description: "শ্রেণি, বিষয়, অধ্যায় ও প্রশ্নের ধরন নির্বাচন করুন।",
  },
  {
    step: "02",
    title: "প্রশ্নপত্র তৈরি করুন",
    description: "প্রয়োজনীয় প্রশ্ন নির্বাচন করে Generate করুন।",
  },
  {
    step: "03",
    title: "PDF / Print করুন",
    description: "সরাসরি PDF তৈরি করে ডাউনলোড বা প্রিন্ট করুন।",
  },
  {
    step: "04",
    title: "পরীক্ষা ও মূল্যায়ন করুন",
    description: "OMR অথবা Online Exam ব্যবহার করে ফলাফল বিশ্লেষণ করুন।",
  },
];

export const TARGET_USERS = [
  {
    title: "শিক্ষক",
    description: "দ্রুত প্রশ্নপত্র তৈরি ও ক্লাস পরিচালনা করুন।",
    icon: "GraduationCap",
  },
  {
    title: "স্কুল / কলেজ",
    description: "পরীক্ষা, প্রশ্নব্যাংক ও মূল্যায়ন আরও সহজভাবে পরিচালনা করুন।",
    icon: "School",
  },
  {
    title: "কোচিং সেন্টার",
    description: "একাধিক ব্যাচের প্রশ্নপত্র, পরীক্ষা ও ফলাফল পরিচালনা করুন।",
    icon: "Building2",
  },
  {
    title: "শিক্ষার্থী",
    description: "অনলাইন পরীক্ষা, লেকচার শীট ও প্রস্তুতি রিসোর্স ব্যবহার করুন।",
    icon: "Users",
  },
];

export const TRUST_STATS = [
  { value: 1000, suffix: "+", label: "প্রশ্নপত্র" },
  { value: 500, suffix: "+", label: "শিক্ষক" },
  { value: 100, suffix: "+", label: "শিক্ষা প্রতিষ্ঠান" },
  { value: 10000, suffix: "+", label: "শিক্ষার্থী" },
];

export const SAMPLE_QUOTES = [
  {
    quote: "প্রশ্নপত্র তৈরির সময় অনেকটাই কমে গেছে।",
    role: "নমুনা মতামত — শিক্ষক",
  },
  {
    quote: "OMR মূল্যায়ন এক প্ল্যাটফর্মেই সম্পন্ন করা যায়।",
    role: "নমুনা মতামত — কোচিং সেন্টার",
  },
];

export const FAQ_ITEMS = [
  {
    q: "স্মার্ট প্রশ্নব্যাংক কী?",
    a: "স্মার্ট প্রশ্নব্যাংক একটি EdTech SaaS প্ল্যাটফর্ম যেখানে প্রশ্নপত্র তৈরি, OMR মূল্যায়ন, অনলাইন পরীক্ষা, লেকচার শীট ও ক্লাস রুটিন একসাথে পরিচালনা করা যায়।",
  },
  {
    q: "কারা এটি ব্যবহার করতে পারবেন?",
    a: "শিক্ষক, কোচিং সেন্টার, স্কুল, কলেজ এবং শিক্ষা প্রতিষ্ঠানসহ শিক্ষার্থীরাও প্রাসঙ্গিক ফিচার ব্যবহার করতে পারবেন।",
  },
  {
    q: "কীভাবে প্রশ্নপত্র তৈরি করব?",
    a: "শ্রেণি, বিষয়, অধ্যায় ও প্রশ্নের ধরন নির্বাচন করে Generate করুন—কয়েক ক্লিকেই PDF-রেডি প্রশ্নপত্র পাবেন।",
  },
  {
    q: "OMR কীভাবে মূল্যায়ন করা হয়?",
    a: "OMR শিট তৈরির পর স্ক্যান বা মোবাইল ক্যামেরা দিয়ে আপলোড করলে সিস্টেম স্বয়ংক্রিয়ভাবে সঠিক/ভুল/ফাঁকা শনাক্ত করে ফলাফল হিসাব করে।",
  },
  {
    q: "মোবাইল দিয়ে OMR স্ক্যান করা যাবে?",
    a: "হ্যাঁ, মোবাইল ক্যামেরা ও স্ক্যানার সাপোর্ট রয়েছে।",
  },
  {
    q: "অনলাইন পরীক্ষা নেওয়া যাবে?",
    a: "হ্যাঁ, ব্যাচভিত্তিক অনলাইন MCQ পরীক্ষা, সিকিউর লিংক এবং অটো রেজাল্ট সাপোর্ট করা হয়।",
  },
  {
    q: "PDF হিসেবে প্রশ্নপত্র ডাউনলোড করা যাবে?",
    a: "হ্যাঁ, প্রশ্নপত্র PDF এক্সপোর্ট ও প্রিন্ট-রেডি লেআউট পাওয়া যায়।",
  },
  {
    q: "একাধিক শিক্ষক বা ব্যাচ পরিচালনা করা যাবে?",
    a: "Institution ও Professional প্ল্যানে একাধিক ইউজার/ব্যাচ পরিচালনার সুবিধা রয়েছে।",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "প্ল্যাটফর্ম",
    links: [
      { label: "প্রশ্নপত্র তৈরি", href: "#question-generator" },
      { label: "OMR মূল্যায়ন", href: "#omr" },
      { label: "অনলাইন পরীক্ষা", href: "#exam" },
      { label: "প্রশ্নব্যাংক", href: "#features" },
    ],
  },
  {
    title: "রিসোর্স",
    links: [
      { label: "লেকচার শীট", href: "#features" },
      { label: "ক্লাস রুটিন", href: "#features" },
      { label: "FAQ", href: "#faq" },
      { label: "Help Center", href: "#faq" },
    ],
  },
  {
    title: "কোম্পানি",
    links: [
      { label: "আমাদের সম্পর্কে", href: "#home" },
      { label: "যোগাযোগ", href: "mailto:support@smartproshnobank.com" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];
