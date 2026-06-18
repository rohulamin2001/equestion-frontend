import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, ModalCancelButton, ModalSubmitButton } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RippleButton, RippleButtonRipples } from '@/components/ui/ripple-button';
import {
  BookOpen,
  ChevronRight,
  Code,
  Edit,
  GraduationCap,
  Loader2,
  Plus,
  School,
  Sliders,
  Trash2,
} from 'lucide-react';
import {
  LEVEL_LABELS,
  PREDEFINED_CATEGORIES,
  TYPE_LABELS,
  getGroupLabel,
  useSubjectSetup,
} from './hook/useSubjectSetup';

const TYPE_ICONS = {
  School: School,
  College: GraduationCap,
  Madrasah: BookOpen,
};

const TYPE_COLORS = {
  School: {
    bg: 'bg-indigo-50/40 border-indigo-200 text-indigo-700 shadow-indigo-100',
    activeBg: 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 shadow-md',
    glow: 'from-indigo-500 to-indigo-600',
  },
  College: {
    bg: 'bg-amber-50/40 border-amber-200 text-amber-700 shadow-amber-100',
    activeBg: 'bg-amber-500 border-amber-500 text-white shadow-amber-200 shadow-md',
    glow: 'from-amber-400 to-amber-500',
  },
  Madrasah: {
    bg: 'bg-emerald-50/40 border-emerald-200 text-emerald-700 shadow-emerald-100',
    activeBg: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 shadow-md',
    glow: 'from-emerald-500 to-emerald-600',
  },
};

export default function SubjectSetup() {
  const {
    selectedType,
    selectedLevel,
    selectedClass,
    setSelectedClass,
    activeTypes,
    activeLevels,
    classesForLevel,
    currentClassLabel,
    handleTypeChange,
    handleLevelChange,
    subjectName,
    setSubjectName,
    subjectCode,
    setSubjectCode,
    subjectTotalMarks,
    setSubjectTotalMarks,
    subjectGroup,
    setSubjectGroup,
    subjectYears,
    subjectCategories,
    subjectVersion,
    setSubjectVersion,
    config,
    listVersionFilter,
    setListVersionFilter,
    editingSubject,
    setEditingSubject,
    subjectToDelete,
    setSubjectToDelete,
    isEditModalOpen,
    setIsEditModalOpen,
    subjects,
    subjectsLoading,
    addSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,
    handleAddYear,
    handleRemoveYear,
    handleToggleCategory,
    handleCreateSubjectSubmit,
    handleEditSubjectSubmit,
    handleOpenEditModal,
    isClass9to12,
  } = useSubjectSetup();

  const activeColor = TYPE_COLORS[selectedType] || TYPE_COLORS.School;

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-glass p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            সাবজেক্ট ও কোড সেটআপ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            প্রতিষ্ঠানের স্তর ও শ্রেণীভিত্তিক স্থায়ী বিষয়সমূহ কোড ও সক্রিয় শিক্ষাবর্ষসহ কনফিগার করুন।
          </p>
        </div>
      </div>

      {/* Cascading Filter Selection (Hierarchy tabs styled) */}
      <div className="relative w-full bg-glass p-6 rounded-2xl border shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Type Selection */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5 font-sans">
            <span className="size-2 rounded-full bg-indigo-500"></span>
            প্রতিষ্ঠানের ধরণ (Type)
          </h4>
          <div className="flex flex-col gap-2.5">
            {activeTypes.map((type) => {
              const IconComp = TYPE_ICONS[type] || School;
              const isActive = selectedType === type;
              const colStyle = TYPE_COLORS[type] || TYPE_COLORS.School;

              return (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`p-3 px-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isActive ? colStyle.activeBg : colStyle.bg
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="size-4.5" />
                    <span className="font-bold text-[13px]">{TYPE_LABELS[type] || type}</span>
                  </div>
                  {isActive && <ChevronRight className="size-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Level Selection */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5 font-sans">
            <span className="size-2 rounded-full bg-indigo-500"></span>
            শিক্ষার স্তর (Level)
          </h4>
          <div className="flex flex-col gap-2.5">
            {activeLevels.map((level) => {
              const isActive = selectedLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  className={`p-3 px-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isActive
                      ? activeColor.activeBg
                      : 'bg-white/45 border-slate-200/50 text-slate-700 hover:border-slate-350 hover:bg-white/70 shadow-sm'
                  }`}
                >
                  <span className="font-bold text-[13px]">{LEVEL_LABELS[level] || level}</span>
                  {isActive && <ChevronRight className="size-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 3: Class Selection */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider pl-1 flex items-center gap-1.5 font-sans">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            শ্রেণী নির্বাচন (Class)
          </h4>
          <div className="p-4 rounded-xl border border-black/[0.04] bg-black/[0.01] min-h-[120px] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-2 w-full">
              {classesForLevel.map((cls) => {
                const isActive = selectedClass === cls.value;
                return (
                  <button
                    key={cls.value}
                    onClick={() => setSelectedClass(cls.value, selectedType, selectedLevel)}
                    className={`p-2.5 py-3 rounded-lg text-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white/45 border border-slate-200/50 text-slate-600 hover:border-slate-350 hover:bg-white/70 shadow-sm'
                    }`}
                  >
                    <span className="font-extrabold">{cls.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Setup Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Create Subject Form (1 col) */}
        <div className="bg-glass p-6 rounded-2xl border shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 text-base border-b pb-3 flex items-center gap-2">
            <Plus className="size-4.5 text-indigo-500" />
            <span>নতুন বিষয় যোগ করুন ({currentClassLabel})</span>
          </h3>

          <form onSubmit={handleCreateSubjectSubmit} className="space-y-5">

            {/* Subject Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                বিষয়ের নাম <span className="text-indigo-400">*</span>
              </label>
              <Input
                required
                placeholder="যেমন: বাংলা ১ম পত্র, সাধারণ গণিত"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                disabled={addSubjectMutation.isPending}
                className="h-11 px-4 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Subject Code + পূর্ণমান — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  বিষয় কোড <span className="text-indigo-400">*</span>
                </label>
                <Input
                  required
                  placeholder="যেমন: ১০১"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  disabled={addSubjectMutation.isPending}
                  className="h-11 px-4 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  পূর্ণমান <span className="text-indigo-400">*</span>
                </label>
                <Input
                  required
                  type="text"
                  placeholder="যেমন: ১০০"
                  value={subjectTotalMarks}
                  onChange={(e) => setSubjectTotalMarks(e.target.value)}
                  disabled={addSubjectMutation.isPending}
                  className="h-11 px-4 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {/* Group Selection (Only for Class 9-12) */}
            {isClass9to12 && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  বিভাগ / গ্রুপ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'General', label: 'সাধারণ' },
                    { value: 'Science', label: 'বিজ্ঞান' },
                    { value: 'Humanities', label: 'মানবিক' },
                    { value: 'Commerce', label: 'ব্যবসায় শিক্ষা' },
                  ].map((grp) => (
                    <label
                      key={grp.value}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all duration-200 ${
                        subjectGroup === grp.value
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-white/60 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subjectGroup"
                        checked={subjectGroup === grp.value}
                        onChange={() => setSubjectGroup(grp.value)}
                        disabled={addSubjectMutation.isPending}
                        className="sr-only"
                      />
                      {grp.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Version Selection (Only shown if both Bangla and English versions are active in config) */}
            {(!config?.versions || config.versions.length > 1) && (
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  ভাষা সংস্করণ <span className="text-indigo-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'Bangla', label: 'বাংলা সংস্করণ' },
                    { value: 'English', label: 'ইংরেজি সংস্করণ' },
                  ].map((ver) => (
                    <label
                      key={ver.value}
                      className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all duration-200 ${
                        subjectVersion === ver.value
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-white/60 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="subjectVersion"
                        checked={subjectVersion === ver.value}
                        onChange={() => setSubjectVersion(ver.value)}
                        disabled={addSubjectMutation.isPending}
                        className="sr-only"
                      />
                      {ver.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Active Years */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                সক্রিয় শিক্ষাবর্ষ
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="new-year-setup-input"
                  placeholder="বছর (যেমন: ২০২৬)"
                  disabled={addSubjectMutation.isPending}
                  className="h-11 px-4 rounded-xl border border-slate-200 bg-white/70 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) { handleAddYear(val); e.target.value = ''; }
                    }
                  }}
                />
                <Button
                  type="button"
                  disabled={addSubjectMutation.isPending}
                  onClick={() => {
                    const input = document.getElementById('new-year-setup-input');
                    if (input?.value.trim()) { handleAddYear(input.value.trim()); input.value = ''; }
                  }}
                  className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[28px]">
                {subjectYears.length === 0 && (
                  <span className="text-[11px] text-slate-400 italic">কোনো বছর যোগ করা হয়নি</span>
                )}
                {subjectYears.map((yr) => (
                  <span
                    key={yr}
                    className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1.5 rounded-full border border-amber-200 shadow-sm"
                  >
                    {yr}
                    <button
                      type="button"
                      disabled={addSubjectMutation.isPending}
                      onClick={() => handleRemoveYear(yr)}
                      className="size-4 rounded-full flex items-center justify-center bg-amber-200/60 hover:bg-amber-300 text-amber-700 font-black leading-none cursor-pointer transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Question Categories */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                প্রশ্নের ক্যাটাগরি
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PREDEFINED_CATEGORIES.map((cat) => {
                  const isChecked = subjectCategories.includes(cat.value);
                  return (
                    <label
                      key={cat.value}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all duration-150 ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                          : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                      }`}
                    >
                      <span className={`size-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                      }`}>
                        {isChecked && (
                          <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCategory(cat.value)}
                        disabled={addSubjectMutation.isPending}
                        className="sr-only"
                      />
                      <span className="leading-tight">{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <RippleButton
              type="submit"
              disabled={addSubjectMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold h-12 rounded-xl shadow-md shadow-indigo-200 cursor-pointer transition-all"
            >
              {addSubjectMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  বিষয় যুক্ত করুন
                </>
              )}
              <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
            </RippleButton>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-glass p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-500" />
              <span>বিষয়ের তালিকা ({currentClassLabel})</span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {(!config?.versions || config.versions.length > 1) && (
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {[
                    { value: 'All', label: 'সব সংস্করণ' },
                    { value: 'Bangla', label: 'বাংলা' },
                    { value: 'English', label: 'ইংরেজি' },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setListVersionFilter(tab.value)}
                      className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md transition-all cursor-pointer ${
                        listVersionFilter === tab.value
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
              <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full whitespace-nowrap">
                মোট {subjects.length} টি বিষয় কনফিগারড
              </span>
            </div>
          </div>

          {subjectsLoading ? (
            <div className="bg-glass rounded-2xl border p-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-slate-500 text-sm">বিষয়ের তালিকা লোড হচ্ছে...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="bg-glass border rounded-2xl shadow-sm p-16 text-center max-w-md mx-auto">
              <BookOpen className="size-12 text-slate-400 mb-3 mx-auto" />
              <p className="text-slate-800 font-semibold mb-1">কোনো বিষয় পাওয়া যায়নি</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                {currentClassLabel}-এর অধীনে এখন পর্যন্ত কোনো বিষয় কনফিগার করা হয়নি। বামপাশের ফর্ম ব্যবহার করে নতুন বিষয়
                যুক্ত করুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-glass border p-5 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-200 hover:bg-white/[0.60] relative group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Code Badge & Actions */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-extrabold rounded-lg">
                          <Code className="size-3.5" />
                          কোড: {sub.subjectCode}
                        </span>
                        {(!config?.versions || config.versions.length > 1) && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                            sub.version === 'English'
                              ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
                              : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                          }`}>
                            {sub.version === 'English' ? 'ইংরেজি' : 'বাংলা'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(sub)}
                          className="h-8 w-8 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 shadow-sm"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSubjectToDelete(sub)}
                          className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 border border-slate-100 shadow-sm"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Subject Details */}
                  <div>
                      <h4 className="font-extrabold text-slate-800 text-[16px] leading-snug">{sub.subjectName}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-semibold">
                        শ্রেণী: {currentClassLabel}
                        {sub.group && sub.group !== 'General' && ` • গ্রুপ: ${getGroupLabel(sub.group)}`}
                        {sub.totalMarks != null && ` • পূর্ণমান: ${sub.totalMarks}`}
                      </p>
                    </div>
                  </div>

                  {/* Active Years badges */}
                  <div className=" border-t border-slate-50 flex flex-wrap gap-1 items-center">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">শিক্ষাবর্ষ:</span>
                    {sub.years &&
                      sub.years.map((yr) => (
                        <span
                          key={yr}
                          className="bg-amber-50 border border-amber-100 text-amber-700 font-extrabold text-[11px] px-2 py-0.5 rounded-md"
                        >
                          {yr}
                        </span>
                      ))}
                  </div>

                  {/* Configured Categories badges */}
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">ক্যাটাগরি:</span>
                    {sub.categories && sub.categories.length > 0 ? (
                      sub.categories.map((cat) => (
                        <span
                          key={cat}
                          className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-[11px] px-2 py-0.5 rounded-md"
                        >
                          {PREDEFINED_CATEGORIES.find((c) => c.value === cat)?.label ?? cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">কোনোটি নয় (ডিফল্ট)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Subject Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        if (!open && !updateSubjectMutation.isPending) {
          setIsEditModalOpen(false);
          setEditingSubject(null);
        }
      }}>
        <DialogContent className="max-w-md p-0 bg-glass-elevated backdrop-blur-xl border border-slate-200/50 rounded-2xl relative shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="text-left px-6 pt-5 pb-3 border-b border-slate-100 shrink-0">
            <DialogTitle className="font-bold text-slate-800 text-[16px] tracking-tight">বিষয় তথ্য সংশোধন</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs mt-0.5">
              বিষয়ের বিবরণ, বিষয় কোড এবং সক্রিয় শিক্ষাবর্ষ সংশোধন করুন।
            </DialogDescription>
          </DialogHeader>

          {editingSubject && (
            <form onSubmit={handleEditSubjectSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3.5">

                {/* বিষয়ের নাম */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 block">বিষয়ের নাম</label>
                  <Input
                    required
                    value={editingSubject.subjectName}
                    onChange={(e) => setEditingSubject({ ...editingSubject, subjectName: e.target.value })}
                    disabled={updateSubjectMutation.isPending}
                    className="h-10 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* বিষয় কোড + পূর্ণমান — একই লাইনে */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">বিষয় কোড</label>
                    <Input
                      required
                      value={editingSubject.subjectCode}
                      onChange={(e) => setEditingSubject({ ...editingSubject, subjectCode: e.target.value })}
                      disabled={updateSubjectMutation.isPending}
                      className="h-10 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">পূর্ণমান <span className="text-indigo-400">*</span></label>
                    <Input
                      required
                      type="text"
                      placeholder="যেমন: ১০০"
                      value={editingSubject.totalMarks ?? ''}
                      onChange={(e) => setEditingSubject({ ...editingSubject, totalMarks: e.target.value })}
                      disabled={updateSubjectMutation.isPending}
                      className="h-10 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Group Selection in Edit (if applicable) */}
                {['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(editingSubject.className) && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 block">বিভাগ / গ্রুপ</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'General', label: 'সাধারণ' },
                        { value: 'Science', label: 'বিজ্ঞান' },
                        { value: 'Humanities', label: 'মানবিক' },
                        { value: 'Commerce', label: 'ব্যবসায়' },
                      ].map((grp) => (
                        <label
                          key={grp.value}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all duration-200 ${
                            editingSubject.group === grp.value
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="editSubjectGroup"
                            checked={editingSubject.group === grp.value}
                            onChange={() => setEditingSubject({ ...editingSubject, group: grp.value })}
                            disabled={updateSubjectMutation.isPending}
                            className="sr-only"
                          />
                          {grp.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Version Selection in Edit */}
                {(!config?.versions || config.versions.length > 1) && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 block">ভাষা সংস্করণ</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'Bangla', label: 'বাংলা সংস্করণ' },
                        { value: 'English', label: 'ইংরেজি সংস্করণ' },
                      ].map((ver) => (
                        <label
                          key={ver.value}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all duration-200 ${
                            editingSubject.version === ver.value
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="editSubjectVersion"
                            checked={editingSubject.version === ver.value}
                            onChange={() => setEditingSubject({ ...editingSubject, version: ver.value })}
                            disabled={updateSubjectMutation.isPending}
                            className="sr-only"
                          />
                          {ver.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edit Years setup */}
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <label className="text-xs font-semibold text-slate-600 block">সক্রিয় শিক্ষাবর্ষ</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      id="edit-year-input"
                      placeholder="বছর (যেমন: ২০২৬)"
                      disabled={updateSubjectMutation.isPending}
                      className="h-9 rounded-xl border border-slate-200 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val) { handleAddYear(val, true); e.target.value = ''; }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={updateSubjectMutation.isPending}
                      onClick={() => {
                        const input = document.getElementById('edit-year-input');
                        if (input && input.value.trim()) { handleAddYear(input.value.trim(), true); input.value = ''; }
                      }}
                      className="h-9 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                      যোগ
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editingSubject.years.map((yr) => (
                      <span
                        key={yr}
                        className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 font-semibold text-xs px-2.5 py-0.5 rounded-md border border-amber-100"
                      >
                        {yr}
                        <button type="button" onClick={() => handleRemoveYear(yr, true)} className="text-amber-500 font-bold hover:text-amber-700">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Edit Categories — custom pill style */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 block">প্রশ্নের ক্যাটাগরি</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PREDEFINED_CATEGORIES.map((cat) => {
                      const isChecked = (editingSubject.categories || []).includes(cat.value);
                      return (
                        <label
                          key={cat.value}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all duration-150 ${
                            isChecked
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white/80'
                          }`}
                        >
                          <span className={`size-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                            isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                          }`}>
                            {isChecked && (
                              <svg className="size-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCategory(cat.value, true)}
                            disabled={updateSubjectMutation.isPending}
                            className="sr-only"
                          />
                          <span className="leading-tight">{cat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Sticky footer — always visible */}
              <DialogFooter className="px-6 py-4 border-t border-slate-100 flex gap-2 justify-end shrink-0 bg-white/60 backdrop-blur-sm rounded-b-2xl">
                <DialogClose asChild>
                  <ModalCancelButton disabled={updateSubjectMutation.isPending}>বাতিল</ModalCancelButton>
                </DialogClose>
                <ModalSubmitButton type="submit" disabled={updateSubjectMutation.isPending}>
                  {updateSubjectMutation.isPending ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </ModalSubmitButton>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!subjectToDelete}
        onOpenChange={(open) => {
          if (!open && !deleteSubjectMutation.isPending) {
            setSubjectToDelete(null);
          }
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-3">
              <Trash2 className="h-6 w-6 text-red-650 animate-bounce" />
            </div>
            <AlertDialogTitle className="text-center font-bold text-slate-900 text-base">আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500 text-xs mt-1.5 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি{' '}
              <strong>
                {subjectToDelete?.subjectName} ({subjectToDelete?.subjectCode})
              </strong>{' '}
              বিষয়টিকে স্থায়ীভাবে ডিলিট করতে চান? এটি মুছে ফেললে এই বিষয়ের সাথে সংযুক্ত যেকোনো সিলেবাস এবং প্রশ্ন ক্ষতিগ্রস্ত
              হতে পারে!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="w-full sm:w-auto text-xs"
              disabled={deleteSubjectMutation.isPending}
              onClick={() => setSubjectToDelete(null)}
            >
              না, বাতিল করুন
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              disabled={deleteSubjectMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (subjectToDelete) {
                  deleteSubjectMutation.mutate(subjectToDelete._id);
                }
              }}
            >
              {deleteSubjectMutation.isPending ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
