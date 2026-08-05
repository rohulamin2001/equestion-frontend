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
  Loader2,
  Lock,
  MessageSquare,
  Paperclip,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminSupport } from "./hook/useAdminSupport";

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
    label: "গ্রাহকের উত্তরের অপেক্ষায়",
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

export default function AdminSupportCenter() {
  const {
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    activeTicketId,
    setActiveTicketId,
    stats,
    isStatsLoading,
    tickets,
    isTicketsLoading,
    ticketDetails,
    isTicketDetailsLoading,
    cannedResponses,
    addMessageMutation,
    updateTicketStatusMutation,
    createCannedResponseMutation,
    deleteCannedResponseMutation,
  } = useAdminSupport();

  // Reply Form State
  const [replyMessage, setReplyMessage] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [replyAttachmentUrl, setReplyAttachmentUrl] = useState("");

  // New Canned Response Modal State
  const [showCannedModal, setShowCannedModal] = useState(false);
  const [cannedTitle, setCannedTitle] = useState("");
  const [cannedCategory, setCannedCategory] = useState(
    "Billing & Subscription",
  );
  const [cannedContent, setCannedContent] = useState("");

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
        isInternalNote,
        attachments,
      });
      setReplyMessage("");
      setReplyAttachmentUrl("");
      toast.success(
        isInternalNote
          ? "আভ্যন্তরীণ নোট সেভ করা হয়েছে"
          : "গ্রাহককে উত্তর সফলভাবে পাঠানো হয়েছে!",
      );
    } catch {
      toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!activeTicketId) return;
    try {
      await updateTicketStatusMutation.mutateAsync({
        ticketId: activeTicketId,
        status: newStatus,
      });
      toast.success(`টিকেট স্ট্যাটাস '${newStatus}' এ পরিবর্তন করা হয়েছে`);
    } catch {
      toast.error("স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে");
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (!activeTicketId) return;
    try {
      await updateTicketStatusMutation.mutateAsync({
        ticketId: activeTicketId,
        priority: newPriority,
      });
      toast.success(`প্রাইওরিটি '${newPriority}' এ পরিবর্তন করা হয়েছে`);
    } catch {
      toast.error("প্রাইওরিটি পরিবর্তন করতে সমস্যা হয়েছে");
    }
  };

  const handleCreateCannedSubmit = async (e) => {
    e.preventDefault();
    if (!cannedTitle.trim() || !cannedContent.trim()) {
      toast.error("দয়া করে টেমপ্লেটের শিরোনাম ও কনটেন্ট লিখুন");
      return;
    }

    try {
      await createCannedResponseMutation.mutateAsync({
        title: cannedTitle,
        category: cannedCategory,
        content: cannedContent,
      });
      setCannedTitle("");
      setCannedCategory("Billing & Subscription");
      setCannedContent("");
      setShowCannedModal(false);
      toast.success("ক্যানড রেসপন্স টেমপ্লেট সংরক্ষিত হয়েছে");
    } catch {
      toast.error("টেমপ্লেট তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteCanned = async (id) => {
    try {
      await deleteCannedResponseMutation.mutateAsync(id);
      toast.success("টেমপ্লেট ডিলিট করা হয়েছে");
    } catch {
      toast.error("টেমপ্লেট মুছতে সমস্যা হয়েছে");
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
            <div className="p-2.5 rounded-2xl bg-purple-600/10 text-purple-700 shrink-0">
              <ShieldAlert className="size-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight font-sans flex items-center gap-2">
                এডমিন হেল্পডেস্ক (Admin Support Center)
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                গ্রাহকদের সাপোর্ট টিকেট সমাধান, অ্যাসাইনমেন্ট ও ক্যানড রেসপন্স
                টেমপ্লেট ড্যাশবোর্ড
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowCannedModal(true)}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl h-9 sm:h-10 px-3.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="size-4" />
            ক্যানড টেমপ্লেট সেটিং
          </Button>
        </div>
      </div>

      {/* Stats Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "মোট টিকেট",
            count: stats.total,
            color: "text-purple-700",
            bg: "from-purple-500/10 to-indigo-500/10",
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
            label: "গড় CSAT রেটিং",
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
              className="bg-white/[0.45] p-4 rounded-2xl border border-black/[0.04] backdrop-blur-md shadow-soft flex items-center justify-between"
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
      <div className="bg-glass p-4 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-3 sm:space-y-0 sm:flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="টিকেট আইডি বা বিষয়বস্তু..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs sm:text-sm bg-white/[0.45] border-black/[0.08] focus-visible:ring-purple-500/15 rounded-xl font-semibold"
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
          {/* Status Filter */}
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

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 px-3.5 border border-black/[0.08] bg-white/65 hover:bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none backdrop-blur-md transition shadow-2xs flex items-center gap-2 cursor-pointer group">
                <span>
                  {priorityFilter
                    ? PRIORITY_CONFIG[priorityFilter]?.label || priorityFilter
                    : "সকল প্রাইওরিটি"}
                </span>
                <ChevronDown className="size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100] min-w-[160px]"
            >
              <DropdownMenuItem
                onSelect={() => setPriorityFilter("")}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                  !priorityFilter
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>সকল প্রাইওরিটি</span>
                {!priorityFilter && (
                  <CheckCircle2 className="size-3.5 text-purple-600" />
                )}
              </DropdownMenuItem>
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <DropdownMenuItem
                  key={key}
                  onSelect={() => setPriorityFilter(key)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                    priorityFilter === key
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{config.label}</span>
                  {priorityFilter === key && (
                    <CheckCircle2 className="size-3.5 text-purple-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter */}
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
              {Object.keys(CATEGORY_LABELS).map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onSelect={() => setCategoryFilter(cat)}
                  className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                    categoryFilter === cat
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{CATEGORY_LABELS[cat]}</span>
                  {categoryFilter === cat && (
                    <CheckCircle2 className="size-3.5 text-purple-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(statusFilter ||
            priorityFilter ||
            categoryFilter ||
            searchQuery) && (
            <Button
              variant="ghost"
              onClick={() => {
                setStatusFilter("");
                setPriorityFilter("");
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

      {/* Admin Tickets Table / Grid */}
      {isTicketsLoading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <span className="text-sm font-semibold">সকল টিকেট লোড হচ্ছে...</span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 bg-white/[0.3] rounded-2xl border border-black/[0.05] text-center space-y-2">
          <HelpCircle className="size-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            কোনো সাপোর্ট টিকেট পাওয়া যায়নি
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => {
            const statusInfo =
              STATUS_CONFIG[ticket.status] || STATUS_CONFIG.Open;
            const priorityInfo =
              PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.Medium;
            const StatusIcon = statusInfo.icon;
            const customerName = ticket.userId?.fullName || "অজানা গ্রাহক";
            const customerInst =
              ticket.userId?.institutionName || "কোনো প্রতিষ্ঠান নাম নেই";

            return (
              <div
                key={ticket._id}
                className="bg-white/[0.5] hover:bg-white/[0.7] p-5 rounded-2xl border border-black/[0.05] shadow-sm hover:shadow-md transition duration-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                        {ticket.ticketId}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1 ${statusInfo.color}`}
                    >
                      <StatusIcon className="size-3" />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Users className="size-3.5 text-slate-400" />
                    <span>{customerName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-normal">
                      {customerInst}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
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
                    className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="size-3.5" />
                    ম্যানেজ করুন ({ticket.messages?.length || 1})
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Ticket Manage & Thread Modal */}
      <Dialog
        open={Boolean(activeTicketId)}
        onOpenChange={(open) => !open && setActiveTicketId(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl p-0 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden font-bengali max-h-[92vh] flex flex-col"
        >
          {isTicketDetailsLoading || !ticketDetails ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-purple-600" />
              <span className="text-sm font-semibold text-slate-600">
                টিকেট বিবরণ লোড হচ্ছে...
              </span>
            </div>
          ) : (
            <>
              {/* Customer Subscription Summary Header */}
              <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white space-y-2 shrink-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-lg">
                      {ticketDetails.ticketId}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 font-bold border border-white/20">
                      {ticketDetails.category}
                    </span>
                  </div>

                  {/* Quick Controls */}
                  <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 px-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                          <span>
                            {STATUS_CONFIG[ticketDetails.status]?.label ||
                              ticketDetails.status}
                          </span>
                          <ChevronDown className="size-3 text-white/70" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl p-1.5 space-y-0.5 z-[100] min-w-[170px]"
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <DropdownMenuItem
                            key={key}
                            onSelect={() => handleStatusChange(key)}
                            className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                              ticketDetails.status === key
                                ? "bg-purple-600/30 text-purple-300 font-semibold"
                                : "text-slate-200 hover:bg-white/10"
                            }`}
                          >
                            <span>{config.label}</span>
                            {ticketDetails.status === key && (
                              <CheckCircle2 className="size-3.5 text-purple-400" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Priority Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 px-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                          <span>
                            {PRIORITY_CONFIG[ticketDetails.priority]?.label ||
                              ticketDetails.priority}
                          </span>
                          <ChevronDown className="size-3 text-white/70" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl p-1.5 space-y-0.5 z-[100] min-w-[160px]"
                      >
                        {Object.entries(PRIORITY_CONFIG).map(
                          ([key, config]) => (
                            <DropdownMenuItem
                              key={key}
                              onSelect={() => handlePriorityChange(key)}
                              className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                                ticketDetails.priority === key
                                  ? "bg-purple-600/30 text-purple-300 font-semibold"
                                  : "text-slate-200 hover:bg-white/10"
                              }`}
                            >
                              <span>{config.label}</span>
                              {ticketDetails.priority === key && (
                                <CheckCircle2 className="size-3.5 text-purple-400" />
                              )}
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Modal Close Button */}
                    <button
                      type="button"
                      onClick={() => setActiveTicketId(null)}
                      className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/30 text-white border border-white/25 flex items-center justify-center transition cursor-pointer shadow-2xs shrink-0"
                      title="বন্ধ করুন"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-purple-100 gap-4 flex-wrap pt-1">
                  <div>
                    👤 গ্রাহক:{" "}
                    <strong className="text-white">
                      {ticketDetails.userId?.fullName}
                    </strong>{" "}
                    ({ticketDetails.userId?.phoneNumber})
                  </div>
                  <div>
                    🏫 প্রতিষ্ঠান:{" "}
                    <strong className="text-white">
                      {ticketDetails.userId?.institutionName || "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
                {ticketDetails.messages?.map((msg, index) => {
                  const isStaffMsg = msg.senderRole === "Support";
                  const isInternal = Boolean(msg.isInternalNote);

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${
                        isInternal
                          ? "items-center"
                          : isStaffMsg
                            ? "items-end"
                            : "items-start"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-600">
                          {isInternal
                            ? "🔒 ইন্টারনাল প্রাইভেট নোট (টিমের অভ্যন্তরীণ নোট)"
                            : isStaffMsg
                              ? `🛡️ সাপোর্ট টিম (${msg.senderId?.fullName || "Agent"})`
                              : `👤 গ্রাহক (${ticketDetails.userId?.fullName || "Customer"})`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatBengaliDateTime(msg.createdAt)}
                        </span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isInternal
                            ? "bg-amber-50 border border-amber-200 text-amber-900 font-medium"
                            : isStaffMsg
                              ? "bg-purple-700 text-white rounded-tr-none"
                              : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
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

              {/* Reply / Internal Note Input Box */}
              <form
                onSubmit={handleReplySubmit}
                className="p-4 bg-white border-t border-black/[0.05] space-y-3 shrink-0"
              >
                {/* Canned Response Picker */}
                {cannedResponses.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">
                      ক্যানড রেসপন্স:
                    </span>
                    {cannedResponses.map((template) => (
                      <button
                        key={template._id}
                        type="button"
                        onClick={() => setReplyMessage(template.content)}
                        className="h-7 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-semibold whitespace-nowrap cursor-pointer shrink-0"
                      >
                        {template.title}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(false)}
                      className={`h-7 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                        !isInternalNote
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      কাস্টমার রিপ্লাই
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(true)}
                      className={`h-7 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        isInternalNote
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Lock className="size-3" />
                      ইন্টারনাল নোট (গোপন)
                    </button>
                  </div>

                  {/* Quick Canned Response Selector */}
                  {cannedResponses.length > 0 && !isInternalNote && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 transition flex items-center gap-1.5 cursor-pointer border border-purple-200/60 shadow-2xs"
                        >
                          <Sparkles className="size-3.5 text-purple-600" />
                          <span>
                            ক্যানড টেমপ্লেট ব্যবহার করুন ({cannedResponses.length})
                          </span>
                          <ChevronDown className="size-3 text-purple-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-xl p-1.5 space-y-1 z-[100] w-72 sm:w-80 max-h-60 overflow-y-auto font-bengali"
                      >
                        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          সংরক্ষিত টেমপ্লেটসমূহ (ক্লিক করে ইনসার্ট করুন):
                        </div>
                        {cannedResponses.map((tmpl) => (
                          <DropdownMenuItem
                            key={tmpl._id}
                            onSelect={() => {
                              setReplyMessage(tmpl.content);
                              toast.info(
                                `'${tmpl.title}' টেমপ্লেটটি রিপ্লাই বক্সে বসানো হয়েছে`,
                              );
                            }}
                            className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition hover:bg-purple-50 group flex flex-col items-start gap-0.5"
                          >
                            <div className="font-bold text-slate-800 group-hover:text-purple-700 flex items-center gap-1.5 w-full justify-between">
                              <span className="line-clamp-1">{tmpl.title}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-normal shrink-0">
                                {CATEGORY_LABELS[tmpl.category] || tmpl.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {tmpl.content}
                            </p>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder={
                      isInternalNote
                        ? "ইন্টারনাল প্রাইভেট নোট লিখুন (গ্রাহক দেখতে পাবে না)..."
                        : "গ্রাহকের প্রশ্নের উত্তর লিখুন..."
                    }
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className={`h-10 text-xs sm:text-sm rounded-xl flex-1 ${
                      isInternalNote
                        ? "bg-amber-50/60 border-amber-200 focus-visible:ring-amber-500/20"
                        : "bg-slate-50 border-black/[0.08]"
                    }`}
                  />
                  <Button
                    type="submit"
                    disabled={
                      addMessageMutation.isPending || !replyMessage.trim()
                    }
                    className={`rounded-xl h-10 px-4 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
                      isInternalNote
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-purple-700 hover:bg-purple-800 text-white"
                    }`}
                  >
                    {addMessageMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        {isInternalNote ? "নোট সেভ করুন" : "উত্তর পাঠান"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Canned Response Manager Modal */}
      <Dialog open={showCannedModal} onOpenChange={setShowCannedModal}>
        <DialogContent className="max-w-lg p-6 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative font-bengali">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              ক্যানড রেসপন্স টেমপ্লেট সেটিংস
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              ঘনঘন আসা প্রশ্নের দ্রুত উত্তরের জন্য ক্যানড টেমপ্লেট সেভ করে
              রাখুন।
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
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
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
              className="w-full p-2.5 text-xs bg-white rounded-xl border border-black/[0.08] focus:outline-none"
              required
            />
            <Button
              type="submit"
              disabled={createCannedResponseMutation.isPending}
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
    </div>
  );
}
