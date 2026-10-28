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
      level: "Famous School",
      specialSearch: ["পরীক্ষায় আসার মতো"],
      creativeData: {
        stem: "করিম একটি কাঁচের জারে সবুজ জলজ উদ্ভিদ রেখে সূর্যালোকিত স্থানে রাখল। কিছুক্ষণ পর সে দেখল উদ্ভিদটির কান্ড থেকে বুদবুদ আকারে গ্যাস নির্গত হচ্ছে...",
        subQuestions: {
          cognitiveA: {
            text: "সালোকসংশ্লেষণ কাকে বলে ?",
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

  // ৭. কবিতা (Poem)
  Poem: [
    {
      difficulty: "Medium",
      topics: ["কাজের লোক"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["গভ. ল্যাবরেটরি হাই স্কুল"],
      level: "অনুধাবন",
      specialSearch: ["কবিতা ও চরণভিত্তিক প্রশ্ন"],
      generalData: {
        stem: "<p><strong>কবিতাংশ:</strong><br/>মৌমাছি, মৌমাছি,<br/>কোথা যাও নাচি নাচি,<br/>দাঁড়াও না একবার ভাই।<br/>ওই ফুল ফোটে বনে,<br/>যাই মধু আহরণে,<br/>দাঁড়াবার সময় তো নাই।</p>",
        questionText:
          "<p>ক) মৌমাছি কোথায় যায় এবং কেন যায়?<br/>খ) কবিতাটির কবির নাম কী?</p>",
        suggestedAnswer:
          "<p>ক) মৌমাছি বনে ফুল থেকে মধু সংগ্রহ করার জন্য যায়।<br/>খ) কবিতাটির কবির নাম নবকৃষ্ণ ভট্টাচার্য।</p>",
        marks: 5,
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

  // ১৫. অনুচ্ছেদ (Paragraph)
  Paragraph: [
    {
      difficulty: "Medium",
      topics: ["অনুচ্ছেদ ও প্রশ্নোত্তর"],
      examHistory: [{ board: "ঢাকা বোর্ড", years: ["2026"] }],
      school: ["ময়মনসিংহ জিলা স্কুল"],
      level: "অনুধাবন ও প্রয়োগ",
      specialSearch: ["অনুচ্ছেদ ভিত্তিক"],
      generalData: {
        stem: "<p><strong>নিচের অনুচ্ছেদটি পড়ে প্রশ্নগুলোর উত্তর দাও:</strong><br/>বাঙালি জাতির জীবনে একুশে ফেব্রুয়ারি এক অবিস্মরণীয় দিন। ১৯৫২ সালের এই দিনে মাতৃভাষা বাংলার মর্যাদার দাবিতে রাজপথে বুকের তাজা রক্ত ঢেলে দিয়ে শহীদ হন সালাম, বরকত, রফিক, জব্বারসহ অনেকে। তাদের এই মহান আত্মত্যাগের মাধ্যমে বাংলা ভাষা রাষ্ট্রভাষার মর্যাদা লাভ করে। ১৯৯৯ সালে ইউনেস্কো দিনটিকে আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে স্বীকৃতি দেয়।</p>",
        questionText:
          "<p>ক) বাঙালি জাতির জীবনে একুশে ফেব্রুয়ারি কেন অবিস্মরণীয়?<br/>খ) আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে দিনটি কবে স্বীকৃতি পায়?</p>",
        suggestedAnswer:
          "<p>ক) মাতৃভাষা বাংলার অধিকার প্রতিষ্ঠার জন্য বীর শহীদরা এই দিনে জীবন উৎসর্গ করেছিলেন বলে এটি এক অবিস্মরণীয় দিন।<br/>খ) ১৯৯৯ সালে ইউনেস্কো একুশে ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে স্বীকৃতি প্রদান করে।</p>",
        marks: 5,
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
        stem: "<p><strong>ইঙ্গিত/পয়েন্ট:</strong> ভূমিকা, প্রাকৃতিক রূপ, জাতীয় প্রতীকসমূহ, অর্থনৈতিক গুরুত্ব, উপসংহার।</p>",
        questionText:
          "<p>উপরের ইঙ্গিতগুলোর আলোকে 'আমাদের প্রিয় মাতৃভূমি' বিষয়ে একটি রচনা লেখ।</p>",
        suggestedAnswer:
          "<p><strong>ভূমিকা:</strong> আমাদের প্রিয় মাতৃভূমির নাম বাংলাদেশ। এটি দক্ষিণ এশিয়ার একটি সবুজ শ্যামল দেশ...<br/><br/><strong>উপসংহার:</strong> দেশকে সুন্দর ও সমৃদ্ধশালী করে গড়ে তোলা আমাদের সকলের পবিত্র দায়িত্ব।</p>",
        marks: 10,
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

  return CATEGORY_JSON_SAMPLES[category] || CATEGORY_JSON_SAMPLES.ShortAnswer;
}

/**
 * Returns JSON string placeholder for textarea
 */
export function getCategoryJsonPlaceholder(category, subType = "All") {
  const sample = getCategoryJsonSample(category, subType);
  return JSON.stringify(sample, null, 2);
}
