import {
  GraduationCap,
  KeyRound,
  Landmark,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ProfileInfoTab from "./components/ProfileInfoTab";
import ProfileSecurityTab from "./components/ProfileSecurityTab";
import ProfileSubscriptionsTab from "./components/ProfileSubscriptionsTab";
import { useProfile } from "./hook/useProfile";

export default function Profile() {
  const profile = useProfile();
  const { activeTab, setActiveTab, isSubscriber, isTeacher } = profile;

  const tabs = [
    {
      id: "info",
      label: "প্রোফাইল তথ্য",
      icon: !isSubscriber || isTeacher ? GraduationCap : Landmark,
    },
    {
      id: "security",
      label: "নিরাপত্তা ও অ্যাকাউন্ট",
      icon: KeyRound,
    },
    {
      id: "subscriptions",
      label: "সাবস্ক্রিপশন",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto pb-10">
      {/* Page Header */}
      <div className="flex items-center gap-3.5 bg-glass-elevated backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-200/50 shadow-soft">
        <div className="p-2.5 sm:p-3 bg-gradient-to-br from-[var(--purple-700)] to-[var(--purple-600)] text-white rounded-xl shadow-md shadow-purple-600/20 shrink-0">
          <UserCog className="size-5 sm:size-6" />
        </div>
        <div>
          <h1 className="text-base sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
            প্রোফাইল সেটিংস
          </h1>
          <p className="text-[11px] sm:text-sm text-slate-500 font-bengali mt-0.5 font-medium">
            আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্য এবং অ্যাকাউন্ট নিরাপত্তা পরিচালনা করুন
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="bg-slate-100/80 p-1 sm:p-1.5 rounded-2xl flex gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar border border-slate-200/60 shadow-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 flex-1 min-w-[105px] sm:min-w-[140px] py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 transition-colors duration-200 font-bengali cursor-pointer whitespace-nowrap ${
                isActive
                  ? "text-[var(--purple-800)]"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="profileTabPill"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-purple-200/50"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <Icon className={`size-3.5 sm:size-4 shrink-0 relative z-10 transition-colors ${isActive ? "text-[var(--purple-700)]" : "text-slate-400"}`} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <ProfileInfoTab profile={profile} />
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <ProfileSecurityTab profile={profile} />
          </motion.div>
        )}

        {activeTab === "subscriptions" && (
          <motion.div
            key="subscriptions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <ProfileSubscriptionsTab profile={profile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
