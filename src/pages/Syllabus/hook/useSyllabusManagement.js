import { useUserContext } from '@/context/UserContext';
import { useAcademicConfig } from '@/hooks/useAcademicConfig';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@clerk/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export function useSyllabusManagement() {
  const { getToken } = useAuth();
  const { role: userRole } = useUserContext();
  const queryClient = useQueryClient();
  const { allowedClasses, config, isLoading: configLoading } = useAcademicConfig();

  // Active filter state - Derived State Pattern
  const [userSelectedType, setUserSelectedType] = useState(null);
  const [userSelectedLevel, setUserSelectedLevel] = useState(null);
  const [userSelectedClass, setUserSelectedClass] = useState(null);

  const firstAllowed = allowedClasses && allowedClasses.length > 0 ? allowedClasses[0] : null;

  const isSelectionValid = allowedClasses.some(
    c => c.value === userSelectedClass && c.type === userSelectedType && c.level === userSelectedLevel
  );

  const selectedType = isSelectionValid ? userSelectedType : (firstAllowed ? firstAllowed.type : 'School');
  const selectedLevel = isSelectionValid ? userSelectedLevel : (firstAllowed ? firstAllowed.level : 'Secondary');
  const selectedClass = isSelectionValid ? userSelectedClass : (firstAllowed ? firstAllowed.value : 'Class 6');

  const setSelectedType = setUserSelectedType;
  const setSelectedLevel = setUserSelectedLevel;
  const setSelectedClass = (clsVal, targetTypeOverride = null, targetLevelOverride = null) => {
    const targetType = targetTypeOverride !== null ? targetTypeOverride : (userSelectedType || selectedType);
    const targetLevel = targetLevelOverride !== null ? targetLevelOverride : (userSelectedLevel || selectedLevel);
    const clsObj = allowedClasses.find(
      (c) => c.value === clsVal && c.type === targetType && c.level === targetLevel
    );
    if (clsObj) {
      setUserSelectedType(clsObj.type);
      setUserSelectedLevel(clsObj.level);
      setUserSelectedClass(clsVal);
    } else {
      const fallbackObj = allowedClasses.find((c) => c.value === clsVal);
      if (fallbackObj) {
        setUserSelectedType(fallbackObj.type);
        setUserSelectedLevel(fallbackObj.level);
        setUserSelectedClass(clsVal);
      } else {
        setUserSelectedClass(clsVal);
      }
    }
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState(null); // null if creating, contains syllabus object if editing
  const [syllabusToDelete, setSyllabusToDelete] = useState(null); // contains syllabus object to delete

  // Form Fields
  const [formType, setFormTypeState] = useState('School');
  const [formLevel, setFormLevelState] = useState('Secondary');
  const [formClass, setFormClassState] = useState('Class 6');
  const [formSubject, setFormSubject] = useState('');
  const [formSubjectId, setFormSubjectId] = useState('');
  const [formSubjectCode, setFormSubjectCode] = useState('');
  const [formGroup, setFormGroup] = useState('General');
  const [formYears, setFormYears] = useState([new Date().getFullYear()]);
  
  // Derived / Dynamic Version State
  const [userFormVersion, setUserFormVersion] = useState(null);
  const defaultVersion = config?.versions && config.versions.length > 0 ? config.versions[0] : 'Bangla';
  const formVersion = userFormVersion ?? defaultVersion;
  const setFormVersion = (val) => {
    setUserFormVersion(val);
    if (!editingSyllabus) {
      setFormSubject('');
      setFormSubjectId('');
      setFormSubjectCode('');
    }
  };

  const [formChapters, setFormChapters] = useState([
    { chapterNumber: 1, chapterName: '', topicsString: '' }
  ]);

  const setFormType = (val) => {
    setFormTypeState(val);
    if (!editingSyllabus) {
      setFormSubject('');
      setFormSubjectId('');
      setFormSubjectCode('');
      setFormYears([new Date().getFullYear()]);
    }
  };

  const setFormLevel = (val) => {
    setFormLevelState(val);
    if (!editingSyllabus) {
      setFormSubject('');
      setFormSubjectId('');
      setFormSubjectCode('');
      setFormYears([new Date().getFullYear()]);
    }
  };

  const setFormClass = (clsVal) => {
    setFormClassState(clsVal);
    if (!editingSyllabus) {
      setFormSubject('');
      setFormSubjectId('');
      setFormSubjectCode('');
      setFormYears([new Date().getFullYear()]);
    }
  };

  // Fetch configured subjects dynamically for the selected Type, Level, Class, Version in the form
  const { data: formSubjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects-form', formType, formLevel, formClass, formVersion],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/subjects', {
        params: {
          className: formClass,
          institutionType: formType,
          academicLevel: formLevel,
          version: formVersion
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.subjects;
    },
    enabled: !!formClass
  });

  const handleAddYear = (year) => {
    const y = Number(year);
    if (!y || isNaN(y)) return;
    if (formYears.includes(y)) return;
    setFormYears([...formYears, y].sort((a, b) => a - b));
  };

  const handleRemoveYear = (year) => {
    const y = Number(year);
    setFormYears(formYears.filter(item => item !== y));
  };

  // Fetch Syllabus list query
  const {
    data: syllabusList = [],
    isLoading: loading,
    error: fetchError,
    refetch: fetchSyllabus,
  } = useQuery({
    queryKey: ['syllabusList', selectedType, selectedLevel, selectedClass],
    queryFn: async () => {
      const token = await getToken();
      const response = await apiClient.get('/syllabus', {
        params: { 
          className: selectedClass,
          institutionType: selectedType,
          academicLevel: selectedLevel
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.syllabus;
    },
  });

  const error = fetchError
    ? fetchError.response?.data?.error || fetchError.message || 'সিলেবাস তালিকা লোড করতে ব্যর্থ হয়েছে'
    : null;

  // Add Syllabus mutation
  const addSyllabusMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      const response = await apiClient.post('/syllabus', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusList'] });
      toast.success('সিলেবাস সফলভাবে যুক্ত করা হয়েছে!');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সিলেবাস যুক্ত করতে ব্যর্থ হয়েছে');
    },
  });

  // Edit Syllabus mutation
  const updateSyllabusMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const token = await getToken();
      const response = await apiClient.put(`/syllabus/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusList'] });
      toast.success('সিলেবাস সফলভাবে আপডেট করা হয়েছে!');
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সিলেবাস আপডেট করতে ব্যর্থ হয়েছে');
    },
  });

  // Delete Syllabus mutation
  const deleteSyllabusMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      await apiClient.delete(`/syllabus/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabusList'] });
      toast.success('সিলেবাস সফলভাবে মুছে ফেলা হয়েছে!');
      setSyllabusToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.message || 'সিলেবাস মুছতে ব্যর্থ হয়েছে');
    },
  });

  // Reset form states
  const resetForm = () => {
    setFormType(selectedType);
    setFormLevel(selectedLevel);
    setFormClass(selectedClass);
    setFormSubject('');
    setFormSubjectId('');
    setFormSubjectCode('');
    setFormGroup('General');
    setFormYears([new Date().getFullYear()]);
    setUserFormVersion(null);
    setFormChapters([{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
    setEditingSyllabus(null);
  };

  // Open modal for adding new syllabus
  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Open modal for editing existing syllabus
  const handleOpenEditModal = (syllabus) => {
    setEditingSyllabus(syllabus);
    setFormType(syllabus.institutionType || 'School');
    setFormLevel(syllabus.academicLevel || 'Secondary');
    setFormClass(syllabus.className);
    setFormSubject(syllabus.subjectName);
    setFormSubjectId(syllabus.subjectId || '');
    setFormSubjectCode(syllabus.subjectCode || '');
    setFormGroup(syllabus.group || 'General');
    setFormYears(syllabus.years && syllabus.years.length > 0 ? syllabus.years : [new Date().getFullYear()]);
    setUserFormVersion(syllabus.version || 'Bangla');
    
    // Map chapters to include topicsString (comma-separated list for easy textarea editing)
    const mappedChapters = syllabus.chapters.map(c => ({
      chapterNumber: c.chapterNumber,
      chapterName: c.chapterName,
      topicsString: c.topics ? c.topics.join(', ') : ''
    }));
    setFormChapters(mappedChapters.length > 0 ? mappedChapters : [{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
    setIsModalOpen(true);
  };

  // Dynamic form handlers for chapters
  const handleAddChapterField = () => {
    const nextNum = formChapters.length + 1;
    setFormChapters([
      ...formChapters,
      { chapterNumber: nextNum, chapterName: '', topicsString: '' }
    ]);
  };

  const handleRemoveChapterField = (index) => {
    if (formChapters.length === 1) {
      setFormChapters([{ chapterNumber: 1, chapterName: '', topicsString: '' }]);
      return;
    }
    const updated = formChapters.filter((_, i) => i !== index).map((c, i) => ({
      ...c,
      chapterNumber: i + 1 // Re-index chapter numbers
    }));
    setFormChapters(updated);
  };

  const handleChapterFieldChange = (index, field, value) => {
    const updated = formChapters.map((c, i) => {
      if (i === index) {
        return { ...c, [field]: value };
      }
      return c;
    });
    setFormChapters(updated);
  };

  // Handle submit form (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format payload
    const formattedChapters = formChapters
      .filter(c => c.chapterName.trim()) // filter out empty chapters
      .map(c => ({
        chapterNumber: Number(c.chapterNumber),
        chapterName: c.chapterName.trim(),
        topics: c.topicsString
          ? c.topicsString.split(',').map(t => t.trim()).filter(Boolean)
          : []
      }));

    const isClass9to12 = ['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(formClass);
    const payload = {
      className: formClass,
      subjectId: formSubjectId,
      subjectCode: formSubjectCode,
      subjectName: formSubject.trim(),
      group: isClass9to12 ? formGroup : 'General',
      years: formYears,
      chapters: formattedChapters,
      institutionType: formType,
      academicLevel: formLevel,
      version: formVersion
    };

    if (editingSyllabus) {
      updateSyllabusMutation.mutate({ id: editingSyllabus._id, payload });
    } else {
      addSyllabusMutation.mutate(payload);
    }
  };

  const handleDelete = async () => {
    if (syllabusToDelete) {
      deleteSyllabusMutation.mutate(syllabusToDelete._id);
    }
  };

  const formLoading = addSyllabusMutation.isPending || updateSyllabusMutation.isPending;

  return {
    userRole,
    selectedType,
    setSelectedType,
    selectedLevel,
    setSelectedLevel,
    selectedClass,
    setSelectedClass,
    allowedClasses,
    configLoading,
    // Modal & delete states
    isModalOpen,
    setIsModalOpen,
    editingSyllabus,
    syllabusToDelete,
    setSyllabusToDelete,
    // Form fields & setters
    formType,
    setFormType,
    formLevel,
    setFormLevel,
    formClass,
    setFormClass,
    formSubject,
    setFormSubject,
    formSubjectId,
    setFormSubjectId,
    formSubjectCode,
    setFormSubjectCode,
    formSubjects,
    subjectsLoading,
    formGroup,
    setFormGroup,
    formYears,
    setFormYears,
    handleAddYear,
    handleRemoveYear,
    formVersion,
    setFormVersion,
    config,
    formChapters,
    formLoading,
    deletePending: deleteSyllabusMutation.isPending,
    // Data list
    syllabusList,
    loading,
    error,
    refetch: fetchSyllabus,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleAddChapterField,
    handleRemoveChapterField,
    handleChapterFieldChange,
    handleSubmit,
    handleDelete,
  };
}
