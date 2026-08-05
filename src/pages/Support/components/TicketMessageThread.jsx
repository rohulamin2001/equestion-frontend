import { Paperclip } from "lucide-react";

export function TicketMessageThread({
  messages = [],
  customerName = "Customer",
  formatBengaliDateTime,
}) {
  return (
    <div className="space-y-3">
      {messages.map((msg, index) => {
        const isStaffMsg = msg.senderRole === "Staff";
        const isInternal = msg.isInternalNote;

        return (
          <div
            key={msg._id || index}
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
                    : `👤 গ্রাহক (${customerName})`}
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
                      className="text-xs flex items-center gap-1 underline opacity-90 hover:opacity-100"
                    >
                      <Paperclip className="size-3" />
                      <span>{att.fileName || "সংযুক্ত ফাইল দেখুন"}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
