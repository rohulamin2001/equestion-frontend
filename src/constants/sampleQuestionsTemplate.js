/**
 * Sample JSON Template for Bulk Importing Questions (MCQ & Creative)
 */

export const ALLOWED_IMPORT_VALUES = {
  institutionType: ["School", "College", "Madrasah"],
  academicLevel: [
    "Primary",
    "Secondary",
    "Higher Secondary",
    "Ebtedayee",
    "Dakhil",
    "Alim",
  ],
  version: ["Bangla", "English"],
  className: [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "Class 11",
    "Class 12",
  ],
  category: [
    "MCQ",
    "Creative",
    "ShortAnswer",
    "BroadQuestion",
    "FillInBlanks",
    "Matching",
    "Poem",
    "SentenceFormation",
    "ConjunctLetters",
    "WordMeaning",
    "Punctuation",
    "GenderChange",
    "Antonym",
    "FormFilling",
    "Paragraph",
    "Essay",
  ],
  difficulty: ["Easy", "Medium", "Hard"],
  mcqType: ["Simple", "MultipleCompletion", "Contextual"],
  board: [
    "ঢাকা বোর্ড",
    "রাজশাহী বোর্ড",
    "কুমিল্লা বোর্ড",
    "যশোর বোর্ড",
    "চট্টগ্রাম বোর্ড",
    "বরিশাল বোর্ড",
    "সিলেট বোর্ড",
    "দিনাজপুর বোর্ড",
    "ময়মনসিংহ বোর্ড",
    "মাদ্রাসা বোর্ড",
    "কারিগরি বোর্ড",
  ],
  year: [
    "2026",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ],
  school: [
    "মতিঝিল আইডিয়াল স্কুল ও কলেজ",
    "ভিকারুননিসা নূন স্কুল ও কলেজ",
    "গভ. ল্যাবরেটরি হাই স্কুল",
  ],
  level: ["অনুধাবন", "জ্ঞান", "দক্ষতা", "দৃষ্টিভঙ্গি", "প্রয়োগ", "মূল্যবোধ"],
  specialSearch: [
    "অনুশীলনি",
    "অভিন্ন তথ্যভিত্তিক",
    "গাণিতিক",
    "চিত্রযুক্ত",
    "তত্ত্বীয়",
    "রিপিটেড স্কুল",
  ],
  note: "subjectId অবশ্যই সিস্টেমের সঠিক 24-character MongoDB ID হতে হবে এবং chapterNumber একটি ধনাত্মক সংখ্যা (1, 2, 3...) হতে হবে।",
};

export const SAMPLE_QUESTIONS_TEMPLATE = [
  // ১. সাধারণ বহুনির্বাচনি (Simple MCQ)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "MCQ",
    difficulty: "Easy",
    topics: ["সততার পুরস্কার"],
    examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026", "2025"] }],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["মতিঝিল আইডিয়াল স্কুল ও কলেজ"],
    level: "জ্ঞান",
    specialSearch: ["অনুশীলনি", "তত্ত্বীয়"],
    mcqData: {
      mcqType: "Simple",
      questionText:
        "<p>'সততার পুরস্কার' গল্পে প্রথম লোকটির শরীরে কী রোগ ছিল?</p>",
      options: [
        "<p>ধবল রোগ</p>",
        "<p>টাকপড়া</p>",
        "<p>অন্ধত্ব</p>",
        "<p>জ্বর</p>",
      ],
      correctAnswer: 0,
      explanation:
        "<p>গল্প অনুযায়ী প্রথম লোকটির শরীর ধবল রোগে আক্রান্ত ছিল.</p>",
      marks: 1,
    },
  },
  // ২. বহুপদী সমাপ্তিসূচক বহুনির্বাচনি (Multiple Completion MCQ)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "MCQ",
    difficulty: "Medium",
    topics: ["সততার পুরস্কার"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["ভিকারুননিসা নূন স্কুল ও কলেজ"],
    level: "অনুধাবন",
    specialSearch: ["অনুশীলনি", "রিপিটেড স্কুল"],
    mcqData: {
      mcqType: "MultipleCompletion",
      questionText: "<p>'সততার পুরস্কার' গল্পের মূল শিক্ষা হলো—</p>",
      statements: [
        "সততা ও ঈমানদারী",
        "আল্লাহর প্রতি কৃতজ্ঞতা প্রকাশ",
        "অকৃতজ্ঞতার কুফল",
      ],
      options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
      correctAnswer: 3,
      explanation:
        "<p>তিনটি বাক্যই সততার পুরস্কার গল্পের মূল শিক্ষার অন্তর্ভুক্ত।</p>",
      marks: 1,
    },
  },
  // ৩. উদ্দীপক ভিত্তিক বহুনির্বাচনি (Contextual / Passage MCQ)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "MCQ",
    difficulty: "Medium",
    topics: ["সততার পুরস্কার"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["গভ. ল্যাবরেটরি হাই স্কুল"],
    level: "প্রয়োগ",
    specialSearch: ["অভিন্ন তথ্যভিত্তিক"],
    mcqData: {
      mcqType: "Contextual",
      stem: "<p>রাফিজ একজন গরিব লোককে সাধ্যমতো সাহায্য করল, কিন্তু তার ভাই কালাম তাকে তাড়িয়ে দিল।</p>",
      questionText:
        "<p>উদ্দীপকের রাফিজের আচরণের সাথে 'সততার পুরস্কার' গল্পের কোন চরিত্রের মিল রয়েছে?</p>",
      options: [
        "<p>তৃতীয় ব্যক্তি (অন্ধ লোক)</p>",
        "<p>প্রথম ব্যক্তি</p>",
        "<p>দ্বিতীয় ব্যক্তি</p>",
        "<p>ছদ্মবেশী ফেরেশতা</p>",
      ],
      correctAnswer: 0,
      explanation:
        "<p>রাফিজের আচরণে কৃতজ্ঞতা প্রকাশ পেয়েছে যা অন্ধ লোকটির আচরণের সমতুল্য।</p>",
      marks: 1,
    },
  },
  // ৪. সৃজনশীল প্রশ্ন (Creative Question - CQ)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "Creative",
    difficulty: "Medium",
    topics: ["সততার পুরস্কার"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["মতিঝিল আইডিয়াল স্কুল ও কলেজ"],
    level: "দক্ষতা",
    specialSearch: ["রিপিটেড স্কুল"],
    creativeData: {
      stem: "<p>কালাম ও রাফিজ দুই ভাই। একজন গরিব লোক সাহায্য চাইলে কালাম তাকে তাড়িয়ে দিল, কিন্তু রাফিজ সাধ্যমতো সাহায্য করল।</p>",
      subQuestions: {
        cognitiveA: {
          text: "<p>'সততার পুরস্কার' গল্পের প্রথম লোকটির কী রোগ ছিল?</p>",
          answer: "<p>প্রথম লোকটির শরীরে ধবল রোগ ছিল।</p>",
          marks: 1,
        },
        cognitiveB: {
          text: "<p>স্বর্গীয় দূত ছদ্মবেশ ধারণ করেছিলেন কেন?</p>",
          answer:
            "<p>আল্লাহর নির্দেশে তিন ব্যক্তির পরীক্ষা নেওয়ার জন্য তিনি ছদ্মবেশ ধারণ করেছিলেন।</p>",
          marks: 2,
        },
        cognitiveC: {
          text: "<p>কালামের আচরণে গল্পের যে দিকটি প্রকাশ পেয়েছে তা ব্যাখ্যা করো।</p>",
          answer:
            "<p>কালামের আচরণে অকৃতজ্ঞতা ও কৃপণতার দিকটি প্রকাশ পেয়েছে।</p>",
          marks: 3,
        },
        cognitiveD: {
          text: "<p>'রাফিজের আচরণেই সততার পুরস্কার গল্পের মূল বার্তা প্রতিফলিত'— মূল্যায়ন করো।</p>",
          answer:
            "<p>উক্তিটি যথার্থ। রাফিজের কৃতজ্ঞতাবোধ ও সততার মধ্যেই গল্পের মূল শিক্ষা ফুটে উঠেছে।</p>",
          marks: 4,
        },
      },
    },
  },
  // ৫. সংক্ষিপ্ত উত্তর প্রশ্ন (Short Answer)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "ShortAnswer",
    difficulty: "Easy",
    topics: ["সততার পুরস্কার"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["ভিকারুননিসা নূন স্কুল ও কলেজ"],
    level: "মূল্যবোধ",
    specialSearch: ["হাফ ইয়ার্লি ২০২৬"],
    generalData: {
      questionText: "<p>'সততার পুরস্কার' গল্পের মূল শিক্ষা কী?</p>",
      suggestedAnswer:
        "<p>সততা ও সত্যবাদিতার মাধ্যমে আল্লার সন্তুষ্টি এবং পুরষ্কার লাভ করা সম্ভব।</p>",
      marks: 2,
    },
  },
];

// ৬. প্রশ্ন ইনপোর্ট স্কিমা ও ফিল্ড গাইড টেমপ্লেট (Schema Placeholder Template)
export const SAMPLE_QUESTIONS_TEMPLATE_2 = [
  // ১. সাধারণ বহুনির্বাচনি (Simple MCQ - Schema Guide)
  {
    className: "Class 6", // শ্রেণীর নাম (যেমন: Class 1 থেকে Class 12)
    institutionType: "School", // প্রতিষ্ঠানের ধরন (School / College / Madrasah)
    academicLevel: "Secondary", // শিক্ষার স্তর (Primary / Secondary / Higher Secondary / Ebtedayee / Dakhil / Alim)
    version: "Bangla", // ভাষা ভার্সন (Bangla / English)
    subjectId: "6a65e46462c905bec8b28da4", // বিষয় আইডি (অবশ্যই ২৪ অক্ষরের MongoDB ObjectId)
    chapterNumber: 1, // অধ্যায় নম্বর (ধনাত্মক সংখ্যা)
    category: "MCQ", // প্রশ্নের ধরণ (MCQ)
    difficulty: "Easy", // কাঠিন্যের স্তর (Easy / Medium / Hard)
    topics: ["এখানে টপিকের নাম লিখুন"], // নির্দিষ্ট টপিকের অ্যারে (ঐচ্ছিক)
    examHistory: [
      { board: "ঢাকা বোর্ড", years: ["2026", "2025"] },
      { board: "দিনাজপুর বোর্ড", years: ["2024"] },
    ], // বোর্ড ও পরীক্ষার সালের ম্যাপিং হিস্ট্রি (ঐচ্ছিক)
    year: ["2026"], // শিক্ষাবর্ষ/সালের অ্যারে (ঐচ্ছিক)
    board: ["ঢাকা বোর্ড"], // বোর্ডের নাম (ঐচ্ছিক)
    school: ["এখানে স্কুলের নাম লিখুন"], // স্কুলের নাম (ঐচ্ছিক)
    level: "জ্ঞান", // কগনিটিভ লেভেল (জ্ঞান / অনুধাবন / প্রয়োগ / দক্ষতা / দৃষ্টিভঙ্গি / মূল্যবোধ)
    specialSearch: ["এখানে স্পেশাল কিওয়ার্ড লিখুন"], // সার্চ ট্যাগের অ্যারে (ঐচ্ছিক)
    mcqData: {
      mcqType: "Simple", // সাধারণ বহুনির্বাচনি
      questionText: "<p>এখানে মূল প্রশ্নটি লিখুন...</p>",
      options: [
        "<p>এখানে অপশন ১ লিখুন</p>",
        "<p>এখানে অপশন ২ লিখুন</p>",
        "<p>এখানে অপশন ৩ লিখুন</p>",
        "<p>এখানে অপশন ৪ লিখুন</p>",
      ],
      correctAnswer: 0, // সঠিক উত্তরের অপশন ইনডেক্স (০ = ১ম অপশন, ১ = ২য় অপশন, ২ = ৩য় অপশন, ৩ = ৪র্থ অপশন)
      explanation: "<p>এখানে উত্তর বিশ্লেষণ বা ব্যাখ্যা লিখুন (ঐচ্ছিক)...</p>",
      marks: 1, // নম্বর (ডিফল্ট ১)
    },
  },

  // ২. বহুপদী সমাপ্তিসূচক বহুনির্বাচনি (Multiple Completion MCQ - Schema Guide)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "MCQ",
    difficulty: "Medium",
    topics: ["এখানে টপিকের নাম লিখুন"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["এখানে স্কুলের নাম লিখুন"],
    level: "অনুধাবন",
    specialSearch: ["এখানে স্পেশাল কিওয়ার্ড লিখুন"],
    mcqData: {
      mcqType: "MultipleCompletion", // বহুপদী সমাপ্তিসূচক
      questionText: "<p>এখানে মূল বহুপদী প্রশ্নটি লিখুন...</p>",
      statements: [
        "এখানে ১ম বিবৃতি লিখুন",
        "এখানে ২য় বিবৃতি লিখুন",
        "এখানে ৩য় বিবৃতি লিখুন",
      ],
      options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
      correctAnswer: 3,
      explanation: "<p>এখানে উত্তর বিশ্লেষণ বা ব্যাখ্যা লিখুন (ঐচ্ছিক)...</p>",
      marks: 1,
    },
  },

  // ৩. উদ্দীপক ভিত্তিক বহুনির্বাচনি (Contextual MCQ - Schema Guide)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "MCQ",
    difficulty: "Medium",
    topics: ["এখানে টপিকের নাম লিখুন"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["এখানে স্কুলের নাম লিখুন"],
    level: "প্রয়োগ",
    specialSearch: ["এখানে স্পেশাল কিওয়ার্ড লিখুন"],
    mcqData: {
      mcqType: "Contextual", // উদ্দীপক ভিত্তিক
      stem: "<p>এখানে অনুচ্ছেদ বা উদ্দীপকটি লিখুন...</p>",
      questionText: "<p>এখানে উদ্দীপক ভিত্তিক প্রশ্নটি লিখুন...</p>",
      options: [
        "<p>এখানে অপশন ১ লিখুন</p>",
        "<p>এখানে অপশন ২ লিখুন</p>",
        "<p>এখানে অপশন ৩ লিখুন</p>",
        "<p>এখানে অপশন ৪ লিখুন</p>",
      ],
      correctAnswer: 0,
      explanation: "<p>এখানে উত্তর বিশ্লেষণ বা ব্যাখ্যা লিখুন (ঐচ্ছিক)...</p>",
      marks: 1,
    },
  },

  // ৪. সৃজনশীল প্রশ্ন (Creative Question - CQ - Schema Guide)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "Creative",
    difficulty: "Medium",
    topics: ["এখানে টপিকের নাম লিখুন"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["এখানে স্কুলের নাম লিখুন"],
    level: "দক্ষতা",
    specialSearch: ["এখানে স্পেশাল কিওয়ার্ড লিখুন"],
    creativeData: {
      stem: "<p>এখানে সৃজনশীল প্রশ্নের অনুচ্ছেদ বা উদ্দীপকটি লিখুন...</p>",
      subQuestions: {
        cognitiveA: {
          text: "<p>এখানে 'ক' (জ্ঞানমূলক) প্রশ্নটি লিখুন...</p>",
          answer: "<p>এখানে 'ক' প্রশ্নের উত্তর লিখুন...</p>",
          marks: 1,
        },
        cognitiveB: {
          text: "<p>এখানে 'খ' (অনুধাবনমূলক) প্রশ্নটি লিখুন...</p>",
          answer: "<p>এখানে 'খ' প্রশ্নের উত্তর লিখুন...</p>",
          marks: 2,
        },
        cognitiveC: {
          text: "<p>এখানে 'গ' (প্রয়োগমূলক) প্রশ্নটি লিখুন...</p>",
          answer: "<p>এখানে 'গ' প্রশ্নের উত্তর লিখুন...</p>",
          marks: 3,
        },
        cognitiveD: {
          text: "<p>এখানে 'ঘ' (উচ্চতর দক্ষতা) প্রশ্নটি লিখুন...</p>",
          answer: "<p>এখানে 'ঘ' প্রশ্নের উত্তর লিখুন...</p>",
          marks: 4,
        },
      },
    },
  },

  // ৫. সংক্ষিপ্ত/সাধারণ প্রশ্ন (Short Answer - Schema Guide)
  {
    className: "Class 6",
    institutionType: "School",
    academicLevel: "Secondary",
    version: "Bangla",
    subjectId: "6a65e46462c905bec8b28da4",
    chapterNumber: 1,
    category: "ShortAnswer",
    difficulty: "Easy",
    topics: ["এখানে টপিকের নাম লিখুন"],
    year: ["2026"],
    board: ["ঢাকা বোর্ড"],
    school: ["এখানে স্কুলের নাম লিখুন"],
    level: "মূল্যবোধ",
    specialSearch: ["এখানে স্পেশাল কিওয়ার্ড লিখুন"],
    generalData: {
      questionText: "<p>এখানে প্রশ্নটি লিখুন...</p>",
      suggestedAnswer: "<p>এখানে নমুনা বা প্রস্তাবিত উত্তর লিখুন...</p>",
      marks: 2,
    },
  },
];

export function downloadSampleJsonFile() {
  const payload = {
    _instructions: {
      description:
        "নমুনা প্রশ্ন ইমপোর্ট টেমপ্লেট ও ইমপোর্টের জন্য সিস্টেমে অনুমোদিত সঠিক মানসমূহ (Allowed Values Reference)",
      allowedValues: ALLOWED_IMPORT_VALUES,
    },
    questions: SAMPLE_QUESTIONS_TEMPLATE,
  };
  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sample_questions_import.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
