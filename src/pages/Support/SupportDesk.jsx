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
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  Clock,
  Clock3,
  FileText,
  HelpCircle,
  LifeBuoy,
  Loader2,
  MessageSquare,
  Paperclip,
  PlusCircle,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSupport } from "./hook/useSupport";

const CATEGORY_OPTIONS = [
  "Billing & Subscription",
  "Question & Content Error",
  "Technical & Login",
  "Feature Request",
  "Other",
];

const CATEGORY_LABELS = {
  "Billing & Subscription": "পেমেন্ট ও সাবস্ক্রিপশন",
  "Question & Content Error": "প্রশ্ন ও কন্টেন্ট সংশোধন",
  "Technical & Login": "লগইন ও কারিগরি সমস্যা",
  "Feature Request": "নতুন ফিচারের পরামর্শ",
  Other: "অন্যান্য বিষয়",
};

const STATUS_CONFIG = {
  Open: {
    label: "খোলা (Open)",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: AlertCircle,
  },
  "In Progress": {
    label: "প্রক্রিয়াধীন",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock3,
  },
  "Waiting for Customer": {
    label: "আপনার উত্তরের অপেক্ষায়",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Clock,
  },
  Resolved: {
    label: "সমাধানকৃত",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  Closed: {
    label: "বন্ধ (Closed)",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: BadgeCheck,
  },
};

const PRIORITY_CONFIG = {
  Low: {
    label: "সাধারণ",
    color: "bg-slate-100 text-slate-600 border-slate-200",
  },
  Medium: {
    label: "মাঝারি",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  High: {
    label: "উচ্চ (High)",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  VIP: {
    label: "VIP Priority",
    color: "bg-purple-100 text-purple-800 border-purple-300 font-bold",
  },
};

export default function SupportDesk() {
  const {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    activeTicketId,
    setActiveTicketId,
    isCreateModalOpen,
    setIsCreateModalOpen,
    stats,
    isStatsLoading,
    tickets,
    isTicketsLoading,
    ticketDetails,
    isTicketDetailsLoading,
    createTicketMutation,
    addMessageMutation,
    submitRatingMutation,
  } = useSupport();

  // New Ticket Form State
  const [newCategory, setNewCategory] = useState("Question & Content Error");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");

  // Reply Form State
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachmentUrl, setReplyAttachmentUrl] = useState("");

  // CSAT Rating State
  const [selectedRating, setSelectedRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      toast.error("দয়া করে বিষয়বস্তু ও বিবরণ লিখুন");
      return;
    }

    const attachments = newAttachmentUrl.trim()
      ? [{ fileName: "Attachment", fileUrl: newAttachmentUrl.trim() }]
      : [];

    try {
      await createTicketMutation.mutateAsync({
        category: newCategory,
        subject: newSubject,
        description: newDescription,
        attachments,
      });
      toast.success("সাপোর্ট টিকেটটি সফলভাবে খোলা হয়েছে!");
      setNewSubject("");
      setNewDescription("");
      setNewAttachmentUrl("");
    } catch {
      toast.error("টিকেট সাবমিট করতে ব্যর্থ হয়েছে");
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicketId) return;

    const attachments = replyAttachmentUrl.trim()
      ? [{ fileName: "Attachment", fileUrl: replyAttachmentUrl.trim() }]
      : [];

    try {
      await addMessageMutation.mutateAsync({
        ticketId: activeTicketId,
        message: replyMessage,
        attachments,
      });
      setReplyMessage("");
      setReplyAttachmentUrl("");
      toast.success("উত্তরটি সফলভাবে পাঠানো হয়েছে!");
    } catch {
      toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে");
    }
  };

  const handleRatingSubmit = async () => {
    if (!activeTicketId) return;
    try {
      await submitRatingMutation.mutateAsync({
        ticketId: activeTicketId,
        satisfactionRating: selectedRating,
        feedbackComment,
      });
      toast.success("আপনার মূল্যবান ফিডব্যাকের জন্য ধন্যবাদ!");
    } catch {
      toast.error("রেটিং সাবমিট করতে সমস্যা হয়েছে");
    }
  };

  const formatBengaliDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 pb-12 w-full font-bengali">
      {/* Header Banner */}
      <div className="bg-glass p-4 sm:p-6 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#900EB0]/10 text-[#900EB0] shrink-0">
              <LifeBuoy className="size-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight font-sans">
                সহায়তা ও সাপোর্ট সেন্টার (Support Desk)
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                পেমেন্ট, প্রশ্ন সংশোধন বা যেকোনো কারিগরি সহায়তার জন্য টিকেট
                খুলুন
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#900EB0] hover:bg-[#720A7B] text-white rounded-xl h-9 sm:h-11 px-4 flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-md shadow-[#900EB0]/20 cursor-pointer accent-glow-purple"
          >
            <PlusCircle className="size-4" />
            নতুন টিকেট খুলুন
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "মোট টিকেট",
            count: stats.total,
            color: "text-[#900EB0]",
            bg: "from-[#900EB0]/10 to-[#B010CA]/10",
            icon: FileText,
          },
          {
            label: "ওপেন/প্রক্রিয়াধীন",
            count: stats.open + stats.inProgress,
            color: "text-rose-600",
            bg: "from-rose-500/10 to-red-500/10",
            icon: Clock3,
          },
          {
            label: "সমাধানকৃত",
            count: stats.resolved + stats.closed,
            color: "text-emerald-600",
            bg: "from-emerald-500/10 to-teal-500/10",
            icon: CheckCircle2,
          },
          {
            label: "গড় সন্তুষ্টি (CSAT)",
            count: `${stats.avgRating} ★`,
            color: "text-amber-600",
            bg: "from-amber-500/10 to-orange-500/10",
            icon: Star,
          },
        ].map((stat, i) => {
          const IconComp = stat.icon;
          return (
            <div
              key={i}
              className="bg-white/[0.45] hover:bg-white/[0.65] p-4 rounded-2xl border border-black/[0.04] backdrop-blur-md shadow-soft transition flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block uppercase tracking-wider font-sans">
                  {stat.label}
                </span>
                <span className="text-lg sm:text-2xl font-bold text-slate-800 block font-sans">
                  {isStatsLoading ? "..." : stat.count}
                </span>
              </div>
              <div
                className={`size-10 sm:size-11 rounded-xl bg-gradient-to-br ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
              >
                <IconComp className="size-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-glass p-4 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-3 sm:space-y-0 sm:flex items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="টিকেট আইডি বা বিষয়বস্তু দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs sm:text-sm bg-white/[0.45] border-black/[0.08] focus-visible:ring-[#900EB0]/15 rounded-xl font-semibold text-slate-700"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-3.5 border border-black/[0.08] bg-white/65 hover:bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none backdrop-blur-md transition shadow-2xs flex items-center gap-2 cursor-pointer group">
                <span>
                  {statusFilter
                    ? STATUS_CONFIG[statusFilter]?.label || statusFilter
                    : "সকল স্ট্যাটাস"}
                </span>
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] min-w-[160px]"
            >
              <DropdownMenuItem
                onSelect={() => setStatusFilter("")}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                  !statusFilter
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>সকল স্ট্যাটাস</span>
                {!statusFilter && (
                  <CheckCircle2 className="size-3.5 text-purple-600" />
                )}
              </DropdownMenuItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <DropdownMenuItem
                  key={key}
                  onSelect={() => setStatusFilter(key)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                    statusFilter === key
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{config.label}</span>
                  {statusFilter === key && (
                    <CheckCircle2 className="size-3.5 text-purple-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-3.5 border border-black/[0.08] bg-white/65 hover:bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none backdrop-blur-md transition shadow-2xs flex items-center gap-2 cursor-pointer group">
                <span>
                  {categoryFilter
                    ? CATEGORY_LABELS[categoryFilter] || categoryFilter
                    : "সকল ক্যাটাগরি"}
                </span>
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] min-w-[180px]"
            >
              <DropdownMenuItem
                onSelect={() => setCategoryFilter("")}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                  !categoryFilter
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>সকল ক্যাটাগরি</span>
                {!categoryFilter && (
                  <CheckCircle2 className="size-3.5 text-purple-600" />
                )}
              </DropdownMenuItem>
              {CATEGORY_OPTIONS.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onSelect={() => setCategoryFilter(cat)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                    categoryFilter === cat
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{CATEGORY_LABELS[cat] || cat}</span>
                  {categoryFilter === cat && (
                    <CheckCircle2 className="size-3.5 text-purple-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(statusFilter || categoryFilter || searchQuery) && (
            <Button
              variant="ghost"
              onClick={() => {
                setStatusFilter("");
                setCategoryFilter("");
                setSearchQuery("");
              }}
              className="h-10 text-slate-500 hover:text-rose-600 rounded-xl px-3 text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="size-3.5" /> রিসেট
            </Button>
          )}
        </div>
      </div>

      {/* Tickets List / Grid */}
      {isTicketsLoading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="size-8 animate-spin text-[#900EB0]" />
          <span className="text-sm font-semibold">টিকেটসমূহ লোড হচ্ছে...</span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 bg-white/[0.3] rounded-2xl border border-black/[0.05] text-center space-y-3">
          <HelpCircle className="size-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            কোনো সাপোর্ট টিকেট পাওয়া যায়নি
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            আপনার কোনো সমস্যা বা জিজ্ঞাসা থাকলে ওপরের "নতুন টিকেট খুলুন" বাটনে
            ক্লিক করে প্রশ্ন সাবমিট করুন।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => {
            const statusInfo =
              STATUS_CONFIG[ticket.status] || STATUS_CONFIG.Open;
            const priorityInfo =
              PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.Medium;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={ticket._id}
                className="bg-white/[0.5] hover:bg-white/[0.7] p-5 rounded-2xl border border-black/[0.05] shadow-sm hover:shadow-md transition duration-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#900EB0] bg-[#900EB0]/8 px-2.5 py-1 rounded-lg">
                      {ticket.ticketId}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1 ${statusInfo.color}`}
                      >
                        <StatusIcon className="size-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-800 line-clamp-1">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs text-slate-400 gap-2">
                  <span>
                    ক্যাটাগরি:{" "}
                    <strong className="text-slate-600">
                      {CATEGORY_LABELS[ticket.category] || ticket.category}
                    </strong>
                  </span>
                  <Button
                    onClick={() => setActiveTicketId(ticket._id)}
                    variant="outline"
                    className="h-8 px-3 rounded-xl border-[#900EB0]/20 text-[#900EB0] hover:bg-[#900EB0]/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="size-3.5" />
                    থ্রেড দেখুন ({ticket.messages?.length || 1})
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Ticket Modal (Glassmorphic Standard) */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2 font-sans">
              <LifeBuoy className="size-5 text-[#900EB0]" />
              নতুন সাপোর্ট টিকেট সাবমিট করুন
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              আপনার সমস্যটি বিস্তারিত লিখুন। আমাদের সাপোর্ট টিম দ্রুত সমাধান
              প্রদান করবে।
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">
                সমস্যার ক্যাটাগরি *
              </label>
              <div className="relative">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 pl-3.5 pr-10 border border-slate-200/80 bg-white/80 hover:bg-white rounded-xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 appearance-none cursor-pointer transition shadow-2xs"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat] || cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              </div>
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
                placeholder="আপনার সমস্যার কথা বিস্তারিতভাবে বর্ণনা করুন..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={4}
                className="w-full p-3 text-xs sm:text-sm bg-white/[0.6] rounded-xl border border-black/[0.08] focus:outline-none focus:ring-2 focus:ring-[#900EB0]/20"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Paperclip className="size-3.5" /> ফাইল / স্ক্রিনশট লিংক
                (ঐচ্ছিক)
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
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl h-10 px-4 text-xs font-semibold text-slate-500"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                disabled={createTicketMutation.isPending}
                className="bg-[#900EB0] hover:bg-[#720A7B] text-white rounded-xl h-10 px-5 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#900EB0]/20 cursor-pointer"
              >
                {createTicketMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    টিকেট তৈরি হচ্ছে...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    টিকেট সাবমিট করুন
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ticket Details & Live Chat Thread Modal */}
      <Dialog
        open={Boolean(activeTicketId)}
        onOpenChange={(open) => !open && setActiveTicketId(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-3xl p-0 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden font-bengali max-h-[90vh] flex flex-col"
        >
          {isTicketDetailsLoading || !ticketDetails ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-[#900EB0]" />
              <span className="text-sm font-semibold text-slate-600">
                টিকেট লোড হচ্ছে...
              </span>
            </div>
          ) : (
            <>
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-white/70 border-b border-black/[0.05] space-y-2 shrink-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#900EB0] bg-[#900EB0]/10 px-2.5 py-1 rounded-lg">
                      {ticketDetails.ticketId}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                        (
                          STATUS_CONFIG[ticketDetails.status] ||
                          STATUS_CONFIG.Open
                        ).color
                      }`}
                    >
                      {
                        (
                          STATUS_CONFIG[ticketDetails.status] ||
                          STATUS_CONFIG.Open
                        ).label
                      }
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        (
                          PRIORITY_CONFIG[ticketDetails.priority] ||
                          PRIORITY_CONFIG.Medium
                        ).color
                      }`}
                    >
                      {
                        (
                          PRIORITY_CONFIG[ticketDetails.priority] ||
                          PRIORITY_CONFIG.Medium
                        ).label
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      খোলার তারিখ:{" "}
                      {formatBengaliDateTime(ticketDetails.createdAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTicketId(null)}
                      className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
                      title="বন্ধ করুন"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  {ticketDetails.subject}
                </h2>
              </div>

              {/* Chat Thread Area */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/40">
                {ticketDetails.messages?.map((msg, index) => {
                  const isStaffMsg = msg.senderRole === "Support";
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isStaffMsg ? "items-start" : "items-end"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-600">
                          {isStaffMsg
                            ? `🛡️ সাপোর্ট টিম (${msg.senderId?.fullName || "Agent"})`
                            : `👤 আপনি (${msg.senderId?.fullName || "You"})`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatBengaliDateTime(msg.createdAt)}
                        </span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isStaffMsg
                            ? "bg-white border border-purple-100 text-slate-800 rounded-tl-none"
                            : "bg-[#900EB0] text-white rounded-tr-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.message}</p>

                        {msg.attachments?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-black/10 space-y-1">
                            {msg.attachments.map((att, i) => (
                              <a
                                key={i}
                                href={att.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] underline flex items-center gap-1 opacity-90 hover:opacity-100"
                              >
                                <Paperclip className="size-3" />
                                {att.fileName || "সংযুক্ত ফাইল লিঙ্ক"}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CSAT Rating Section if Resolved/Closed */}
              {["Resolved", "Closed"].includes(ticketDetails.status) && (
                <div className="p-4 bg-purple-50/70 border-t border-purple-100 space-y-2 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1">
                      <Sparkles className="size-4 text-purple-600" />
                      এই টিকেটের সমাধান সম্পর্কে আপনার অনুভূতি কেমন?
                    </span>
                    {ticketDetails.satisfactionRating && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        রেটিং প্রদান সম্পন্ন ✓
                      </span>
                    )}
                  </div>

                  {!ticketDetails.satisfactionRating ? (
                    <div className="flex items-center gap-4 flex-wrap pt-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setSelectedRating(star)}
                            className="p-1 hover:scale-110 transition cursor-pointer"
                          >
                            <Star
                              className={`size-6 ${
                                star <= selectedRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <Input
                        placeholder="আপনার ফিডব্যাক বা মন্তব্য লিখুন (ঐচ্ছিক)"
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        className="h-8 text-xs bg-white rounded-xl border-purple-200 flex-1 min-w-[200px]"
                      />
                      <Button
                        onClick={handleRatingSubmit}
                        disabled={submitRatingMutation.isPending}
                        className="bg-purple-700 hover:bg-purple-800 text-white rounded-xl h-8 px-3 text-xs font-bold cursor-pointer shrink-0"
                      >
                        রেটিং জমা দিন
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-purple-800 font-medium">
                      আপনার রেটিং:{" "}
                      {"★".repeat(ticketDetails.satisfactionRating)}{" "}
                      {ticketDetails.feedbackComment &&
                        `— "${ticketDetails.feedbackComment}"`}
                    </div>
                  )}
                </div>
              )}

              {/* Reply Box if Ticket Open */}
              {!["Closed"].includes(ticketDetails.status) && (
                <form
                  onSubmit={handleReplySubmit}
                  className="p-3 sm:p-4 bg-white border-t border-black/[0.05] space-y-2 shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="আপনার উত্তর বা অতিরিক্ত তথ্য লিখুন..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="h-10 text-xs sm:text-sm bg-slate-50 border-black/[0.08] rounded-xl flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={
                        addMessageMutation.isPending || !replyMessage.trim()
                      }
                      className="bg-[#900EB0] hover:bg-[#720A7B] text-white rounded-xl h-10 px-4 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 accent-glow-purple"
                    >
                      {addMessageMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="size-3.5" />
                          উত্তর দিন
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="সংযুক্ত ফাইল/স্ক্রিনশট লিংক (ঐচ্ছিক)"
                      value={replyAttachmentUrl}
                      onChange={(e) => setReplyAttachmentUrl(e.target.value)}
                      className="h-7 text-[11px] bg-slate-50 border-black/[0.06] rounded-lg"
                    />
                  </div>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
