import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function SupportTicketCard({
  ticket,
  statusConfig,
  priorityConfig,
  categoryLabels,
  onSelectTicket,
}) {
  const statusInfo = statusConfig[ticket.status] || statusConfig.Open;
  const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.Medium;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white/[0.5] hover:bg-white/[0.7] p-5 rounded-2xl border border-black/[0.05] shadow-sm hover:shadow-md transition duration-200 space-y-3 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#900EB0] bg-[#900EB0]/10 px-2.5 py-1 rounded-lg">
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
            {categoryLabels[ticket.category] || ticket.category}
          </strong>
        </span>
        <Button
          onClick={() => onSelectTicket(ticket._id)}
          className="h-8 px-3 rounded-xl border-[#900EB0]/20 text-[#900EB0] hover:bg-[#900EB0]/10 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <MessageSquare className="size-3.5" />
          দেখুন ({ticket.messages?.length || 1})
        </Button>
      </div>
    </div>
  );
}
