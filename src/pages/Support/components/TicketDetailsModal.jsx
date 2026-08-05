import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Paperclip, Plus, Send, Star, Trash2, X } from "lucide-react";
import { TicketMessageThread } from "./TicketMessageThread";

export function TicketDetailsModal({
  activeTicketId,
  onClose,
  ticketDetails,
  isTicketDetailsLoading,
  replyMessage,
  setReplyMessage,
  replyAttachmentUrls = [""],
  handleReplyAttachmentChange,
  handleAddReplyAttachment,
  handleRemoveReplyAttachment,
  handleReplySubmit,
  isReplyPending,
  ratingScore,
  setRatingScore,
  feedbackComment,
  setFeedbackComment,
  handleRatingSubmit,
  isRatingPending,
  statusConfig,
  priorityConfig,
  formatBengaliDateTime,
}) {
  const statusInfo = ticketDetails
    ? statusConfig[ticketDetails.status] || statusConfig.Open
    : null;
  const priorityInfo = ticketDetails
    ? priorityConfig[ticketDetails.priority] || priorityConfig.Medium
    : null;

  return (
    <Dialog
      open={Boolean(activeTicketId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl p-0 border border-slate-200/50 bg-glass-elevated backdrop-blur-xl shadow-2xl rounded-2xl relative overflow-hidden font-bengali max-h-[90vh] flex flex-col"
      >
        {isTicketDetailsLoading || !ticketDetails ? (
          <>
            <DialogTitle className="sr-only">টিকেট লোড হচ্ছে</DialogTitle>
            <DialogDescription className="sr-only">
              টিকেট লোড করা হচ্ছে
            </DialogDescription>
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-purple-600" />
              <span className="text-sm font-semibold text-slate-600">
                টিকেট লোড হচ্ছে...
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Modal Header */}
            <div className="p-3.5 sm:p-5 bg-white/70 border-b border-black/[0.05] space-y-2 shrink-0">
              <DialogDescription className="sr-only">
                সাপোর্ট টিকেটের বার্তার থ্রেড এবং বিস্তারিত উত্তর
              </DialogDescription>

              {/* Row 1: Date on Left, Close Button on Far Right */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {formatBengaliDateTime(ticketDetails.createdAt)}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-7 w-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer shrink-0"
                  title="বন্ধ করুন"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Row 2: Ticket ID, Status Badge, Priority Badge */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs font-mono font-bold text-purple-600 bg-purple-600/10  py-1 rounded-lg">
                  {ticketDetails.ticketId}
                </span>
                <span
                  className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border ${priorityInfo.color}`}
                >
                  {priorityInfo.label}
                </span>
              </div>

              {/* Row 3: Subject */}
              <DialogTitle className="text-sm sm:text-base font-bold text-slate-800 pt-0.5">
                {ticketDetails.subject}
              </DialogTitle>
            </div>

            {/* Conversation Thread */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <TicketMessageThread
                messages={ticketDetails.messages || []}
                customerName={ticketDetails.userId?.fullName || "Customer"}
                formatBengaliDateTime={formatBengaliDateTime}
              />
            </div>

            {/* CSAT Rating Section if Resolved/Closed */}
            {(ticketDetails.status === "Resolved" ||
              ticketDetails.status === "Closed") && (
              <div className="p-4 bg-purple-50/70 border-t border-purple-100 space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    আপনার সমাধানের অভিজ্ঞতা কেমন ছিল? (CSAT Rating)
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingScore(star)}
                        className="p-1 cursor-pointer transition transform hover:scale-110"
                      >
                        <Star
                          className={`size-5 ${
                            ratingScore >= star
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="মতামত লিখুন (ঐচ্ছিক)..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="h-9 text-xs bg-white rounded-xl border-purple-200"
                  />
                  <Button
                    onClick={handleRatingSubmit}
                    disabled={isRatingPending || ratingScore === 0}
                    className="h-9 px-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                  >
                    রেটিং দিন
                  </Button>
                </div>
              </div>
            )}

            {/* Customer Reply Form */}
            {ticketDetails.status !== "Closed" && (
              <form
                onSubmit={handleReplySubmit}
                className="p-4 bg-white border-t border-black/[0.05] space-y-3 shrink-0"
              >
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="আপনার মেসেজ বা উত্তর লিখুন..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="h-10 text-xs sm:text-sm bg-slate-50 rounded-xl border-black/[0.08] flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isReplyPending || !replyMessage.trim()}
                    className="bg-purple-600 hover:bg-purple-800 text-white rounded-xl h-10 px-4 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {isReplyPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="size-3.5" /> উত্তর দিন
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <Paperclip className="size-3 text-purple-600" /> ফাইল/ছবি
                      অ্যাটাচমেন্ট লিংকসমূহ (ঐচ্ছিক):
                    </span>

                    <button
                      type="button"
                      onClick={handleAddReplyAttachment}
                      className="size-5 rounded-full bg-purple-50 text-purple-600 font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  {replyAttachmentUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <Input
                        placeholder={`ফাইল/ছবি লিংক ${index + 1}...`}
                        value={url}
                        onChange={(e) =>
                          handleReplyAttachmentChange(index, e.target.value)
                        }
                        className="h-8 text-[11px] bg-slate-50/70 border-black/[0.05] rounded-lg flex-1"
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
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
