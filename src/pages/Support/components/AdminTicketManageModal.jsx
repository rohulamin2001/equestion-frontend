import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
  Paperclip,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { TicketMessageThread } from "./TicketMessageThread";

export function AdminTicketManageModal({
  activeTicketId,
  onClose,
  ticketDetails,
  isTicketDetailsLoading,
  replyMessage,
  setReplyMessage,
  isInternalNote,
  setIsInternalNote,
  replyAttachmentUrls = [""],
  handleReplyAttachmentChange,
  handleAddReplyAttachment,
  handleRemoveReplyAttachment,
  handleReplySubmit,
  isReplyPending,
  handleStatusChange,
  handlePriorityChange,
  cannedResponses,
  statusConfig,
  priorityConfig,
  categoryLabels,
  formatBengaliDateTime,
}) {
  return (
    <Dialog
      open={Boolean(activeTicketId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl p-0 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden font-bengali max-h-[92vh] flex flex-col"
      >
        {isTicketDetailsLoading || !ticketDetails ? (
          <>
            <DialogTitle className="sr-only">টিকেট লোড হচ্ছে</DialogTitle>
            <DialogDescription className="sr-only">টিকেট লোড হচ্ছে</DialogDescription>
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-purple-600" />
              <span className="text-sm font-semibold text-slate-600">
                টিকেট বিবরণ লোড হচ্ছে...
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Customer Subscription Summary Header */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white space-y-2 shrink-0">
              <DialogTitle className="sr-only">
                টিকেট ব্যবস্থাপনা - {ticketDetails.ticketId}
              </DialogTitle>
              <DialogDescription className="sr-only">
                টিকেট উত্তর প্রদান ও স্ট্যাটাস ব্যবস্থাপনা
              </DialogDescription>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-mono font-bold bg-white/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
                    {ticketDetails.ticketId}
                  </span>
                  <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 font-bold border border-white/20">
                    {ticketDetails.category}
                  </span>
                </div>

                {/* Quick Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Status Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-7 sm:h-8 px-2 sm:px-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl text-[11px] sm:text-xs font-semibold backdrop-blur-md transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs">
                        <span>
                          {statusConfig[ticketDetails.status]?.label ||
                            ticketDetails.status}
                        </span>
                        <ChevronDown className="size-3 text-white/70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl p-1.5 space-y-0.5 z-[100] min-w-[170px]"
                    >
                      {Object.entries(statusConfig).map(([key, config]) => (
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
                      <button className="h-7 sm:h-8 px-2 sm:px-3 bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-xl text-[11px] sm:text-xs font-semibold backdrop-blur-md transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs">
                        <span>
                          {priorityConfig[ticketDetails.priority]?.label ||
                            ticketDetails.priority}
                        </span>
                        <ChevronDown className="size-3 text-white/70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl p-1.5 space-y-0.5 z-[100] min-w-[160px]"
                    >
                      {Object.entries(priorityConfig).map(([key, config]) => (
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
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Modal Close Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-white/15 hover:bg-white/30 text-white border border-white/25 flex items-center justify-center transition cursor-pointer shadow-2xs shrink-0"
                    title="বন্ধ করুন"
                  >
                    <X className="size-3.5 sm:size-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] sm:text-xs text-purple-100 gap-2 sm:gap-4 flex-wrap pt-1">
                <div>
                  👤 গ্রাহক:{" "}
                  <strong className="text-white">
                    {ticketDetails.userId?.fullName}
                  </strong>{" "}
                  ({ticketDetails.userId?.phone || "ফোন নেই"})
                </div>
                <div>
                  🏫 প্রতিষ্ঠান:{" "}
                  <strong className="text-white">
                    {ticketDetails.userId?.institutionName || "N/A"}
                  </strong>
                </div>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <TicketMessageThread
                messages={ticketDetails.messages || []}
                customerName={ticketDetails.userId?.fullName || "Customer"}
                formatBengaliDateTime={formatBengaliDateTime}
              />
            </div>

            {/* Admin Reply & Internal Note Form */}
            <form
              onSubmit={handleReplySubmit}
              className="p-4 bg-white border-t border-black/[0.05] space-y-3 shrink-0"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Paperclip className="size-3 text-purple-600" /> ফাইল/ছবি অ্যাটাচমেন্ট লিংকসমূহ (ঐচ্ছিক):
                  </span>
                  <button
                    type="button"
                    onClick={handleAddReplyAttachment}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    + লিংক যোগ করুন
                  </button>
                </div>

                {replyAttachmentUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <Input
                      placeholder={`সংযুক্তির লিংক ${index + 1}...`}
                      value={url}
                      onChange={(e) =>
                        handleReplyAttachmentChange(index, e.target.value)
                      }
                      className="h-8 text-[11px] bg-slate-50 border-black/[0.05] rounded-lg flex-1"
                    />
                    {replyAttachmentUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveReplyAttachment(index)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md cursor-pointer shrink-0"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {cannedResponses.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1 shrink-0">
                    <Sparkles className="size-3" /> দ্রুত টেমপ্লেট:
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

                {cannedResponses.length > 0 && !isInternalNote && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 transition flex items-center gap-1.5 cursor-pointer border border-purple-200/60 shadow-2xs"
                      >
                        <Sparkles className="size-3.5 text-purple-600" />
                        <span>
                          ক্যানড টেমপ্লেট ব্যবহার করুন ({cannedResponses.length}
                          )
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
                          onSelect={() => setReplyMessage(tmpl.content)}
                          className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition hover:bg-purple-50 group flex flex-col items-start gap-0.5"
                        >
                          <div className="font-bold text-slate-800 group-hover:text-purple-700 flex items-center gap-1.5 w-full justify-between">
                            <span className="line-clamp-1">{tmpl.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-normal shrink-0">
                              {categoryLabels[tmpl.category] || tmpl.category}
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
                  disabled={isReplyPending || !replyMessage.trim()}
                  className={`rounded-xl h-10 px-4 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
                    isInternalNote
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-purple-700 hover:bg-purple-800 text-white"
                  }`}
                >
                  {isReplyPending ? (
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
  );
}
