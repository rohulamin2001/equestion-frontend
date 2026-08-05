import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ChevronDown, Sparkles, Trash2 } from "lucide-react";

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full h-9 px-3 border border-black/[0.08] bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none transition shadow-2xs flex items-center justify-between cursor-pointer group"
                >
                  <span>
                    {categoryLabels[cannedCategory] || cannedCategory}
                  </span>
                  <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] min-w-[180px] font-bengali"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onSelect={() => setCannedCategory(key)}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                      cannedCategory === key
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{label}</span>
                    {cannedCategory === key && (
                      <CheckCircle2 className="size-3.5 text-purple-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
