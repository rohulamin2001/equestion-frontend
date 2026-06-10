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
import { Input } from '@/components/ui/input';
import { RippleButton, RippleButtonRipples } from '@/components/ui/ripple-button';
import { CATEGORIES_MAP } from '@/constants/categories';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@clerk/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const TYPE_LABELS = {
  School: 'স্কুল (School)',
  College: 'কলেজ (College)',
  Madrasah: 'মাদ্রাসা (Madrasah)',
};

const LEVEL_LABELS = {
  Primary: 'প্রাথমিক (Primary)',
  Secondary: 'মাধ্যমিক (Secondary)',
  'Higher Secondary': 'উচ্চমাধ্যমিক (Higher Secondary)',
  Ebtedayee: 'ইবতেদায়ী (Ebtedayee)',
  Dakhil: 'দাখিল (Dakhil)',
  Alim: 'আলিম (Alim)',
};

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

const getGroupLabel = (groupName) => {
  switch (groupName) {
    case 'Science': return 'বিজ্ঞান';
    case 'Humanities': return 'মানবিক';
    case 'Commerce': return 'ব্যবসায় শিক্ষা';
    default: return 'সাধারণ';
  }
};

const PREDEFINED_CATEGORIES = CATEGORIES_MAP.map(c =>c);

export default function SubjectSetup() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { allowedClasses } = useAcademicConfig();

  // Active filter state
  const [selectedType, setSelectedType] = useState('School');
  const [selectedLevel, setSelectedLevel] = useState('Secondary');
  const [selectedClass, setSelectedClass] = useState('Class 6');

  // Form Fields
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectGroup, setSubjectGroup] = useState('General');
  const [subjectYears, setSubjectYears] = useState([new Date().getFullYear()]);
  const [subjectCategories, setSubjectCategories] = useState(['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion']);

  // Modal / Editing states
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sync state when allowedClasses changes or loaded
  useEffect(() => {
    if (allowedClasses && allowedClasses.length > 0) {
      const exists = allowedClasses.some(
        (c) => c.value === selectedClass && c.type === selectedType && c.level === selectedLevel
      );
      if (!exists) {
        const first = allowedClasses[0];
        setSelectedType(first.type);
        setSelectedLevel(first.level);
        setSelectedClass(first.value);
      }
    }
  }, [allowedClasses]);

  const activeTypes = Array.from(new Set(allowedClasses.map((c) => c.type)));
  const activeLevels = Array.from(
    new Set(allowedClasses.filter((c) => c.type === selectedType).map((c) => c.level))
  );
  const classesForLevel = allowedClasses.filter(
    (c) => c.type === selectedType && c.level === selectedLevel
  );

  const currentClassLabel = allowedClasses.find(
    (c) => c.value === selectedClass && c.type === selectedType && c.level === selectedLevel
  )?.label || selectedClass;

  // Fetch Subjects Query
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', selectedType, selectedLevel, selectedClass],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/subjects', {
        params: {
          className: selectedClass,
          institutionType: selectedType,
          academicLevel: selectedLevel,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.subjects;
    },
    enabled: !!selectedClass,
  });

  // Add Subject Mutation
  const addSubjectMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      return apiClient.post('/subjects', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('বিষয় সফলভাবে যুক্ত করা হয়েছে!');
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'বিষয় যুক্ত করতে ব্যর্থ হয়েছে');
    },
  });

  // Update Subject Mutation
  const updateSubjectMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const token = await getToken();
      return apiClient.put(`/subjects/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('বিষয় সফলভাবে আপডেট করা হয়েছে!');
      setIsEditModalOpen(false);
      setEditingSubject(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'বিষয় আপডেট করতে ব্যর্থ হয়েছে');
    },
  });

  // Delete Subject Mutation
  const deleteSubjectMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      return apiClient.delete(`/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('বিষয় সফলভাবে মুছে ফেলা হয়েছে!');
      setSubjectToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'বিষয় মুছতে ব্যর্থ হয়েছে');
    },
  });

  const handleAddYear = (year, isEdit = false) => {
    const y = Number(year);
    if (!y || isNaN(y)) return;
    if (isEdit) {
      if (editingSubject.years.includes(y)) return;
      setEditingSubject({ ...editingSubject, years: [...editingSubject.years, y].sort((a, b) => a - b) });
    } else {
      if (subjectYears.includes(y)) return;
      setSubjectYears([...subjectYears, y].sort((a, b) => a - b));
    }
  };

  const handleRemoveYear = (year, isEdit = false) => {
    const y = Number(year);
    if (isEdit) {
      setEditingSubject({ ...editingSubject, years: editingSubject.years.filter((item) => item !== y) });
    } else {
      setSubjectYears(subjectYears.filter((item) => item !== y));
    }
  };

  const handleToggleCategory = (catVal, isEdit = false) => {
    if (isEdit) {
      const currentCats = editingSubject.categories || [];
      const updated = currentCats.includes(catVal)
        ? currentCats.filter((c) => c !== catVal)
        : [...currentCats, catVal];
      setEditingSubject({ ...editingSubject, categories: updated });
    } else {
      const updated = subjectCategories.includes(catVal)
        ? subjectCategories.filter((c) => c !== catVal)
        : [...subjectCategories, catVal];
      setSubjectCategories(updated);
    }
  };

  const resetForm = () => {
    setSubjectName('');
    setSubjectCode('');
    setSubjectGroup('General');
    setSubjectYears([new Date().getFullYear()]);
    setSubjectCategories(['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion']);
  };

  const handleCreateSubjectSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(selectedClass);

    addSubjectMutation.mutate({
      className: selectedClass,
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.trim(),
      group: isClass9to12 ? subjectGroup : 'General',
      years: subjectYears,
      categories: subjectCategories,
      institutionType: selectedType,
      academicLevel: selectedLevel,
    });
  };

  const handleEditSubjectSubmit = (e) => {
    e.preventDefault();
    if (!editingSubject) return;
    const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(editingSubject.className);

    updateSubjectMutation.mutate({
      id: editingSubject._id,
      payload: {
        className: editingSubject.className,
        subjectName: editingSubject.subjectName.trim(),
        subjectCode: editingSubject.subjectCode.trim(),
        group: isClass9to12 ? editingSubject.group : 'General',
        years: editingSubject.years,
        categories: editingSubject.categories || ['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion'],
        institutionType: editingSubject.institutionType,
        academicLevel: editingSubject.academicLevel,
      },
    });
  };

  const handleOpenEditModal = (sub) => {
    setEditingSubject({
      ...sub,
      categories: sub.categories && sub.categories.length > 0 ? sub.categories : ['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion']
    });
    setIsEditModalOpen(true);
  };

  const activeColor = TYPE_COLORS[selectedType] || TYPE_COLORS.School;

  const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(selectedClass);

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans flex items-center gap-2">
            <Sliders className="size-6 text-primary" />
            সাবজেক্ট ও কোড সেটআপ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            প্রতিষ্ঠানের স্তর ও শ্রেণীভিত্তিক স্থায়ী বিষয়সমূহ কোড ও সক্রিয় শিক্ষাবর্ষসহ কনফিগার করুন।
          </p>
        </div>
      </div>

      {/* Cascading Filter Selection (Hierarchy tabs styled) */}
      <div className="relative w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  onClick={() => {
                    setSelectedType(type);
                    const lvls = Array.from(new Set(allowedClasses.filter((c) => c.type === type).map((c) => c.level)));
                    if (lvls.length > 0) {
                      setSelectedLevel(lvls[0]);
                      const cls = allowedClasses.filter((c) => c.type === type && c.level === lvls[0]);
                      if (cls.length > 0) setSelectedClass(cls[0].value);
                    }
                  }}
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
                  onClick={() => {
                    setSelectedLevel(level);
                    const cls = allowedClasses.filter((c) => c.type === selectedType && c.level === level);
                    if (cls.length > 0) setSelectedClass(cls[0].value);
                  }}
                  className={`p-3 px-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isActive
                      ? activeColor.activeBg
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
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
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/45 min-h-[120px] flex items-center justify-center">
            <div className="grid grid-cols-2 gap-2 w-full">
              {classesForLevel.map((cls) => {
                const isActive = selectedClass === cls.value;
                return (
                  <button
                    key={cls.value}
                    onClick={() => setSelectedClass(cls.value)}
                    className={`p-2.5 py-3 rounded-lg text-center text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
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
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 text-base border-b pb-3 flex items-center gap-2">
            <Plus className="size-4.5 text-indigo-500" />
            <span>নতুন বিষয় যোগ করুন ({currentClassLabel})</span>
          </h3>

          <form onSubmit={handleCreateSubjectSubmit} className="space-y-4">
            {/* Subject Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">বিষয়ের নাম (Subject Name)</label>
              <Input
                required
                placeholder="যেমন: বাংলা ১ম পত্র, সাধারণ গণিত"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                disabled={addSubjectMutation.isPending}
                className="px-3.5 h-10.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150"
              />
            </div>

            {/* Subject Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">বিষয় কোড (Subject Code)</label>
              <Input
                required
                placeholder="যেমন: ১০১, ১০২, BAN101"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                disabled={addSubjectMutation.isPending}
                className="px-3.5 h-10.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150"
              />
            </div>

            {/* Group Selection (Only for Class 9-12) */}
            {isClass9to12 && (
              <div className="space-y-2.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/30">
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">বিভাগ / গ্রুপ (Group)</label>
                <div className="flex flex-col gap-1.5">
                  {[
                    { value: 'General', label: 'সাধারণ (General)' },
                    { value: 'Science', label: 'বিজ্ঞান (Science)' },
                    { value: 'Humanities', label: 'মানবিক (Humanities)' },
                    { value: 'Commerce', label: 'ব্যবসায় শিক্ষা (Commerce)' }
                  ].map((grp) => (
                    <label key={grp.value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="subjectGroup"
                        checked={subjectGroup === grp.value}
                        onChange={() => setSubjectGroup(grp.value)}
                        disabled={addSubjectMutation.isPending}
                        className="accent-indigo-600 size-4"
                      />
                      <span>{grp.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Active Years setup */}
            <div className="space-y-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/30">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">সক্রিয় শিক্ষাবর্ষ / বছর</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  id="new-year-setup-input"
                  placeholder="বছর লিখুন (যেমন: ২০২৬)"
                  disabled={addSubjectMutation.isPending}
                  className="px-3.5 h-10 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        handleAddYear(val);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={addSubjectMutation.isPending}
                  onClick={() => {
                    const input = document.getElementById('new-year-setup-input');
                    if (input && input.value.trim()) {
                      handleAddYear(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="h-10 px-4 rounded-xl border border-indigo-200 text-indigo-600 text-xs font-bold hover:bg-indigo-50/50"
                >
                  যোগ
                </Button>
              </div>

              {/* Badges list */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {subjectYears.map((yr) => (
                  <span
                    key={yr}
                    className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 font-semibold text-xs px-2.5 py-1.5 rounded-lg border border-amber-100 shadow-sm"
                  >
                    {yr}
                    <button
                      type="button"
                      disabled={addSubjectMutation.isPending}
                      onClick={() => handleRemoveYear(yr)}
                      className="text-amber-600 font-bold ml-1 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center hover:bg-amber-200/50 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Question Categories setup */}
            <div className="space-y-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/30">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">প্রশ্নের ক্যাটাগরি সমূহ</label>
              <div className="grid grid-cols-2 gap-2">
                {PREDEFINED_CATEGORIES.map((cat) => {
                  const isChecked = subjectCategories.includes(cat.value);
                  return (
                    <label
                      key={cat.value}
                      className={`flex items-center gap-2.5 p-2 px-3 rounded-xl border text-xs font-semibold select-none cursor-pointer transition-all duration-150 ${
                        isChecked
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCategory(cat.value)}
                        disabled={addSubjectMutation.isPending}
                        className="accent-indigo-600 size-4 rounded cursor-pointer"
                      />
                      <span>{cat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <RippleButton
              type="submit"
              disabled={addSubjectMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-xl shadow-md cursor-pointer"
            >
              {addSubjectMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  বিষয় যুক্ত করুন
                </>
              )}
              <RippleButtonRipples color="rgba(255, 255, 255, 0.3)" />
            </RippleButton>
          </form>
        </div>

        {/* Right Side: Subjects List Grid (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-500" />
              <span>বিষয়ের তালিকা ({currentClassLabel})</span>
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              মোট {subjects.length} টি বিষয় কনফিগারড
            </span>
          </div>

          {subjectsLoading ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="size-8 text-primary animate-spin" />
              <p className="text-slate-500 text-sm">বিষয়ের তালিকা লোড হচ্ছে...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-16 text-center max-w-md mx-auto">
              <BookOpen className="size-12 text-slate-400 mb-3 mx-auto" />
              <p className="text-slate-800 font-semibold mb-1">কোনো বিষয় পাওয়া যায়নি</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                {currentClassLabel}-এর অধীনে এখন পর্যন্ত কোনো বিষয় কনফিগার করা হয়নি। বামপাশের ফর্ম ব্যবহার করে নতুন বিষয় যুক্ত করুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map((sub) => (
                <div 
                  key={sub._id}
                  className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-200 relative group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Top Row: Code Badge & Actions */}
                    <div className="flex justify-between items-start gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-extrabold rounded-lg">
                        <Code className="size-3.5" />
                        কোড: {sub.subjectCode}
                      </span>
                      
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <h4 className="font-extrabold text-slate-800 text-[15px] leading-snug">{sub.subjectName}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                        শ্রেণী: {currentClassLabel}
                        {sub.group && sub.group !== 'General' && ` • গ্রুপ: ${getGroupLabel(sub.group)}`}
                      </p>
                    </div>
                  </div>

                  {/* Active Years badges */}
                  <div className="pt-3 border-t border-slate-50 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">শিক্ষাবর্ষ:</span>
                    {sub.years && sub.years.map((yr) => (
                      <span 
                        key={yr}
                        className="bg-amber-50 border border-amber-100 text-amber-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md"
                      >
                        {yr}
                      </span>
                    ))}
                  </div>

                  {/* Configured Categories badges */}
                  <div className="pt-2 flex flex-wrap gap-1 items-center">
                    <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase">ক্যাটাগরি:</span>
                    {sub.categories && sub.categories.length > 0 ? (
                      sub.categories.map((cat) => (
                        <span 
                          key={cat}
                          className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-[10px] px-2 py-0.5 rounded-md"
                        >
                          {cat === 'MCQ' ? 'MCQ' : cat === 'Creative' ? 'সৃজনশীল' : cat === 'ShortAnswer' ? 'সংক্ষিপ্ত' : cat === 'BroadQuestion' ? 'বর্ণনামূলক' : cat === 'FillInBlanks' ? 'শূন্যস্থান' : cat === 'Matching' ? 'ডানবাম' : cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">কোনোটি নয় (ডিফল্ট)</span>
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
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl relative shadow-2xl">
          <DialogHeader className="text-left">
            <DialogTitle className="font-bold text-slate-800 text-[16px] tracking-tight">বিষয় তথ্য সংশোধন</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              বিষয়ের বিবরণ, বিষয় কোড এবং সক্রিয় শিক্ষাবর্ষের শিক্ষাবর্ষ সংশোধন করুন।
            </DialogDescription>
          </DialogHeader>

          {editingSubject && (
            <form onSubmit={handleEditSubjectSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">বিষয়ের নাম</label>
                <Input
                  required
                  value={editingSubject.subjectName}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectName: e.target.value })}
                  disabled={updateSubjectMutation.isPending}
                  className="h-10.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">বিষয় কোড</label>
                <Input
                  required
                  value={editingSubject.subjectCode}
                  onChange={(e) => setEditingSubject({ ...editingSubject, subjectCode: e.target.value })}
                  disabled={updateSubjectMutation.isPending}
                  className="h-10.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150"
                />
              </div>

              {/* Group Selection in Edit (if applicable) */}
              {['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(editingSubject.className) && (
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">বিভাগ / গ্রুপ</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'General', label: 'সাধারণ' },
                      { value: 'Science', label: 'বিজ্ঞান' },
                      { value: 'Humanities', label: 'মানবিক' },
                      { value: 'Commerce', label: 'ব্যবসায়' }
                    ].map((grp) => (
                      <label key={grp.value} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none">
                        <input
                          type="radio"
                          name="editSubjectGroup"
                          checked={editingSubject.group === grp.value}
                          onChange={() => setEditingSubject({ ...editingSubject, group: grp.value })}
                          disabled={updateSubjectMutation.isPending}
                          className="accent-indigo-600 size-3.5"
                        />
                        <span>{grp.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit Years setup */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">সক্রিয় শিক্ষাবর্ষ</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    id="edit-year-input"
                    placeholder="বছর (যেমন: ২০২৬)"
                    disabled={updateSubjectMutation.isPending}
                    className="h-10 rounded-xl border border-slate-200 px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-150"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.target.value.trim();
                        if (val) {
                          handleAddYear(val, true);
                          e.target.value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updateSubjectMutation.isPending}
                    onClick={() => {
                      const input = document.getElementById('edit-year-input');
                      if (input && input.value.trim()) {
                        handleAddYear(input.value.trim(), true);
                        input.value = '';
                      }
                    }}
                    className="h-10 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    যোগ
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {editingSubject.years.map((yr) => (
                    <span 
                      key={yr} 
                      className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-800 font-semibold text-xs px-2.5 py-0.5 rounded-md border border-amber-100"
                    >
                      {yr}
                      <button
                        type="button"
                        onClick={() => handleRemoveYear(yr, true)}
                        className="text-amber-500 font-bold hover:text-amber-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Edit Categories setup */}
              <div className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">প্রশ্নের ক্যাটাগরি সমূহ</label>
                <div className="grid grid-cols-2 gap-2">
                  {PREDEFINED_CATEGORIES.map((cat) => {
                    const isChecked = (editingSubject.categories || []).includes(cat.value);
                    return (
                      <label
                        key={cat.value}
                        className={`flex items-center gap-2.5 p-2 px-3 rounded-xl border text-xs font-semibold select-none cursor-pointer transition-all duration-150 ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCategory(cat.value, true)}
                          disabled={updateSubjectMutation.isPending}
                          className="accent-indigo-600 size-4 rounded cursor-pointer"
                        />
                        <span>{cat.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <DialogFooter className="pt-4 flex gap-2 justify-end border-t border-slate-100">
                <DialogClose asChild>
                  <ModalCancelButton disabled={updateSubjectMutation.isPending}>
                    বাতিল
                  </ModalCancelButton>
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
              আপনি কি নিশ্চিত যে আপনি <strong>{subjectToDelete?.subjectName} ({subjectToDelete?.subjectCode})</strong> বিষয়টিকে স্থায়ীভাবে ডিলিট করতে চান?
              এটি মুছে ফেললে এই বিষয়ের সাথে সংযুক্ত যেকোনো সিলেবাস এবং প্রশ্ন ক্ষতিগ্রস্ত হতে পারে!
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
