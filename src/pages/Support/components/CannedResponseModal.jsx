import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronDown, Sparkles, Trash2 } from "lucide-react";

export function CannedResponseModal({
  isOpen,
  onOpenChange,
  cannedTitle,
  setCannedTitle,
  cannedCategory,
  setCannedCategory,
  cannedContent,
  setCannedContent,
  handleCreateCannedSubmit,
  handleDeleteCanned,
  cannedResponses,
  createCannedPending,
  categoryLabels,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="size-5 text-purple-600" />
            ক্যানড রেসপন্স টেমপ্লেট সেটিংস
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            ঘনঘন আসা প্রশ্নের দ্রুত উত্তরের জন্য ক্যানড টেমপ্লেট সেভ করে রাখুন।
          </DialogDescription>
        </DialogHeader>

        {/* Add New Template Form */}
        <form onSubmit={handleCreateCannedSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              placeholder="টেমপ্লেট শিরোনাম (যেমন: পেমেন্ট কনফার্মেশন প্রসেস)"
              value={cannedTitle}
              onChange={(e) => setCannedTitle(e.target.value)}
              className="h-9 text-xs bg-white rounded-xl border-black/[0.08]"
              required
            />
            <div className="relative">
              <select
                value={cannedCategory}
                onChange={(e) => setCannedCategory(e.target.value)}
                className="w-full h-9 text-xs bg-white rounded-xl border border-black/[0.08] pl-3 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 appearance-none cursor-pointer shadow-2xs"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <textarea
            placeholder="টেমপ্লেট উত্তরের বিষয়বস্তু..."
            value={cannedContent}
            onChange={(e) => setCannedContent(e.target.value)}
            rows={3}
            className="w-full p-2.5 text-xs bg-white rounded-xl border border-black/[0.08] focus:outline-none font-sans"
            required
          />
          <Button
            type="submit"
            disabled={createCannedPending}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white rounded-xl h-9 text-xs font-bold cursor-pointer"
          >
            + নতুন টেমপ্লেট যোগ করুন
          </Button>
        </form>

        {/* Saved Templates List */}
        <div className="pt-3 space-y-2 max-h-48 overflow-y-auto border-t border-black/[0.05]">
          <span className="text-xs font-bold text-slate-600 block">
            সংরক্ষিত টেমপ্লেটসমূহ:
          </span>
          {cannedResponses.map((template) => (
            <div
              key={template._id}
              className="p-2.5 bg-slate-50 rounded-xl border border-black/[0.05] flex items-center justify-between text-xs gap-2"
            >
              <div>
                <strong className="text-slate-800 block">
                  {template.title}
                </strong>
                <span className="text-[11px] text-slate-500 line-clamp-1">
                  {template.content}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCanned(template._id)}
                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
