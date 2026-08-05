import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Paperclip, Send, Star, X } from "lucide-react";
import { TicketMessageThread } from "./TicketMessageThread";

export function TicketDetailsModal({
  activeTicketId,
  onClose,
  ticketDetails,
  isTicketDetailsLoading,
  replyMessage,
  setReplyMessage,
  replyAttachmentUrl,
  setReplyAttachmentUrl,
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
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="size-8 animate-spin text-purple-600" />
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
                  <span className="text-xs font-mono font-bold text-purple-600 bg-purple-600/10 px-2.5 py-1 rounded-lg">
                    {ticketDetails.ticketId}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityInfo.color}`}
                  >
                    {priorityInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    খোলার তারিখ:{" "}
                    {formatBengaliDateTime(ticketDetails.createdAt)}
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
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

                <div className="flex items-center gap-1.5">
                  <Paperclip className="size-3 text-slate-400" />
                  <Input
                    placeholder="প্রয়োজনে অ্যাটাচমেন্ট বা ফাইল/ছবি লিংক যোগ করুন..."
                    value={replyAttachmentUrl}
                    onChange={(e) => setReplyAttachmentUrl(e.target.value)}
                    className="h-8 text-[11px] bg-slate-50/70 border-black/[0.05] rounded-lg"
                  />
                </div>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
