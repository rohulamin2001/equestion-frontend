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
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { RippleButton, RippleButtonRipples } from '@/components/ui/ripple-button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Book,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit,
  FolderPlus,
  Loader2,
  Plus,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useSyllabusManagement } from './hook/useSyllabusManagement';

const CLASSES_MAP = [
  { value: 'Class 3', label: '৩য় শ্রেণী' },
  { value: 'Class 4', label: '৪র্থ শ্রেণী' },
  { value: 'Class 5', label: '৫ম শ্রেণী' },
  { value: 'Class 6', label: '৬ষ্ঠ শ্রেণী' },
  { value: 'Class 7', label: '৭ম শ্রেণী' },
  { value: 'Class 8', label: '৮ম শ্রেণী' },
  { value: 'Class 9', label: '৯ম শ্রেণী' },
  { value: 'Class 10', label: '১০ম শ্রেণী' },
  { value: 'Class 11', label: '১১শ শ্রেণী' },
  { value: 'Class 12', label: 'দ্বাদশ শ্রেণী' },
];

export default function SyllabusManagement() {
  const {
    userRole,
    selectedClass,
    setSelectedClass,
    isModalOpen,
    setIsModalOpen,
    editingSyllabus,
    syllabusToDelete,
    setSyllabusToDelete,
    formClass,
    setFormClass,
    formSubject,
    setFormSubject,
    formChapters,
    formError,
    formSuccess,
    formLoading,
    deletePending,
    syllabusList,
    loading,
    error,
    refetch,
    handleOpenAddModal,
    handleOpenEditModal,
    handleAddChapterField,
    handleRemoveChapterField,
    handleChapterFieldChange,
    handleSubmit,
    handleDelete,
  } = useSyllabusManagement();

  // Expanded subject tracking
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [isFormClassDropdownOpen, setIsFormClassDropdownOpen] = useState(false);

  const toggleSubject = (id) => {
    setExpandedSubjectId(prev => (prev === id ? null : id));
  };

  const currentClassLabel = CLASSES_MAP.find(c => c.value === selectedClass)?.label || selectedClass;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">সিলেবাস ও টপিক ব্যবস্থাপনা</h1>
          <p className="text-slate-500 text-sm mt-1">শ্রেণীভিত্তিক পরীক্ষার প্রশ্নের অধ্যায় ও সুনির্দিষ্ট টপিকসমূহ আগে থেকে প্রস্তুত করুন।</p>
        </div>
        <RippleButton 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-6 rounded-xl bg-primary text-white hover:bg-primary/95 transition font-semibold"
        >
          <FolderPlus className="size-[18px]" />
          নতুন সিলেবাস যোগ করুন
          <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
        </RippleButton>
      </div>

      {/* Classes Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {CLASSES_MAP.map((cls) => {
            const isActive = selectedClass === cls.value;
            return (
              <button
                key={cls.value}
                onClick={() => {
                  setSelectedClass(cls.value);
                  setExpandedSubjectId(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                {cls.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-slate-500 text-sm">{currentClassLabel}-এর সিলেবাস লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center max-w-md mx-auto">
            <AlertCircle className="size-10 text-red-500 mb-3 mx-auto" />
            <p className="text-slate-800 font-semibold mb-1">সিলেবাস লোড করা যায়নি</p>
            <p className="text-slate-500 text-sm mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">আবার চেষ্টা করুন</Button>
          </div>
        ) : syllabusList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center max-w-md mx-auto">
            <Book className="size-12 text-slate-400 mb-3 mx-auto" />
            <p className="text-slate-800 font-semibold mb-1">কোনো সিলেবাস পাওয়া যায়নি</p>
            <p className="text-slate-500 text-sm">
              {currentClassLabel}-এর জন্য কোনো সিলেবাস বা বিষয় এখন পর্যন্ত যুক্ত করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {syllabusList.map((subject) => {
              const isExpanded = expandedSubjectId === subject._id;
              return (
                <div 
                  key={subject._id} 
                  className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  {/* Subject Title Bar */}
                  <div 
                    onClick={() => toggleSubject(subject._id)}
                    className="flex justify-between items-center px-6 py-5 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-primary/5 text-primary rounded-xl shrink-0">
                        <BookOpen className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight">{subject.subjectName}</h3>
                        <p className="text-xs text-slate-500 mt-1">{subject.chapters?.length || 0} টি অধ্যায় সংযুক্ত</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="সম্পাদনা করুন"
                          onClick={() => handleOpenEditModal(subject)}
                          className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg"
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          title="মুছে ফেলুন"
                          onClick={() => setSyllabusToDelete(subject)}
                          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      
                      <button 
                        onClick={() => toggleSubject(subject._id)}
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                      >
                        <ChevronDown className={`size-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Chapters List (Accordion Content) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="border-t border-slate-50 bg-slate-50/20"
                      >
                        <div className="p-6 space-y-4">
                          {subject.chapters && subject.chapters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {subject.chapters
                                .sort((a, b) => a.chapterNumber - b.chapterNumber)
                                .map((chap) => (
                                  <div 
                                    key={chap._id || chap.chapterNumber}
                                    className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm "
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className="inline-flex items-center justify-center size-7 rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0 mt-0.5">
                                        {chap.chapterNumber}
                                      </span>
                                      <h4 className="font-bold text-slate-800 text-[15px] pt-0.5">{chap.chapterName}</h4>
                                    </div>
                                    
                                    <div className="pl-10 space-y-1.5">
                                      <span className="text-[12px]  text-slate-400 uppercase tracking-wider">টপিকসমূহ:</span>
                                      {chap.topics && chap.topics.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                          {chap.topics.map((topic, ti) => (
                                            <span 
                                              key={ti}
                                              className="inline-block bg-slate-50 border border-slate-100 text-slate-600 text-[11px] px-2 py-1 rounded-md font-semibold"
                                            >
                                              {topic}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-slate-400 italic">কোনো টপিক সেট করা হয়নি</p>
                                      )}
                                    </div>
                                  </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-slate-400 text-sm text-center italic py-4">কোনো অধ্যায় পাওয়া যায়নি।</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Syllabus Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open && !formLoading) {
          setIsModalOpen(false);
        }
      }}>
        <DialogContent
          from="top"
          showCloseButton={!formLoading}
          onPointerDownOutside={(e) => {
            if (formLoading) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (formLoading) e.preventDefault();
          }}
          className="max-w-2xl p-0 border border-slate-200/60 overflow-hidden bg-white shadow-2xl rounded-2xl relative"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[85vh]">
            <DialogHeader className="bg-white px-6 pt-6 pb-5 border-b border-slate-100/80 relative flex flex-col space-y-0 mb-0 text-left">
              <div className="flex items-start gap-4 pr-8">
                <div className="p-2 bg-indigo-50 border border-indigo-100/40 text-indigo-600 rounded-xl shrink-0 mt-0.5 shadow-sm shadow-indigo-100/10">
                  <FolderPlus className="size-5" />
                </div>
                <div className="space-y-1">
                  <DialogTitle className="font-bold text-slate-800 text-[17px] tracking-tight leading-snug">
                    {editingSyllabus ? 'সিলেবাস সংশোধন করুন' : 'নতুন সিলেবাস যোগ করুন'}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500 text-[13px] font-normal leading-relaxed">
                    শ্রেণী ও বিষয়ের অধীনে অধ্যায় এবং প্রতিটি অধ্যায়ের সুনির্দিষ্ট টপিকসমূহ সাজিয়ে নিন।
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {formError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="font-semibold">{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    শ্রেণী নির্বাচন (Class)
                  </label>
                  <DropdownMenu 
                    open={isFormClassDropdownOpen} 
                    onOpenChange={(open) => {
                      if (!formLoading && !editingSyllabus) {
                        setIsFormClassDropdownOpen(open);
                      }
                    }}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        disabled={formLoading || !!editingSyllabus}
                        className="w-full px-4 border border-slate-200 rounded-xl text-sm bg-white hover:bg-slate-50/50 hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all duration-200 font-semibold text-slate-700 flex justify-between items-center h-11 shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100 disabled:pointer-events-none cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Book className="size-4 text-indigo-500" />
                          {CLASSES_MAP.find(c => c.value === formClass)?.label || formClass}
                        </span>
                        <ChevronDown className={`size-4 text-slate-400 transition-transform duration-300 ${isFormClassDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-0.5 z-[100]"
                    >
                      {CLASSES_MAP.map((cls) => {
                        const isSelected = formClass === cls.value;
                        return (
                          <DropdownMenuItem
                            key={cls.value}
                            onSelect={() => setFormClass(cls.value)}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-between cursor-pointer focus:bg-indigo-50 focus:text-indigo-600 hover:bg-slate-50/80 group ${
                              isSelected 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : 'text-slate-700'
                            }`}
                          >
                            <span>{cls.label}</span>
                            {isSelected && (
                              <span className="size-1.5 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    বিষয়ের নাম (Subject Name)
                  </label>
                  <Input
                    required
                    placeholder="যেমন: গণিত, বিজ্ঞান, English"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    disabled={formLoading}
                    className="px-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all duration-200 h-11 text-sm font-semibold outline-none shadow-sm disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              {/* Chapters Dynamic Fields */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                  <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <BookOpen className="size-5 text-indigo-500" />
                    <span>অধ্যায় ও টপিকসমূহ</span>
                  </h4>
                  <RippleButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddChapterField}
                    disabled={formLoading}
                    className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 active:scale-95 rounded-xl border border-indigo-200 hover:border-indigo-400 transition-all py-2.5 px-4 text-xs font-bold shadow-sm shadow-indigo-100/10"
                  >
                    <Plus className="size-4" />
                    অধ্যায় যোগ করুন
                    <RippleButtonRipples color="rgba(99, 102, 241, 0.12)" />
                  </RippleButton>
                </div>

                <div className="space-y-5 max-h-[38vh] overflow-y-auto pr-1">
                  {formChapters.map((chap, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-2xl border border-slate-200 border-l-4 border-l-indigo-500 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300 space-y-5 relative group shadow-sm"
                    >
                      {/* Chapter Header Bar */}
                      <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center rounded-full px-1.5 pt-0.5 size-6.5  bg-indigo-100 text-indigo-700 font-bold text-xs">
                            {chap.chapterNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            অধ্যায় এর বিবরণ
                          </span>
                        </div>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveChapterField(index)}
                          disabled={formLoading}
                          className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all duration-200 border border-slate-200 shadow-sm flex items-center justify-center"
                          title="অধ্যায়টি মুছুন"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-3 sm:col-span-2.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">অধ্যায় নং</label>
                          <Input
                            required
                            type="number"
                            value={chap.chapterNumber}
                            onChange={(e) => handleChapterFieldChange(index, 'chapterNumber', e.target.value)}
                            disabled={formLoading}
                            className="text-center rounded-xl border border-slate-200 h-11 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 font-semibold text-slate-700 bg-white hover:border-slate-300 shadow-sm focus:bg-white"
                          />
                        </div>
                        <div className="col-span-9 sm:col-span-9.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">অধ্যায়ের নাম (Chapter Name)</label>
                          <Input
                            required
                            placeholder="যেমন: বাস্তব সংখ্যা বা প্রথম অধ্যায়"
                            value={chap.chapterName}
                            onChange={(e) => handleChapterFieldChange(index, 'chapterName', e.target.value)}
                            disabled={formLoading}
                            className="rounded-xl border border-slate-200 h-11 px-4 focus-visible:ring-indigo-100 focus-visible:border-indigo-500 font-semibold text-slate-700 bg-white hover:border-slate-300 shadow-sm focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          টপিকসমূহ (Topics - কমা দিয়ে আলাদা করুন)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="যেমন: সংখ্যার তুলনা, ক্রমবাচক সংখ্যা, ভগ্নাংশ"
                          value={chap.topicsString}
                          onChange={(e) => handleChapterFieldChange(index, 'topicsString', e.target.value)}
                          disabled={formLoading}
                          className="w-full border border-slate-200 rounded-xl text-sm p-3.5 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 font-semibold text-slate-700 placeholder-slate-400 hover:border-slate-300 transition-all resize-none bg-white shadow-sm"
                        />
                        
                        {/* Real-time Tags Preview */}
                        {chap.topicsString && (
                          <div className="space-y-2 pt-2 border-t border-slate-200/40 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">টপিক ট্যাগ প্রিভিউ:</span>
                            <div className="flex flex-wrap gap-2">
                              {chap.topicsString.split(',').map((t, ti) => {
                                const trimmed = t.trim();
                                if (!trimmed) return null;
                                return (
                                  <span 
                                    key={ti}
                                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/15 hover:to-violet-500/15 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-indigo-100/50 transition-all duration-200 hover:scale-105 cursor-default shadow-sm"
                                  >
                                    #{trimmed}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="bg-slate-50/70 px-6 py-3.5 border-t border-slate-100/85 flex flex-col-reverse sm:flex-row justify-end gap-2.5 mt-0">
              <DialogClose asChild>
                <ModalCancelButton disabled={formLoading}>
                  বাতিল করুন
                </ModalCancelButton>
              </DialogClose>
              <ModalSubmitButton type="submit" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  'সংরক্ষণ করুন'
                )}
              </ModalSubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog 
        open={!!syllabusToDelete} 
        onOpenChange={(open) => { 
          if (!open && !deletePending) {
            setSyllabusToDelete(null); 
          }
        }}
      >
        <AlertDialogPopup>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-3">
              <Trash2 className="h-6 w-6 text-red-600 animate-bounce" />
            </div>
            <AlertDialogTitle className="text-center font-bold text-slate-900 text-lg">আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-slate-500 text-sm mt-2">
              আপনি কি নিশ্চিত যে আপনি <strong>{syllabusToDelete?.subjectName} ({currentClassLabel})</strong> বিষয়ের সম্পূর্ণ সিলেবাসটি স্থায়ীভাবে মুছে ফেলতে চান? এটি আর পুনরুদ্ধার করা যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="w-full sm:w-auto" 
              disabled={deletePending}
              onClick={() => {
                if (!deletePending) {
                  setSyllabusToDelete(null);
                }
              }}
            >
              না, বাতিল করুন
            </AlertDialogCancel>
            <AlertDialogAction 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2"
              disabled={deletePending}
              onClick={async (e) => {
                e.preventDefault();
                if (syllabusToDelete) {
                  try {
                    await handleDelete();
                  } catch (err) {
                    // Handled in mutation
                  }
                }
              }}
            >
              {deletePending ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  মুছে ফেলা হচ্ছে...
                </>
              ) : (
                'হ্যাঁ, মুছে ফেলুন'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </div>
  );
}
