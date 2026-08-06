import { Button } from "@/components/ui/button";
import { Check, Copy, MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminTicketCard({
  ticket,
  statusConfig,
  priorityConfig,
  categoryLabels,
  onSelectTicket,
}) {
  const [copied, setCopied] = useState(false);
  const statusInfo = statusConfig[ticket.status] || statusConfig.Open;
  const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.Medium;
  const StatusIcon = statusInfo.icon;
  const customerName = ticket.userId?.fullName || "অজানা গ্রাহক";
  const customerInst =
    ticket.userId?.institutionName || "কোনো প্রতিষ্ঠান নাম নেই";

  const handleCopyTicketId = (e) => {
    e.stopPropagation();
    if (!ticket.ticketId) return;
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    toast.success("টিকেট ID কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/[0.5] hover:bg-white/[0.7] p-3.5 sm:p-5 rounded-2xl border border-black/[0.05] shadow-sm hover:shadow-md transition duration-200 space-y-2.5 sm:space-y-3 flex flex-col justify-between">
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg flex items-center gap-1">
              <span>{ticket.ticketId}</span>
              <button
                type="button"
                onClick={handleCopyTicketId}
                className="text-purple-700 hover:text-purple-900 p-0.5 rounded transition cursor-pointer shrink-0"
                title="টিকেট ID কপি করুন"
              >
                {copied ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </span>
            <span
              className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${priorityInfo.color}`}
            >
              {priorityInfo.label}
            </span>
          </div>
          <span
            className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1 ${statusInfo.color}`}
          >
            <StatusIcon className="size-3" />
            {statusInfo.label}
          </span>
        </div>

        <div className="text-[11px] sm:text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Users className="size-3 sm:size-3.5 text-slate-400" />
          <span>{customerName}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-normal">{customerInst}</span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
          {ticket.subject}
        </h3>

        <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs text-slate-400 gap-2">
        <span>
          ক্যাটাগরি:{" "}
          <strong className="text-slate-600">
            {categoryLabels[ticket.category] || ticket.category}
          </strong>
        </span>
        <Button
          onClick={() => onSelectTicket(ticket._id)}
          className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <MessageSquare className="size-3.5" />
          ম্যানেজ করুন ({ticket.messages?.length || 1})
        </Button>
      </div>
    </div>
  );
}
