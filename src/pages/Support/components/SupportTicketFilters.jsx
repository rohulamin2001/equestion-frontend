import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ChevronDown, RotateCcw, Search, X } from "lucide-react";

export function SupportTicketFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  statusConfig,
  categoryOptions,
  categoryLabels,
}) {
  return (
    <div className="bg-glass p-4 rounded-2xl border border-black/[0.05] backdrop-blur-md shadow-sm space-y-3 sm:space-y-0 sm:flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <Input
          placeholder="টিকেট আইডি বা বিষয়বস্তু দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 text-xs sm:text-sm bg-white/[0.45] border-black/[0.08] focus-visible:ring-purple-600/15 rounded-xl font-semibold"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns & Reset */}
      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap w-full sm:w-auto">
        {/* Status Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 px-3.5 border border-black/[0.08] bg-white/65 hover:bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none backdrop-blur-md transition shadow-2xs flex items-center gap-2 cursor-pointer group">
              <span>
                {statusFilter
                  ? statusConfig[statusFilter]?.label || statusFilter
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
            {Object.entries(statusConfig).map(([key, config]) => (
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
                  ? categoryLabels[categoryFilter] || categoryFilter
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
            {categoryOptions.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onSelect={() => setCategoryFilter(cat)}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition ${
                  categoryFilter === cat
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{categoryLabels[cat] || cat}</span>
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
            className="h-10 text-slate-500 hover:text-rose-600 rounded-xl px-3 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="size-3.5" /> রিসেট
          </Button>
        )}
      </div>
    </div>
  );
}
