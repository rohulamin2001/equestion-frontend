/**
 * Master definition of all platform features and role permissions.
 * Derived directly from sidebar navigation and route authorization rules.
 */

export const ROLE_KEYS = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  CONTENT_MANAGER: "Content Manager",
  QUESTION_CREATOR: "Question Creator",
  SUPPORT_TEAM: "Support Team",
  SUBSCRIBER: "Subscriber",
};

export const FEATURE_CATEGORIES = [
  "ওভারভিউ",
  "প্রশ্ন ইঞ্জিন",
  "মূল্যায়ন",
  "ব্যবস্থাপনা",
  "সহায়তা",
];

/**
 * Complete list of all 24 application features across all pages and actions.
 */
export const MASTER_APP_FEATURES = [
  // 1. ওভারভিউ
  {
    id: "dashboard",
    name: "ড্যাশবোর্ড",
    category: "ওভারভিউ",
    url: "/dashboard",
    description: "প্ল্যাটফর্মের সামগ্রিক পরিসংখ্যান ও ওভারভিউ বিশ্লেষণ",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.CONTENT_MANAGER,
      ROLE_KEYS.QUESTION_CREATOR,
      ROLE_KEYS.SUPPORT_TEAM,
      ROLE_KEYS.SUBSCRIBER,
    ],
  },

  // 2. প্রশ্ন ইঞ্জিন
  {
    id: "generate",
    name: "১ ক্লিকে প্রশ্ন তৈরি",
    category: "প্রশ্ন ইঞ্জিন",
    url: "/dashboard/generate",
    description: "সিলেবাস ও ব্লুপ্রিন্ট অনুযায়ী এক ক্লিকে সম্পূর্ণ প্রশ্ন তৈরি",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },
  {
    id: "created_questions",
    name: "তৈরিকৃত প্রশ্ন",
    category: "প্রশ্ন ইঞ্জিন",
    url: "/dashboard/created-questions",
    description: "পূর্বে তৈরিকৃত প্রশ্নপত্রের ইতিহাস, ভিউ ও পিডিএফ ডাউনলোড",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.SUBSCRIBER,
    ],
  },
  {
    id: "bank",
    name: "প্রশ্নব্যাংক",
    category: "প্রশ্ন ইঞ্জিন",
    url: "/dashboard/bank",
    description:
      "সেন্ট্রাল প্রশ্নব্যাংকের সমস্ত অনুমোদিত প্রশ্ন অনুসন্ধান ও ফিল্টারিং",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.CONTENT_MANAGER,
    ],
  },
  {
    id: "question_approval",
    name: "প্রশ্ন অনুমোদন",
    category: "প্রশ্ন ইঞ্জিন",
    url: "/dashboard/question-approval",
    description:
      "ক্রিয়েটরদের পাঠানো প্রশ্ন রিভিউ, অনুমোদন (Approve) বা রিজেক্ট (Reject)",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.CONTENT_MANAGER,
    ],
  },
  {
    id: "my_questions",
    name: "আমার তৈরি প্রশ্ন",
    category: "প্রশ্ন ইঞ্জিন",
    url: "/dashboard/my-questions",
    description:
      "ক্রিয়েটরের নিজের তৈরি প্রশ্নের খসড়া, পেন্ডিং ও রিজেক্টেড তালিকা",
    allowedRoles: [ROLE_KEYS.QUESTION_CREATOR],
  },
  {
    id: "add_question",
    name: "নতুন প্রশ্ন যোগ",
    category: "প্রশ্ন ইঞ্জিন",
    url: "/dashboard/add-question",
    description: "সিস্টেমের জন্য মেটাডাটা ও ফর্মুলাসহ নতুন প্রশ্ন সাবমিশন",
    allowedRoles: [ROLE_KEYS.QUESTION_CREATOR],
  },

  // 3. মূল্যায়ন
  {
    id: "exams",
    name: "অনলাইন পরীক্ষা",
    category: "মূল্যায়ন",
    url: "/dashboard/exams",
    description: "শিক্ষার্থীদের জন্য অনলাইন এক্সাম তৈরি, লিংক শেয়ার ও ফলাফল",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },
  {
    id: "omr_generate",
    name: "ওএমআর তৈরি",
    category: "মূল্যায়ন",
    url: "/dashboard/omr/generate",
    description: "কাস্টম রোল নম্বর ও অপশনসহ স্ট্যান্ডার্ড ওএমআর শিট জেনারেশন",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },
  {
    id: "omr_tokens",
    name: "ওএমআর টোকেন",
    category: "মূল্যায়ন",
    url: "/dashboard/omr/tokens",
    description: "ওএমআর শিট মূল্যায়নের জন্য ক্রেডিট টোকেন পরিচালনা ও রিচার্জ",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },
  {
    id: "omr_evaluator",
    name: "ওএমআর মূল্যায়ন",
    category: "মূল্যায়ন",
    url: "/dashboard/omr/evaluator",
    description: "স্মার্ট স্ক্যানারের মাধ্যমে ওএমআর শিট স্বয়ংক্রিয় মূল্যায়ন",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },

  // 4. ব্যবস্থাপনা
  {
    id: "staff_mgmt",
    name: "স্টাফ তালিকা ও নতুন স্টাফ যোগ",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/staff",
    description: "স্টাফ মেম্বারদের তালিকা দর্শন ও নতুন স্টাফ যোগ করা",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.ADMIN],
  },
  {
    id: "staff_promotion_delete",
    name: "স্টাফ পদবি পরিবর্তন ও ডিলিট",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/staff",
    description: "স্টাফদের পদবি পরিবর্তন (প্রমোশন/ডিমোশন) ও স্থায়ীভাবে অপসারণ",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN],
  },
  {
    id: "reset_2fa",
    name: "স্টাফ ২FA সিকিউরিটি রিসেট",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/staff",
    description: "স্টাফদের টু-স্টেপ (2FA) সিকিউরিটি পুনরায় রিসেট করা",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.ADMIN],
  },
  {
    id: "syllabus",
    name: "সিলেবাস ব্যবস্থাপনা",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/syllabus",
    description: "শ্রেণি ও বিষয়ভিত্তিক সিলেবাস যোগ, সম্পাদনা ও অধ্যায় সেটআপ",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.CONTENT_MANAGER,
    ],
  },
  {
    id: "subject_setup",
    name: "সাবজেক্ট সেটআপ",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/subject-setup",
    description:
      "প্ল্যাটফর্মের বিষয় তালিকা ও গ্রুপভিত্তিক কারিকুলাম কনফিগারেশন",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.ADMIN],
  },
  {
    id: "metadata_setup",
    name: "মেটাডাটা সেটআপ",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/metadata-setup",
    description: "প্রশ্নের বোর্ড, বছর ও শিক্ষা প্রতিষ্ঠানের মেটাডাটা ট্যাগিং",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.CONTENT_MANAGER,
    ],
  },
  {
    id: "academic_setup",
    name: "অ্যাকাডেমিক সেটআপ",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/academic-setup",
    description: "শিক্ষা বোর্ড, প্রতিষ্ঠান ধরন ও অ্যাকাডেমিক কাঠামো নিয়ন্ত্রণ",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN],
  },
  {
    id: "pricing",
    name: "প্যাকেজ ও ডিসকাউন্ট",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/admin/pricing",
    description: "সাবস্ক্রিপশন প্যাকেজের মূল্য নির্ধারণ ও প্রোমো কোড তৈরি",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.ADMIN],
  },
  {
    id: "affiliates",
    name: "অ্যাফিলিয়েট প্রোগ্রাম",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/affiliates",
    description: "অ্যাফিলিয়েট পার্টনার, কমিশন ও উইথড্রয়াল সুপারভিশন",
    allowedRoles: [ROLE_KEYS.SUPER_ADMIN, ROLE_KEYS.ADMIN],
  },
  {
    id: "institution",
    name: "আমার প্রতিষ্ঠান",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/institution",
    description: "গ্রাহকের নিজস্ব শিক্ষা প্রতিষ্ঠানের প্রোফাইল ও লোগো সেটআপ",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },
  {
    id: "subscription",
    name: "সাবস্ক্রিপশন ও প্যাকেজ",
    category: "ব্যবস্থাপনা",
    url: "/dashboard/subscription",
    description: "গ্রাহকের বর্তমান প্ল্যান, প্যাকেজ ক্রয় ও পেমেন্ট বিবরণ",
    allowedRoles: [ROLE_KEYS.SUBSCRIBER],
  },

  // 5. সহায়তা
  {
    id: "support_desk",
    name: "সাপোর্ট সেন্টার",
    category: "সহায়তা",
    url: "/dashboard/support",
    description: "গ্রাহক সহায়তা টিমের কাছে প্রশ্ন বা সমস্যার টিকিট সাবমিট করা",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.CONTENT_MANAGER,
      ROLE_KEYS.QUESTION_CREATOR,
      ROLE_KEYS.SUPPORT_TEAM,
      ROLE_KEYS.SUBSCRIBER,
    ],
  },
  {
    id: "support_management",
    name: "সাপোর্ট হেল্পডেস্ক",
    category: "সহায়তা",
    url: "/dashboard/support-management",
    description: "ব্যবহারকারীদের সমস্ত অভিযোগ ও সহায়তা টিকিট পরিচালনা ও সমাধান",
    allowedRoles: [
      ROLE_KEYS.SUPER_ADMIN,
      ROLE_KEYS.ADMIN,
      ROLE_KEYS.SUPPORT_TEAM,
    ],
  },
];

/**
 * Returns all features for a given role with allowed boolean flag.
 */
export function getFeaturesForRole(roleKey) {
  return MASTER_APP_FEATURES.map((feature) => ({
    ...feature,
    allowed: feature.allowedRoles.includes(roleKey),
  }));
}

export const ROLE_CONFIGS = {
  [ROLE_KEYS.SUPER_ADMIN]: {
    key: ROLE_KEYS.SUPER_ADMIN,
    title: "Super Admin",
    bengaliTitle: "সুপার এডমিন",
    tagline: "সম্পূর্ণ সিস্টেমের সর্বোচ্চ নিয়ন্ত্রণ ও এক্সেস",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    glowColor: "rgba(239, 68, 68, 0.5)",
    description:
      "সিস্টেমের মূল নিয়ন্ত্রক। সমস্ত ফিচার, স্টাফ ম্যানেজমেন্ট, আর্থিক প্যাকেজ এবং সিস্টেম সিকিউরিটির সম্পূর্ণ এক্সেস রয়েছে।",
    responsibilities: [
      "সমস্ত স্টাফ যোগ, ডিলিট ও পদবি পরিবর্তন (প্রমোশন/ডিমোশন)",
      "ব্যবহারকারীদের ২-স্টেপ (2FA) সিকিউরিটি রিসেট",
      "অ্যাকাডেমিক সেটআপ, সাবজেক্ট ও মেটাডাটা কনফিগারেশন",
      "প্রশ্ন অনুমোদন, প্রশ্নব্যাংক ও সিলেবাস ব্যবস্থাপনা",
      "প্যাকেজ মূল্য নির্ধারণ ও অ্যাফিলিয়েট প্রোগ্রাম পরিচালনা",
      "গ্রাহক সহায়তা টিকিট হেল্পডেস্ক সুপারভিশন",
    ],
    features: getFeaturesForRole(ROLE_KEYS.SUPER_ADMIN),
  },

  [ROLE_KEYS.ADMIN]: {
    key: ROLE_KEYS.ADMIN,
    title: "Admin",
    bengaliTitle: "এডমিন",
    tagline: "স্টাফ পরিচালনা, প্ল্যাটফর্ম সেটআপ ও কন্টেন্ট সুপারভিশন",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
    glowColor: "rgba(249, 115, 22, 0.5)",
    description:
      "প্ল্যাটফর্মের দৈনন্দিন কার্য পরিচালনা ও কনফিগারেশন পরিচালনা করেন। স্টাফ তালিকা দেখতে ও ২FA রিসেট করতে পারেন, তবে পদবি পরিবর্তন বা স্টাফ স্থায়ীভাবে মোছার ক্ষমতা সুপার এডমিনের হাতে সংরক্ষিত।",
    responsibilities: [
      "নতুন স্টাফ মেম্বার যোগ করা ও ২FA রিসেট",
      "সিলেবাস ও মেটাডাটা সেটআপ পরিচালনা",
      "প্যাকেজ ও ডিসকাউন্ট কনফিগারেশন এবং অ্যাফিলিয়েট প্রোগ্রাম ভিউ",
      "প্রশ্ন অনুমোদন (Question Approval) ও প্রশ্নব্যাংক এক্সেস",
      "গ্রাহক সহায়তা টিকিট হেল্পডেস্কে সহায়তা প্রদান",
    ],
    features: getFeaturesForRole(ROLE_KEYS.ADMIN),
  },

  [ROLE_KEYS.CONTENT_MANAGER]: {
    key: ROLE_KEYS.CONTENT_MANAGER,
    title: "Content Manager",
    bengaliTitle: "কন্টেন্ট ম্যানেজার",
    tagline: "প্রশ্ন অনুমোদন, সিলেবাস পরিচালনা ও মেটাডাটা সেটআপ",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
    description:
      "প্রশ্নের মান নিয়ন্ত্রণ ও সিলেবাস সমৃদ্ধকরণের মূল দায়িত্ব পালন করেন। প্রশ্ন ক্রিয়েটরদের পাঠানো প্রশ্ন রিভিউ করে অনুমোদন বা প্রত্যাখ্যান করতে পারেন।",
    responsibilities: [
      "প্রশ্ন ক্রিয়েটরদের জমাকৃত প্রশ্ন রিভিউ ও মান যাচাই",
      "প্রশ্ন অনুমোদন (Approve) অথবা ফিডব্যাক দিয়ে রিজেক্ট (Reject) করা",
      "অনুমোদিত প্রশ্নব্যাংক সম্পূর্ণ ব্রাউজ ও ফিল্টার করা",
      "সিলেবাস ও কারিকুলামের চ্যাপ্টার/টপিক আপডেট করা",
      "প্রশ্নের বোর্ড, বছর ও মেটাডাটা ট্যাগিং কনফিগার করা",
    ],
    features: getFeaturesForRole(ROLE_KEYS.CONTENT_MANAGER),
  },

  [ROLE_KEYS.QUESTION_CREATOR]: {
    key: ROLE_KEYS.QUESTION_CREATOR,
    title: "Question Creator",
    bengaliTitle: "প্রশ্ন ক্রিয়েটর",
    tagline: "নতুন প্রশ্ন তৈরি ও নিজস্ব ড্রাফট/সাবমিশন পরিচালনা",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
    glowColor: "rgba(16, 185, 129, 0.5)",
    description:
      "সিস্টেমের জন্য নতুন প্রশ্ন রচয়িতা। সিলেবাস ও মেটাডাটা অনুযায়ী বিভিন্ন বিষয়ের প্রশ্ন তৈরি করেন এবং অনুমোদনের জন্য সাবমিট করেন।",
    responsibilities: [
      "নতুন প্রশ্ন তৈরি ও মেটাডাটা (বিষয়, অধ্যায়, সাল) যুক্ত করে সাবমিট করা",
      "নিজের তৈরি প্রশ্নের খসড়া (Draft) সংরক্ষণ ও এডিট করা",
      "অনুমোদনের অপেক্ষায় থাকা (Pending) ও রিজেক্টেড প্রশ্নের ফিডব্যাক সংশোধন",
      "ব্যক্তিগত সাপোর্ট টিকিটের মাধ্যমে টিমের সাহায্য চাওয়া",
    ],
    features: getFeaturesForRole(ROLE_KEYS.QUESTION_CREATOR),
  },

  [ROLE_KEYS.SUPPORT_TEAM]: {
    key: ROLE_KEYS.SUPPORT_TEAM,
    title: "Support Team",
    bengaliTitle: "সাপোর্ট টিম",
    tagline: "ব্যবহারকারীদের অভিযোগ সমাধান ও হেল্পডেস্ক সাপোর্ট",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
    glowColor: "rgba(168, 85, 247, 0.5)",
    description:
      "গ্রাহক সেবা ও টেকনিক্যাল হেল্পডেস্কের দায়িত্ব পালন করেন। ব্যবহারকারীদের যেকোনো প্রশ্ন, টিকিট বা সমস্যার দ্রুত সমাধান নিশ্চিত করেন।",
    responsibilities: [
      "সাপোর্ট হেল্পডেস্কে আগত সকল গ্রাহক টিকিট পর্যালোচনা",
      "টিকিটের উত্তর দেওয়া ও দ্রুত স্ট্যাটাস সমাধান (Resolve)",
      "ক্যান্ড রেসপন্স (Canned Responses) তৈরি ও ব্যবহার",
      "গুরুত্বপূর্ণ সমস্যা এডমিন ও টেকনিক্যাল টিমের কাছে ফরওয়ার্ড করা",
    ],
    features: getFeaturesForRole(ROLE_KEYS.SUPPORT_TEAM),
  },

  [ROLE_KEYS.SUBSCRIBER]: {
    key: ROLE_KEYS.SUBSCRIBER,
    title: "Subscriber",
    bengaliTitle: "সাবস্ক্রাইবার",
    tagline: "প্রশ্ন জেনারেটর, ওএমআর মূল্যায়ন ও অনলাইন পরীক্ষা",
    badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
    dotColor: "bg-slate-500",
    glowColor: "rgba(100, 116, 139, 0.5)",
    description:
      "প্ল্যাটফর্মের নিয়মিত গ্রাহক (শিক্ষক, কোচিং সেন্টার ও শিক্ষা প্রতিষ্ঠান)। এরা প্রশ্ন জেনারেটর ব্যবহার করে প্রশ্ন তৈরি, ওএমআর শিট তৈরি ও মূল্যায়ন করতে পারেন।",
    responsibilities: [
      "১ ক্লিকে নিজস্ব সিলেবাস অনুযায়ী প্রশ্নপত্র তৈরি করা",
      "অনলাইন পরীক্ষা পরিচালনা ও শিক্ষার্থীদের অংশগ্রহণ নিশ্চিত করা",
      "ওএমআর শিট জেনারেশন ও স্মার্ট স্ক্যানারের মাধ্যমে ওএমআর মূল্যায়ন",
      "প্রতিষ্ঠান প্রোফাইল ও সাবস্ক্রিপশন প্ল্যান নবায়ন",
    ],
    features: getFeaturesForRole(ROLE_KEYS.SUBSCRIBER),
  },
};

/**
 * Returns a comparison between two roles:
 * what permissions are gained vs what are lost
 */
export function getRoleDiff(fromRoleKey, toRoleKey) {
  const fromAllowed = new Set(
    MASTER_APP_FEATURES.filter((f) => f.allowedRoles.includes(fromRoleKey)).map(
      (f) => f.name,
    ),
  );
  const toAllowed = new Set(
    MASTER_APP_FEATURES.filter((f) => f.allowedRoles.includes(toRoleKey)).map(
      (f) => f.name,
    ),
  );

  const gained = [];
  toAllowed.forEach((item) => {
    if (!fromAllowed.has(item)) {
      gained.push(item);
    }
  });

  const lost = [];
  fromAllowed.forEach((item) => {
    if (!toAllowed.has(item)) {
      lost.push(item);
    }
  });

  return { gained, lost };
}
