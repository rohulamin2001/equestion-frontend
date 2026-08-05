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
import { CheckCircle2, ChevronDown, LifeBuoy, Loader2, Paperclip, Send } from "lucide-react";

export function CreateTicketModal({
  isOpen,
  onOpenChange,
  newCategory,
  setNewCategory,
  newSubject,
  setNewSubject,
  newDescription,
  setNewDescription,
  newAttachmentUrl,
  setNewAttachmentUrl,
  onSubmit,
  isPending,
  categoryOptions,
  categoryLabels,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 font-sans">
            <LifeBuoy className="size-5 text-purple-600" />
            নতুন সাপোর্ট টিকেট
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            আপনার সমস্যটি বিস্তারিত লিখুন। আমাদের সাপোর্ট টিম দ্রুত সমাধান
            প্রদান করবে।
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              সমস্যার ক্যাটাগরি *
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-full h-10 px-3.5 border border-slate-200/80 bg-white/80 hover:bg-white rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none backdrop-blur-md transition shadow-2xs flex items-center justify-between cursor-pointer group"
                >
                  <span>{categoryLabels[newCategory] || newCategory}</span>
                  <ChevronDown className="size-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] w-full min-w-[240px] font-bengali"
              >
                {categoryOptions.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onSelect={() => setNewCategory(cat)}
                    className={`w-full px-3 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer flex items-center justify-between transition ${
                      newCategory === cat
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{categoryLabels[cat] || cat}</span>
                    {newCategory === cat && (
                      <CheckCircle2 className="size-4 text-purple-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              সংক্ষিপ্ত বিষয়বস্তু (Subject) *
            </label>
            <Input
              placeholder="যেমন: পদার্থবিজ্ঞান ৩য় অধ্যায়ের প্রশ্নটিতে টাইপো আছে"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="h-10 text-xs sm:text-sm bg-white/[0.6] rounded-xl border-black/[0.08]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">
              বিস্তারিত বিবরণ (Description) *
            </label>
            <textarea
              placeholder="আপনার সমস্যা বা প্রশ্নের বিস্তারিত বিবরণ লিখুন..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={4}
              className="w-full p-3 text-xs sm:text-sm bg-white/[0.6] rounded-xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-purple-600/20 font-sans"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Paperclip className="size-3.5" /> ফাইল / স্ক্রিনশট লিংক (ঐচ্ছিক)
            </label>
            <Input
              placeholder="https://drive.google.com/... বা স্ক্রিনশটের ড্রাইভ লিংক"
              value={newAttachmentUrl}
              onChange={(e) => setNewAttachmentUrl(e.target.value)}
              className="h-9 text-xs bg-white/[0.6] rounded-xl border-black/[0.08]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-10 px-4 text-xs font-semibold text-slate-500 cursor-pointer"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-purple-600 hover:bg-purple-800 text-white rounded-xl h-10 px-5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  সাবমিট করুন
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
