/**
 * categoryJsonSamples.js
 * Comprehensive Smart JSON templates and placeholders for all question categories.
 */

export const CATEGORY_JSON_SAMPLES = {
  // ১. বহুনির্বাচনি (MCQ)
  MCQ: {
    Simple: [
      {
        difficulty: "Easy",
        topics: ["সততার পুরস্কার"],
        examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026", "2025"] }],
        school: ["মতিঝিল আইডিয়াল স্কুল অ্যান্ড কলেজ"],
        level: "সহজ",
        specialSearch: ["সাধারণ"],
        mcqData: {
          mcqType: "Simple",
          questionText:
            "<p>'সততার পুরস্কার' গল্পে প্রথম ব্যক্তিটির কী রোগ ছিল?</p>",
          options: [
            "<p>ধবল রোগ</p>",
            "<p>অন্ধত্ব</p>",
            "<p>কুষ্ঠরোগ</p>",
            "<p>পক্ষাঘাত</p>",
          ],
          correctAnswer: 0,
          explanation:
            "<p>গল্পে প্রথম ব্যক্তির গায়ে ধবল রোগ ছিল যা আল্লাহর রহমতে সেরে যায়।</p>",
        },
      },
    ],
    MultipleCompletion: [
      {
        difficulty: "Medium",
        topics: ["সততার পুরস্কার"],
        examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
        school: ["ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ"],
        level: "অনুধাবন",
        specialSearch: ["বহুপদী প্রশ্ন"],
        mcqData: {
          mcqType: "MultipleCompletion",
          questionText: "<p>'সততার পুরস্কার' গল্পের মূল শিক্ষা হলো—</p>",
          statements: [
            "সততা ও কৃতজ্ঞতাবোধ",
            "অসহায় মানুষের পাশে দাঁড়ানো",
            "অহংকারের পরিণতি ধ্বংস",
          ],
          options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
          correctAnswer: 3,
          explanation:
            "<p>উপরে উল্লিখিত তিনটিই সততার পুরস্কার গল্পের মূল শিক্ষার অংশ।</p>",
        },
      },
    ],
    Contextual: [
      {
        difficulty: "Hard",
        topics: ["সততার পুরস্কার"],
        examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
        school: ["রাজউক উত্তরা মডেল কলেজ"],
        level: "প্রয়োগ",
        specialSearch: ["উদ্দীপক ভিত্তিক"],
        mcqData: {
          mcqType: "Contextual",
          stem: "<p>রহিম একজন দরিদ্র কৃষক। হঠাৎ অর্থবান হয়ে সে গ্রামের অসহায় মানুষদের ভুলে যায় এবং আগের অভাবের কথা অস্বীকার করে।</p>",
          questionText:
            "<p>উদ্দীপকে রহিমের আচরণে 'সততার পুরস্কার' গল্পের কোন চরিত্রের প্রতিফলন ঘটেছে?</p>",
          options: [
            "<p>প্রথম ব্যক্তি</p>",
            "<p>দ্বিতীয় ব্যক্তি</p>",
            "<p>তৃতীয় ব্যক্তি</p>",
            "<p>ফেরেশতা</p>",
          ],
          correctAnswer: 0,
          explanation:
            "<p>প্রথম ব্যক্তি সুস্থ ও ধনী হয়ে পূর্বের অভাবের কথা অস্বীকার করেছিল।</p>",
        },
      },
    ],
    Grouped: [
      {
        isGroup: true,
        passageStem:
          "<p>রফিক সাহেব তার জমিতে রাসায়নিক সারের পরিবর্তে কেঁচো সার ও সবুজ সার ব্যবহার করায় জমির উর্বরতা বজায় রইল এবং ফসলের উৎপাদন বৃদ্ধি পেল...</p>",
        questions: [
          {
            difficulty: "Medium",
            topics: ["পরিবেশ ও কৃষি"],
            examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
            school: ["গভ. ল্যাবরেটরি হাই স্কুল"],
            level: "Famous School",
            mcqData: {
              mcqType: "Simple",
              questionText:
                "<p>উদ্দীপকে রফিক সাহেবের ব্যবহৃত সার কোন ধরনের?</p>",
              options: ["জৈব সার", "রাসায়নিক সার", "ইউরিয়া সার", "কীটনাশক"],
              correctAnswer: 0,
              explanation:
                "<p>কেঁচো সার ও সবুজ সার মূলত পরিবেশবান্ধব জৈব সার।</p>",
            },
          },
          {
            difficulty: "Hard",
            topics: ["পরিবেশ ও কৃষি"],
            examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
            mcqData: {
              mcqType: "MultipleCompletion",
              questionText: "<p>সবুজ সার ব্যবহারের সুবিধা হলো—</p>",
              statements: [
                "মাটির উর্বরতা বৃদ্ধি পায়",
                "পরিবেশের ভারসাম্য বজায় থাকে",
                "মাটির পানি ধারণ ক্ষমতা বাড়ে",
              ],
              options: ["i ও ii", "ii ও iii", "i ও iii", "i, ii ও iii"],
              correctAnswer: 3,
              explanation:
                "<p>সবুজ সার মাটির উর্বরতা, পানি ধারণ ক্ষমতা ও পরিবেশের ভারসাম্য বাড়ায়।</p>",
            },
          },
        ],
      },
    ],
  },

  // ২. সৃজনশীল প্রশ্ন (Creative / CQ)
  Creative: [
    {
      difficulty: "Medium",
      topics: ["উদ্ভিদের পুষ্টি ও শারীরতত্ত্ব"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["ঢাকা রেসিডেনসিয়াল মডেল কলেজ"],
      specialSearch: ["পরীক্ষায় আসার মতো"],
      creativeData: {
        stem: "করিম একটি কাঁচের জারে সবুজ জলজ উদ্ভিদ রেখে সূর্যালোকিত স্থানে রাখল। কিছুক্ষণ পর সে দেখল উদ্ভিদটির কান্ড থেকে বুদবুদ আকারে গ্যাস নির্গত হচ্ছে...",
        subQuestions: {
          cognitiveA: {
            text: "সালোকসংশ্লেষণ কাকে বলে?",
            answer:
              "যে জৈব রাসায়নিক প্রক্রিয়ায় সবুজ উদ্ভিদ সূর্যালোকের উপস্থিতিতে খাদ্য প্রস্তুত করে তাকে সালোকসংশ্লেষণ বলে।",
            marks: 1,
          },
          cognitiveB: {
            text: "উদ্ভিদের জন্য আলোর প্রয়োজনীয়তা ব্যাখ্যা কর।",
            answer:
              "আলো ছাড়া ক্লোরোফিল সক্রিয় হতে পারে না এবং খাদ্য তৈরির মূল শক্তি সূর্যালোক থেকেই আসে।",
            marks: 2,
          },
          cognitiveC: {
            text: "উদ্দীপকে নির্গত গ্যাসটি কীভাবে পরীক্ষা করবে ব্যাখ্যা কর।",
            answer:
              "একটি নিভু নিভু শিখা জারের মুখে ধরলে তা দপ করে জ্বলে উঠবে, যা প্রমাণ করে গ্যাসটি অক্সিজেন।",
            marks: 3,
          },
          cognitiveD: {
            text: "মানবজীবনে উদ্দীপকের জৈব প্রক্রিয়ার গুরুত্ব মূল্যায়ন কর।",
            answer:
              "সালোকসংশ্লেষণ প্রক্রিয়া না থাকলে জীবজগতের বেঁচে থাকার জন্য প্রয়োজনীয় অক্সিজেন ও খাদ্যের সরবরাহ সম্পূর্ণ বন্ধ হয়ে যেত।",
            marks: 4,
          },
        },
      },
    },
  ],

  // ৩. সংক্ষিপ্ত প্রশ্ন (ShortAnswer)
  ShortAnswer: [
    {
      difficulty: "Easy",
      topics: ["সাধারণ জ্ঞান"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["গভ. ল্যাবরেটরি হাই স্কুল"],
      level: "Top School",
      specialSearch: ["সংক্ষিপ্ত প্রশ্ন"],
      generalData: {
        questionText:
          "<p>বাংলা নববর্ষ বা পহেলা বৈশাখ প্রথম কে প্রবর্তন করেন?</p>",
        suggestedAnswer: "<p>মুঘল সম্রাট আকবর বাংলা সনের প্রবর্তন করেন।</p>",
        marks: 2,
      },
    },
  ],

  // ৪. রচনামূলক প্রশ্ন (BroadQuestion)
  BroadQuestion: [
    {
      difficulty: "Medium",
      topics: ["বাংলা গদ্য ও সাহিত্য"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"],
      level: "উচ্চতর দক্ষতা",
      specialSearch: ["বর্ণনামূলক প্রশ্ন"],
      generalData: {
        questionText:
          "<p>বাঙালি সংস্কৃতির বিকাশে একুশে ফেব্রুয়ারির ভূমিকা বিস্তারিত আলোচনা কর।</p>",
        suggestedAnswer:
          "<p>একুশে ফেব্রুয়ারি শুধু একটি তারিখ নয়, এটি বাঙালির আত্মপরিচয় ও অধিকার আদায়ের প্রতীক...</p>",
        marks: 5,
      },
    },
  ],

  // ৫. শূন্যস্থান পূরণ (FillInBlanks)
  FillInBlanks: [
    {
      difficulty: "Easy",
      topics: ["শূন্যস্থান পূরণ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["আইডিয়াল স্কুল অ্যান্ড কলেজ"],
      level: "জ্ঞানমূলক",
      specialSearch: ["শূন্যস্থান পূরণ"],
      generalData: {
        questionText: "<p>দেশকে ভালোবাসার নামই ______।</p>",
        suggestedAnswer: "<p>দেশপ্রেম</p>",
        marks: 1,
      },
    },
    {
      difficulty: "Easy",
      topics: ["শূন্যস্থান পূরণ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["আইডিয়াল স্কুল অ্যান্ড কলেজ"],
      level: "জ্ঞানমূলক",
      specialSearch: ["শূন্যস্থান পূরণ"],
      generalData: {
        questionText: "<p>সূর্য পূর্ব দিকে ______।</p>",
        suggestedAnswer: "<p>ওঠে</p>",
        marks: 1,
      },
    },
  ],

  // ৬. মিলকরণ (Matching)
  Matching: [
    {
      difficulty: "Medium",
      topics: ["মিলকরণ অনুচ্ছেদ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["ভিকারুননিসা নূন স্কুল অ্যান্ড কলেজ"],
      level: "অনুধাবন",
      specialSearch: ["বাম-ডান মিলকরণ"],
      generalData: {
        stem: "<p><strong>বাম পাশের বাক্যাংশের সাথে ডান পাশের বাক্যাংশ মিল করে বাক্য তৈরি কর:</strong></p>",
        questionText:
          "<p>১. ধানক্ষেতে — ক. পাখি ডাকে<br/>২. নদীর জলে — খ. সোনালী ফসল হাসে<br/>৩. গাছে গাছে — গ. মাছ ভাসে</p>",
        suggestedAnswer:
          "<p>১ + খ: ধানক্ষেতে সোনালী ফসল হাসে।<br/>২ + গ: নদীর জলে মাছ ভাসে।<br/>৩ + ক: গাছে গাছে পাখি ডাকে।</p>",
        marks: 3,
      },
    },
  ],

  // ৭. কবিতা (Poem - কবি ও কবিতার নামসহ কবিতা লিখন)
  Poem: [
    {
      difficulty: "Medium",
      topics: ["পাখির মতো", "কবিতা লিখন"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["গভ. ল্যাবরেটরি হাই স্কুল, ঢাকা"],
      level: "স্মরণ ও প্রয়োগ",
      specialSearch: ["কবিতা", "পাখির মতো", "আল মাহমুদ"],
      generalData: {
        stem: "",
        questionText: "<p>কবি ও কবিতার নামসহ 'পাখির মতো' কবিতাটি লেখো।</p>",
        suggestedAnswer:
          '<p style="text-align: center;"><strong>পাখির মতো</strong><br/><em>আল মাহমুদ</em></p><p style="text-align: center;">আম্মা বলেন, পড়রে সোনা আব্বা বলেন, মন দে;<br/>পাঠে আমার মন বসে না কাঁঠালচাঁপার গন্ধে।<br/>আমার কেবল ইচ্ছে জাগে নদীর কাছে থাকতে,<br/>বকুল ডালে লুকিয়ে থেকে পাখির মতো ডাকতে।<br/>সবাই যখন ঘুমিয়ে পড়ে কর্ণফুলীর কূলটায়,<br/>দুধভরা ঐ চাঁদের বাটি ফেরেস্তারা উল্টায়।<br/>তখন কেবল ভাবতে থাকি কেমন করে উড়বো,<br/>কেননা করে শহর ছেড়ে সবুজ গাঁয়ে ঘুরবো!<br/>—তোমরা যখন শিখছো পড়া মানুষ হওয়ার জন্য,<br/>আমি না হয় পাখিই হবো— বন্য পাখির মতো।</p>',
        marks: 5,
      },
    },
    {
      difficulty: "Medium",
      topics: ["সংকল্প", "কবিতা লিখন"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মতিঝিল আইডিয়াল স্কুল অ্যান্ড কলেজ"],
      level: "স্মরণ ও প্রয়োগ",
      specialSearch: ["কবিতা", "সংকল্প", "কাজী নজরুল ইসলাম"],
      generalData: {
        stem: "",
        questionText:
          "<p>কবি ও কবিতার নামসহ 'সংকল্প' কবিতার প্রথম ৮টি চরণ লেখ।</p>",
        suggestedAnswer:
          '<p style="text-align: center;"><strong>সংকল্প</strong><br/><em>কাজী নজরুল ইসলাম</em></p><p style="text-align: center;">থাকব না কো বদ্ধ ঘরে,<br/>দেখব এবার জগৎটাকে,<br/>কেমন করে ঘুরছে মানুষ<br/>যুগান্তরের ঘূর্ণিপাকে।<br/>দেশ হতে দেশ দেশান্তরে<br/>ছুটছে তারা কেমন করে,<br/>কিসের নেশায় কেমন করে<br/>মরছে যে বীর লাখে লাখে।</p>',
        marks: 8,
      },
    },
  ],

  // ৮. বাক্য গঠন (SentenceFormation)
  SentenceFormation: [
    {
      difficulty: "Easy",
      topics: ["বাক্য গঠন"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["রাজউক উত্তরা মডেল কলেজ"],
      level: "প্রয়োগ",
      specialSearch: ["বাক্য রচনা"],
      generalData: {
        questionText:
          "<p>নিচের শব্দগুলো দিয়ে অর্থপূর্ণ বাক্য রচনা কর:<br/><strong>স্বাধীনতা, বীরত্ব, প্রভাত</strong></p>",
        suggestedAnswer:
          "<p><strong>স্বাধীনতা:</strong> ১৯৭১ সালে বীর মুক্তিযোদ্ধারা আমাদের স্বাধীনতা এনে দিয়েছেন।<br/><strong>বীরত্ব:</strong> মুক্তিযোদ্ধাদের বীরত্ব জাতি চিরদিন স্মরণ রাখবে।<br/><strong>প্রভাত:</strong> প্রভাতে পূর্ব আকাশে সূর্য ওঠে।</p>",
        marks: 3,
      },
    },
  ],

  // ৯. যুক্তবর্ণ (ConjunctLetters)
  ConjunctLetters: [
    {
      difficulty: "Medium",
      topics: ["যুক্তবর্ণ ভেঙে বাক্য তৈরি"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মতিঝিল মডেল স্কুল অ্যান্ড কলেজ"],
      level: "জ্ঞান ও প্রয়োগ",
      specialSearch: ["যুক্তবর্ণ বিভাজন"],
      generalData: {
        questionText:
          "<p>নিচের যুক্তবর্ণগুলো ভেঙে একটি করে শব্দ ও বাক্য তৈরি কর:<br/><strong>ক্ষ, জ্ঞ, ঙ্গ</strong></p>",
        suggestedAnswer:
          "<p><strong>ক্ষ:</strong> ক্ + ষ = শিক্ষা (শিক্ষাই জাতির মেরুদণ্ড।)<br/><strong>জ্ঞ:</strong> জ্ + ঞ = জ্ঞান (জ্ঞানই পরম শক্তি।)<br/><strong>ঙ্গ:</strong> ঙ্ + গ = অঙ্গন (বিদ্যালয়ের অঙ্গন সবসময় পরিষ্কার রাখা উচিত।)</p>",
        marks: 6,
      },
    },
  ],

  // ১০. শব্দার্থ (WordMeaning)
  WordMeaning: [
    {
      difficulty: "Easy",
      topics: ["শব্দার্থ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["ঢাকা কলেজিয়েট স্কুল"],
      level: "জ্ঞানমূলক",
      specialSearch: ["শব্দ ও অর্থ"],
      generalData: {
        questionText:
          "<p>নিচের শব্দগুলোর অর্থ লেখ:<br/><strong>অরণ্য, হর্ষ, প্রভাত, তটিনী</strong></p>",
        suggestedAnswer:
          "<p><strong>অরণ্য:</strong> বন বা জঙ্গল<br/><strong>হর্ষ:</strong> আনন্দ বা উল্লাস<br/><strong>প্রভাত:</strong> সকাল বা ভোর<br/><strong>তটিনী:</strong> নদী</p>",
        marks: 4,
      },
    },
  ],

  // ১১. বিরামচিহ্ন (Punctuation)
  Punctuation: [
    {
      difficulty: "Hard",
      topics: ["বিরামচিহ্ন বসানো"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["চট্টগ্রাম কলেজিয়েট স্কুল"],
      level: "প্রয়োগমূলক",
      specialSearch: ["যতি ও বিরামচিহ্ন"],
      generalData: {
        stem: "<p><strong>নিচের অনুচ্ছেদে যথাযুক্ত স্থানে বিরামচিহ্ন বসাও:</strong></p>",
        questionText:
          "<p>মা বললেন খোকা তুই কোথায় যাচ্ছিস আমি বললাম মা আমি স্কুলে যাচ্ছি তখন মা বললেন সাবধানে পথ চলিস</p>",
        suggestedAnswer:
          '<p>মা বললেন, "খোকা, তুই কোথায় যাচ্ছিস?" আমি বললাম, "মা, আমি স্কুলে যাচ্ছি।" তখন মা বললেন, "সাবধানে পথ চলিস।"</p>',
        marks: 5,
      },
    },
  ],

  // ১২. লিঙ্গান্তর (GenderChange)
  GenderChange: [
    {
      difficulty: "Easy",
      topics: ["লিঙ্গ পরিবর্তন"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["সেন্ট যোসেফ উচ্চ মাধ্যমিক বিদ্যালয়"],
      level: "জ্ঞানমূলক",
      specialSearch: ["পুংলিঙ্গ ও স্ত্রীলিঙ্গ"],
      generalData: {
        questionText:
          "<p>নিচের শব্দগুলোর লিঙ্গ পরিবর্তন কর:<br/><strong>শিক্ষক, বিদ্বান, কোকিল, নায়ক</strong></p>",
        suggestedAnswer:
          "<p><strong>শিক্ষক:</strong> শিক্ষিকা<br/><strong>বিদ্বান:</strong> বিদুষী<br/><strong>কোকিল:</strong> কোকিলা<br/><strong>নায়ক:</strong> নায়িকা</p>",
        marks: 4,
      },
    },
  ],

  // ১৩. বিপরীত শব্দ (Antonym)
  Antonym: [
    {
      difficulty: "Easy",
      topics: ["বিপরীত শব্দ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["খুলনা জিলা স্কুল"],
      level: "জ্ঞানমূলক",
      specialSearch: ["বিপরীতার্থক শব্দ"],
      generalData: {
        questionText:
          "<p>নিচের শব্দগুলোর বিপরীত শব্দ লেখ:<br/><strong>আকাশ, সুখ, সৎ, উন্নতি</strong></p>",
        suggestedAnswer:
          "<p><strong>আকাশ:</strong> পাতাল<br/><strong>সুখ:</strong> দুঃখ<br/><strong>সৎ:</strong> অসৎ<br/><strong>উন্নতি:</strong> অবনতি</p>",
        marks: 4,
      },
    },
  ],

  // ১৪. ফরম পূরণ (FormFilling)
  FormFilling: [
    {
      difficulty: "Medium",
      topics: ["ফরম পূরণ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["বরিশাল জিলা স্কুল"],
      level: "ব্যবহারিক",
      specialSearch: ["পাঠাগার বা ভর্তির ফরম"],
      generalData: {
        stem: "<p>মনে কর তোমার নাম রাফি। তুমি শাপলা উচ্চ বিদ্যালয়ের পঞ্চম শ্রেণির ছাত্র। তোমার রোল নম্বর ৫।</p>",
        questionText:
          "<p><strong>বিদ্যালয় পাঠাগার সদস্য ফরম পূরণ কর:</strong><br/>১. শিক্ষার্থীর নাম: ____________<br/>২. পিতার নাম: ____________<br/>৩. মাতার নাম: ____________<br/>৪. শ্রেণি: ____________ রোল: ____________<br/>৫. ঠিকানা: ____________</p>",
        suggestedAnswer:
          "<p>১. শিক্ষার্থীর নাম: রাফি<br/>২. পিতার নাম: মো. রফিকুল ইসলাম<br/>৩. মাতার নাম: রাশেদা বেগম<br/>৪. শ্রেণি: পঞ্চম, রোল: ৫<br/>৫. ঠিকানা: গ্রাম: ধানমন্ডি, থানা: ধানমন্ডি, জেলা: ঢাকা।</p>",
        marks: 5,
      },
    },
  ],

  // ১৫. অনুচ্ছেদ (Paragraph - অনুচ্ছেদ রচনা)
  Paragraph: [
    {
      difficulty: "Medium",
      topics: ["ছবি আঁকা", "অনুচ্ছেদ রচনা"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["রাজউক উত্তরা মডেল কলেজ"],
      level: "প্রয়োগ",
      specialSearch: ["অনুচ্ছেদ রচনা", "ছবি আঁকা"],
      generalData: {
        stem: "",
        questionText: "<p>'ছবি আঁকা' শিরোনামে একটি অনুচ্ছেদ রচনা করো।</p>",
        suggestedAnswer:
          "<p>মানুষ ভাবতে ভালোবাসে। মানুষের মনে যেসব ভাবনা খেলা করে সেসবের শিল্পময় প্রকাশই ছবি। কে কখন ছবি আঁকা শুরু করেছিল তা বলা মুশকিল। তবে মানুষের আঁকা সবচেয়ে পুরোনো ছবির কথা জানা যায়। ১৮৭৯ খ্রিস্টাব্দে স্পেনে আলতামিরা নামক এক গুহায় প্রথম মানুষের আঁকা ছবির সন্ধান মেলে। যেকোনো মানুষই ছবি আঁকে। এমন কোনো মানুষ নেই যে জীবনে কোনোদিন ছবি আঁকেনি। যেকোনো ছবি, হতে পারে তা কোনো পশু, পাখি, মাছ, আম, জাম, কাঁঠাল, পেঁপে—এর কোনো-না-কোনোটি মানুষ জীবনে একবার হলেও এঁকেছে। আঁকতে আঁকতে অনেকের ছবি আঁকাটাই নেশা হয়ে যায় এবং জীবনে ছবি আঁকা ছাড়া তারা আর কিছু ভাবতে পারে না। ছবি আঁকা নিয়েই তাদের স্বপ্ন, ছবি আঁকাই তাদের পেশা হয়ে যায়। তারা নিজেদের প্রতিভার প্রকাশ ঘটায় ছবি আঁকার মধ্য দিয়ে। পৃথিবীতে অনেকে বিখ্যাত হয়েছেন শুধু ছবি এঁকে।</p>",
        marks: 10,
      },
    },
    {
      difficulty: "Medium",
      topics: ["ফেরিওয়ালা", "অনুচ্ছেদ রচনা"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মতিঝিল আইডিয়াল স্কুল অ্যান্ড কলেজ"],
      level: "প্রয়োগ",
      specialSearch: ["অনুচ্ছেদ রচনা", "ফেরিওয়ালা"],
      generalData: {
        stem: "",
        questionText: "<p>'ফেরিওয়ালা' বিষয়ে একটি অনুচ্ছেদ লেখ।</p>",
        suggestedAnswer:
          "<p>রাস্তায় রাস্তায় হেঁটে নানা ধরনের সামগ্রী বিক্রি করে বা ফেরি করে যে জীবিকা নির্বাহ করে, সে-ই ফেরিওয়ালা। ফেরিওয়ালা আমাদের নিত্যদিনের পরিচিত ব্যক্তি। প্রতিদিনই আমরা দেখি তারা মহল্লায় মহল্লায়, রাস্তায় রাস্তায় বিভিন্ন ধরনের জিনিস, মাছ, তরকারি, ফল, খাবার, কাপড়চোপড় বিক্রি করে। তারা নিত্যপ্রয়োজনীয় জিনিস নিয়ে আমাদের বাসার সামনে হাজির হয়। বাজারের চেয়ে কম দামে তাদের কাছ থেকে এসব কেনা যায়। অনেক সময় নানা ধরনের গান গেয়ে তারা ক্রেতার মন জয় করার চেষ্টা করে। অনেক ফেরিওয়ালা আবার চুড়ি, ফিতাসহ নানা ধরনের খেলনা বিক্রি করে। যাওয়া-আসার মধ্য দিয়ে অনেক ফেরিওয়ালা অনেক পরিবারের সঙ্গে আন্তরিকতার সম্পর্ক গড়ে তোলে। তারা আমাদের চাহিদা মতো অনেক জিনিস দূরের শহর থেকেও এনে দেয়। এভাবে তারা আমাদের সময় ও শ্রম বাঁচায়।</p>",
        marks: 10,
      },
    },
  ],

  // ১৬. রচনা (Essay)
  Essay: [
    {
      difficulty: "Hard",
      topics: ["আমাদের প্রিয় মাতৃভূমি"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["সিলেট সরকারি পাইলট উচ্চ বিদ্যালয়"],
      level: "উচ্চতর দক্ষতা",
      specialSearch: ["প্রবন্ধ ও রচনা"],
      generalData: {
        questionText: "<p>'আমাদের প্রিয় মাতৃভূমি' বিষয়ে একটি রচনা লেখ।</p>",
        suggestedAnswer:
          "<p><strong>ভূমিকা:</strong> আমাদের প্রিয় মাতৃভূমির নাম বাংলাদেশ। এটি দক্ষিণ এশিয়ার একটি সবুজ শ্যামল দেশ...<br/><br/><strong>উপসংহার:</strong> দেশকে সুন্দর ও সমৃদ্ধশালী করে গড়ে তোলা আমাদের সকলের পবিত্র দায়িত্ব।</p>",
        marks: 10,
      },
    },
  ],

  // ১৭. প্রতিবেদন (ReportWriting)
  ReportWriting: [
    {
      difficulty: "Medium",
      topics: ["বিদ্যালয়ের বার্ষিক ক্রীড়া প্রতিযোগিতা"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মেহেরপুর সরকারি উচ্চ বিদ্যালয়"],
      level: "প্রয়োগ",
      specialSearch: ["প্রতিবেদন লিখন"],
      generalData: {
        stem: "<p>মনে কর, তুমি সুমন। মেহেরপুর সরকারি উচ্চ বিদ্যালয়ের দশম শ্রেণির ছাত্র।</p>",
        questionText:
          "<p>তোমার বিদ্যালয়ে সম্প্রতি অনুষ্ঠিত বার্ষিক ক্রীড়া অনুষ্ঠান সম্পর্কে প্রধান শিক্ষক বরাবর একখানা প্রতিবেদন প্রণয়ন কর।</p>",
        suggestedAnswer:
          "<p><strong>তারিখ:</strong> ১৫ জানুয়ারি, ২০২৬<br/><strong>বরাবর:</strong> প্রধান শিক্ষক, মেহেরপুর সরকারি উচ্চ বিদ্যালয়, মেহেরপুর।<br/><strong>বিষয়:</strong> বিদ্যালয়ে অনুষ্ঠিত বার্ষিক ক্রীড়া প্রতিযোগিতা সম্পর্কিত প্রতিবেদন।<br/><br/>জনাব,<br/>আপনার আদেশানুসারে সম্প্রতি সমাপ্ত আমাদের বিদ্যালয়ের ৫২তম বার্ষিক ক্রীড়া প্রতিযোগিতার বিবরণ নিম্নে পেশ করছি...</p>",
        marks: 10,
      },
    },
  ],

  // ১৮. সারাংশ (Summary)
  Summary: [
    {
      difficulty: "Medium",
      topics: ["চরিত্রের মাহাত্ম্য", "সারাংশ লিখন"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["রাজশাহী কলেজিয়েট স্কুল"],
      level: "অনুধাবন",
      specialSearch: ["সারাংশ লিখন"],
      generalData: {
        questionText: "<p><strong>সারাংশ লেখ:</strong></p>",
        stem: "<p>খুব ছোট ছিদ্রের মধ্য দিয়ে যেমন সূর্যকে দেখা যায়, তেমনি ছোট ছোট কাজের ভেতর দিয়েও কোনো ব্যক্তির চরিত্র ফুটে ওঠে। বস্তুত মর্যাদাপূর্ণভাবে ও সুচারুরূপে সম্পন্ন ছোট ছোট কাজেই চরিত্রের পরিচয়। অন্যের প্রতি আমাদের ব্যবহার কীরূপ তাই হচ্ছে আমাদের চরিত্রের শ্রেষ্ঠ পরীক্ষা। বড়, ছোট ও সমতুল্যের প্রতি সুশোভন ব্যবহার আনন্দের উৎস।</p>",
        suggestedAnswer:
          "<p><strong>সারাংশ:</strong> মানুষের ছোট ছোট কাজের আচরণ এবং অপরের সাথে শোভন ব্যবহারের মাধ্যমেই তার প্রকৃত চরিত্রের প্রকাশ ঘটে। আন্তরিক ও মার্জিত ব্যবহার মানবজীবনকে সুন্দর ও আনন্দময় করে তোলে।</p>",
        marks: 10,
      },
    },
  ],

  // ১৯. সারমর্ম (Substance)
  Substance: [
    {
      difficulty: "Medium",
      topics: ["ন্যায়বিচার ও মানবিকতা", "সারমর্ম লিখন"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["ঢাকা কলেজিয়েট স্কুল"],
      level: "অনুধাবন",
      specialSearch: ["সারমর্ম লিখন"],
      generalData: {
        questionText: "<p><strong>সারমর্ম লেখ:</strong></p>",
        stem: "<p>দণ্ডিতের সাথে<br/>দণ্ডদাতা কাঁদে যবে সমান আঘাতে<br/>সর্বশ্রেষ্ঠ সে বিচার। যার তরে প্রাণ<br/>কোন ব্যথা নাহি পায়, তারে দণ্ড দান<br/>প্রবলের অত্যাচার। যে দণ্ড বেদনা<br/>পুত্রেরে না পার দিতে, সে কারেও দিও না,<br/>যে তোমার পুত্র নহে, তারও পিতা আছে,<br/>মহা অপরাধী হবে তুমি তার কাছে।</p>",
        suggestedAnswer:
          "<p><strong>সারমর্ম:</strong> ক্রোধ বা প্রতিহিংসা থেকে নয়, বরং মমত্ববোধ ও সংশোধনের উদ্দেশ্যেই অপরাধীকে দণ্ড দেওয়া উচিত। যে বিচারে অন্তরে সহানুভূতি থাকে না, তা ন্যায়ের বদলে অত্যাচারে পরিণত হয়। অপত্যস্নেহের অনুভূতির মতো ক্ষমা ও সহমর্মিতাপূর্ণ বিচারই প্রকৃত ও শ্রেষ্ঠ বিচার।</p>",
        marks: 10,
      },
    },
  ],

  // ১৯. ভাবসম্প্রসারণ (Amplification)
  Amplification: [
    {
      difficulty: "Medium",
      topics: ["নীতি ও মানবিকতা"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["কুমিল্লা জিলা স্কুল"],
      level: "উচ্চতর দক্ষতা",
      specialSearch: ["ভাবসম্প্রসারণ"],
      generalData: {
        stem: "",
        questionText:
          "<p>ভাব-সম্প্রসারণ কর:<br/><strong>'ভোগে নয়, ত্যাগেই প্রকৃত সুখ।'</strong></p>",
        suggestedAnswer:
          "<p><strong>মূলভাব:</strong> স্বার্থপরের মতো আত্মসুখ ভোগের মধ্যে মানবজীবনের সার্থকতা নিহিত নয়; বরং অপরের কল্যাণে আত্মত্যাগের মধ্যেই নিহিত রয়েছে অনাবিল পরম আনন্দ।<br/><br/><strong>সম্প্রসারিত ভাব:</strong> মানুষ সমাজবদ্ধ জীব। কেবল নিজের জন্য বাঁচা পশুত্বের লক্ষণ। স্বার্থান্বেষী মানুষ সম্পদের প্রাচুর্যেও প্রকৃত সুখ পায় না...</p>",
        marks: 10,
      },
    },
  ],

  // ২০. বঙ্গানুবাদ / অনুবাদ (Translation)
  Translation: [
    {
      difficulty: "Medium",
      topics: ["বৃক্ষরোপণ ও পরিবেশ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["চট্টগ্রাম কলেজিয়েট স্কুল"],
      level: "প্রয়োগ",
      specialSearch: ["বঙ্গানুবাদ"],
      generalData: {
        stem: "<p>Trees help us in different ways. It gives us shade, food, fuel, medicine and Oxygen. Trees make our environment beautiful. Trees are our valuable wealth. It is very much necessary to make afforestation program successful.</p>",
        questionText: "<p>অনুচ্ছেদটি বাংলায় অনুবাদ কর:</p>",
        suggestedAnswer:
          "<p><strong>বঙ্গানুবাদ:</strong> গাছপালা নানাভাবে আমাদের সাহায্য করে। এটি আমাদের ছায়া, খাদ্য, জ্বালানি, ওষুধ এবং অক্সিজেন দেয়। গাছপালা আমাদের পরিবেশকে সুন্দর করে তোলে। গাছ আমাদের মূল্যবান সম্পদ। বৃক্ষরোপণ কর্মসূচি সফল করা একান্ত প্রয়োজন।</p>",
        marks: 10,
      },
    },
  ],

  // ২১. অনুধাবন (Comprehension)
  Comprehension: [
    {
      difficulty: "Easy",
      topics: ["আকাশ ও প্রকৃতি", "অনুধাবন পরীক্ষণ"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"],
      level: "অনুধাবন",
      specialSearch: ["অনুধাবন পরীক্ষণ", "অনুচ্ছেদ পড়ে উত্তর"],
      generalData: {
        stem: "<p>দিনের বেলা সোনার থালার মতো সূর্য তার কিরণ দিয়ে পৃথিবীকে আলোকিত ও উষ্ণ রাখে। কখনও কখনও সাদা বা কালো মেঘে ঢেকে যায় আকাশ। মেঘে মেঘে ঘষা লাগলে বিদ্যুৎ চমকায় আর গম্ভীর মেঘের ডাকে আমরা ভয় পাই। বৃষ্টি নামলে আকাশটা ভিজে যায় আর বৃষ্টির শেষে আকাশে দেখা যায় সাতরঙা রামধনু। রাতের আকাশ সাধারণত কালচে বা নীলাভ নীল দেখায়। আকাশে চাঁদ ও তারা মিটিমিটি জ্বলে।</p>",
        questionText: "<p>অনুচ্ছেদটি পড়ে প্রশ্নগুলোর উত্তর দাও:</p>",
        subQuestions: [
          {
            identifier: "ক.",
            text: "দিনের বেলা আকাশের রং কেমন থাকে?",
            answer:
              "দিনের বেলা আকাশের রং সাধারণত উজ্জ্বল নীল বা মেঘলা থাকলে সাদা/কালো থাকে।",
            marks: 2,
          },
          {
            identifier: "খ.",
            text: "রাতের বেলা আকাশে চাঁদ ও তারা দেখা যায় কেন?",
            answer:
              "রাতের বেলা সূর্যের আলো না থাকায় অন্ধকার নেমে আসে, ফলে দূর আকাশের নিজস্ব আলো বা প্রতিফলিত আলোতে চাঁদ ও তারারা দৃশ্যমান হয়।",
            marks: 2,
          },
          {
            identifier: "গ.",
            text: "দিন ও রাতে আকাশে আলোর যে পার্থক্য দেখা যায় তা লেখ।",
            answer:
              "দিনে সূর্যের তীব্র কিরণে চারিদিক আলোকময় ও উষ্ণ থাকে; রাতে মৃদু জোছনা ও তারাদের মিটিমিটি আলোয় শান্ত রূপ ফুটে ওঠে।",
            marks: 2,
          },
          {
            identifier: "ঘ.",
            text: "তোমার দেখা আকাশের সঙ্গে অনুচ্ছেদের আকাশের মিল কোথায়?",
            answer:
              "বাস্তবে আমরা যেভাবে রোদ, মেঘ, বৃষ্টি এবং রাতে চাঁদ-তারাভরা আকাশ দেখি, অনুচ্ছেদের বর্ণনার সাথে তার পূর্ণ মিল রয়েছে।",
            marks: 2,
          },
          {
            identifier: "ঙ.",
            text: "খালি চোখে দেখা আকাশ আর অনুচ্ছেদে বর্ণিত আকাশ কি একই? ব্যাখ্যা কর।",
            answer:
              "হ্যাঁ, খালি চোখে দিন ও রাতের আকাশের যে রূপ পরিবর্তন আমরা প্রত্যক্ষ করি, অনুচ্ছেদে সেই বাস্তব চিত্রটিই তুলে ধরা হয়েছে।",
            marks: 2,
          },
        ],
        marks: 10,
      },
    },
    {
      difficulty: "Medium",
      topics: ["মাদার তেরেসা", "মহীয়সী নারী", "অনুধাবন পরীক্ষণ"],
      examHistory: [{ board: "চট্টগ্রাম বোর্ড", years: ["2026"] }],
      school: ["চট্টগ্রাম কলেজিয়েট স্কুল"],
      level: "অনুধাবন",
      specialSearch: ["অনুধাবন পরীক্ষণ", "অনুচ্ছেদ পড়ে উত্তর"],
      generalData: {
        stem: "<p>কলকাতার এক নোংরা বস্তিতে মাদার তেরেসা প্রথম স্কুল খুললেন। বেঞ্চ-টেবিল কিছু নেই, মাটিতে দাগ কেটে শিশুদের শেখাতে লাগলেন বর্ণমালা। অসুস্থদের সেবার জন্য খুললেন চিকিৎসাকেন্দ্র। ধীরে-ধীরে সাহায্যের হাত বাড়িয়ে দিলেন অনেক মানুষ। মাদার তেরেসার কাজের পরিধি ক্রমাগত বেড়ে চলল। তাঁর সঙ্গে যোগ দিলেন আরও অনেকে। তাঁদের নিয়ে তিনি গড়ে তুললেন মানবসেবার সংঘ 'মিশনারিজ অব চ্যারিটি'।</p>",
        questionText: "<p>অনুচ্ছেদটি পড়ে প্রশ্নগুলোর উত্তর দাও:</p>",
        subQuestions: [
          {
            identifier: "ক.",
            text: "মাদার তেরেসার গঠিত সংঘটির নাম কী?",
            answer:
              "মাদার তেরেসার গঠিত মানবসেবার সংঘটির নাম 'মিশনারিজ অব চ্যারিটি'।।",
            marks: 2,
          },
          {
            identifier: "খ.",
            text: "মাদার তেরেসাকে কেন মানুষ সাহায্যের হাত বাড়িয়ে দিল?",
            answer:
              "মাদার তেরেসার নিঃস্বার্থ মানবসেবা, অকৃত্রিম মমতা এবং আর্তমানবতার সেবায় আত্মনিবেদন দেখে মানুষ সাহায্যের হাত বাড়িয়ে দেন।",
            marks: 2,
          },
          {
            identifier: "গ.",
            text: "মাদার তেরেসা কীভাবে মানবসেবায় এগিয়ে আসলেন? অনুচ্ছেদটি বুঝিয়ে দাও।",
            answer:
              "কলকাতার বস্তির সুবিধাবঞ্চিত শিশুদের মাটিতে দাগ কেটে বর্ণমালা শিক্ষা দেওয়া এবং অসুস্থদের চিকিৎসার জন্য সেবাকেন্দ্র খোলার মধ্য দিয়ে তিনি মানবসেবায় এগিয়ে আসেন।",
            marks: 2,
          },
          {
            identifier: "ঘ.",
            text: "'মানবসেবার জন্য অর্থের দরকার নেই, দরকার সদিচ্ছা' — উক্তিটি বুঝিয়ে দাও।",
            answer:
              "মানবসেবার মূল চালিকাশক্তি হলো আন্তরিক সহানুভূতি ও সেবার মানসিকতা, কেবল বিপুল অর্থ থাকলেই সেবা করা যায় না—উক্তিটি দ্বারা এ মহৎ সত্যকেই বোঝানো হয়েছে।",
            marks: 2,
          },
          {
            identifier: "ঙ.",
            text: "মাদার তেরেসার এই দৃষ্টি কী নামে অভিহিত করা যায়?",
            answer:
              "মাদার তেরেসার এই দৃষ্টিকে নিঃস্বার্থ মানবপ্রেম, পরহিতৈষণা বা বিশ্বমানবতার দৃষ্টি নামে অভিহিত করা যায়।",
            marks: 2,
          },
        ],
        marks: 10,
      },
    },
  ],

  // ২২. পত্র রচনা (LetterWriting - আবেদনপত্র ও ব্যক্তিগত চিঠি)
  LetterWriting: [
    {
      difficulty: "Medium",
      topics: ["আবেদনপত্র", "পত্র রচনা"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["মতিঝিল আইডিয়াল স্কুল অ্যান্ড কলেজ"],
      level: "প্রয়োগ",
      specialSearch: ["আবেদনপত্র", "দরখাস্ত", "পত্র রচনা"],
      generalData: {
        stem: "",
        questionText:
          "<p>তোমার বিদ্যালয়ে একটি 'বিজ্ঞান ক্লাব' গঠনের অনুমতি চেয়ে প্রধান শিক্ষকের নিকট একখানা আবেদনপত্র লেখ।</p>",
        suggestedAnswer:
          "<p><strong>তারিখ:</strong> ১৫ মার্চ, ২০২৬<br/><strong>বরাবর,</strong><br/>প্রধান শিক্ষক<br/>মতিঝিল আইডিয়াল স্কুল অ্যান্ড কলেজ, ঢাকা।<br/><strong>বিষয়:</strong> বিদ্যালয়ে একটি বিজ্ঞান ক্লাব গঠনের অনুমতির জন্য আবেদন।<br/><br/>মহোদয়,<br/>বিনীত নিবেদন এই যে, আমরা আপনার বিদ্যালয়ের শিক্ষার্থী। আধুনিক বিজ্ঞানের যুগে শিক্ষার্থীদের বিজ্ঞানমনস্ক করে গড়ে তোলা এবং বিজ্ঞানের ব্যবহারিক চর্চা বৃদ্ধির লক্ষ্যে আমাদের বিদ্যালয়ে একটি বিজ্ঞান ক্লাব গঠন করা অত্যন্ত জরুরি। একটি সক্রিয় বিজ্ঞান ক্লাব থাকলে শিক্ষার্থীরা বিজ্ঞান মেলা আয়োজন এবং বিভিন্ন উদ্ভাবনী কর্মকাণ্ডে সক্রিয়ভাবে অংশগ্রহণের সুযোগ পাবে।<br/><br/>অতএব, মহোদয়ের সমীপে বিনীত প্রার্থনা, আমাদের বিদ্যালয়ে একটি বিজ্ঞান ক্লাব গঠনের সদয় অনুমতি ও প্রয়োজনীয় দিকনির্দেশনা প্রদান করে বাধিত করবেন।<br/><br/>বিনীত নিবেদন—<br/>আপনার বিদ্যালয়ের শিক্ষার্থীবৃন্দের পক্ষে,<br/>রাফি হাসান<br/>শ্রেণি: দশম, রোল: ০১</p>",
        marks: 10,
      },
    },
    {
      difficulty: "Medium",
      topics: ["ব্যক্তিগত পত্র", "পত্র রচনা"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["রাজউক উত্তরা মডেল কলেজ"],
      level: "প্রয়োগ",
      specialSearch: ["ব্যক্তিগত পত্র", "চিঠি", "পত্র রচনা"],
      generalData: {
        stem: "",
        questionText:
          "<p>মাধ্যমিক বা বার্ষিক পরীক্ষার প্রস্তুতির কথা জানিয়ে তোমার বন্ধুকে একটি পত্র লেখ।</p>",
        suggestedAnswer:
          '<p style="text-align: right;">উত্তরা, ঢাকা<br/>১০ নভেম্বর, ২০২৬</p><p>প্রিয় রনি,<br/>আমার প্রীতি ও শুভেচ্ছা নিও। আশা করি পরিবারের সকলকে নিয়ে ভালো আছ। গতকাল তোমার চিঠি পেয়ে জানতে পারলাম তুমি আমার আসন্ন বার্ষিক পরীক্ষার প্রস্তুতি সম্পর্কে জানতে চেয়েছ।<br/><br/>আমার পরীক্ষার প্রস্তুতি বেশ ভালোভাবেই এগোচ্ছে। বাংলা ও ইংরেজি বিষয়ের পাঠ্যসূচি ইতোমধ্যে কয়েকবার রিভিশন দিয়েছি। গণিতে কিছুটা দুর্বলতা ছিল, তবে নিয়মিত অনুশীলন ও স্যারের সহায়তায় এখন অনেকটাই আত্মবিশ্বাস ফিরে পেয়েছি। অন্যান্য বিষয়গুলোও রুটিন মাফিক চর্চা করছি। আশা করছি ভালোভাবে পরীক্ষা দিতে পারব। তোমার প্রস্তুতি কেমন চলছে জানিও।<br/><br/>তোমার পিতা-মাতাকে আমার সালাম দিও এবং ছোটদের স্নেহাশিস দিও। ভালো থেকো।</p><p style="text-align: right;">ইতি,<br/>তোমারই বন্ধু<br/>আবির</p>',
        marks: 10,
      },
    },
  ],

  // ২৩. ইংরেজি ক্যাটাগরিসমূহ (English Categories - Class 3 to 10 / SSC)
  SeenPassage: [
    {
      difficulty: "Medium",
      topics: ["English For Today", "Seen Passage"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Rajuk Uttara Model College"],
      level: "অনুধাবন",
      specialSearch: ["Seen Passage", "Reading Comprehension"],
      generalData: {
        stem: "<p><strong>Read the following text and answer the questions that follow:</strong></p><p>Sima and Tamal are in the Town Hall Language Club. They come to the club to practice speaking English. They listen to CDs and watch DVDs in English, or speak English with friends. Today there is a new person in the club. He is a young man. He is reading a book about Bangladesh.</p>",
        questionText:
          "<p><strong>Read the text carefully and answer the questions below:</strong></p><p>Sima and Tamal are in the Town Hall Language Club. They come to the club to practice speaking English. They listen to CDs and watch DVDs in English, or speak English with friends. Today there is a new person in the club. He is a young man. He is reading a book about Bangladesh.</p>",
        suggestedAnswer:
          "<p>The passage describes Sima and Tamal visiting the Town Hall Language Club to practice their English skills.</p>",
        marks: 10,
      },
    },
  ],

  UnseenPassage: [
    {
      difficulty: "Medium",
      topics: ["Unseen Comprehension"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Viqarunnisa Noon School & College"],
      level: "অনুধাবন",
      specialSearch: ["Unseen Passage", "Reading Text"],
      generalData: {
        stem: "<p><strong>Read the text and answer questions 4, 5, 6, and 7:</strong></p><p>Bayazid was a small boy. His mother was ill. One night, he was studying by the bed of his sick mother. All on a sudden, his mother woke up, raised her head and said, 'Water, give me some water.' Bayazid went to the pitcher to fetch water, but found it empty.</p>",
        questionText:
          "<p><strong>Read the text carefully and answer the questions below:</strong></p><p>Bayazid was a small boy. His mother was ill. One night, he was studying by the bed of his sick mother. All on a sudden, his mother woke up, raised her head and said, 'Water, give me some water.' Bayazid went to the pitcher to fetch water, but found it empty.</p>",
        suggestedAnswer:
          "<p>This is a well-known story of filial piety and devotion of Bayazid Bostami towards his mother.</p>",
        marks: 10,
      },
    },
  ],

  Rearrange: [
    {
      difficulty: "Medium",
      topics: ["Rearrange", "Sentence Structure"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Ideal School and College"],
      level: "প্রয়োগ",
      specialSearch: ["Rearrange", "Jumbled Words", "Sentence Ordering"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Rearrange the following words to make meaningful sentences:</strong></p><ol type='a'><li>old / how / you / are / ?</li><li>name / your / what / is / ?</li><li>am / fine / I / thank / you / .</li><li>live / Dhaka / in / I / .</li><li>class / what / in / read / do / you / ?</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>How old are you?</li><li>What is your name?</li><li>I am fine, thank you.</li><li>I live in Dhaka.</li><li>What class do you read in?</li></ol>",
        marks: 10,
      },
    },
  ],

  SubstitutionTable: [
    {
      difficulty: "Medium",
      topics: ["Substitution Table", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Motijheel Government Boys' High School"],
      level: "প্রয়োগ",
      specialSearch: ["Substitution Table", "Table to Sentences"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Make five meaningful sentences using parts of sentences from each column of the table below:</strong></p><table class='w-full border-collapse border border-slate-300 text-sm'><thead><tr class='bg-slate-100'><th class='border border-slate-300 p-2'>Column A</th><th class='border border-slate-300 p-2'>Column B</th><th class='border border-slate-300 p-2'>Column C</th></tr></thead><tbody><tr><td class='border border-slate-300 p-2'>Character</td><td class='border border-slate-300 p-2'>is</td><td class='border border-slate-300 p-2'>the crown of human life.</td></tr><tr><td class='border border-slate-300 p-2'>It</td><td class='border border-slate-300 p-2'>means</td><td class='border border-slate-300 p-2'>the combination of good qualities.</td></tr><tr><td class='border border-slate-300 p-2'>A person of character</td><td class='border border-slate-300 p-2'>is respected</td><td class='border border-slate-300 p-2'>everywhere in society.</td></tr><tr><td class='border border-slate-300 p-2'>Good character</td><td class='border border-slate-300 p-2'>helps</td><td class='border border-slate-300 p-2'>a person to attain peace and success.</td></tr><tr><td class='border border-slate-300 p-2'>Everybody</td><td class='border border-slate-300 p-2'>should build up</td><td class='border border-slate-300 p-2'>moral character from early life.</td></tr></tbody></table>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol><li>Character is the crown of human life.</li><li>It means the combination of good qualities.</li><li>A person of character is respected everywhere in society.</li><li>Good character helps a person to attain peace and success.</li><li>Everybody should build up moral character from early life.</li></ol>",
        marks: 5,
      },
    },
  ],

  RightFormOfVerbs: [
    {
      difficulty: "Medium",
      topics: ["Right Form of Verbs", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Rajuk Uttara Model College"],
      level: "প্রয়োগ",
      specialSearch: ["Right Form of Verbs", "Verbs"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Complete the following text with suitable verbs from the box. Give their correct forms:</strong></p><div class='p-3 bg-slate-50 border rounded mb-3 text-center'>[ prepare | be | study | succeed | waste ]</div><p>Student life (a) _____ the golden season of life. A student should (b) _____ his time properly. If he does not (c) _____ hard, he cannot (d) _____ in life. Therefore, every student must (e) _____ his lessons attentively.</p>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><p>(a) is<br/>(b) not waste<br/>(c) study<br/>(d) succeed<br/>(e) prepare</p>",
        marks: 5,
      },
    },
  ],

  ChangingSentences: [
    {
      difficulty: "Hard",
      topics: ["Changing Sentences", "Transformation"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Dhaka Residential Model College"],
      level: "উচ্চতর দক্ষতা",
      specialSearch: [
        "Changing Sentences",
        "Transformation of Sentences",
        "Voice",
        "Degree",
      ],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Change the following sentences according to the directions given in brackets:</strong></p><ol type='a'><li>Internet is a wonderful invention of modern science. (Exclamatory)</li><li>It is used by people of all ages. (Active)</li><li>No other invention is as useful as computer. (Comparative)</li><li>We should use it properly so that we can prosper. (Simple)</li><li>Though it has some disadvantages, it is indispensable. (Compound)</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>What a wonderful invention of modern science internet is!</li><li>People of all ages use it.</li><li>Computer is more useful than any other invention.</li><li>We should use it properly to prosper.</li><li>It has some disadvantages, but it is indispensable.</li></ol>",
        marks: 5,
      },
    },
  ],

  CompletingStory: [
    {
      difficulty: "Medium",
      topics: ["Completing Story", "Writing"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["St. Joseph Higher Secondary School"],
      level: "সৃজনশীলতা",
      specialSearch: ["Completing Story", "Story Writing"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Read the beginning of the following story and complete it with a suitable title:</strong></p><p>Once upon a time, there lived a poor woodcutter in a village. One day, he was cutting wood near a deep river. Suddenly, his axe slipped from his hand and fell into the water. The river was very deep, and the poor woodcutter did not know how to swim...</p>",
        suggestedAnswer:
          "<p><strong>Title: The Honest Woodcutter</strong></p><p>...He sat by the riverbank and began to weep bitterly. Hearing his cries, Mercury, the god of water, appeared before him. Learning of his misfortune, Mercury dove into the river and came up with a golden axe. The woodcutter said, 'This is not mine.' The god dove again and brought a silver axe. The honest woodcutter refused this as well. Finally, Mercury brought out the woodcutter's own iron axe. The woodcutter cried out in joy, 'Yes! This is my axe!' Pleased with his honesty, the god rewarded him with all three axes.</p><p><em>Moral: Honesty is the best policy.</em></p>",
        marks: 10,
      },
    },
  ],

  Dialogue: [
    {
      difficulty: "Medium",
      topics: ["Dialogue Writing", "Writing"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Viqarunnisa Noon School & College"],
      level: "প্রয়োগ",
      specialSearch: ["Dialogue Writing", "Conversation"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Write a dialogue between you and your friend about the importance of reading newspapers.</strong></p>",
        suggestedAnswer:
          "<p><strong>Myself:</strong> Hello Rony, how are you?<br/><strong>Rony:</strong> I am fine, thank you. What about you?<br/><strong>Myself:</strong> I am doing great. What are you reading so attentively?<br/><strong>Rony:</strong> I am reading today's 'The Daily Star'.<br/><strong>Myself:</strong> That's very good! Do you read newspapers regularly?<br/><strong>Rony:</strong> Yes, absolutely. Reading newspapers keeps us updated with current affairs, national and global news, and sports.<br/><strong>Myself:</strong> That is true. It also enriches our vocabulary and general knowledge.<br/><strong>Rony:</strong> Exactly! Everyone should develop the habit of reading newspapers daily.<br/><strong>Myself:</strong> Thank you, Rony, for this nice discussion.<br/><strong>Rony:</strong> You are welcome!</p>",
        marks: 10,
      },
    },
  ],

  WhQuestions: [
    {
      difficulty: "Easy",
      topics: ["Wh-Questions", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Motijheel Model School & College"],
      level: "প্রয়োগ",
      specialSearch: ["Wh-Questions", "Primary English Questions"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Make Wh-questions from the given sentences using Who, What, When, Where, Why, Which, and How with the underlined words:</strong></p><ol type='a'><li>Sima is at home <u>because she has flu</u>.</li><li>Tamal is <u>in the library</u>.</li><li>Jessica is going to <u>Chittagong</u>.</li><li>The train leaves at <u>8:00 AM</u>.</li><li><u>Mr. Karim</u> is a doctor.</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>Why is Sima at home?</li><li>Where is Tamal?</li><li>Where is Jessica going?</li><li>When does the train leave?</li><li>Who is a doctor?</li></ol>",
        marks: 10,
      },
    },
  ],

  Narration: [
    {
      difficulty: "Hard",
      topics: ["Narration", "Speech Transformation"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Rajuk Uttara Model College"],
      level: "উচ্চতর দক্ষতা",
      specialSearch: [
        "Narration",
        "Direct to Indirect Speech",
        "Passage Narration",
      ],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Change the narrative style of the following passage:</strong></p><p>'Where are you going?' said the teacher. 'I am going to the library to borrow some books,' replied Rony. 'Did you return the books you borrowed last week?' 'No sir, I will return them tomorrow,' said Rony.</p>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><p>The teacher asked Rony where he was going. Rony replied that he was going to the library to borrow some books. Then the teacher asked him if he had returned the books he had borrowed the previous week. Respectfully, Rony replied in the negative and added that he would return them the next day.</p>",
        marks: 5,
      },
    },
  ],

  TagQuestions: [
    {
      difficulty: "Medium",
      topics: ["Tag Questions", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Mirzapur Cadet College"],
      level: "প্রয়োগ",
      specialSearch: ["Tag Questions", "Question Tags"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Add tag questions to the following statements:</strong></p><ol type='a'><li>Nothing is impossible, _____?</li><li>Let's go for a walk in the open field, _____?</li><li>Birds fly in the sky, _____?</li><li>Everybody loves flowers, _____?</li><li>He seldom comes here, _____?</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>Nothing is impossible, <u>is it</u>?</li><li>Let's go for a walk in the open field, <u>shall we</u>?</li><li>Birds fly in the sky, <u>don't they</u>?</li><li>Everybody loves flowers, <u>don't they</u>?</li><li>He seldom comes here, <u>does he</u>?</li></ol>",
        marks: 5,
      },
    },
  ],

  SuffixPrefix: [
    {
      difficulty: "Medium",
      topics: ["Suffixes and Prefixes", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Ideal School and College"],
      level: "প্রয়োগ",
      specialSearch: ["Suffix", "Prefix", "Word Formation"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Complete the text adding suffixes, prefixes or both to the root words given in brackets:</strong></p><p>Trees are vital for our (a) _____ (exist). They supply oxygen without which no animal can (b) _____ (breath). Unfortunately, many people cut down trees (c) _____ (thought) for their personal gain. This causes (d) _____ (balance) in ecology and leads to natural (e) _____ (disaster).</p>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><p>(a) existence<br/>(b) breathe<br/>(c) thoughtlessly<br/>(d) imbalance<br/>(e) disasters</p>",
        marks: 5,
      },
    },
  ],

  Connectors: [
    {
      difficulty: "Medium",
      topics: ["Sentence Connectors", "Linking Words"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Dhaka College"],
      level: "প্রয়োগ",
      specialSearch: ["Sentence Connectors", "Linking Words"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Complete the passage using suitable sentence connectors:</strong></p><p>Honesty is a noble virtue. (a) _____ a man possesses this virtue, he is respected by all. (b) _____ an honest person faces difficulties, he never deviates from truth. (c) _____ dishonest people prosper temporarily, (d) _____ they suffer in the long run. (e) _____ we should practice honesty from childhood.</p>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><p>(a) If / When<br/>(b) Even if / Although<br/>(c) Though / Although<br/>(d) ultimately / yet<br/>(e) Therefore / So</p>",
        marks: 5,
      },
    },
  ],

  InformationTransfer: [
    {
      difficulty: "Medium",
      topics: ["Information Transfer", "Reading Skills"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Viqarunnisa Noon School & College"],
      level: "অনুধাবন",
      specialSearch: ["Information Transfer", "Grid Completion"],
      generalData: {
        stem: "<p>Kazi Nazrul Islam is the national poet of Bangladesh. He was born on 24 May 1899 in Churulia, West Bengal. He wrote poems, songs, novels, and plays. In 1972, he was brought to Bangladesh. He died on 29 August 1976 in Dhaka.</p>",
        questionText:
          "<p><strong>Complete the following table with the information from the passage:</strong></p><table class='w-full border-collapse border border-slate-300 text-sm'><thead><tr class='bg-slate-100'><th class='border border-slate-300 p-2'>Who / What</th><th class='border border-slate-300 p-2'>Event / Activity</th><th class='border border-slate-300 p-2'>Time / Place</th></tr></thead><tbody><tr><td class='border border-slate-300 p-2'>Kazi Nazrul Islam</td><td class='border border-slate-300 p-2'>born</td><td class='border border-slate-300 p-2'>(i) _____</td></tr><tr><td class='border border-slate-300 p-2'>He</td><td class='border border-slate-300 p-2'>brought to Bangladesh</td><td class='border border-slate-300 p-2'>(ii) _____</td></tr><tr><td class='border border-slate-300 p-2'>(iii) _____</td><td class='border border-slate-300 p-2'>passed away</td><td class='border border-slate-300 p-2'>in Dhaka in 1976</td></tr></tbody></table>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><p>(i) 24 May 1899 / Churulia, West Bengal<br/>(ii) in 1972<br/>(iii) Kazi Nazrul Islam</p>",
        marks: 5,
      },
    },
  ],

  NumbersInWords: [
    {
      difficulty: "Easy",
      topics: ["Numbers in Words", "Primary English"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Primary School"],
      level: "জ্ঞান",
      specialSearch: [
        "Numbers in Words",
        "Cardinal Numbers",
        "Ordinal Numbers",
      ],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Write the following numbers in words (both cardinal and ordinal):</strong></p><ol type='a'><li>12 = _____</li><li>25 = _____</li><li>1st = _____</li><li>2nd = _____</li><li>3rd = _____</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>Twelve</li><li>Twenty-five</li><li>First</li><li>Second</li><li>Third</li></ol>",
        marks: 5,
      },
    },
  ],

  SingularPlural: [
    {
      difficulty: "Easy",
      topics: ["Singular and Plural", "Number"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Primary School"],
      level: "জ্ঞান",
      specialSearch: ["Singular Plural", "Number Transformation"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Change the following words from Singular to Plural:</strong></p><ol type='a'><li>Book - _____</li><li>Child - _____</li><li>Baby - _____</li><li>Leaf - _____</li><li>Man - _____</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>Book - Books</li><li>Child - Children</li><li>Baby - Babies</li><li>Leaf - Leaves</li><li>Man - Men</li></ol>",
        marks: 5,
      },
    },
  ],

  Preposition: [
    {
      difficulty: "Easy",
      topics: ["Prepositions", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Ideal School and College"],
      level: "প্রয়োগ",
      specialSearch: ["Preposition", "Appropriate Prepositions"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Fill in the blanks with appropriate prepositions (in, on, at, to, with, of):</strong></p><ol type='a'><li>The cat is sleeping _____ the table.</li><li>He lives _____ Dhaka.</li><li>She goes to school _____ bus.</li><li>He is fond _____ sweets.</li><li>We should be kind _____ animals.</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>on</li><li>in</li><li>by</li><li>of</li><li>to</li></ol>",
        marks: 5,
      },
    },
  ],

  Articles: [
    {
      difficulty: "Easy",
      topics: ["Articles", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Viqarunnisa Noon School & College"],
      level: "প্রয়োগ",
      specialSearch: ["Articles", "a an the"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Fill in the blanks with 'a', 'an' or 'the'. Put a cross (x) where no article is needed:</strong></p><ol type='a'><li>He is _____ honest boy.</li><li>I saw _____ bird in the cage.</li><li>_____ Padma is a big river.</li><li>He drinks _____ milk every morning.</li><li>Mr. Rahman is _____ M.A.</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>an</li><li>a</li><li>The</li><li>x</li><li>an</li></ol>",
        marks: 5,
      },
    },
  ],

  PartsOfSpeech: [
    {
      difficulty: "Easy",
      topics: ["Parts of Speech", "Grammar"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["Primary School"],
      level: "জ্ঞান",
      specialSearch: ["Parts of Speech", "Noun", "Pronoun", "Verb"],
      generalData: {
        stem: "",
        questionText:
          "<p><strong>Identify the parts of speech of the underlined words (Noun, Pronoun, Verb, Adjective, Adverb):</strong></p><ol type='a'><li>Dhaka is a <u>large</u> city.</li><li><u>She</u> sings beautifully.</li><li>Birds <u>fly</u> in the sky.</li><li><u>Honesty</u> is rewarded.</li><li>He runs <u>fast</u>.</li></ol>",
        suggestedAnswer:
          "<p><strong>Answer:</strong></p><ol type='a'><li>large - Adjective</li><li>She - Pronoun</li><li>fly - Verb</li><li>Honesty - Noun</li><li>fast - Adverb</li></ol>",
        marks: 5,
      },
    },
  ],
};

/**
 * Returns JSON object array sample for the specified category and sub-type
 */
export function getCategoryJsonSample(category, subType = "All") {
  if (category === "MCQ") {
    const mcqObj = CATEGORY_JSON_SAMPLES.MCQ;
    if (subType === "Simple") return mcqObj.Simple;
    if (subType === "MultipleCompletion") return mcqObj.MultipleCompletion;
    if (subType === "Contextual") return mcqObj.Contextual;
    if (subType === "Grouped") return mcqObj.Grouped;
    return [
      ...mcqObj.Simple,
      ...mcqObj.MultipleCompletion,
      ...mcqObj.Contextual,
      ...mcqObj.Grouped,
    ];
  }

  if (category === "Application") {
    return CATEGORY_JSON_SAMPLES.LetterWriting;
  }

  return CATEGORY_JSON_SAMPLES[category] || CATEGORY_JSON_SAMPLES.ShortAnswer;
}

/**
 * Returns JSON string placeholder for textarea
 */
export function getCategoryJsonPlaceholder(category, subType = "All") {
  const sample = getCategoryJsonSample(category, subType);
  return JSON.stringify(sample, null, 2);
}
