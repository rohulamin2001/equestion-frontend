import { GraduationCap, KeyRound, Landmark, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ProfileInfoTab from "./components/ProfileInfoTab";
import ProfileSecurityTab from "./components/ProfileSecurityTab";
import ProfileSubscriptionsTab from "./components/ProfileSubscriptionsTab";
import { useProfile } from "./hook/useProfile";

export default function Profile() {
  const profile = useProfile();
  const { activeTab, setActiveTab, isSubscriber, isTeacher } = profile;

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-base sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
          প্রোফাইল সেটিংস
        </h1>
        <p className="text-[11px] sm:text-sm text-slate-500 font-bengali mt-0.5">
          আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য এবং অ্যাকাউন্ট নিরাপত্তা পরিচালনা
          করুন
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("info")}
          className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all font-bengali whitespace-nowrap shrink-0 ${
            activeTab === "info"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          {!isSubscriber || isTeacher ? (
            <GraduationCap className="size-3.5 sm:size-4" />
          ) : (
            <Landmark className="size-3.5 sm:size-4" />
          )}
          প্রোফাইল তথ্য
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all font-bengali whitespace-nowrap shrink-0 ${
            activeTab === "security"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <KeyRound className="size-3.5 sm:size-4" />
          নিরাপত্তা ও অ্যাকাউন্ট
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`pb-2.5 sm:pb-3 text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 border-b-2 transition-all font-bengali whitespace-nowrap shrink-0 ${
            activeTab === "subscriptions"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <ShieldCheck className="size-3.5 sm:size-4" />
          সাবস্ক্রিপশন
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <ProfileInfoTab profile={profile} />
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <ProfileSecurityTab profile={profile} />
          </motion.div>
        )}

        {activeTab === "subscriptions" && (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <ProfileSubscriptionsTab profile={profile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
