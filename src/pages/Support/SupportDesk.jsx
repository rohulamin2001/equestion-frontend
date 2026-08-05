import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Clock3,
  HelpCircle,
  LifeBuoy,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { SupportStatsCards } from "./components/SupportStatsCards";
import { SupportTicketCard } from "./components/SupportTicketCard";
import { SupportTicketFilters } from "./components/SupportTicketFilters";
import { TicketDetailsModal } from "./components/TicketDetailsModal";
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
    stats,
    isStatsLoading,
    tickets,
    isTicketsLoading,
    ticketDetails,
    isTicketDetailsLoading,
    createTicketMutation,
    addMessageMutation,
    submitRatingMutation: addRatingMutation,
  } = useSupport();

  // Create Ticket Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("Billing & Subscription");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");

  // Reply Form State
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachmentUrl, setReplyAttachmentUrl] = useState("");

  // CSAT Rating State
  const [ratingScore, setRatingScore] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

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
      setIsCreateModalOpen(false);
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
      await addRatingMutation.mutateAsync({
        ticketId: activeTicketId,
        satisfactionRating: ratingScore,
        feedbackComment,
      });
      toast.success("আপনার মূল্যবান ফিডব্যাকের জন্য ধন্যবাদ!");
    } catch {
      toast.error("রেটিং সাবমিট করতে সমস্যা হয়েছে");
    }
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
              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight font-sans flex items-center gap-2">
                সহায়তা ও সাপোর্ট কেন্দ্র (Support Desk)
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm">
                আপনার প্রশ্ন, টেকনিক্যাল সমস্যা বা নতুন ফিচারের পরামর্শের জন্য
                টিকেট জমা দিন
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#900EB0] hover:bg-[#720A7B] text-white rounded-xl h-9 sm:h-10 px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-[#900EB0]/20 cursor-pointer shrink-0"
          >
            <PlusCircle className="size-4" />
            নতুন টিকেট খুলুন
          </Button>
        </div>
      </div>

      {/* Summary Stats Header Cards */}
      <SupportStatsCards stats={stats} isStatsLoading={isStatsLoading} />

      {/* Filters Bar Component */}
      <SupportTicketFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusConfig={STATUS_CONFIG}
        categoryOptions={CATEGORY_OPTIONS}
        categoryLabels={CATEGORY_LABELS}
      />

      {/* Tickets Grid */}
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
          {tickets.map((ticket) => (
            <SupportTicketCard
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

      {/* Create Ticket Modal Component */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newSubject={newSubject}
        setNewSubject={setNewSubject}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newAttachmentUrl={newAttachmentUrl}
        setNewAttachmentUrl={setNewAttachmentUrl}
        onSubmit={handleCreateSubmit}
        isPending={createTicketMutation.isPending}
        categoryOptions={CATEGORY_OPTIONS}
        categoryLabels={CATEGORY_LABELS}
      />

      {/* Ticket Thread Details & Reply Modal Component */}
      <TicketDetailsModal
        activeTicketId={activeTicketId}
        onClose={() => setActiveTicketId(null)}
        ticketDetails={ticketDetails}
        isTicketDetailsLoading={isTicketDetailsLoading}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        replyAttachmentUrl={replyAttachmentUrl}
        setReplyAttachmentUrl={setReplyAttachmentUrl}
        handleReplySubmit={handleReplySubmit}
        isReplyPending={addMessageMutation.isPending}
        ratingScore={ratingScore}
        setRatingScore={setRatingScore}
        feedbackComment={feedbackComment}
        setFeedbackComment={setFeedbackComment}
        handleRatingSubmit={handleRatingSubmit}
        isRatingPending={addRatingMutation.isPending}
        statusConfig={STATUS_CONFIG}
        priorityConfig={PRIORITY_CONFIG}
        formatBengaliDateTime={formatBengaliDateTime}
      />
    </div>
  );
}
