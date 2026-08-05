import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Clock3,
  HelpCircle,
  Loader2,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminTicketCard } from "./components/AdminTicketCard";
import { AdminTicketFilters } from "./components/AdminTicketFilters";
import { AdminTicketManageModal } from "./components/AdminTicketManageModal";
import { CannedResponseModal } from "./components/CannedResponseModal";
import { SupportStatsCards } from "./components/SupportStatsCards";
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
  const [replyAttachmentUrls, setReplyAttachmentUrls] = useState([""]);

  const handleAddReplyAttachment = () => {
    setReplyAttachmentUrls((prev) => [...prev, ""]);
  };

  const handleRemoveReplyAttachment = (index) => {
    setReplyAttachmentUrls((prev) =>
      prev.length === 1 ? [""] : prev.filter((_, i) => i !== index),
    );
  };

  const handleReplyAttachmentChange = (index, value) => {
    setReplyAttachmentUrls((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

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

    const attachments = replyAttachmentUrls
      .filter((url) => url && url.trim().length > 0)
      .map((url, i) => ({
        fileName: `সংযুক্ত ফাইল ${i + 1}`,
        fileUrl: url.trim(),
      }));

    try {
      await addMessageMutation.mutateAsync({
        ticketId: activeTicketId,
        message: replyMessage,
        isInternalNote,
        attachments,
      });
      setReplyMessage("");
      setReplyAttachmentUrls([""]);
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
      toast.success("টেমপ্লেট সংরক্ষিত হয়েছে");
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
      <div className="bg-glass p-3.5 sm:p-5 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-purple-600/10 text-purple-700 shrink-0">
              <ShieldAlert className="size-4 sm:size-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight font-sans">
                সাপোর্ট হেল্পডেস্ক
              </h1>
              <p className="hidden sm:block text-slate-500 text-xs">
                গ্রাহকদের সাপোর্ট টিকেট সমাধান, অ্যাসাইনমেন্ট ও টেমপ্লেট
                ড্যাশবোর্ড
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowCannedModal(true)}
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50 rounded-xl h-8 sm:h-10 px-2.5 sm:px-3.5 text-xs font-semibold flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
          >
            <Settings className="size-3.5 sm:size-4" />
            <span className="hidden sm:inline">টেমপ্লেট সেটিংস</span>
            <span className="sm:hidden">টেমপ্লেট</span>
          </Button>
        </div>
      </div>

      {/* Stats Header Cards Component */}
      <SupportStatsCards stats={stats} isStatsLoading={isStatsLoading} />

      {/* Admin Filters Component */}
      <AdminTicketFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusConfig={STATUS_CONFIG}
        priorityConfig={PRIORITY_CONFIG}
        categoryLabels={CATEGORY_LABELS}
      />

      {/* Admin Tickets List / Grid */}
      {isTicketsLoading ? (
        <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="size-8 animate-spin text-purple-600" />
          <span className="text-sm font-semibold">সকল টিকেট লোড হচ্ছে...</span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-6 sm:p-10 bg-white/[0.3] rounded-2xl border border-black/[0.05] text-center space-y-2">
          <HelpCircle className="size-7 sm:size-9 text-slate-300 mx-auto" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-700">
            কোনো সাপোর্ট টিকেট পাওয়া যায়নি
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => (
            <AdminTicketCard
              key={ticket._id}
              ticket={ticket}
              statusConfig={STATUS_CONFIG}
              priorityConfig={PRIORITY_CONFIG}
              categoryLabels={CATEGORY_LABELS}
              onSelectTicket={setActiveTicketId}
            />
          ))}
        </div>
      )}

      {/* Admin Ticket Manage & Thread Modal Component */}
      <AdminTicketManageModal
        activeTicketId={activeTicketId}
        onClose={() => setActiveTicketId(null)}
        ticketDetails={ticketDetails}
        isTicketDetailsLoading={isTicketDetailsLoading}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        isInternalNote={isInternalNote}
        setIsInternalNote={setIsInternalNote}
        replyAttachmentUrls={replyAttachmentUrls}
        handleReplyAttachmentChange={handleReplyAttachmentChange}
        handleAddReplyAttachment={handleAddReplyAttachment}
        handleRemoveReplyAttachment={handleRemoveReplyAttachment}
        handleReplySubmit={handleReplySubmit}
        isReplyPending={addMessageMutation.isPending}
        handleStatusChange={handleStatusChange}
        handlePriorityChange={handlePriorityChange}
        cannedResponses={cannedResponses}
        statusConfig={STATUS_CONFIG}
        priorityConfig={PRIORITY_CONFIG}
        categoryLabels={CATEGORY_LABELS}
        formatBengaliDateTime={formatBengaliDateTime}
      />

      {/* Canned Response Manager Modal Component */}
      <CannedResponseModal
        isOpen={showCannedModal}
        onOpenChange={setShowCannedModal}
        cannedTitle={cannedTitle}
        setCannedTitle={setCannedTitle}
        cannedCategory={cannedCategory}
        setCannedCategory={setCannedCategory}
        cannedContent={cannedContent}
        setCannedContent={setCannedContent}
        handleCreateCannedSubmit={handleCreateCannedSubmit}
        handleDeleteCanned={handleDeleteCanned}
        cannedResponses={cannedResponses}
        createCannedPending={createCannedResponseMutation.isPending}
        categoryLabels={CATEGORY_LABELS}
      />
    </div>
  );
}
