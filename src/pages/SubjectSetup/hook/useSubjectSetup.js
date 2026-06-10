import { CATEGORIES_MAP } from '@/constants/categories';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@clerk/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const PREDEFINED_CATEGORIES = CATEGORIES_MAP.map((c) => c);

export const TYPE_LABELS = {
  School: 'স্কুল (School)',
  College: 'কলেজ (College)',
  Madrasah: 'মাদ্রাসা (Madrasah)',
};

export const LEVEL_LABELS = {
  Primary: 'প্রাথমিক (Primary)',
  Secondary: 'মাধ্যমিক (Secondary)',
  'Higher Secondary': 'উচ্চমাধ্যমিক (Higher Secondary)',
  Ebtedayee: 'ইবতেদায়ী (Ebtedayee)',
  Dakhil: 'দাখিল (Dakhil)',
  Alim: 'আলিম (Alim)',
};

export const getGroupLabel = (groupName) => {
  switch (groupName) {
    case 'Science': return 'বিজ্ঞান';
    case 'Humanities': return 'মানবিক';
    case 'Commerce': return 'ব্যবসায় শিক্ষা';
    default: return 'সাধারণ';
  }
};

export function useSubjectSetup() {
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

  const currentClassLabel =
    allowedClasses.find(
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
      toast.success('বিষয় সফলভাবে যুক্ত করা হয়েছে!');
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'বিষয় যুক্ত করতে ব্যর্থ হয়েছে');
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
      toast.success('বিষয় সফলভাবে আপডেট করা হয়েছে!');
      setIsEditModalOpen(false);
      setEditingSubject(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'বিষয় আপডেট করতে ব্যর্থ হয়েছে');
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
      toast.success('বিষয় সফলভাবে মুছে ফেলা হয়েছে!');
      setSubjectToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'বিষয় মুছতে ব্যর্থ হয়েছে');
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
      categories:
        sub.categories && sub.categories.length > 0
          ? sub.categories
          : ['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion'],
    });
    setIsEditModalOpen(true);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    const lvls = Array.from(new Set(allowedClasses.filter((c) => c.type === type).map((c) => c.level)));
    if (lvls.length > 0) {
      setSelectedLevel(lvls[0]);
      const cls = allowedClasses.filter((c) => c.type === type && c.level === lvls[0]);
      if (cls.length > 0) setSelectedClass(cls[0].value);
    }
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    const cls = allowedClasses.filter((c) => c.type === selectedType && c.level === level);
    if (cls.length > 0) setSelectedClass(cls[0].value);
  };

  const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(selectedClass);

  return {
    // Filter state & derived
    allowedClasses,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
    selectedClass,
    setSelectedClass,
    activeTypes,
    activeLevels,
    classesForLevel,
    currentClassLabel,
    handleTypeChange,
    handleLevelChange,

    // Form fields
    subjectName,
    setSubjectName,
    subjectCode,
    setSubjectCode,
    subjectGroup,
    setSubjectGroup,
    subjectYears,
    subjectCategories,

    // Modal / editing state
    editingSubject,
    setEditingSubject,
    subjectToDelete,
    setSubjectToDelete,
    isEditModalOpen,
    setIsEditModalOpen,

    // Data
    subjects,
    subjectsLoading,

    // Mutations
    addSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,

    // Handlers
    handleAddYear,
    handleRemoveYear,
    handleToggleCategory,
    resetForm,
    handleCreateSubjectSubmit,
    handleEditSubjectSubmit,
    handleOpenEditModal,

    // Derived
    isClass9to12,
  };
}
