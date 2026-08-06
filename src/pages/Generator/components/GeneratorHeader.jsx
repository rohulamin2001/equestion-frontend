import { CreditCard, Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GeneratorHeader({ hasLockedSubject }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white shadow-lg shadow-purple-900/15 px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-7 text-center font-sans">
      {/* Floating background orbs */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-24 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center justify-center gap-2">
        <Wand2 className="size-5 sm:size-6 text-purple-300" />
        <span>প্রশ্ন তৈরি করুন</span>
        <Sparkles className="size-4 sm:size-5 text-yellow-300 animate-pulse" />
      </h1>
      <p className="text-xs text-purple-200 mt-1 font-normal">
        শিক্ষা এবং সফটওয়্যার, একসাথে এগিয়ে চলা!
      </p>

      {/* Subscribe Banner if any selected subject is locked */}
      {hasLockedSubject && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/dashboard/subscription")}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition text-white px-5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 shadow-md shadow-red-500/20 cursor-pointer"
          >
            <CreditCard className="size-3.5" />
            <span>সাবস্ক্রাইব করুন!</span>
          </button>
        </div>
      )}
    </div>
  );
}
