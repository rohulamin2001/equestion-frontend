import { CATEGORIES_MAP } from '@/constants/categories';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@clerk/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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
  const { allowedClasses, config } = useAcademicConfig();

  // Active filter state (raw user choices)
  const [userSelectedType, setUserSelectedType] = useState(null);
  const [userSelectedLevel, setUserSelectedLevel] = useState(null);
  const [userSelectedClass, setUserSelectedClass] = useState(null);
  const [listVersionFilter, setListVersionFilter] = useState('All');

  // Fallback defaults from config
  const firstAllowed = allowedClasses && allowedClasses.length > 0 ? allowedClasses[0] : null;

  // Validate user selection
  const isSelectionValid = allowedClasses.some(
    (c) => c.value === userSelectedClass && c.type === userSelectedType && c.level === userSelectedLevel
  );

  const selectedType = isSelectionValid ? userSelectedType : (firstAllowed ? firstAllowed.type : 'School');
  const selectedLevel = isSelectionValid ? userSelectedLevel : (firstAllowed ? firstAllowed.level : 'Secondary');
  const selectedClass = isSelectionValid ? userSelectedClass : (firstAllowed ? firstAllowed.value : 'Class 6');

  // Custom setter for class selection
  const setSelectedClass = (clsVal, targetTypeOverride, targetLevelOverride) => {
    const type = targetTypeOverride !== undefined ? targetTypeOverride : userSelectedType;
    const level = targetLevelOverride !== undefined ? targetLevelOverride : userSelectedLevel;
    
    const clsObj = allowedClasses.find((c) => 
      c.value === clsVal && 
      (type === null || c.type === type) && 
      (level === null || c.level === level)
    ) || allowedClasses.find((c) => c.value === clsVal);

    if (clsObj) {
      setUserSelectedType(clsObj.type);
      setUserSelectedLevel(clsObj.level);
      setUserSelectedClass(clsVal);
    } else {
      setUserSelectedClass(clsVal);
    }
  };

  // Form Fields
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectTotalMarks, setSubjectTotalMarks] = useState('');
  const [subjectGroup, setSubjectGroup] = useState('General');
  const [subjectYears, setSubjectYears] = useState([new Date().getFullYear()]);
  const [subjectCategories, setSubjectCategories] = useState(['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion']);

  // Version Field
  const activeVersions = config?.versions && config.versions.length > 0 ? config.versions : ['Bangla', 'English', 'Madrasah'];
  const defaultVersion = activeVersions.includes('Bangla') ? 'Bangla' : activeVersions[0];
  const [userSelectedVersion, setUserSelectedVersion] = useState(null);
  const subjectVersion = (userSelectedVersion && activeVersions.includes(userSelectedVersion)) ? userSelectedVersion : defaultVersion;
  const setSubjectVersion = setUserSelectedVersion;

  // Modal / Editing states
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    queryKey: ['subjects', selectedType, selectedLevel, selectedClass, listVersionFilter],
    queryFn: async () => {
      const token = await getToken();
      const params = {
        className: selectedClass,
        institutionType: selectedType,
        academicLevel: selectedLevel,
      };
      if (listVersionFilter !== 'All') {
        params.version = listVersionFilter;
      }
      const response = await apiClient.get('/subjects', {
        params,
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
    setSubjectTotalMarks('');
    setSubjectGroup('General');
    setSubjectYears([new Date().getFullYear()]);
    setSubjectCategories(['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion']);
    setUserSelectedVersion('Bangla');
  };

  const handleCreateSubjectSubmit = (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(selectedClass);

    addSubjectMutation.mutate({
      className: selectedClass,
      subjectName: subjectName.trim(),
      subjectCode: subjectCode.trim(),
      totalMarks: subjectTotalMarks.trim() !== '' ? subjectTotalMarks.trim() : null,
      group: isClass9to12 ? subjectGroup : 'General',
      years: subjectYears,
      categories: subjectCategories,
      institutionType: selectedType,
      academicLevel: selectedLevel,
      version: subjectVersion,
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
        totalMarks: (editingSubject.totalMarks !== '' && editingSubject.totalMarks != null)
          ? String(editingSubject.totalMarks).trim()
          : null,
        group: isClass9to12 ? editingSubject.group : 'General',
        years: editingSubject.years,
        categories: editingSubject.categories || ['MCQ', 'Creative', 'ShortAnswer', 'BroadQuestion'],
        institutionType: editingSubject.institutionType,
        academicLevel: editingSubject.academicLevel,
        version: editingSubject.version || 'Bangla',
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
      version: sub.version || (config?.versions && config.versions.length > 0 ? config.versions[0] : 'Bangla'),
    });
    setIsEditModalOpen(true);
  };

  const handleTypeChange = (type) => {
    setUserSelectedType(type);
    const lvls = Array.from(new Set(allowedClasses.filter((c) => c.type === type).map((c) => c.level)));
    if (lvls.length > 0) {
      setUserSelectedLevel(lvls[0]);
      const cls = allowedClasses.filter((c) => c.type === type && c.level === lvls[0]);
      if (cls.length > 0) setSelectedClass(cls[0].value, type, lvls[0]);
    }
  };

  const handleLevelChange = (level) => {
    setUserSelectedLevel(level);
    const cls = allowedClasses.filter((c) => c.type === selectedType && c.level === level);
    if (cls.length > 0) setSelectedClass(cls[0].value, selectedType, level);
  };

  const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(selectedClass);

  return {
    // Filter state & derived
    allowedClasses,
    selectedType,
    setSelectedType: setUserSelectedType,
    selectedLevel,
    setSelectedLevel: setUserSelectedLevel,
    selectedClass,
    setSelectedClass,
    activeTypes,
    activeLevels,
    classesForLevel,
    currentClassLabel,
    handleTypeChange,
    handleLevelChange,
    listVersionFilter,
    setListVersionFilter,

    // Form fields
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
