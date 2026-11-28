import RichTextRender from "@/components/RichTextRender";
import { getCategoryDisplayName } from "@/constants/categories";
import { CLASSES_MAP } from "@/constants/classes";
import QuestionMetadataTooltip from "@/pages/MyQuestions/components/QuestionMetadataTooltip";
import {
  BookOpenText,
  Building2,
  Calendar,
  Check,
  Eye,
  EyeOff,
  Hash,
  PanelRightOpen,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { extractQuestionMetadata, toBnNumber } from "../../utils/questionUtils";
import QuestionBodyContent from "./QuestionBodyContent";

/**
 * Compact header + clickable metadata footer strip for a single Question card.
 */
function QuestionCardMetaBadges({
  question,
  meta,
  classLabel,
  isSelected,
  isAnswerVisible,
  isInspected,
  onToggleSelect,
  onToggleAnswer,
  onInspectQuestion,
  serialLabel,
}) {
  const catLabel =
    getCategoryDisplayName(
      question.category,
      question.subjectId?.subjectName || question.subjectName,
    ) || question.category;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/[0.05]">
      {/* Left Badges */}
      <div className="flex items-center flex-wrap gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold text-slate-500">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect();
          }}
          className={`size-5 sm:size-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 select-none ${
            isSelected
              ? "bg-[#900EB0] border-[#900EB0] text-white shadow-sm shadow-[#900EB0]/25"
              : "bg-white border-slate-300 hover:border-[#900EB0]/60"
          }`}
          title={
            isSelected ? "সিলেকশন বাতিল করুন" : "প্রশ্নটি সেটে যোগ করুন"
          }
        >
          {isSelected && <Check className="size-3.5 stroke-[3]" />}
        </button>

        {serialLabel && (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 text-[10px]">
            {serialLabel}
          </span>
        )}

        {meta.uid && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(meta.uid);
              toast.success(`প্রশ্ন আইডি #${meta.uid} কপি করা হয়েছে`);
            }}
            className="bg-slate-100 hover:bg-slate-200/90 text-slate-700 border border-slate-200/90 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider flex items-center gap-0.5 cursor-pointer transition"
            title="প্রশ্ন আইডি কপি করতে ক্লিক করুন"
          >
            <span className="text-slate-400">#</span>
            <span>{meta.uid}</span>
          </button>
        )}

        {question.chapterNumber !== undefined &&
          question.chapterNumber !== null && (
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/70 text-[10px]">
              অধ্যায় {toBnNumber(question.chapterNumber)}
            </span>
          )}

        <QuestionMetadataTooltip question={question} classLabel={classLabel} />
      </div>

      {/* Right Badges & Quick Actions */}
      <div className="flex items-center flex-wrap gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold">
        <span className="bg-[#900EB0]/8 text-[#900EB0] border border-[#900EB0]/20 px-2 py-0.5 rounded">
          {catLabel}
        </span>

        <span
          className={`px-2 py-0.5 rounded border ${meta.difficultyMeta.className}`}
        >
          {meta.difficultyMeta.label}
        </span>

        {meta.levelLabel && (
          <span className="px-2 py-0.5 rounded border bg-indigo-50 text-indigo-700 border-indigo-200/70">
            {meta.levelLabel}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleAnswer();
          }}
          className={`size-6 sm:size-7 rounded-lg border transition cursor-pointer flex items-center justify-center ${
            isAnswerVisible
              ? "bg-[#900EB0]/10 text-[#900EB0] border-[#900EB0]/30"
              : "bg-slate-50 text-slate-500 hover:text-slate-700 border-slate-200 hover:bg-slate-100"
          }`}
          title={isAnswerVisible ? "উত্তর লুকান" : "উত্তর ও বিশ্লেষণ দেখুন"}
        >
          {isAnswerVisible ? (
            <EyeOff className="size-3.5" />
          ) : (
            <Eye className="size-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspectQuestion(question);
          }}
          className={`px-2 h-6 sm:h-7 rounded-lg border text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
            isInspected
              ? "bg-[#900EB0] text-white border-[#900EB0] shadow-xs"
              : "bg-purple-50/70 text-[#720A7B] border-purple-200/80 hover:bg-purple-100"
          }`}
          title="ডান প্যানেলে পূর্ণ মেটাডাটা ও কীওয়ার্ড দেখুন"
        >
          <PanelRightOpen className="size-3" />
          <span className="hidden sm:inline">মেটাডাটা</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Clickable footer chips summarizing author-attached Board/Year, School, Topics & Special Keywords.
 */
function QuestionKeywordFooter({ meta, onQuickTagFilter }) {
  const hasFooterItems =
    meta.boardYearPairs.length > 0 ||
    meta.schools.length > 0 ||
    meta.topics.length > 0 ||
    meta.specialSearches.length > 0;

  if (!hasFooterItems) return null;

  return (
    <div className="pt-2.5 border-t border-black/[0.05] flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] font-sans">
      {meta.boardYearPairs.map((by, idx) => (
        <span
          key={`by-${idx}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 font-semibold"
        >
          <Calendar className="size-3 text-slate-500" />
          {by}
        </span>
      ))}

      {meta.schools.map((sch, idx) => (
        <button
          key={`sch-${idx}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickTagFilter?.("school", sch);
          }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/70 font-semibold hover:bg-sky-100 transition cursor-pointer"
          title={`স্কুল দিয়ে ফিল্টার করুন: ${sch}`}
        >
          <Building2 className="size-3 text-sky-600" />
          {sch}
        </button>
      ))}

      {meta.topics.map((tp, idx) => (
        <button
          key={`tp-${idx}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickTagFilter?.("topic", tp);
          }}
          className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#900EB0]/8 text-[#720A7B] border border-[#900EB0]/20 font-semibold hover:bg-[#900EB0]/15 transition cursor-pointer"
          title={`টপিক দিয়ে ফিল্টার করুন: #${tp}`}
        >
          <Hash className="size-2.5" />
          {tp}
        </button>
      ))}

      {meta.specialSearches.map((tag, idx) => (
        <button
          key={`ss-${idx}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickTagFilter?.("special", tag);
          }}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200/70 font-semibold hover:bg-violet-100 transition cursor-pointer"
          title={`স্পেশাল কীওয়ার্ডে ফিল্টার করুন: ${tag}`}
        >
          <Tag className="size-2.5" />
          {tag}
        </button>
      ))}
    </div>
  );
}

/**
 * Renders either a standalone Question or a grouped Passage Group matching MyQuestions visuals.
 */
export default function QuestionBankCard({
  item,
  indexOffset = 0,
  selectedIdsSet,
  globalShowAnswers = false,
  inspectedQuestionId = null,
  availableChapters = [],
  onToggleQuestion,
  onToggleGroup,
  onInspectQuestion,
  onQuickTagFilter,
}) {
  const [expandedAnswerIds, setExpandedAnswerIds] = useState({});

  const toggleLocalAnswer = (id) => {
    setExpandedAnswerIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (item.isGroup) {
    const groupQuestions = item.questions || [];
    const qMeta = item.meta || groupQuestions[0] || {};
    const classLabel =
      CLASSES_MAP.find((c) => c.value === qMeta.className)?.label ||
      qMeta.className;

    const allGroupSelected =
      groupQuestions.length > 0 &&
      groupQuestions.every((gq) => selectedIdsSet.has(gq._id));
    const someGroupSelected = groupQuestions.some((gq) =>
      selectedIdsSet.has(gq._id),
    );

    const groupMeta = extractQuestionMetadata(qMeta, availableChapters);

    return (
      <div
        className={`border-2 p-4 sm:p-5 rounded-2xl transition-all duration-200 space-y-4 font-bengali ${
          allGroupSelected || someGroupSelected
            ? "ring-2 ring-[#900EB0]/20 border-[#900EB0]/45 bg-[#900EB0]/[0.02] shadow-sm"
            : "bg-white/80 hover:bg-white border-[#900EB0]/20 hover:border-[#900EB0]/35"
        }`}
      >
        {/* Passage Group Header */}
        <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-black/[0.06]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-sans font-bold">
            <span className="bg-gradient-to-r from-[#900EB0] to-[#B010CA] text-white px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1.5 text-xs">
              <BookOpenText className="size-3.5" />
              উদ্দীপকভিত্তিক প্রশ্নগুচ্ছ ({toBnNumber(groupQuestions.length)} টি)
            </span>
            {qMeta.chapterNumber !== undefined && qMeta.chapterNumber !== null && (
              <span className="bg-amber-50 text-amber-800 border border-amber-200/70 px-2 py-0.5 rounded">
                অধ্যায় {toBnNumber(qMeta.chapterNumber)}
              </span>
            )}
            <QuestionMetadataTooltip
              question={qMeta}
              classLabel={classLabel}
            />
          </div>

          <button
            type="button"
            onClick={() => onToggleGroup(groupQuestions, allGroupSelected)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              allGroupSelected
                ? "bg-[#900EB0] text-white shadow-sm shadow-[#900EB0]/25"
                : "bg-purple-50 text-[#720A7B] border border-purple-200 hover:bg-purple-100"
            }`}
          >
            <Check className="size-3.5" />
            {allGroupSelected ? "সবগুলো নির্বাচিত" : "সবগুলো বাছুন"}
          </button>
        </div>

        {/* Shared Passage Stem */}
        {item.passageStem && (
          <div className="p-4 bg-[#900EB0]/5 border border-[#900EB0]/15 rounded-xl text-slate-800 text-[15px] leading-relaxed">
            <RichTextRender content={item.passageStem} />
          </div>
        )}

        {/* Group Sub-Questions */}
        <div className="space-y-3 pt-1 border-t border-dashed border-[#900EB0]/20">
          {groupQuestions.map((subQ, subIdx) => {
            const isSubSelected = selectedIdsSet.has(subQ._id);
            const isSubAnsVisible =
              globalShowAnswers || Boolean(expandedAnswerIds[subQ._id]);
            const subMeta = extractQuestionMetadata(subQ, availableChapters);

            return (
              <div
                key={subQ._id}
                onClick={() => onToggleQuestion(subQ, { standalone: true })}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  isSubSelected
                    ? "bg-[#900EB0]/[0.05] border-[#900EB0]/40 ring-1 ring-[#900EB0]/20"
                    : "bg-slate-50/70 border-slate-200/70 hover:bg-white hover:border-purple-200"
                }`}
              >
                <QuestionCardMetaBadges
                  question={subQ}
                  meta={subMeta}
                  classLabel={classLabel}
                  isSelected={isSubSelected}
                  isAnswerVisible={isSubAnsVisible}
                  isInspected={inspectedQuestionId === subQ._id}
                  onToggleSelect={() =>
                    onToggleQuestion(subQ, { standalone: true })
                  }
                  onToggleAnswer={() => toggleLocalAnswer(subQ._id)}
                  onInspectQuestion={onInspectQuestion}
                  serialLabel={`প্রশ্ন ${toBnNumber(subIdx + 1)}`}
                />

                <QuestionBodyContent
                  question={subQ}
                  serialLabel={`${toBnNumber(subIdx + 1)}।`}
                  isAnswerVisible={isSubAnsVisible}
                />

                <QuestionKeywordFooter
                  meta={subMeta}
                  onQuickTagFilter={onQuickTagFilter}
                />
              </div>
            );
          })}
        </div>

        <QuestionKeywordFooter
          meta={groupMeta}
          onQuickTagFilter={onQuickTagFilter}
        />
      </div>
    );
  }

  // Single Question Card
  const q = item.question;
  if (!q) return null;

  const isSelected = selectedIdsSet.has(q._id);
  const isAnsVisible = globalShowAnswers || Boolean(expandedAnswerIds[q._id]);
  const classLabel =
    CLASSES_MAP.find((c) => c.value === q.className)?.label || q.className;
  const meta = extractQuestionMetadata(q, availableChapters);

  return (
    <div
      onClick={() => onToggleQuestion(q)}
      className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 cursor-pointer space-y-3.5 font-bengali ${
        isSelected
          ? "ring-2 ring-[#900EB0]/25 border-[#900EB0]/45 bg-[#900EB0]/[0.03] shadow-sm"
          : "bg-white/85 hover:bg-white border-black/[0.06] hover:border-[#900EB0]/35 hover:shadow-xs"
      }`}
    >
      <QuestionCardMetaBadges
        question={q}
        meta={meta}
        classLabel={classLabel}
        isSelected={isSelected}
        isAnswerVisible={isAnsVisible}
        isInspected={inspectedQuestionId === q._id}
        onToggleSelect={() => onToggleQuestion(q)}
        onToggleAnswer={() => toggleLocalAnswer(q._id)}
        onInspectQuestion={onInspectQuestion}
      />

      <QuestionBodyContent
        question={q}
        serialLabel={
          indexOffset > 0 ? `${toBnNumber(indexOffset)}।` : ""
        }
        isAnswerVisible={isAnsVisible}
      />

      <QuestionKeywordFooter
        meta={meta}
        onQuickTagFilter={onQuickTagFilter}
      />
    </div>
  );
}
